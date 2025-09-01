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

interface ReservationFormProps {
  vehicleType: string;
  vehicleName: string;
  vehicleImageUrl?: string;
  basePrice: number;
}

interface EligibilityData {
  dateOfBirth: string;
  licenseIssueDate: string;
  ageBucket: string;
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

  // Eligibility states
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [licenseIssueDate, setLicenseIssueDate] = useState<Date>();
  const [dobDay, setDobDay] = useState<string>('');
  const [dobMonth, setDobMonth] = useState<string>('');
  const [dobYear, setDobYear] = useState<string>('');
  const [licenseDay, setLicenseDay] = useState<string>('');
  const [licenseMonth, setLicenseMonth] = useState<string>('');
  const [licenseYear, setLicenseYear] = useState<string>('');
  const [eligibility, setEligibility] = useState<EligibilityData>({
    dateOfBirth: '',
    licenseIssueDate: '',
    ageBucket: '',
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
      dateOfBirth: 'Date of Birth',
      licenseIssueDate: 'License Issue Date',
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
      dateOfBirthRequired: 'Date of birth is required',
      minimumAgeError: 'Minimum age is 21 years',
      maximumAgeError: 'Maximum age is 75 years',
      licenseIssueDateRequired: 'License issue date is required',
      minimumLicenseAgeError: 'License must be at least 1 year old',
      countryRequired: 'Country is required',
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
      dateOfBirth: 'Data di nascita',
      licenseIssueDate: 'Data rilascio patente',
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
      dateOfBirthRequired: 'La data di nascita è obbligatoria',
      minimumAgeError: 'Età minima 21 anni',
      maximumAgeError: 'Età massima 75 anni',
      licenseIssueDateRequired: 'La data di rilascio patente è obbligatoria',
      minimumLicenseAgeError: 'La patente deve essere vecchia almeno 1 anno',
      countryRequired: 'Il paese è obbligatorio',
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

  // Validation functions
  const validateEligibility = (): string[] => {
    const errors: string[] = [];
    
    if (!dateOfBirth) {
      errors.push(t.dateOfBirthRequired);
    } else {
      const age = calculateAge(dateOfBirth);
      if (age < 21) {
        errors.push(t.minimumAgeError);
      } else if (age > 75) {
        errors.push(t.maximumAgeError);
      }
    }
    
    if (!licenseIssueDate) {
      errors.push(t.licenseIssueDateRequired);
    } else {
      const licenseAge = calculateLicenseAge(licenseIssueDate);
      if (licenseAge < 1) {
        errors.push(t.minimumLicenseAgeError);
      }
    }
    
    if (!eligibility.countryIso2) {
      errors.push(t.countryRequired);
    }
    
    if (!licenseFile) {
      errors.push(t.licensePhotoRequired);
    }
    
    if (!eligibility.termsAccepted) {
      errors.push(t.termsAcceptanceRequired);
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

  // Helper functions for dropdown date handling
  const updateDateOfBirth = () => {
    if (dobDay && dobMonth && dobYear) {
      const date = new Date(parseInt(dobYear), parseInt(dobMonth) - 1, parseInt(dobDay));
      setDateOfBirth(date);
      setEligibility(prev => ({ ...prev, dateOfBirth: date.toISOString().split('T')[0] }));
      // Trigger insurance update after setting the date
      setTimeout(() => updateInsuranceSelection(date, licenseIssueDate), 0);
    }
  };

  const updateLicenseDate = () => {
    if (licenseDay && licenseMonth && licenseYear) {
      const date = new Date(parseInt(licenseYear), parseInt(licenseMonth) - 1, parseInt(licenseDay));
      setLicenseIssueDate(date);
      setEligibility(prev => ({ ...prev, licenseIssueDate: date.toISOString().split('T')[0] }));
      // Trigger insurance update after setting the date
      setTimeout(() => updateInsuranceSelection(dateOfBirth, date), 0);
    }
  };

  // Helper functions for age calculations
  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const calculateLicenseAge = (licenseDate: Date): number => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - licenseDate.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return diffYears;
  };

  // Automatic insurance selection based on age and license experience
  const updateInsuranceSelection = (dob: Date | undefined, licenseDate: Date | undefined) => {
    console.log('updateInsuranceSelection called', { dob, licenseDate });
    if (!dob || !licenseDate) {
      console.log('Missing dates, skipping insurance update');
      return;
    }
    
    const age = calculateAge(dob);
    const licenseAge = calculateLicenseAge(licenseDate);
    console.log('Age calculations:', { age, licenseAge });
    
    // Insurance selection logic based on risk assessment
    let selectedInsurance = 'kasko';
    if (age < 25 || licenseAge < 2) {
      // High risk: young driver or new license - require premium insurance
      selectedInsurance = 'kasko-signature';
      console.log('High risk detected, selecting kasko-signature');
    } else if (age < 30 || licenseAge < 5) {
      // Medium risk: moderate experience - advanced insurance
      selectedInsurance = 'kasko-black';
      console.log('Medium risk detected, selecting kasko-black');
    } else {
      // Low risk: experienced driver - basic insurance allowed
      selectedInsurance = 'kasko';
      console.log('Low risk detected, selecting basic kasko');
    }
    
    setInsurance(selectedInsurance);
    console.log('Insurance set to:', selectedInsurance);
  };

  // Get available insurance options based on conditions
  const getAvailableInsuranceOptions = () => {
    if (!dateOfBirth || !licenseIssueDate) {
      return [
        { id: 'kasko', name: 'Kasko - Basic protection', price: 15, disabled: true }
      ];
    }

    const age = calculateAge(dateOfBirth);
    const licenseAge = calculateLicenseAge(licenseIssueDate);
    
    // Only show the appropriate insurance option based on risk assessment
    if (age < 25 || licenseAge < 2) {
      // High risk: only show signature
      return [
        { id: 'kasko-signature', name: 'Kasko Signature - Complete protection', price: 35, disabled: false }
      ];
    } else if (age < 30 || licenseAge < 5) {
      // Medium risk: only show black
      return [
        { id: 'kasko-black', name: 'Kasko Black - Advanced protection', price: 25, disabled: false }
      ];
    } else {
      // Low risk: only show basic
      return [
        { id: 'kasko', name: 'Kasko - Basic protection', price: 15, disabled: false }
      ];
    }
  };

  // Generate arrays for dropdowns
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const currentYear = new Date().getFullYear();
  const dobYears = Array.from({ length: 80 }, (_, i) => (currentYear - 18 - i).toString()); // 18-98 years old
  const licenseYears = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString()); // Current year to 50 years ago

  const handleNextStep = () => {
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

      // Validate DOB and license date in step 1
      // Check if DOB is set OR if all dropdown values are provided
      let validDateOfBirth = dateOfBirth;
      if (!validDateOfBirth && dobDay && dobMonth && dobYear) {
        // Create date from dropdown values for validation
        validDateOfBirth = new Date(parseInt(dobYear), parseInt(dobMonth) - 1, parseInt(dobDay));
        setDateOfBirth(validDateOfBirth);
        setEligibility(prev => ({ ...prev, dateOfBirth: validDateOfBirth!.toISOString().split('T')[0] }));
      }
      
      if (!validDateOfBirth) {
        toast({
          title: 'Error',
          description: t.dateOfBirthRequired,
          variant: 'destructive',
        });
        return;
      }

      // Check if license date is set OR if all dropdown values are provided  
      let validLicenseDate = licenseIssueDate;
      if (!validLicenseDate && licenseDay && licenseMonth && licenseYear) {
        // Create date from dropdown values for validation
        validLicenseDate = new Date(parseInt(licenseYear), parseInt(licenseMonth) - 1, parseInt(licenseDay));
        setLicenseIssueDate(validLicenseDate);
        setEligibility(prev => ({ ...prev, licenseIssueDate: validLicenseDate!.toISOString().split('T')[0] }));
      }
      
      if (!validLicenseDate) {
        toast({
          title: 'Error',
          description: t.licenseIssueDateRequired,
          variant: 'destructive',
        });
        return;
      }

      // Validate age limits using the validated date
      const age = calculateAge(validDateOfBirth);
      if (age < 21) {
        toast({
          title: 'Error',
          description: t.minimumAgeError,
          variant: 'destructive',
        });
        return;
      } else if (age > 75) {
        toast({
          title: 'Error',
          description: t.maximumAgeError,
          variant: 'destructive',
        });
        return;
      }

      // Validate license age using the validated date
      const licenseAge = calculateLicenseAge(validLicenseDate);
      if (licenseAge < 1) {
        toast({
          title: 'Error',
          description: t.minimumLicenseAgeError,
          variant: 'destructive',
        });
        return;
      }

      // Update insurance selection based on the validated dates
      updateInsuranceSelection(validDateOfBirth, validLicenseDate);

      // Set age bucket based on calculated age - this enables insurance selection logic
      let ageBucket = '';
      if (age >= 21 && age <= 24) ageBucket = '21-24';
      else if (age >= 25 && age <= 30) ageBucket = '25-30';
      else if (age >= 31 && age <= 45) ageBucket = '31-45';
      else if (age >= 46 && age <= 65) ageBucket = '46-65';
      else if (age >= 66 && age <= 75) ageBucket = '66-75';

      setEligibility(prev => ({ ...prev, ageBucket }));
      
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

      // Set age bucket based on calculated age
      const ageForBucket = calculateAge(dateOfBirth!);
      let ageBucket = '';
      if (ageForBucket >= 21 && ageForBucket <= 24) ageBucket = '21-24';
      else if (ageForBucket >= 25 && ageForBucket <= 30) ageBucket = '25-30';
      else if (ageForBucket >= 31 && ageForBucket <= 45) ageBucket = '31-45';
      else if (ageForBucket >= 46 && ageForBucket <= 65) ageBucket = '46-65';
      else if (ageForBucket >= 66 && ageForBucket <= 75) ageBucket = '66-75';

      setEligibility(prev => ({ ...prev, ageBucket }));

      toast({
        title: 'Success',
        description: t.eligibilityValidated,
      });
      
      setStep(3);
    }
  };

  const handlePreviousStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userId = user?.id || null;
      
      let licenseFilePath = null;
      
      // Upload license file
      if (licenseFile) {
        const fileExt = licenseFile.name.split('.').pop();
        const fileName = `${userId || 'guest'}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('driver-licenses')
          .upload(fileName, licenseFile);

        if (uploadError) {
          console.error('License upload error:', uploadError);
          toast({
            title: 'Upload Error',
            description: 'Failed to upload driver license',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        licenseFilePath = fileName;
      }

      // Create booking record with all required eligibility fields
      const bookingData = {
        user_id: userId,
        vehicle_type: vehicleType,
        vehicle_name: vehicleName,
        vehicle_image_url: vehicleImageUrl,
        pickup_date: pickupDate?.toISOString().split('T')[0],
        dropoff_date: dropoffDate?.toISOString().split('T')[0],
        pickup_location: pickupLocation,
        dropoff_location: pickupLocation,
        price_total: Math.round(calculateTotal() * 100), // Store in cents
        currency: 'EUR',
        status: 'pending',
        payment_status: 'pending',
        license_issue_date: licenseIssueDate?.toISOString().split('T')[0],
        license_file_url: licenseFilePath,
        date_of_birth: dateOfBirth?.toISOString().split('T')[0],
        age_bucket: eligibility.ageBucket,
        country_iso2: eligibility.countryIso2,
        terms_accepted: eligibility.termsAccepted,
        booking_details: {
          basePrice: basePrice,
          insurance: insurance,
          extras: extras,
          guestInfo: !userId ? guestInfo : null,
          pickupDate: pickupDate?.toISOString().split('T')[0],
          dropoffDate: dropoffDate?.toISOString().split('T')[0],
          pickupLocation: pickupLocation,
          dropoffLocation: pickupLocation,
          vehicleName: vehicleName,
          vehicleType: vehicleType,
          vehicleImageUrl: vehicleImageUrl,
            eligibility: {
              dateOfBirth: dateOfBirth?.toISOString().split('T')[0],
              licenseIssueDate: licenseIssueDate?.toISOString().split('T')[0],
            ageBucket: eligibility.ageBucket,
            countryIso2: eligibility.countryIso2,
            termsAccepted: eligibility.termsAccepted
          }
        } as any
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        toast({
          title: 'Booking Error',
          description: bookingError.message,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Calculate line items for payment
      const days = Math.ceil((dropoffDate!.getTime() - pickupDate!.getTime()) / (1000 * 60 * 60 * 24));
      const lineItems = [];

      // Base rental cost
      lineItems.push({
        type: 'rental',
        description: `${vehicleName} - ${days} ${days === 1 ? t.day : t.days}`,
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

      if (insurancePrices[insurance as keyof typeof insurancePrices]) {
        const dailyInsurance = insurancePrices[insurance as keyof typeof insurancePrices];
        lineItems.push({
          type: 'insurance',
          description: `${insurance.charAt(0).toUpperCase() + insurance.slice(1)} Insurance - ${days} ${days === 1 ? t.day : t.days}`,
          quantity: days,
          unitPrice: dailyInsurance,
          totalPrice: dailyInsurance * days
        });
      }

      // Add extras to line items
      if (extras.fullCleaning) {
        lineItems.push({
          type: 'extra',
          description: t.fullCleaning,
          quantity: 1,
          unitPrice: 30,
          totalPrice: 30
        });
      }

      if (extras.secondDriver) {
        lineItems.push({
          type: 'extra',
          description: `${t.secondDriver} - ${days} ${days === 1 ? t.day : t.days}`,
          quantity: days,
          unitPrice: 10,
          totalPrice: 10 * days
        });
      }

      if (extras.under25) {
        lineItems.push({
          type: 'extra',
          description: `${t.under25Surcharge} - ${days} ${days === 1 ? t.day : t.days}`,
          quantity: days,
          unitPrice: 10,
          totalPrice: 10 * days
        });
      }

      if (extras.licenseUnder3) {
        lineItems.push({
          type: 'extra',
          description: `${t.licenseUnder3} - ${days} ${days === 1 ? t.day : t.days}`,
          quantity: days,
          unitPrice: 20,
          totalPrice: 20 * days
        });
      }

      if (extras.outOfHours) {
        lineItems.push({
          type: 'extra',
          description: t.outOfHours,
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
            dropoffLocation: pickupLocation,
            insurance: insurance,
            extras: extras,
            basePrice: basePrice
          },
          lineItems: lineItems,
          totalAmount: calculateTotal(),
          currency: 'EUR',
          language: language,
          payerEmail: user?.email || guestInfo.email,
          payerName: user ? `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email : `${guestInfo.firstName} ${guestInfo.lastName}`
        }
      });

      if (paymentError) {
        console.error('Payment initiation error:', paymentError);
        toast({
          title: 'Payment Error',
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
        title: 'Error',
        description: error.message || 'An error occurred during booking',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Show personal info form only for guests */}
            {!user && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t.personalInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t.firstName} *</Label>
                      <Input
                        id="firstName"
                        value={guestInfo.firstName}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t.lastName} *</Label>
                      <Input
                        id="lastName"
                        value={guestInfo.lastName}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">{t.email} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t.phone} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Date of Birth and License Date Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informazioni di idoneità
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t.dateOfBirth} *</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={dobDay} onValueChange={(value) => {
                        setDobDay(value);
                        setTimeout(updateDateOfBirth, 0);
                      }}>
                        <SelectTrigger className="bg-background z-50">
                          <SelectValue placeholder="Giorno" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {days.map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={dobMonth} onValueChange={(value) => {
                        setDobMonth(value);
                        setTimeout(updateDateOfBirth, 0);
                      }}>
                        <SelectTrigger className="bg-background z-50">
                          <SelectValue placeholder="Mese" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {months.map(month => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={dobYear} onValueChange={(value) => {
                        setDobYear(value);
                        setTimeout(updateDateOfBirth, 0);
                      }}>
                        <SelectTrigger className="bg-background z-50">
                          <SelectValue placeholder="Anno" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {dobYears.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>{t.licenseIssueDate} *</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={licenseDay} onValueChange={(value) => {
                        setLicenseDay(value);
                        setTimeout(updateLicenseDate, 0);
                      }}>
                        <SelectTrigger className="bg-background z-50">
                          <SelectValue placeholder="Giorno" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {days.map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={licenseMonth} onValueChange={(value) => {
                        setLicenseMonth(value);
                        setTimeout(updateLicenseDate, 0);
                      }}>
                        <SelectTrigger className="bg-background z-50">
                          <SelectValue placeholder="Mese" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {months.map(month => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={licenseYear} onValueChange={(value) => {
                        setLicenseYear(value);
                        setTimeout(updateLicenseDate, 0);
                      }}>
                        <SelectTrigger className="bg-background z-50">
                          <SelectValue placeholder="Anno" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {licenseYears.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details Card */}
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {t.bookingDetails}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t.pickupDate} *</Label>
                       <Popover open={pickupDateOpen} onOpenChange={setPickupDateOpen}>
                         <PopoverTrigger asChild>
                           <Button
                             variant={"outline"}
                             className={cn(
                               "w-full justify-start text-left font-normal",
                               !pickupDate && "text-muted-foreground"
                             )}
                           >
                             <CalendarIcon className="mr-2 h-4 w-4" />
                             {pickupDate ? format(pickupDate, "PPP") : <span>Pick a date</span>}
                           </Button>
                         </PopoverTrigger>
                         <PopoverContent className="w-auto p-0" align="start">
                           <Calendar
                             mode="single"
                             selected={pickupDate}
                             onSelect={(date) => {
                               setPickupDate(date);
                               setPickupDateOpen(false);
                               // Automatically open return date if pickup date is selected
                               if (date) {
                                 setTimeout(() => setDropoffDateOpen(true), 100);
                               }
                             }}
                             disabled={(date) => date < new Date()}
                             initialFocus
                             className="pointer-events-auto"
                           />
                         </PopoverContent>
                       </Popover>
                    </div>
                    <div>
                      <Label>{t.dropoffDate} *</Label>
                       <Popover open={dropoffDateOpen} onOpenChange={setDropoffDateOpen}>
                         <PopoverTrigger asChild>
                           <Button
                             variant={"outline"}
                             className={cn(
                               "w-full justify-start text-left font-normal",
                               !dropoffDate && "text-muted-foreground"
                             )}
                           >
                             <CalendarIcon className="mr-2 h-4 w-4" />
                             {dropoffDate ? format(dropoffDate, "PPP") : <span>Pick a date</span>}
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
                             disabled={(date) => date < (pickupDate || new Date())}
                             initialFocus
                             className="pointer-events-auto"
                           />
                         </PopoverContent>
                       </Popover>
                    </div>
                  </div>
                
                <div>
                  <Label htmlFor="pickupLocation">{t.pickupLocation} *</Label>
                  <Select value={pickupLocation} onValueChange={setPickupLocation}>
                    <SelectTrigger className="bg-background">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                        <SelectValue placeholder="Seleziona luogo di ritiro" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="cagliari-airport">
                        <div>
                          <div className="font-medium">Aeroporto di Cagliari</div>
                          <div className="text-sm text-gray-500">Via dei Trasvolatori, 09030 Elmas CA</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="dr7-office">
                        <div>
                          <div className="font-medium">DR7 Office</div>
                          <div className="text-sm text-gray-500">Viale Marconi, 229, 09131 Cagliari</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Insurance and Extras */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t.insurance}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-3">
                   {getAvailableInsuranceOptions().map((option) => (
                     <div key={option.id} className={`flex items-center space-x-2 p-4 rounded-lg border-2 ${
                       insurance === option.id ? 'border-green-400 bg-black text-white' : 'border-gray-600 bg-gray-800 text-white'
                     } ${option.disabled ? 'opacity-50' : ''}`}>
                       <input
                         type="radio"
                         id={option.id}
                         name="insurance"
                         value={option.id}
                         checked={insurance === option.id}
                         onChange={(e) => !option.disabled && setInsurance(e.target.value)}
                         disabled={option.disabled}
                         className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600"
                       />
                       <Label htmlFor={option.id} className={`flex-1 ${option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'} text-white`}>
                         <div className="flex justify-between items-center">
                           <div>
                             <span className="font-medium text-white">{option.name}</span>
                             {insurance === option.id && !option.disabled && (
                               <div className="text-sm text-green-400 font-medium mt-1">
                                 ✓ Selezionato automaticamente in base alla tua età ed esperienza
                               </div>
                             )}
                           </div>
                           <span className="font-bold text-lg text-white">€{option.price}/{t.day}</span>
                         </div>
                       </Label>
                     </div>
                   ))}
                 </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  {t.additionalServices}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { key: 'fullCleaning', label: t.fullCleaning, price: '€30' },
                    { key: 'secondDriver', label: t.secondDriver, price: `€10/${t.day}` },
                    { key: 'under25', label: t.under25Surcharge, price: `€10/${t.day}` },
                    { key: 'licenseUnder3', label: t.licenseUnder3, price: `€20/${t.day}` },
                    { key: 'outOfHours', label: t.outOfHours, price: '€50' }
                   ].map((extra) => (
                     <div key={extra.key} className="flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                         <Checkbox
                           id={extra.key}
                           checked={extras[extra.key as keyof typeof extras]}
                           onCheckedChange={(checked) => setExtras(prev => ({ ...prev, [extra.key]: !!checked }))}
                           disabled={extra.key === 'fullCleaning'} // Make fullCleaning mandatory and disabled
                         />
                         <Label htmlFor={extra.key} className={extra.key === 'fullCleaning' ? 'text-muted-foreground' : ''}>
                           {extra.label} {extra.key === 'fullCleaning' && '(Obbligatorio)'}
                         </Label>
                       </div>
                       <span className="font-semibold">{extra.price}</span>
                     </div>
                   ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t.eligibilityCheck}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="country">{t.country} *</Label>
                <Select value={eligibility.countryIso2} onValueChange={(value) => setEligibility(prev => ({ ...prev, countryIso2: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
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

              <div>
                <Label htmlFor="licenseFile">{t.licensePhoto} *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Input
                      id="licenseFile"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <Label htmlFor="licenseFile" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>Choose file</span>
                      </Button>
                    </Label>
                    {licenseFile && (
                      <p className="mt-2 text-sm text-green-600">
                        <Check className="inline h-4 w-4 mr-1" />
                        {licenseFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={eligibility.termsAccepted}
                  onCheckedChange={(checked) => setEligibility(prev => ({ ...prev, termsAccepted: !!checked }))}
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  {t.termsAndConditions} *
                </Label>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t.paymentProcessing}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-lg mb-4">Ready to process payment</p>
                <p className="text-gray-600 mb-6">
                  Total amount: <strong>€{calculateTotal()}</strong>
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                >
                  {isSubmitting ? t.processing : t.proceedToPayment}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.completeReservation}
          </h1>
          <p className="text-gray-600">{t.enterDetails}</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  stepNumber <= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepNumber < step ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 ${stepNumber < step ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <form onSubmit={(e) => e.preventDefault()}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={handlePreviousStep}
                  disabled={step === 1}
                  variant="outline"
                >
                  {t.previousStep}
                </Button>
                
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {t.nextStep}
                  </Button>
                ) : null}
              </div>
            </form>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  {t.bookingSummary}
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
                      <span>{t.period}:</span>
                      <span className="font-medium">
                        {Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24))} {t.days}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>{t.baseRate}:</span>
                      <span>€{basePrice}/{t.day}</span>
                    </div>

                    {insurance && (
                      <div className="flex justify-between">
                        <span>Insurance:</span>
                        <span>€{insurance === 'kasko' ? 15 : insurance === 'kasko-black' ? 25 : 35}/{t.day}</span>
                      </div>
                    )}

                    {Object.entries(extras).some(([key, value]) => value) && (
                      <div className="space-y-1">
                        <p className="font-medium">{t.extras}:</p>
                        {extras.fullCleaning && (
                          <div className="flex justify-between text-xs">
                            <span>{t.fullCleaning}</span>
                            <span>€30</span>
                          </div>
                        )}
                        {extras.secondDriver && (
                          <div className="flex justify-between text-xs">
                            <span>{t.secondDriver}</span>
                            <span>€{10 * Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                          </div>
                        )}
                        {extras.under25 && (
                          <div className="flex justify-between text-xs">
                            <span>Under 25</span>
                            <span>€{10 * Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                          </div>
                        )}
                        {extras.licenseUnder3 && (
                          <div className="flex justify-between text-xs">
                            <span>License &lt; 3 years</span>
                            <span>€{20 * Math.ceil((new Date(dropoffDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24))}</span>
                          </div>
                        )}
                        {extras.outOfHours && (
                          <div className="flex justify-between text-xs">
                            <span>{t.outOfHours}</span>
                            <span>€50</span>
                          </div>
                        )}
                      </div>
                    )}

                    <hr className="my-2" />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>{t.total}:</span>
                      <span>€{calculateTotal()}</span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• {t.allPricesIncludeVAT}</p>
                  <p>• {t.securePayment}</p>
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