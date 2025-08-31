# Google Reviews Carousel Setup

This document explains how to configure and use the Google Reviews carousel feature.

## Overview

The Google Reviews carousel displays real-time Google reviews for your business on your website. It includes:
- Live fetching from Google Places API
- Caching in Supabase for performance
- Auto-refresh functionality
- Responsive carousel with mobile support
- Schema.org structured data for SEO
- Bilingual support (English/Italian)

## Configuration Required

### 1. Google Places API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Places API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Set Environment Variables

The following secret has been configured in your Supabase project:
- `GOOGLE_PLACES_API_KEY` - Your Google Places API key

### 3. Configure Your Place ID

1. Find your Google Business Place ID:
   - Use [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
   - Or search your business on Google Maps and extract the Place ID from the URL

2. Update the configuration in your Supabase database:
   ```sql
   UPDATE google_reviews_config 
   SET place_id = 'YOUR_ACTUAL_PLACE_ID_HERE'
   WHERE place_id = 'YOUR_PLACE_ID_HERE';
   ```

## Features

### Automatic Updates
- Reviews are fetched every 30 minutes automatically
- Manual refresh available via force parameter
- Background revalidation without blocking UI

### Filtering Options
- Show only 4+ star reviews by default
- Toggle to view all reviews
- Configurable minimum rating threshold

### Customization
Available configuration options in `google_reviews_config` table:
- `min_rating`: Minimum rating to display (default: 4.0)
- `max_reviews`: Maximum number of reviews to cache (default: 12)
- `auto_rotate_interval`: Auto-advance interval in milliseconds (default: 5000)

### Admin Controls
To modify settings, update the `google_reviews_config` table:

```sql
-- Change minimum rating filter
UPDATE google_reviews_config SET min_rating = 3.5;

-- Change max reviews to display
UPDATE google_reviews_config SET max_reviews = 20;

-- Change auto-rotate speed (5 seconds = 5000ms)
UPDATE google_reviews_config SET auto_rotate_interval = 8000;
```

## API Endpoints

### GET /functions/v1/google-reviews
Fetches cached reviews from Supabase and optionally refreshes from Google.

Query parameters:
- `force=true` - Force refresh from Google API

Response:
```json
{
  "reviews": [...],
  "config": {
    "min_rating": 4.0,
    "max_reviews": 12,
    "auto_rotate_interval": 5000
  }
}
```

## Database Schema

### google_reviews_cache
Stores cached reviews from Google:
- `review_id`: Unique identifier for the review
- `author_name`: Name of the reviewer
- `rating`: Star rating (0-5)
- `text`: Review text content
- `relative_time`: Human-readable time (e.g., "2 weeks ago")
- `time`: Unix timestamp
- `profile_photo_url`: Reviewer's profile photo URL
- `language`: Review language code

### google_reviews_config
Configuration settings:
- `place_id`: Your Google Business Place ID
- `min_rating`: Minimum rating threshold
- `max_reviews`: Maximum reviews to cache
- `auto_rotate_interval`: Carousel rotation speed
- `last_fetch`: Last successful API fetch timestamp

## SEO Benefits

The carousel automatically generates:
- Schema.org structured data for reviews
- AggregateRating markup for your business
- Individual Review markup for better search visibility

## Troubleshooting

### Common Issues

1. **No reviews showing**: Check that your Place ID is correct and your business has Google reviews
2. **API errors**: Verify your Google Places API key is valid and has proper permissions
3. **Outdated reviews**: Check the `last_fetch` timestamp in the config table

### Testing

To test the API manually:
```bash
# Test cached reviews
curl https://your-project.supabase.co/functions/v1/google-reviews

# Force refresh from Google
curl https://your-project.supabase.co/functions/v1/google-reviews?force=true
```

### Refresh Intervals

- **Google Places API**: 30 minutes (respects Google's caching and rate limits)
- **UI Auto-advance**: 5 seconds (configurable)
- **Background refresh**: On page load + periodic intervals

## Performance

- Initial page load shows cached reviews instantly
- Background API calls don't block the UI
- Lazy-loaded images for better performance
- Optimized for Lighthouse scores

## Security

- RLS policies ensure proper data access
- API keys stored securely in Supabase secrets
- Input sanitization for review text
- CORS headers properly configured