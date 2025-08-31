import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface PlacesResponse {
  result: {
    reviews: GoogleReview[];
    rating: number;
    user_ratings_total: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Google Reviews fetch...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');

    if (!googleApiKey) {
      throw new Error('Google Places API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get configuration
    const { data: config, error: configError } = await supabase
      .from('google_reviews_config')
      .select('*')
      .single();

    if (configError) {
      console.error('Config error:', configError);
      throw new Error('Configuration not found');
    }

    const placeId = config.place_id;
    if (!placeId || placeId === 'YOUR_PLACE_ID_HERE') {
      throw new Error('Place ID not configured properly');
    }

    // Check if we need to fetch new reviews (30 min cache)
    const lastFetch = new Date(config.last_fetch);
    const now = new Date();
    const timeDiff = now.getTime() - lastFetch.getTime();
    const thirtyMinutes = 30 * 60 * 1000;

    let shouldFetch = timeDiff > thirtyMinutes;

    // Always allow manual refresh via force parameter
    const url = new URL(req.url);
    const force = url.searchParams.get('force') === 'true';
    
    if (force) {
      shouldFetch = true;
    }

    if (shouldFetch) {
      console.log('Fetching fresh reviews from Google Places API...');
      
      // Fetch reviews from Google Places API
      const placesUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${googleApiKey}`;
      
      const response = await fetch(placesUrl);
      const data: PlacesResponse = await response.json();

      if (data.result?.reviews) {
        console.log(`Found ${data.result.reviews.length} reviews`);
        
        // Process and cache reviews
        for (const review of data.result.reviews) {
          const reviewData = {
            review_id: `${placeId}_${review.time}`,
            author_name: review.author_name,
            rating: review.rating,
            text: review.text || '',
            relative_time: review.relative_time_description,
            time: review.time,
            profile_photo_url: review.profile_photo_url || null,
            language: review.language || 'en'
          };

          // Insert or update review
          const { error: upsertError } = await supabase
            .from('google_reviews_cache')
            .upsert(reviewData, { 
              onConflict: 'review_id',
              ignoreDuplicates: false 
            });

          if (upsertError) {
            console.error('Error upserting review:', upsertError);
          }
        }

        // Update last fetch time
        await supabase
          .from('google_reviews_config')
          .update({ last_fetch: now.toISOString() })
          .eq('id', config.id);
      }
    }

    // Get cached reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('google_reviews_cache')
      .select('*')
      .gte('rating', config.min_rating)
      .order('time', { ascending: false })
      .limit(config.max_reviews);

    if (reviewsError) {
      console.error('Reviews error:', reviewsError);
      throw new Error('Failed to fetch reviews');
    }

    console.log(`Returning ${reviews?.length || 0} cached reviews`);

    return new Response(
      JSON.stringify({ 
        reviews: reviews || [],
        config: {
          min_rating: config.min_rating,
          max_reviews: config.max_reviews,
          auto_rotate_interval: config.auto_rotate_interval
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in google-reviews function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        reviews: [],
        config: {
          min_rating: 4.0,
          max_reviews: 12,
          auto_rotate_interval: 5000
        }
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});