import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, User, Phone, Mail, CreditCard, Shield, Car, Clock, Upload, FileText, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { NexiHostedPayment } from './NexiHostedPayment';

interface ReservationFormProps {
  vehicleType: string;
  vehicleName: string;
  vehicleImageUrl?: string;
  basePrice: number;
}

interface EligibilityData {
  ageBucket: string;
  yearsLicensedBucket: string;
  countryIso2: string;
  licenseFileUrl?: string;
  termsAccepted: boolean;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  vehicleType,
  vehicleName,
  vehicleImageUrl,
  basePrice
}) => {
  // Form states
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [pickupLocation, setPickupLocation] = useState('cagliari-airport');
  const [insurance, setInsurance] = useState('kasko');
  const [extras, setExtras] = useState({
    fullCleaning: true, // Made mandatory
    secondDriver: false,
    under25: false,
    licenseUnder3: false,
    outOfHours: false,
  });

  // New eligibility states
  const [ageBucket, setAgeBucket] = useState<string>('');
  const [yearsLicensedBucket, setYearsLicensedBucket] = useState<string>('');
  const [eligibility, setEligibility] = useState<EligibilityData>({
    ageBucket: '',
    yearsLicensedBucket: '',
    countryIso2: '',
    termsAccepted: false,
  });

  // Guest info for non-authenticated users
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Eligibility, 3: Payment
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [pickupDateOpen, setPickupDateOpen] = useState(false);
  const [dropoffDateOpen, setDropoffDateOpen] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const translations = {
    en: {
      completeReservation: 'Complete Your Reservation',
      enterDetails: 'Enter your details to finalize your booking',
      personalInfo: 'Personal Information',
      bookingDetails: 'Booking Details',
      eligibilityCheck: 'Eligibility Check',
      paymentProcessing: 'Payment Processing',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      pickupDate: 'Pickup Date',
      dropoffDate: 'Drop-off Date',
      pickupLocation: 'Pickup Location',
      ageSelector: 'I am',
      yearsLicensedSelector: "I've held my license for",
      ageRequired: 'Please confirm your age.',
      yearsLicensedRequired: 'Please confirm how many years you\'ve held your license.',
      insuranceEligibilityError: 'You don\'t meet the eligibility requirements for this insurance.',
      country: 'Country',
      licensePhoto: 'Upload License Photo',
      termsAndConditions: 'I accept the Terms and Conditions',
      insurance: 'Insurance',
      additionalServices: 'Additional Services',
      bookingSummary: 'Booking Summary',
      proceedToPayment: 'Proceed to Payment',
      processing: 'Processing...',
      nextStep: 'Next Step',
      previousStep: 'Previous Step',
      validateEligibility: 'Validate Eligibility',
      licensePhotoRequired: 'License photo is required',
      termsAcceptanceRequired: 'You must accept the terms and conditions',
      eligibilityValidated: 'Eligibility validated successfully',
      fullCleaning: 'Full cleaning',
      secondDriver: 'Second driver',
      under25Surcharge: 'Under 25 surcharge',
      licenseUnder3: 'License under 3 years',
      outOfHours: 'Out of hours delivery',
      baseRate: 'Base rate',
      period: 'Period',
      days: 'days',
      day: 'day',
      extras: 'Extras',
      total: 'Total',
      allPricesIncludeVAT: 'All prices include VAT',
      securePayment: 'Secure payment with Nexi'
    },
    it: {
      completeReservation: 'Completa la tua prenotazione',
      enterDetails: 'Inserisci i tuoi dati per finalizzare la prenotazione',
      personalInfo: 'Informazioni personali',
      bookingDetails: 'Dettagli prenotazione',
      eligibilityCheck: 'Verifica idoneità',
      paymentProcessing: 'Elaborazione pagamento',
      firstName: 'Nome',
      lastName: 'Cognome',
      email: 'Email',
      phone: 'Telefono',
      pickupDate: 'Data ritiro',
      dropoffDate: 'Data consegna',
      pickupLocation: 'Luogo di ritiro',
      ageSelector: 'Ho',
      yearsLicensedSelector: 'Possiedo la patente da',
      ageRequired: 'Conferma la tua età.',
      yearsLicensedRequired: 'Conferma da quanti anni possiedi la patente.',
      insuranceEligibilityError: 'Non soddisfi i requisiti di idoneità per questa assicurazione.',
      country: 'Paese',
      licensePhoto: 'Carica foto patente',
      termsAndConditions: 'Accetto i Termini e Condizioni',
      insurance: 'Assicurazione',
      additionalServices: 'Servizi aggiuntivi',
      bookingSummary: 'Riepilogo prenotazione',
      proceedToPayment: 'Procedi al pagamento',
      processing: 'Elaborazione...',
      nextStep: 'Prossimo step',
      previousStep: 'Step precedente',
      validateEligibility: 'Valida idoneità',
      licensePhotoRequired: 'La foto della patente è obbligatoria',
      termsAcceptanceRequired: 'Devi accettare i termini e condizioni',
      eligibilityValidated: 'Idoneità validata con successo',
      fullCleaning: 'Pulizia completa',
      secondDriver: 'Secondo guidatore',
      under25Surcharge: 'Supplemento under 25',
      licenseUnder3: 'Patente da meno di 3 anni',
      outOfHours: 'Consegna fuori orario',
      baseRate: 'Tariffa base',
      period: 'Periodo',
      days: 'giorni',
      day: 'giorno',
      extras: 'Servizi aggiuntivi',
      total: 'Totale',
      allPricesIncludeVAT: 'Tutti i prezzi includono IVA',
      securePayment: 'Pagamento sicuro con Nexi'
    }
  };

  const t = translations[language];

  // Age options
  const ageOptions = ['18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28+'];
  // Years licensed options
  const yearsLicensedOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];

  // Business rules for KASKO eligibility
  const getEligibleInsuranceOptions = () => {
    if (!ageBucket || !yearsLicensedBucket) return [];

    const age = ageBucket === '28+' ? 28 : parseInt(ageBucket);
    const yearsLicensed = yearsLicensedBucket === '10+' ? 10 : parseInt(yearsLicensedBucket);

    const options = [];

    // KASKO BASE: years_licensed >= 2
    if (yearsLicensed >= 2) {
      options.push({ id: 'kasko', name: 'Kasko - Basic protection', price: 15 });
    }

    // KASKO BLACK: age >= 25 AND years_licensed >= 5
    if (age >= 25 && yearsLicensed >= 5) {
      options.push({ id: 'kasko-black', name: 'Kasko Black - Advanced protection', price: 25 });
    }

    // KASKO SIGNATURE: age >= 30 AND years_licensed >= 10
    if (age >= 30 && yearsLicensed >= 10) {
      options.push({ id: 'kasko-signature', name: 'Kasko Signature - Complete protection', price: 35 });
    }

    return options;
  };

  // Validate insurance eligibility
  const validateInsuranceEligibility = () => {
    const eligibleOptions = getEligibleInsuranceOptions();
    return eligibleOptions.some(option => option.id === insurance);
  };

  // Validation functions
  const validateEligibility = (): string[] => {
    const errors: string[] = [];
    
    if (!ageBucket) {
      errors.push(t.ageRequired);
    }
    
    if (!yearsLicensedBucket) {
      errors.push(t.yearsLicensedRequired);
    }
    
    if (!eligibility.countryIso2) {
      errors.push('Country is required');
    }
    
    if (!licenseFile) {
      errors.push(t.licensePhotoRequired);
    }
    
    if (!eligibility.termsAccepted) {
      errors.push(t.termsAcceptanceRequired);
    }

    // Check insurance eligibility
    if (ageBucket && yearsLicensedBucket && !validateInsuranceEligibility()) {
      errors.push(t.insuranceEligibilityError);
    }
    
    return errors;
  };

  const calculateTotal = () => {
    if (!pickupDate || !dropoffDate) return 0;
    const days = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 0;

    let total = basePrice * days;

    // Add insurance costs
    const insurancePrices: { [key: string]: number } = {
      'kasko': 15,
      'kasko-black': 25,
      'kasko-signature': 35
    };

    if (insurance && insurancePrices[insurance]) {
      total += insurancePrices[insurance] * days;
    }

    // Add extras
    if (extras.fullCleaning) total += 30;
    if (extras.secondDriver) total += 10 * days;
    if (extras.under25) total += 10 * days;
    if (extras.licenseUnder3) total += 20 * days;
    if (extras.outOfHours) total += 50;

    return total;
  };

  const handleNextStep = async () => {
    if (step === 1) {
      // Validate step 1 fields
      if (!pickupDate || !dropoffDate || !pickupLocation) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        return;
      }
      
      if (!user && (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone)) {
        toast({
          title: 'Error',
          description: 'Please fill in all personal information',
          variant: 'destructive',
        });
        return;
      }

      // Validate age and years licensed selectors
      if (!ageBucket) {
        toast({
          title: 'Error',
          description: t.ageRequired,
          variant: 'destructive',
        });
        return;
      }

      if (!yearsLicensedBucket) {
        toast({
          title: 'Error',
          description: t.yearsLicensedRequired,
          variant: 'destructive',
        });
        return;
      }

      // Update eligibility data
      setEligibility(prev => ({ 
        ...prev, 
        ageBucket,
        yearsLicensedBucket
      }));

      // Auto-select the best available insurance
      const eligibleOptions = getEligibleInsuranceOptions();
      if (eligibleOptions.length > 0) {
        setInsurance(eligibleOptions[0].id);
      }
      
      setStep(2);
    } else if (step === 2) {
      // Validate eligibility
      const errors = validateEligibility();
      if (errors.length > 0) {
        toast({
          title: 'Validation Error',
          description: errors[0],
          variant: 'destructive',
        });
        return;
      }
      setStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateInsuranceEligibility()) {
      toast({
        title: 'Error',
        description: t.insuranceEligibilityError,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createBookingForPayment();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  const createBookingForPayment = async () => {
    let licenseFileUrl = '';
    
    if (licenseFile) {
      const fileExt = licenseFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('driver-licenses')
        .upload(fileName, licenseFile);
        
      if (uploadError) {
        throw new Error('Failed to upload license file');
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('driver-licenses')
        .getPublicUrl(fileName);
        
      licenseFileUrl = publicUrl;
    }
    
    const bookingData = {
      user_id: user?.id || null,
      vehicle_type: vehicleType,
      vehicle_name: vehicleName,
      vehicle_image_url: vehicleImageUrl,
      pickup_date: pickupDate?.toISOString(),
      dropoff_date: dropoffDate?.toISOString(),
      pickup_location: pickupLocation,
      price_total: Math.round(calculateTotal() * 100),
      booking_details: {
        insurance,
        extras,
        guestInfo: user ? null : guestInfo,
      },
      age_bucket: ageBucket,
      years_licensed_bucket: yearsLicensedBucket,
      license_file_url: licenseFileUrl,
      terms_accepted: eligibility.termsAccepted,
      country_iso2: eligibility.countryIso2,
      currency: 'eur',
      status: 'pending',
      payment_status: 'pending'
    };
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    setBookingId(data.id);
  };

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLicenseFile(file);
    }
  };

  // Location options
  const locationOptions = [
    { value: 'cagliari-airport', label: 'Cagliari Airport' },
    { value: 'cagliari-center', label: 'DR7 Office' },
  ];

  // Countries list
  const countries = [
    { code: 'IT', name: 'Italy / Italia' },
    { code: 'DE', name: 'Germany / Deutschland' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain / España' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Personal Information for guests */}
            {!user && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {t.personalInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t.firstName}</Label>
                      <Input
                        id="firstName"
                        value={guestInfo.firstName}
                        onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t.lastName}</Label>
                      <Input
                        id="lastName"
                        value={guestInfo.lastName}
                        onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t.phone}</Label>
                      <Input
                        id="phone"
                        value={guestInfo.phone}
                        onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  {t.bookingDetails}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t.pickupDate}</Label>
                    <Popover open={pickupDateOpen} onOpenChange={setPickupDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !pickupDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={pickupDate}
                          onSelect={(date) => {
                            setPickupDate(date);
                            setPickupDateOpen(false);
                          }}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>{t.dropoffDate}</Label>
                    <Popover open={dropoffDateOpen} onOpenChange={setDropoffDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dropoffDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dropoffDate ? format(dropoffDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dropoffDate}
                          onSelect={(date) => {
                            setDropoffDate(date);
                            setDropoffDateOpen(false);
                          }}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01") || (pickupDate && date <= pickupDate)
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <Label>{t.pickupLocation}</Label>
                  <Select value={pickupLocation} onValueChange={setPickupLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Age and Years Licensed Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      {t.ageSelector}
                      {ageBucket && <Check className="w-4 h-4 text-green-500" />}
                    </Label>
                    <Select value={ageBucket} onValueChange={setAgeBucket}>
                      <SelectTrigger>
                        <SelectValue placeholder={`${t.ageSelector} ... ▾`} />
                      </SelectTrigger>
                      <SelectContent>
                        {ageOptions.map((age) => (
                          <SelectItem key={age} value={age}>
                            {age}+ years
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      {t.yearsLicensedSelector}
                      {yearsLicensedBucket && <Check className="w-4 h-4 text-green-500" />}
                    </Label>
                    <Select value={yearsLicensedBucket} onValueChange={setYearsLicensedBucket}>
                      <SelectTrigger>
                        <SelectValue placeholder={`${t.yearsLicensedSelector} ... ▾`} />
                      </SelectTrigger>
                      <SelectContent>
                        {yearsLicensedOptions.map((years) => (
                          <SelectItem key={years} value={years}>
                            {years} {years === '1' ? 'year' : 'years'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insurance Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t.insurance}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={insurance} onValueChange={setInsurance}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getEligibleInsuranceOptions().map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name} (+€{option.price}/day)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(!ageBucket || !yearsLicensedBucket) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Select your age and license experience to see available insurance options
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card>
              <CardHeader>
                <CardTitle>{t.additionalServices}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fullCleaning"
                    checked={extras.fullCleaning}
                    onCheckedChange={(checked) => 
                      setExtras({ ...extras, fullCleaning: checked as boolean })
                    }
                    disabled={true} // Mandatory service
                  />
                  <Label htmlFor="fullCleaning">{t.fullCleaning} (+€30)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="secondDriver"
                    checked={extras.secondDriver}
                    onCheckedChange={(checked) => 
                      setExtras({ ...extras, secondDriver: checked as boolean })
                    }
                  />
                  <Label htmlFor="secondDriver">{t.secondDriver} (+€10/day)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="outOfHours"
                    checked={extras.outOfHours}
                    onCheckedChange={(checked) => 
                      setExtras({ ...extras, outOfHours: checked as boolean })
                    }
                  />
                  <Label htmlFor="outOfHours">{t.outOfHours} (+€50)</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t.eligibilityCheck}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{t.country}</Label>
                  <Select 
                    value={eligibility.countryIso2} 
                    onValueChange={(value) => setEligibility({ ...eligibility, countryIso2: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="licenseUpload">{t.licensePhoto}</Label>
                  <Input
                    id="licenseUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="mt-1"
                  />
                  {licenseFile && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      {licenseFile.name}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={eligibility.termsAccepted}
                    onCheckedChange={(checked) => 
                      setEligibility({ ...eligibility, termsAccepted: checked as boolean })
                    }
                  />
                  <Label htmlFor="terms">{t.termsAndConditions}</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return bookingId ? (
          <NexiHostedPayment 
            bookingData={{
              bookingId,
              lineItems: [
                {
                  type: 'rental',
                  description: `${vehicleName} rental`,
                  quantity: 1,
                  unitPrice: Math.round(calculateTotal() * 100),
                  totalPrice: Math.round(calculateTotal() * 100)
                }
              ],
              totalAmount: Math.round(calculateTotal() * 100),
              currency: 'EUR',
              payerEmail: user?.email || guestInfo.email,
              payerName: user ? `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() : `${guestInfo.firstName} ${guestInfo.lastName}`,
              bookingDetails: {
                insurance,
                extras,
                ageBucket,
                yearsLicensedBucket,
                pickupDate: pickupDate?.toISOString(),
                dropoffDate: dropoffDate?.toISOString(),
                pickupLocation
              },
              language
            }}
            onPaymentSuccess={() => {
              navigate('/payment-success');
            }}
            onPaymentError={(error) => {
              console.error('Payment error:', error);
              toast({
                title: 'Payment Error',
                description: 'Payment failed. Please try again.',
                variant: 'destructive',
              });
            }}
          />
        ) : (
          <div className="text-center py-8">
            <p>Preparing payment...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.completeReservation}</h1>
        <p className="text-muted-foreground">{t.enterDetails}</p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className={cn("text-sm", step >= 1 ? "text-primary font-medium" : "text-muted-foreground")}>
            {t.bookingDetails}
          </span>
          <span className={cn("text-sm", step >= 2 ? "text-primary font-medium" : "text-muted-foreground")}>
            {t.eligibilityCheck}
          </span>
          <span className={cn("text-sm", step >= 3 ? "text-primary font-medium" : "text-muted-foreground")}>
            {t.paymentProcessing}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2">
          {renderStepContent()}
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={step === 1}
            >
              {t.previousStep}
            </Button>
            
            {step < 3 ? (
              <Button 
                onClick={handleNextStep}
                disabled={!ageBucket || !yearsLicensedBucket}
              >
                {t.nextStep}
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? t.processing : t.proceedToPayment}
              </Button>
            )}
          </div>
        </div>

        {/* Booking summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>{t.bookingSummary}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{vehicleName}</span>
              </div>
              
              {pickupDate && dropoffDate && (
                <>
                  <div className="flex justify-between">
                    <span>{t.period}:</span>
                    <span>
                      {Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))} {t.days}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>{t.baseRate}:</span>
                    <span>€{basePrice * Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))}</span>
                  </div>

                  {insurance && (
                    <div className="flex justify-between">
                      <span>{t.insurance}:</span>
                      <span>€{getEligibleInsuranceOptions().find(opt => opt.id === insurance)?.price || 0} × {Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                  )}

                  {(extras.fullCleaning || extras.secondDriver || extras.outOfHours) && (
                    <div className="border-t pt-2">
                      <h4 className="font-medium">{t.extras}:</h4>
                      {extras.fullCleaning && (
                        <div className="flex justify-between text-sm">
                          <span>{t.fullCleaning}</span>
                          <span>€30</span>
                        </div>
                      )}
                      {extras.secondDriver && (
                        <div className="flex justify-between text-sm">
                          <span>{t.secondDriver}</span>
                          <span>€{10 * Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))}</span>
                        </div>
                      )}
                      {extras.outOfHours && (
                        <div className="flex justify-between text-sm">
                          <span>{t.outOfHours}</span>
                          <span>€50</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>{t.total}:</span>
                      <span>€{calculateTotal()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{t.allPricesIncludeVAT}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
