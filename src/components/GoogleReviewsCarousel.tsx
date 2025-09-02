import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface GoogleReview {
  id: string;
  review_id: string;
  author_name: string;
  rating: number;
  text: string;
  relative_time: string;
  time: number;
  profile_photo_url?: string;
  language: string;
}

interface ReviewsConfig {
  min_rating: number;
  max_reviews: number;
  auto_rotate_interval: number;
}

const GoogleReviewsCarousel: React.FC = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [config, setConfig] = useState<ReviewsConfig>({
    min_rating: 4.0,
    max_reviews: 12,
    auto_rotate_interval: 5000
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const fetchReviews = useCallback(async (force = false) => {
    try {
      const { data, error } = await supabase.functions.invoke('google-reviews', {
        body: { force }
      });

      if (error) throw error;

      setReviews(data.reviews || []);
      setConfig(data.config);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter reviews based on rating preference
  const filteredReviews = React.useMemo(() => {
    return showAllReviews 
      ? reviews 
      : reviews.filter(review => review.rating >= config.min_rating);
  }, [reviews, showAllReviews, config.min_rating]);

  // Auto-advance carousel
  useEffect(() => {
    if (filteredReviews.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % filteredReviews.length);
      }, config.auto_rotate_interval);

      return () => clearInterval(interval);
    }
  }, [filteredReviews.length, isPaused, config.auto_rotate_interval]);

  // Initial load and periodic refresh
  useEffect(() => {
    fetchReviews(true);

    // Set up periodic refresh every 30 minutes
    const refreshInterval = setInterval(() => {
      fetchReviews(false);
    }, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [fetchReviews]);

  const nextReview = () => {
    setCurrentIndex(prev => (prev + 1) % filteredReviews.length);
  };

  const prevReview = () => {
    setCurrentIndex(prev => prev === 0 ? filteredReviews.length - 1 : prev - 1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`}
      />
    ));
  };

  const truncateText = (text: string, maxLines: number = 4) => {
    const words = text.split(' ');
    const maxWords = maxLines * 15; // Approximate words per line
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Calculate average rating for schema.org
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-64 w-full max-w-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('reviews.title')}</h2>
          <p className="text-muted-foreground mb-4">{t('reviews.error')}</p>
          <Button onClick={() => fetchReviews(true)} variant="outline">
            {t('reviews.retry')}
          </Button>
        </div>
      </section>
    );
  }

  if (filteredReviews.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('reviews.title')}</h2>
          <p className="text-muted-foreground">{t('reviews.noReviews')}</p>
        </div>
      </section>
    );
  }

  const currentReview = filteredReviews[currentIndex];

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "DR7 Exotic Cars",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": averageRating.toFixed(1),
              "reviewCount": reviews.length,
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": reviews.slice(0, 5).map(review => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": review.author_name
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating,
                "bestRating": "5",
                "worstRating": "1"
              },
              "reviewBody": review.text,
              "datePublished": new Date(review.time * 1000).toISOString()
            }))
          })
        }}
      />

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'The Seasons, serif' }}>
              {t('reviews.title')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('reviews.subtitle')}
            </p>
            
            {/* Rating filter toggle */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <Button
                variant={showAllReviews ? "outline" : "default"}
                size="sm"
                onClick={() => setShowAllReviews(false)}
              >
                {t('reviews.topRated')} (4+ ⭐)
              </Button>
              <Button
                variant={showAllReviews ? "default" : "outline"}
                size="sm"
                onClick={() => setShowAllReviews(true)}
              >
                {t('reviews.allReviews')}
              </Button>
            </div>
          </div>

          {/* Main carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <Card className="bg-card/80 backdrop-blur-sm border shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    {/* Author avatar */}
                    <div className="flex-shrink-0">
                      {currentReview.profile_photo_url ? (
                        <img
                          src={currentReview.profile_photo_url}
                          alt={currentReview.author_name}
                          className="w-16 h-16 rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {getAuthorInitials(currentReview.author_name)}
                        </div>
                      )}
                    </div>

                    {/* Review content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-1">
                          {renderStars(currentReview.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {currentReview.rating}/5
                        </span>
                      </div>

                      <p className="text-foreground mb-4 leading-relaxed">
                        {truncateText(currentReview.text)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">
                            {currentReview.author_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {currentReview.relative_time}
                          </p>
                        </div>
                        
                        {/* Google badge */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span>Google</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Navigation arrows */}
            {filteredReviews.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={prevReview}
                  aria-label={t('reviews.previous')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                  onClick={nextReview}
                  aria-label={t('reviews.next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Dots indicator */}
            {filteredReviews.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {filteredReviews.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`${t('reviews.goToReview')} ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => window.open('https://www.google.com/search?q=DR7+Exotic+Cars+reviews', '_blank')}
              className="gap-2"
            >
              {t('reviews.seeAllOnGoogle')}
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default GoogleReviewsCarousel;