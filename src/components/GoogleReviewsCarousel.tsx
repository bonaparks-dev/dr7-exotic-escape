import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface GoogleReview {
  review_id: string;
  author_name: string;
  rating: number;
  text: string | null;
  time: number;
  relative_time: string | null;
  profile_photo_url: string | null;
  language: string;
}

interface ReviewsConfig {
  min_rating: number;
  max_reviews: number;
  auto_rotate_interval: number;
}

interface ReviewsResponse {
  reviews: GoogleReview[];
  config: ReviewsConfig;
  error?: string;
}

export default function GoogleReviewsCarousel() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [config, setConfig] = useState<ReviewsConfig>({
    min_rating: 4,
    max_reviews: 12,
    auto_rotate_interval: 5000
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const fetchReviews = useCallback(async (force: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.functions.invoke('google-reviews', {
        body: { force }
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const response = data as ReviewsResponse;

      if (response.error) {
        throw new Error(response.error);
      }

      setReviews(response.reviews || []);
      if (response.config) {
        setConfig(response.config);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter reviews based on rating and toggle state
  const filteredReviews = useMemo(() => {
    if (!reviews.length) return [];
    
    if (showAllReviews) {
      return reviews;
    }
    
    return reviews.filter(review => review.rating >= config.min_rating);
  }, [reviews, config.min_rating, showAllReviews]);

  // Auto-advance carousel
  useEffect(() => {
    if (!filteredReviews.length || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => 
        prevIndex >= filteredReviews.length - 1 ? 0 : prevIndex + 1
      );
    }, config.auto_rotate_interval);

    return () => clearInterval(interval);
  }, [filteredReviews.length, config.auto_rotate_interval, isPaused]);

  // Initial load
  useEffect(() => {
    fetchReviews(true);
  }, [fetchReviews]);

  // Reset current index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [showAllReviews]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex <= 0 ? filteredReviews.length - 1 : prevIndex - 1
    );
  }, [filteredReviews.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex >= filteredReviews.length - 1 ? 0 : prevIndex + 1
    );
  }, [filteredReviews.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'
        }`}
      />
    ));
  };

  const truncateText = (text: string | null, maxLength: number = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  // Schema.org JSON-LD for SEO
  const schemaData = useMemo(() => {
    if (!reviews.length) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'DR7 Exotic',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating,
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1
      },
      review: reviews.slice(0, 5).map(review => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1
        },
        author: {
          '@type': 'Person',
          name: review.author_name
        },
        reviewBody: review.text || '',
        datePublished: new Date(review.time * 1000).toISOString()
      }))
    };
  }, [reviews, averageRating]);

  useEffect(() => {
    if (schemaData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [schemaData]);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-luxury">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gradient-luxury">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">{t('reviews.error')}</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button 
              onClick={() => fetchReviews(true)}
              variant="outline"
              className="border-primary/20 hover:border-primary/40"
            >
              {t('reviews.retry')}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!filteredReviews.length) {
    return (
      <section className="py-16 px-4 bg-gradient-luxury">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">{t('reviews.title')}</h2>
            <p className="text-muted-foreground">{t('reviews.noReviews')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-luxury">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t('reviews.subtitle')}
          </p>

          {/* Filter Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              variant={!showAllReviews ? "default" : "outline"}
              onClick={() => setShowAllReviews(false)}
              className="transition-all duration-300"
            >
              {t('reviews.topRated')}
            </Button>
            <Button
              variant={showAllReviews ? "default" : "outline"}
              onClick={() => setShowAllReviews(true)}
              className="transition-all duration-300"
            >
              {t('reviews.allReviews')}
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center justify-center">
            <div className="hidden md:block">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="mr-4 bg-card/50 backdrop-blur-sm border-border/20 hover:border-primary/40 rounded-full"
                aria-label={t('reviews.previous')}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 max-w-4xl">
              <Card className="bg-card/50 backdrop-blur-sm border-border/20 shadow-elegant rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Author Photo/Initials */}
                    <div className="flex-shrink-0">
                      {filteredReviews[currentIndex]?.profile_photo_url ? (
                        <img
                          src={filteredReviews[currentIndex].profile_photo_url}
                          alt={filteredReviews[currentIndex].author_name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-border/20"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-border/20 flex items-center justify-center">
                          <span className="text-lg font-semibold text-foreground">
                            {getInitials(filteredReviews[currentIndex]?.author_name || '')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-semibold text-foreground">
                          {filteredReviews[currentIndex]?.author_name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {renderStars(filteredReviews[currentIndex]?.rating || 0)}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {truncateText(filteredReviews[currentIndex]?.text, 200)}
                      </p>
                      
                      <p className="text-sm text-muted-foreground/60 mt-4">
                        {filteredReviews[currentIndex]?.relative_time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="hidden md:block">
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="ml-4 bg-card/50 backdrop-blur-sm border-border/20 hover:border-primary/40 rounded-full"
                aria-label={t('reviews.next')}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="bg-card/50 backdrop-blur-sm border-border/20 hover:border-primary/40 rounded-full"
              aria-label={t('reviews.previous')}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="bg-card/50 backdrop-blur-sm border-border/20 hover:border-primary/40 rounded-full"
              aria-label={t('reviews.next')}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {filteredReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`${t('reviews.goToReview')} ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-3 text-lg font-semibold shadow-elegant"
          >
            <a 
              href="https://www.google.com/search?q=DR7+Exotic+reviews" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t('reviews.seeAllOnGoogle')}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}