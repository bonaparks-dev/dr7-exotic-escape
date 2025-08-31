import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface BookingDetails {
  id: string;
  vehicle_name: string;
  pickup_date: string;
  dropoff_date: string;
  price_total: number;
  currency: string;
  payment_status: string;
  nexi_transaction_id: string;
}

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const transactionId = searchParams.get('codTrans');
  const result = searchParams.get('esito');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!transactionId) return;

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('nexi_transaction_id', transactionId)
          .single();

        if (error) throw error;
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (result !== 'OK' || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-destructive/10 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-destructive">{t('paymentFailed')}</CardTitle>
            <CardDescription>{t('paymentFailedDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              {t('backToHome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-600 mb-2">
              {t('paymentSuccessful')}
            </CardTitle>
            <CardDescription className="text-base">
              {t('bookingConfirmed')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                {t('orderSummary')}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('vehicle')}:</span>
                  <p className="font-medium">{booking.vehicle_name}</p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">{t('transactionId')}:</span>
                  <p className="font-mono text-xs">{booking.nexi_transaction_id}</p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">{t('pickupDate')}:</span>
                  <p className="font-medium">
                    {new Date(booking.pickup_date).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">{t('dropoffDate')}:</span>
                  <p className="font-medium">
                    {new Date(booking.dropoff_date).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="col-span-2 pt-2 border-t">
                  <span className="text-muted-foreground">{t('totalPaid')}:</span>
                  <p className="text-xl font-bold text-primary">
                    €{(booking.price_total / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-3">
              <h3 className="font-semibold">{t('nextSteps')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">1.</span>
                  {t('confirmationEmailSent')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">2.</span>
                  {t('contractWillBeSent')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-primary">3.</span>
                  {t('prepareDocuments')}
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => navigate('/bookings')}
                className="flex-1"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {t('viewBookings')}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                {t('backToHome')}
              </Button>
            </div>

            {/* Support */}
            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              <p>{t('supportMessage')}</p>
              <p className="font-medium">support@dr7luxuryempire.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};