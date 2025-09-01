import React, { useState } from 'react';
import { Calendar, MapPin, User, Phone, Mail, CreditCard, Shield, Car, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ReservationFormProps {
  vehicleType: string;
  vehicleName: string;
  vehicleImageUrl?: string;
  basePrice: number;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  vehicleType,
  vehicleName,
  vehicleImageUrl,
  basePrice
}) => {
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCountry, setLicenseCountry] = useState('');
  const [licenseIssueDate, setLicenseIssueDate] = useState('');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [extras, setExtras] = useState({
    fullCleaning: false,
    secondDriver: false,
    under25: false,
    licenseUnder3: false,
    outOfHours: false
  });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const calculateTotal = () => {
    if (!pickupDate || !dropoffDate) return 0;
    const days = Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 0;

    let total = basePrice * days;

    const insurancePrices: { [key: string]: number } = {
      'kasko': 15,
      'kasko-black': 25,
      'kasko-signature': 35
    };

    if (selectedInsurance && insurancePrices[selectedInsurance]) {
      total += insurancePrices[selectedInsurance] * days;
    }

    if (extras.fullCleaning) total += 30;
    if (extras.secondDriver) total += 10 * days;
    if (extras.under25) total += 10 * days;
    if (extras.licenseUnder3) total += 20 * days;
    if (extras.outOfHours) total += 50;

    return total;
  };

  const handleDateChange = (type: 'pickup' | 'dropoff', value: string) => {
    if (type === 'pickup') {
      setPickupDate(value);
      if (dropoffDate && new Date(value) > new Date(dropoffDate)) {
        setDropoffDate(value);
      }
    } else {
      setDropoffDate(value);
    }
  };

  const getInsurancePrice = (insurance: string) => {
    const prices: { [key: string]: number } = {
      'kasko': 15,
      'kasko-black': 25,
      'kasko-signature': 35
    };
    return prices[insurance] || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Support both authenticated users and guests
      const userId = user?.id || null; // Use null for guests instead of generating a string
      
      let licenseFilePath = null;
      
      // Only upload license if file is provided
      if (licenseFile) {
        const fileExt = licenseFile.name.split('.').pop();
        const fileName = `${userId || 'guest'}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('driver-licenses')
          .upload(fileName, licenseFile);

        if (uploadError) {
          console.error('License upload error:', uploadError);
          toast({
            title: language === 'it' ? 'Errore caricamento' : 'Upload error',
            description: language === 'it' 
              ? 'Errore nel caricamento della patente'
              : 'Failed to upload driver license',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        licenseFilePath = fileName;
      }

      // Create booking record
      const bookingData = {
        user_id: userId, // This will be null for guests
        vehicle_type: vehicleType,
        vehicle_name: vehicleName,
        vehicle_image_url: vehicleImageUrl,
        pickup_date: pickupDate,
        dropoff_date: dropoffDate,
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation || pickupLocation,
        price_total: Math.round(calculateTotal() * 100), // Store in cents
        currency: 'EUR',
        status: 'pending',
        payment_status: 'pending',
        license_issue_date: licenseIssueDate,
        booking_details: {
          basePrice: basePrice,
          insurance: selectedInsurance,
          extras: {
            fullCleaning: extras.fullCleaning,
            secondDriver: extras.secondDriver,
            under25: extras.under25,
            licenseUnder3: extras.licenseUnder3,
            outOfHours: extras.outOfHours
          },
          guestInfo: !userId ? {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            licenseNumber: licenseNumber,
            licenseCountry: licenseCountry,
            licenseFilePath: licenseFilePath
          } : null,
          pickupDate: pickupDate,
          dropoffDate: dropoffDate,
          pickupLocation: pickupLocation,
          dropoffLocation: dropoffLocation || pickupLocation,
          vehicleName: vehicleName,
          vehicleType: vehicleType,
          vehicleImageUrl: vehicleImageUrl
        }
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        toast({
          title: language === 'it' ? 'Errore prenotazione' : 'Booking error',
          description: bookingError.message,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Calculate line items for payment
      const days = Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24));
      const lineItems = [];

      // Base rental cost
      lineItems.push({
        type: 'rental',
        description: `${vehicleName} - ${days} ${language === 'it' ? (days === 1 ? 'giorno' : 'giorni') : (days === 1 ? 'day' : 'days')}`,
        quantity: days,
        unitPrice: basePrice,
        totalPrice: basePrice * days
      });

      // Insurance
      const insurancePrices = {
        'kasko': 15,
        'kasko-black': 25,
        'kasko-signature': 35
      };

      if (insurancePrices[selectedInsurance as keyof typeof insurancePrices]) {
        const dailyInsurance = insurancePrices[selectedInsurance as keyof typeof insurancePrices];
        lineItems.push({
          type: 'insurance',
          description: `${selectedInsurance.charAt(0).toUpperCase() + selectedInsurance.slice(1)} Insurance - ${days} ${language === 'it' ? (days === 1 ? 'giorno' : 'giorni') : (days === 1 ? 'day' : 'days')}`,
          quantity: days,
          unitPrice: dailyInsurance,
          totalPrice: dailyInsurance * days
        });
      }

      // Extras
      if (extras.fullCleaning) {
        lineItems.push({
          type: 'extra',
          description: language === 'it' ? 'Pulizia completa' : 'Full cleaning',
          quantity: 1,
          unitPrice: 30,
          totalPrice: 30
        });
      }

      if (extras.secondDriver) {
        lineItems.push({
          type: 'extra',
          description: `${language === 'it' ? 'Secondo guidatore' : 'Second driver'} - ${days} ${language === 'it' ? (days === 1 ? 'giorno' : 'giorni') : (days === 1 ? 'day' : 'days')}`,
          quantity: days,
          unitPrice: 10,
          totalPrice: 10 * days
        });
      }

      if (extras.under25) {
        lineItems.push({
          type: 'extra',
          description: `${language === 'it' ? 'Supplemento under 25' : 'Under 25 surcharge'} - ${days} ${language === 'it' ? (days === 1 ? 'giorno' : 'giorni') : (days === 1 ? 'day' : 'days')}`,
          quantity: days,
          unitPrice: 10,
          totalPrice: 10 * days
        });
      }

      if (extras.licenseUnder3) {
        lineItems.push({
          type: 'extra',
          description: `${language === 'it' ? 'Patente da meno di 3 anni' : 'License under 3 years'} - ${days} ${language === 'it' ? (days === 1 ? 'giorno' : 'giorni') : (days === 1 ? 'day' : 'days')}`,
          quantity: days,
          unitPrice: 20,
          totalPrice: 20 * days
        });
      }

      if (extras.outOfHours) {
        lineItems.push({
          type: 'extra',
          description: language === 'it' ? 'Consegna fuori orario' : 'Out of hours delivery',
          quantity: 1,
          unitPrice: 50,
          totalPrice: 50
        });
      }

      // Initiate payment via Nexi
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('nexi-payment', {
        body: {
          bookingId: booking.id,
          bookingDetails: {
            vehicleName: vehicleName,
            pickupDate: pickupDate,
            dropoffDate: dropoffDate,
            pickupLocation: pickupLocation,
            dropoffLocation: dropoffLocation || pickupLocation,
            insurance: selectedInsurance,
            extras: extras,
            basePrice: basePrice
          },
          lineItems: lineItems,
          totalAmount: calculateTotal(),
          currency: 'EUR',
          language: language,
          payerEmail: user?.email || email,
          payerName: user ? `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email : `${firstName} ${lastName}`
        }
      });

      if (paymentError) {
        console.error('Payment initiation error:', paymentError);
        toast({
          title: language === 'it' ? 'Errore pagamento' : 'Payment error',
          description: paymentError.message,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      if (paymentData?.success && paymentData?.paymentUrl) {
        // Create a form and submit it to Nexi
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentData.paymentUrl;

        // Add all payment parameters as hidden inputs
        Object.entries(paymentData.paymentParams).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error('Failed to get payment URL from server');
      }

    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: language === 'it' ? 'Errore' : 'Error',
        description: error.message || (language === 'it' ? 'Si è verificato un errore durante la prenotazione' : 'An error occurred during booking'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'it' ? 'Completa la tua prenotazione' : 'Complete Your Reservation'}
          </h1>
          <p className="text-gray-600">
            {language === 'it' 
              ? 'Inserisci i tuoi dati per finalizzare la prenotazione' 
              : 'Enter your details to finalize your booking'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Show personal info form only for guests */}
              {!user && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {language === 'it' ? 'Informazioni personali' : 'Personal Information'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{language === 'it' ? 'Nome' : 'First Name'} *</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{language === 'it' ? 'Cognome' : 'Last Name'} *</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">{language === 'it' ? 'Email' : 'Email'} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{language === 'it' ? 'Telefono' : 'Phone'} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Booking Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {language === 'it' ? 'Dettagli prenotazione' : 'Booking Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickupDate">{language === 'it' ? 'Data ritiro' : 'Pickup Date'} *</Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        value={pickupDate}
                        onChange={(e) => handleDateChange('pickup', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dropoffDate">{language === 'it' ? 'Data consegna' : 'Drop-off Date'} *</Label>
                      <Input
                        id="dropoffDate"
                        type="date"
                        value={dropoffDate}
                        onChange={(e) => handleDateChange('dropoff', e.target.value)}
                        min={pickupDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="pickupLocation">{language === 'it' ? 'Luogo di ritiro' : 'Pickup Location'} *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="pickupLocation"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="pl-10"
                        placeholder={language === 'it' ? 'Inserisci indirizzo di ritiro' : 'Enter pickup address'}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dropoffLocation">{language === 'it' ? 'Luogo di consegna' : 'Drop-off Location'}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="dropoffLocation"
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        className="pl-10"
                        placeholder={language === 'it' ? 'Stesso del ritiro se vuoto' : 'Same as pickup if empty'}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver License Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {language === 'it' ? 'Patente di guida' : 'Driver License'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="licenseNumber">{language === 'it' ? 'Numero patente' : 'License Number'} *</Label>
                      <Input
                        id="licenseNumber"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="licenseCountry">{language === 'it' ? 'Paese di rilascio' : 'Country of Issue'} *</Label>
                      <Select value={licenseCountry} onValueChange={setLicenseCountry} required>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'it' ? 'Seleziona paese' : 'Select country'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IT">Italia</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="DE">Deutschland</SelectItem>
                          <SelectItem value="ES">España</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="licenseIssueDate">{language === 'it' ? 'Data di rilascio' : 'Issue Date'} *</Label>
                    <Input
                      id="licenseIssueDate"
                      type="date"
                      value={licenseIssueDate}
                      onChange={(e) => setLicenseIssueDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="licenseFile">{language === 'it' ? 'Carica patente (fronte/retro)' : 'Upload License (front/back)'}</Label>
                    <Input
                      id="licenseFile"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {language === 'it' 
                        ? 'Formati supportati: JPG, PNG, PDF (max 5MB)'
                        : 'Supported formats: JPG, PNG, PDF (max 5MB)'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {language === 'it' ? 'Assicurazione' : 'Insurance'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="kasko"
                        name="insurance"
                        value="kasko"
                        checked={selectedInsurance === 'kasko'}
                        onChange={(e) => setSelectedInsurance(e.target.value)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="kasko" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <span>Kasko - {language === 'it' ? 'Protezione base' : 'Basic protection'}</span>
                          <span className="font-semibold">€15/{language === 'it' ? 'giorno' : 'day'}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {language === 'it' ? 'Copertura per danni e furto' : 'Coverage for damage and theft'}
                        </p>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="kasko-black"
                        name="insurance"
                        value="kasko-black"
                        checked={selectedInsurance === 'kasko-black'}
                        onChange={(e) => setSelectedInsurance(e.target.value)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="kasko-black" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <span>Kasko Black - {language === 'it' ? 'Protezione avanzata' : 'Advanced protection'}</span>
                          <span className="font-semibold">€25/{language === 'it' ? 'giorno' : 'day'}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {language === 'it' ? 'Include danni agli pneumatici e cerchi' : 'Includes tire and rim damage'}
                        </p>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="kasko-signature"
                        name="insurance"
                        value="kasko-signature"
                        checked={selectedInsurance === 'kasko-signature'}
                        onChange={(e) => setSelectedInsurance(e.target.value)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="kasko-signature" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <span>Kasko Signature - {language === 'it' ? 'Protezione completa' : 'Complete protection'}</span>
                          <span className="font-semibold">€35/{language === 'it' ? 'giorno' : 'day'}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {language === 'it' ? 'Copertura totale senza franchigia' : 'Full coverage with no deductible'}
                        </p>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Extras Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    {language === 'it' ? 'Servizi aggiuntivi' : 'Additional Services'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="fullCleaning"
                          checked={extras.fullCleaning}
                          onCheckedChange={(checked) => setExtras(prev => ({ ...prev, fullCleaning: !!checked }))}
                        />
                        <Label htmlFor="fullCleaning">
                          {language === 'it' ? 'Pulizia completa' : 'Full cleaning'}
                        </Label>
                      </div>
                      <span className="font-semibold">€30</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="secondDriver"
                          checked={extras.secondDriver}
                          onCheckedChange={(checked) => setExtras(prev => ({ ...prev, secondDriver: !!checked }))}
                        />
                        <Label htmlFor="secondDriver">
                          {language === 'it' ? 'Secondo guidatore' : 'Second driver'}
                        </Label>
                      </div>
                      <span className="font-semibold">€10/{language === 'it' ? 'giorno' : 'day'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="under25"
                          checked={extras.under25}
                          onCheckedChange={(checked) => setExtras(prev => ({ ...prev, under25: !!checked }))}
                        />
                        <Label htmlFor="under25">
                          {language === 'it' ? 'Supplemento under 25' : 'Under 25 surcharge'}
                        </Label>
                      </div>
                      <span className="font-semibold">€10/{language === 'it' ? 'giorno' : 'day'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="licenseUnder3"
                          checked={extras.licenseUnder3}
                          onCheckedChange={(checked) => setExtras(prev => ({ ...prev, licenseUnder3: !!checked }))}
                        />
                        <Label htmlFor="licenseUnder3">
                          {language === 'it' ? 'Patente da meno di 3 anni' : 'License under 3 years'}
                        </Label>
                      </div>
                      <span className="font-semibold">€20/{language === 'it' ? 'giorno' : 'day'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="outOfHours"
                          checked={extras.outOfHours}
                          onCheckedChange={(checked) => setExtras(prev => ({ ...prev, outOfHours: !!checked }))}
                        />
                        <Label htmlFor="outOfHours">
                          {language === 'it' ? 'Consegna fuori orario' : 'Out of hours delivery'}
                        </Label>
                      </div>
                      <span className="font-semibold">€50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={isSubmitting || !pickupDate || !dropoffDate || !pickupLocation || !licenseNumber || !licenseCountry || !licenseIssueDate || (!user && (!firstName || !lastName || !email || !phone))}
              >
                {isSubmitting 
                  ? (language === 'it' ? 'Elaborazione...' : 'Processing...') 
                  : (language === 'it' ? 'Procedi al pagamento' : 'Proceed to Payment')
                }
              </Button>
            </form>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  {language === 'it' ? 'Riepilogo prenotazione' : 'Booking Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehicleImageUrl && (
                  <img 
                    src={vehicleImageUrl} 
                    alt={vehicleName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                
                <div>
                  <h3 className="font-semibold text-lg">{vehicleName}</h3>
                  <p className="text-gray-600">{vehicleType}</p>
                </div>

                {pickupDate && dropoffDate && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{language === 'it' ? 'Periodo:' : 'Period:'}</span>
                      <span className="font-medium">
                        {Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24))} {language === 'it' ? 'giorni' : 'days'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>{language === 'it' ? 'Tariffa base:' : 'Base rate:'}</span>
                      <span>€{basePrice}/{language === 'it' ? 'giorno' : 'day'}</span>
                    </div>

                    {selectedInsurance && (
                      <div className="flex justify-between">
                        <span>{language === 'it' ? 'Assicurazione:' : 'Insurance:'}</span>
                        <span>€{getInsurancePrice(selectedInsurance)}/{language === 'it' ? 'giorno' : 'day'}</span>
                      </div>
                    )}

                    {Object.entries(extras).some(([key, value]) => value) && (
                      <div className="space-y-1">
                        <p className="font-medium">{language === 'it' ? 'Servizi aggiuntivi:' : 'Extras:'}</p>
                        {extras.fullCleaning && (
                          <div className="flex justify-between text-xs">
                            <span>{language === 'it' ? 'Pulizia completa' : 'Full cleaning'}</span>
                            <span>€30</span>
                          </div>
                        )}
                        {extras.secondDriver && (
                          <div className="flex justify-between text-xs">
                            <span>{language === 'it' ? 'Secondo guidatore' : 'Second driver'}</span>
                            <span>€{10 * Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                          </div>
                        )}
                        {extras.under25 && (
                          <div className="flex justify-between text-xs">
                            <span>{language === 'it' ? 'Under 25' : 'Under 25'}</span>
                            <span>€{10 * Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                          </div>
                        )}
                        {extras.licenseUnder3 && (
                          <div className="flex justify-between text-xs">
                            <span>{language === 'it' ? 'Patente < 3 anni' : 'License < 3 years'}</span>
                            <span>€{20 * Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                          </div>
                        )}
                        {extras.outOfHours && (
                          <div className="flex justify-between text-xs">
                            <span>{language === 'it' ? 'Fuori orario' : 'Out of hours'}</span>
                            <span>€50</span>
                          </div>
                        )}
                      </div>
                    )}

                    <hr className="my-2" />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>{language === 'it' ? 'Totale:' : 'Total:'}</span>
                      <span>€{calculateTotal()}</span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• {language === 'it' ? 'Tutti i prezzi includono IVA' : 'All prices include VAT'}</p>
                  <p>• {language === 'it' ? 'Pagamento sicuro con Nexi' : 'Secure payment with Nexi'}</p>
                  <p>• {language === 'it' ? 'Cancellazione gratuita fino a 24h prima' : 'Free cancellation up to 24h before'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
