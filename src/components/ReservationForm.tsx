import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, X, Check, Upload, Camera } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { NexiPaymentForm } from "./NexiPaymentForm";
import { InlineEligibilitySelectors } from "./InlineEligibilitySelectors";

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  carName: string;
  dailyPrice: number;
}

export const ReservationForm = ({ isOpen, onClose, carName, dailyPrice }: ReservationFormProps) => {
  const { language } = useLanguage();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [depositOption, setDepositOption] = useState("with-deposit");
  const [insurance, setInsurance] = useState("kasko");
  const [fullCleaning, setFullCleaning] = useState(true);
  const [secondDriver, setSecondDriver] = useState(false);
  const [under25, setUnder25] = useState(false);
  const [licenseUnder3, setLicenseUnder3] = useState(false);
  const [outOfHours, setOutOfHours] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [dob, setDob] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [licenseDate, setLicenseDate] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licenseFileUrl, setLicenseFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [paymentBookingData, setPaymentBookingData] = useState<any>(null);
  
  // Eligibility selector states
  const [ageBucket, setAgeBucket] = useState('');
  const [countryIso2, setCountryIso2] = useState('IT');
  const [eligibilityValid, setEligibilityValid] = useState(false);
  const { toast } = useToast();

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    
    const days = differenceInDays(endDate, startDate);
    if (days <= 0) return 0;

    let total = 0;
    
    // Base car rental price
    total += days * dailyPrice;
    
    // Insurance
    const insurancePrices = {
      "kasko": 100,
      "kasko-black": 150,
      "kasko-signature": 200
    };
    total += days * insurancePrices[insurance as keyof typeof insurancePrices];
    
    // Additional options
    total += 30; // Full cleaning (required)
    if (secondDriver) total += days * 10;
    if (under25) total += days * 10;
    if (licenseUnder3) total += days * 20;
    if (outOfHours) total += 50;
    
    return total;
  };

  // Helper functions for dropdowns
  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i.toString().padStart(2, '0'));
    }
    return days;
  };

  const generateMonths = () => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i.toString().padStart(2, '0'));
    }
    return months;
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 1910; i--) {
      years.push(i.toString());
    }
    return years;
  };

  // File upload functions
  const handleFileSelect = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: language === 'it' ? 'Tipo di file non valido' : 'Invalid file type',
        description: language === 'it' 
          ? 'Sono consentiti solo file JPEG, PNG o PDF'
          : 'Only JPEG, PNG, or PDF files are allowed',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: language === 'it' ? 'File troppo grande' : 'File too large',
        description: language === 'it' 
          ? 'Il file deve essere inferiore a 10MB'
          : 'File must be less than 10MB',
        variant: 'destructive',
      });
      return;
    }

    setLicenseFile(file);
    setLicenseFileUrl(URL.createObjectURL(file));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeLicenseFile = () => {
    setLicenseFile(null);
    if (licenseFileUrl) {
      URL.revokeObjectURL(licenseFileUrl);
      setLicenseFileUrl(null);
    }
  };

  const uploadLicenseToStorage = async (file: File, userId: string): Promise<string> => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-license.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('driver-licenses')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      return fileName;
    } finally {
      setIsUploading(false);
    }
  };

  // Update dob when dropdown values change
  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      setDob(`${dobYear}-${dobMonth}-${dobDay}`);
    } else {
      setDob("");
    }
  }, [dobDay, dobMonth, dobYear]);

  useEffect(() => {
    setTotalPrice(calculateTotal());
  }, [startDate, endDate, dailyPrice, insurance, secondDriver, under25, licenseUnder3, outOfHours]);

  useEffect(() => {
    if (startDate && !endDate) {
      setTimeout(() => {
        setEndDateOpen(true);
      }, 300);
    }
  }, [startDate, endDate]);

  const parseDate = (input: string): Date | null => {
    const parts = input.split("-");
    if (parts.length !== 3) return null;
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  };

  const getAge = (birthDate: Date | null): number => {
    if (!birthDate) return 0;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getLicenseYears = (licenseStartDate: Date | null): number => {
    if (!licenseStartDate) return 0;
    const today = new Date();
    let years = today.getFullYear() - licenseStartDate.getFullYear();
    const m = today.getMonth() - licenseStartDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < licenseStartDate.getDate())) {
      years--;
    }
    return years;
  };

  const getInsuranceEligibility = () => {
    const birthDate = parseDate(dob);
    const licenseStart = parseDate(licenseDate);
    const age = getAge(birthDate);
    const licenseYears = getLicenseYears(licenseStart);

    return {
      kasko: {
        eligible: licenseYears >= 2,
        reason: licenseYears < 2 ? (language === "it" ? "Richiede almeno 2 anni di patente" : "Requires at least 2 years license") : null
      },
      kaskoBlack: {
        eligible: age >= 25 && licenseYears >= 5,
        reason: age < 25 || licenseYears < 5 ? (
          language === "it" 
            ? `Richiede almeno 25 anni ${age < 25 ? `(hai ${age} anni)` : ''} e 5 anni di patente ${licenseYears < 5 ? `(hai ${licenseYears} anni di patente)` : ''}`
            : `Requires at least 25 years old ${age < 25 ? `(you are ${age})` : ''} and 5 years license ${licenseYears < 5 ? `(you have ${licenseYears} years)` : ''}`
        ) : null
      },
      kaskoSignature: {
        eligible: age >= 30 && licenseYears >= 10,
        reason: age < 30 || licenseYears < 10 ? (
          language === "it" 
            ? `Richiede almeno 30 anni ${age < 30 ? `(hai ${age} anni)` : ''} e 10 anni di patente ${licenseYears < 10 ? `(hai ${licenseYears} anni di patente)` : ''}`
            : `Requires at least 30 years old ${age < 30 ? `(you are ${age})` : ''} and 10 years license ${licenseYears < 10 ? `(you have ${licenseYears} years)` : ''}`
        ) : null
      }
    };
  };

  const isInsuranceEligible = (): { valid: boolean; message: string | null } => {
    const eligibility = getInsuranceEligibility();
    
    switch (insurance) {
      case "kasko":
        return {
          valid: eligibility.kasko.eligible,
          message: eligibility.kasko.reason
        };
      case "kasko-black":
        return {
          valid: eligibility.kaskoBlack.eligible,
          message: eligibility.kaskoBlack.reason
        };
      case "kasko-signature":
        return {
          valid: eligibility.kaskoSignature.eligible,
          message: eligibility.kaskoSignature.reason
        };
    }

    return { valid: true, message: null };
  };

  // Auto-select valid insurance when current selection becomes invalid
  useEffect(() => {
    const eligibility = getInsuranceEligibility();
    
    if (!isInsuranceEligible().valid) {
      // Find the best available insurance option
      if (eligibility.kaskoSignature.eligible) {
        setInsurance("kasko-signature");
      } else if (eligibility.kaskoBlack.eligible) {
        setInsurance("kasko-black");
      } else if (eligibility.kasko.eligible) {
        setInsurance("kasko");
      }
    }
  }, [dob, licenseDate, language]);

  const generateLineItems = () => {
    const items = [];
    const days = Math.ceil((endDate!.getTime() - startDate!.getTime()) / (1000 * 60 * 60 * 24));

    // Base rate
    items.push({
      type: 'base_rate',
      description: `${carName} - ${days} ${days === 1 ? 'day' : 'days'}`,
      quantity: days,
      unitPrice: dailyPrice,
      totalPrice: dailyPrice * days
    });

    // Insurance
    const insurancePrices: { [key: string]: number } = {
      'kasko': 15,
      'kasko-black': 25,
      'kasko-signature': 35
    };
    
    if (insurancePrices[insurance]) {
      items.push({
        type: 'insurance',
        description: `Insurance: ${insurance.replace('-', ' ').toUpperCase()}`,
        quantity: days,
        unitPrice: insurancePrices[insurance],
        totalPrice: insurancePrices[insurance] * days
      });
    }

    // Extras
    if (fullCleaning) {
      items.push({
        type: 'extra',
        description: language === 'it' ? 'Pulizia completa' : 'Full Cleaning',
        quantity: 1,
        unitPrice: 30,
        totalPrice: 30
      });
    }

    if (secondDriver) {
      items.push({
        type: 'extra',
        description: language === 'it' ? 'Secondo conducente' : 'Second Driver',
        quantity: days,
        unitPrice: 10,
        totalPrice: 10 * days
      });
    }

    if (under25) {
      items.push({
        type: 'extra',
        description: language === 'it' ? 'Conducente sotto 25 anni' : 'Driver under 25',
        quantity: days,
        unitPrice: 10,
        totalPrice: 10 * days
      });
    }

    if (licenseUnder3) {
      items.push({
        type: 'extra',
        description: language === 'it' ? 'Patente da meno di 3 anni' : 'License under 3 years',
        quantity: days,
        unitPrice: 20,
        totalPrice: 20 * days
      });
    }

    if (outOfHours) {
      items.push({
        type: 'extra',
        description: language === 'it' ? 'Consegna/ritiro fuori orario' : 'Out-of-hours delivery/pickup',
        quantity: 1,
        unitPrice: 50,
        totalPrice: 50
      });
    }

    return items;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate license file upload
    if (!licenseFile) {
      toast({
        title: language === 'it' ? 'Documento mancante' : 'Missing document',
        description: language === 'it' 
          ? 'È necessario caricare una foto della patente per continuare.'
          : 'Please upload a driver\'s license photo to continue.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!startDate || !endDate || !dobDay || !dobMonth || !dobYear || !isInsuranceEligible().valid || !eligibilityValid) return;

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Upload license file to storage
      const licenseFilePath = await uploadLicenseToStorage(licenseFile, user.id);

      // Create booking record first
      const bookingData = {
        user_id: user.id,
        vehicle_name: carName,
        vehicle_type: 'car',
        pickup_date: startDate.toISOString(),
        dropoff_date: endDate.toISOString(),
        pickup_location: 'Main Office', // This should come from form
        dropoff_location: 'Main Office', // This should come from form
        price_total: Math.round(totalPrice * 100), // Store in cents
        currency: 'EUR',
        status: 'pending',
        payment_status: 'pending',
        age_bucket: ageBucket,
        country_iso2: countryIso2,
        booking_details: {
          firstName,
          lastName,
          email,
          phone,
          dob,
          licenseDate,
          licensePhotoPath: licenseFilePath,
          insurance,
          ageBucket,
          countryIso2,
          extras: {
            fullCleaning,
            secondDriver,
            under25,
            licenseUnder3,
            outOfHours
          },
          basePrice: dailyPrice
        }
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Prepare payment data
      const lineItems = generateLineItems();
      const paymentData = {
        bookingId: booking.id,
        bookingDetails: {
          vehicleName: carName,
          pickupDate: format(startDate, 'yyyy-MM-dd'),
          dropoffDate: format(endDate, 'yyyy-MM-dd'),
          pickupLocation: 'Main Office',
          dropoffLocation: 'Main Office',
          insurance,
          extras: {
            fullCleaning,
            secondDriver,
            under25,
            licenseUnder3,
            outOfHours
          },
          basePrice: dailyPrice
        },
        lineItems,
        totalAmount: totalPrice,
        currency: 'EUR',
        payerEmail: email,
        payerName: `${firstName} ${lastName}`
      };

      // Show payment modal/form instead of success message
      setBookingCreated(true);
      setPaymentBookingData(paymentData);

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: language === 'it' ? 'Errore' : 'Error',
        description: language === 'it' 
          ? 'Si è verificato un errore nella creazione della prenotazione.'
          : 'An error occurred while creating the booking.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-luxury-black border border-luxury-white/20">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Check className="h-16 w-16 text-luxury-white mb-4" />
            <h3 className="text-2xl font-bold text-luxury-white mb-2">
              {language === 'it' ? 'Pagamento Completato!' : 'Payment Completed!'}
            </h3>
            <p className="text-luxury-white/80">
              {language === 'it' 
                ? 'La tua prenotazione è stata confermata. Riceverai una conferma via email.'
                : 'Your booking has been confirmed. You will receive an email confirmation.'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (bookingCreated && paymentBookingData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg bg-luxury-black border border-luxury-white/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-luxury-white">
              {language === 'it' ? 'Completa il Pagamento' : 'Complete Payment'}
            </DialogTitle>
          </DialogHeader>
          <NexiPaymentForm 
            bookingData={paymentBookingData}
            onPaymentInitiated={() => {
              setShowSuccess(true);
              setBookingCreated(false);
              setTimeout(() => {
                setShowSuccess(false);
                onClose();
              }, 3000);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-luxury-black border border-luxury-white/20">
        <DialogHeader className="border-b border-luxury-white/20 pb-4">
          <DialogTitle className="text-2xl font-bold text-luxury-white">
            {language === 'it' ? 'Prenota' : 'Reserve'} {carName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-luxury-white font-medium">
                {language === 'it' ? 'Data di inizio' : 'Start Date'}
              </Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-white border-luxury-white/20 text-black hover:border-luxury-white hover:bg-luxury-white/5"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-luxury-black border border-luxury-white/20">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setStartDateOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto bg-luxury-black text-luxury-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-luxury-white font-medium">
                {language === 'it' ? 'Data di fine' : 'End Date'}
              </Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-white border-luxury-white/20 text-black hover:border-luxury-white hover:bg-luxury-white/5"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-luxury-black border border-luxury-white/20">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setEndDateOpen(false);
                    }}
                    disabled={(date) => !startDate || date <= startDate}
                    initialFocus
                    className="pointer-events-auto bg-luxury-black text-luxury-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-luxury-white font-medium">
                {language === 'it' ? 'Nome' : 'First Name'}
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-white border-luxury-white/20 text-black placeholder:text-gray-500 focus:border-luxury-white hover:border-luxury-white/40"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-luxury-white font-medium">
                {language === 'it' ? 'Cognome' : 'Last Name'}
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-white border-luxury-white/20 text-black placeholder:text-gray-500 focus:border-luxury-white hover:border-luxury-white/40"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-luxury-white font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-luxury-white/20 text-black placeholder:text-gray-500 focus:border-luxury-white hover:border-luxury-white/40"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-luxury-white font-medium">
                {language === 'it' ? 'Telefono' : 'Phone'}
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white border-luxury-white/20 text-black placeholder:text-gray-500 focus:border-luxury-white hover:border-luxury-white/40"
                required
              />
            </div>
          </div>

          {/* Date of birth and License date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-luxury-white font-medium">
                {language === "it" ? "Data di nascita" : "Date of Birth"}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {/* Day Dropdown */}
                <Select value={dobDay} onValueChange={setDobDay}>
                  <SelectTrigger className="bg-white border-luxury-white/20 text-black hover:border-luxury-white/40 focus:border-luxury-white">
                    <SelectValue placeholder={language === "it" ? "GG" : "DD"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-luxury-white/20 max-h-60">
                    {generateDays().map((day) => (
                      <SelectItem key={day} value={day} className="text-black hover:bg-gray-100">
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Month Dropdown */}
                <Select value={dobMonth} onValueChange={setDobMonth}>
                  <SelectTrigger className="bg-white border-luxury-white/20 text-black hover:border-luxury-white/40 focus:border-luxury-white">
                    <SelectValue placeholder={language === "it" ? "MM" : "MM"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-luxury-white/20 max-h-60">
                    {generateMonths().map((month) => (
                      <SelectItem key={month} value={month} className="text-black hover:bg-gray-100">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Year Dropdown */}
                <Select value={dobYear} onValueChange={setDobYear}>
                  <SelectTrigger className="bg-white border-luxury-white/20 text-black hover:border-luxury-white/40 focus:border-luxury-white">
                    <SelectValue placeholder={language === "it" ? "AAAA" : "YYYY"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-luxury-white/20 max-h-60">
                    {generateYears().map((year) => (
                      <SelectItem key={year} value={year} className="text-black hover:bg-gray-100">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseDate" className="text-luxury-white font-medium">
                {language === "it" ? "Data rilascio patente" : "License Issue Date"}
              </Label>
              <Input
                id="licenseDate"
                type="date"
                value={licenseDate}
                onChange={(e) => {
                  setLicenseDate(e.target.value);
                  // Show immediate feedback when license date changes
                  const years = getLicenseYears(parseDate(e.target.value));
                  if (years < 2 && insurance === "kasko") {
                    toast({
                      title: language === "it" ? "Assicurazione non disponibile" : "Insurance not available",
                      description: language === "it" ? "Con meno di 2 anni di patente, l'assicurazione KASKO non è disponibile." : "With less than 2 years license, KASKO insurance is not available.",
                      variant: "destructive"
                    });
                  }
                }}
                max={new Date().toISOString().split('T')[0]} // Can't be future date
                className="bg-white border-luxury-white/20 text-black placeholder:text-gray-500 focus:border-luxury-white hover:border-luxury-white/40"
                required
              />
              {licenseDate && getLicenseYears(parseDate(licenseDate)) < 2 && (
                <p className="text-amber-400 text-xs flex items-center gap-1">
                  ⚠️ {language === "it" ? `Solo ${getLicenseYears(parseDate(licenseDate))} anni di patente - Opzioni assicurative limitate` : `Only ${getLicenseYears(parseDate(licenseDate))} years license - Limited insurance options`}
                </p>
              )}
            </div>
          </div>

          {/* Driver's License Photo Upload */}
          <div className="space-y-2">
            <Label className="text-luxury-white font-medium">
              {language === "it" ? "Foto della patente (Obbligatorio)" : "Driver's License Photo (Required)"}
            </Label>
            <div className="space-y-3">
              {!licenseFile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Upload File Button */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="license-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-white border-luxury-white/20 text-black hover:border-luxury-white hover:bg-luxury-white/5"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {language === "it" ? "Carica file" : "Upload File"}
                    </Button>
                  </div>

                  {/* Take Photo Button */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="license-camera"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-white border-luxury-white/20 text-black hover:border-luxury-white hover:bg-luxury-white/5"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      {language === "it" ? "Scatta foto" : "Take Photo"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-lg border border-luxury-white/20 bg-luxury-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-luxury-white/20 rounded-lg flex items-center justify-center">
                      {licenseFile.type.includes('pdf') ? (
                        <span className="text-xs font-bold text-luxury-white">PDF</span>
                      ) : (
                        <Camera className="h-5 w-5 text-luxury-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-luxury-white font-medium truncate max-w-48">
                        {licenseFile.name}
                      </p>
                      <p className="text-luxury-white/70 text-xs">
                        {(licenseFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeLicenseFile}
                    className="text-luxury-white hover:text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <p className="text-luxury-white/70 text-xs">
                {language === "it" 
                  ? "Formati supportati: JPEG, PNG, PDF. Dimensione massima: 10MB"
                  : "Supported formats: JPEG, PNG, PDF. Maximum size: 10MB"}
              </p>
            </div>
          </div>

          {/* Inline Eligibility Selectors */}
          <div className="space-y-2">
            <Label className="text-luxury-white font-medium">
              {language === 'it' ? 'Conferma Idoneità' : 'Confirm Eligibility'}
            </Label>
            <InlineEligibilitySelectors
              initialAgeBucket={ageBucket}
              initialCountryIso2={countryIso2}
              dob={dob}
              onAgeBucketChange={setAgeBucket}
              onCountryChange={setCountryIso2}
              onValidationChange={setEligibilityValid}
            />
          </div>

          {/* Insurance Selection */}
          <div className="space-y-4">
            <Label className="text-luxury-white font-medium text-lg">
              {language === 'it' ? 'Assicurazione' : 'Insurance'}
            </Label>
            <RadioGroup value={insurance} onValueChange={setInsurance} className="space-y-3">
              {/* KASKO */}
              <div className={cn(
                "flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200",
                getInsuranceEligibility().kasko.eligible 
                  ? "border-luxury-white/20 hover:border-luxury-white/40 cursor-pointer" 
                  : "border-red-500/50 bg-red-500/10 cursor-not-allowed opacity-60"
              )}>
                <RadioGroupItem 
                  value="kasko" 
                  id="kasko" 
                  disabled={!getInsuranceEligibility().kasko.eligible}
                />
                <Label htmlFor="kasko" className={cn(
                  "flex-1",
                  getInsuranceEligibility().kasko.eligible ? "text-luxury-white cursor-pointer" : "text-red-400 cursor-not-allowed"
                )}>
                  <div className="font-medium">KASKO - €100/day</div>
                  <div className="text-sm text-luxury-white/70">
                    {language === 'it' ? 'Minimo 2 anni di patente' : 'Minimum 2 years license'}
                  </div>
                  {getInsuranceEligibility().kasko.reason && (
                    <div className="text-xs text-red-400 mt-1">
                      {getInsuranceEligibility().kasko.reason}
                    </div>
                  )}
                </Label>
              </div>

              {/* KASKO BLACK */}
              <div className={cn(
                "flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200",
                getInsuranceEligibility().kaskoBlack.eligible 
                  ? "border-luxury-white/20 hover:border-luxury-white/40 cursor-pointer" 
                  : "border-red-500/50 bg-red-500/10 cursor-not-allowed opacity-60"
              )}>
                <RadioGroupItem 
                  value="kasko-black" 
                  id="kasko-black" 
                  disabled={!getInsuranceEligibility().kaskoBlack.eligible}
                />
                <Label htmlFor="kasko-black" className={cn(
                  "flex-1",
                  getInsuranceEligibility().kaskoBlack.eligible ? "text-luxury-white cursor-pointer" : "text-red-400 cursor-not-allowed"
                )}>
                  <div className="font-medium">KASKO BLACK - €150/day</div>
                  <div className="text-sm text-luxury-white/70">
                    {language === 'it' ? 'Minimo 25 anni e 5 anni di patente' : 'Minimum 25 years old and 5 years license'}
                  </div>
                  {getInsuranceEligibility().kaskoBlack.reason && (
                    <div className="text-xs text-red-400 mt-1">
                      {getInsuranceEligibility().kaskoBlack.reason}
                    </div>
                  )}
                </Label>
              </div>

              {/* KASKO SIGNATURE */}
              <div className={cn(
                "flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200",
                getInsuranceEligibility().kaskoSignature.eligible 
                  ? "border-luxury-white/20 hover:border-luxury-white/40 cursor-pointer" 
                  : "border-red-500/50 bg-red-500/10 cursor-not-allowed opacity-60"
              )}>
                <RadioGroupItem 
                  value="kasko-signature" 
                  id="kasko-signature" 
                  disabled={!getInsuranceEligibility().kaskoSignature.eligible}
                />
                <Label htmlFor="kasko-signature" className={cn(
                  "flex-1",
                  getInsuranceEligibility().kaskoSignature.eligible ? "text-luxury-white cursor-pointer" : "text-red-400 cursor-not-allowed"
                )}>
                  <div className="font-medium">KASKO SIGNATURE - €200/day</div>
                  <div className="text-sm text-luxury-white/70">
                    {language === 'it' ? 'Minimo 30 anni e 10 anni di patente' : 'Minimum 30 years old and 10 years license'}
                  </div>
                  {getInsuranceEligibility().kaskoSignature.reason && (
                    <div className="text-xs text-red-400 mt-1">
                      {getInsuranceEligibility().kaskoSignature.reason}
                    </div>
                  )}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <Label className="text-luxury-white font-medium text-lg">
              {language === 'it' ? 'Opzioni aggiuntive' : 'Additional Options'}
            </Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-luxury-white/20">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="fullCleaning"
                    checked={fullCleaning}
                    onCheckedChange={(checked) => setFullCleaning(checked === true)}
                    disabled
                  />
                  <Label htmlFor="fullCleaning" className="text-luxury-white cursor-pointer">
                    {language === 'it' ? 'Pulizia completa (Obbligatorio)' : 'Full Cleaning (Required)'}
                  </Label>
                </div>
                <span className="text-luxury-white font-medium">€30</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-luxury-white/20">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="secondDriver"
                    checked={secondDriver}
                    onCheckedChange={(checked) => setSecondDriver(checked === true)}
                  />
                  <Label htmlFor="secondDriver" className="text-luxury-white cursor-pointer">
                    {language === 'it' ? 'Secondo conducente' : 'Second Driver'}
                  </Label>
                </div>
                <span className="text-luxury-white font-medium">€10/day</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-luxury-white/20">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="under25"
                    checked={under25}
                    onCheckedChange={(checked) => setUnder25(checked === true)}
                  />
                  <Label htmlFor="under25" className="text-luxury-white cursor-pointer">
                    {language === 'it' ? 'Conducente sotto 25 anni' : 'Driver under 25'}
                  </Label>
                </div>
                <span className="text-luxury-white font-medium">€10/day</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-luxury-white/20">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="licenseUnder3"
                    checked={licenseUnder3}
                    onCheckedChange={(checked) => setLicenseUnder3(checked === true)}
                  />
                  <Label htmlFor="licenseUnder3" className="text-luxury-white cursor-pointer">
                    {language === 'it' ? 'Patente da meno di 3 anni' : 'License under 3 years'}
                  </Label>
                </div>
                <span className="text-luxury-white font-medium">€20/day</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-luxury-white/20">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="outOfHours"
                    checked={outOfHours}
                    onCheckedChange={(checked) => setOutOfHours(checked === true)}
                  />
                  <Label htmlFor="outOfHours" className="text-luxury-white cursor-pointer">
                    {language === 'it' ? 'Consegna/ritiro fuori orario' : 'Out-of-hours delivery/pickup'}
                  </Label>
                </div>
                <span className="text-luxury-white font-medium">€50</span>
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-luxury-white/10 p-4 rounded-lg border border-luxury-white/20">
            <div className="flex justify-between items-center">
              <span className="text-luxury-white font-semibold text-lg">
                {language === 'it' ? 'Totale:' : 'Total:'}
              </span>
              <span className="text-luxury-white font-bold text-2xl">€{totalPrice}</span>
            </div>
          </div>

          {/* Insurance eligibility message */}
          {!isInsuranceEligible().valid && (
            <div className="text-red-500 text-sm pt-2">
              {isInsuranceEligible().message}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !isInsuranceEligible().valid || !eligibilityValid}
              className={cn(
                "w-full py-3 text-lg font-semibold transition-all duration-300",
                (isInsuranceEligible().valid && eligibilityValid)
                  ? "bg-luxury-white hover:bg-luxury-white/90 text-luxury-black"
                  : "bg-gray-500 text-white cursor-not-allowed"
              )}
            >
              {isSubmitting
                ? (language === 'it' ? 'Invio in corso...' : 'Submitting...')
                : `${language === 'it' ? 'Prenota ora' : 'Reserve Now'} - €${totalPrice}`}
            </Button>

            {(!isInsuranceEligible().valid || !eligibilityValid) && (
              <div className="mt-2 space-y-1">
                {!isInsuranceEligible().valid && (
                  <p className="text-sm text-red-500 text-center">
                    {isInsuranceEligible().message}
                  </p>
                )}
                {!eligibilityValid && (
                  <p className="text-sm text-red-500 text-center">
                    {language === 'it' 
                      ? 'Conferma la tua età e paese di residenza per continuare'
                      : 'Please confirm your age and country of residence to continue'}
                  </p>
                )}
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};