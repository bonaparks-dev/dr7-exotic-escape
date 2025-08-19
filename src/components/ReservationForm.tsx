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
import { CalendarIcon, X, Check } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [licenseDate, setLicenseDate] = useState("");
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

  const isInsuranceEligible = (): { valid: boolean; message: string | null } => {
    const birthDate = parseDate(dob);
    const licenseStart = parseDate(licenseDate);
    const age = getAge(birthDate);
    const licenseYears = getLicenseYears(licenseStart);

    switch (insurance) {
      case "kasko":
        if (licenseYears < 2) {
          return {
            valid: false,
            message:
              language === "it"
                ? "Per la KASKO è necessario avere almeno 2 anni di patente."
                : "KASKO requires at least 2 years of driving license.",
          };
        }
        break;
      case "kasko-black":
        if (age < 25 || licenseYears < 5) {
          return {
            valid: false,
            message:
              language === "it"
                ? "Per la KASKO BLACK devi avere almeno 25 anni e 5 anni di patente."
                : "KASKO BLACK requires at least 25 years of age and 5 years of driving license.",
          };
        }
        break;
      case "kasko-signature":
        if (age < 30 || licenseYears < 10) {
          return {
            valid: false,
            message:
              language === "it"
                ? "Per la KASKO SIGNATURE devi avere almeno 30 anni e 10 anni di patente."
                : "KASKO SIGNATURE requires at least 30 years of age and 10 years of driving license.",
          };
        }
        break;
    }

    return { valid: true, message: null };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !isInsuranceEligible().valid) return;

    setIsSubmitting(true);

    try {
      const reservationData = {
        carName,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        firstName,
        lastName,
        email,
        phone,
        depositOption,
        insurance,
        secondDriver,
        under25,
        licenseUnder3,
        outOfHours,
        totalPrice,
        dob,
        licenseDate
      };

      const { data, error } = await supabase.functions.invoke('send-reservation', {
        body: reservationData
      });

      if (error) throw error;

      setShowSuccess(true);
      toast({
        title: language === 'it' ? 'Prenotazione inviata!' : 'Reservation sent!',
        description: language === 'it' 
          ? 'Ti contatteremo presto per confermare la tua prenotazione.'
          : 'We will contact you soon to confirm your reservation.',
      });

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast({
        title: language === 'it' ? 'Errore' : 'Error',
        description: language === 'it' 
          ? 'Si è verificato un errore. Riprova.'
          : 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-luxury-charcoal border border-luxury-gold/20">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Check className="h-16 w-16 text-luxury-gold mb-4" />
            <h3 className="text-2xl font-bold text-luxury-ivory mb-2">
              {language === 'it' ? 'Prenotazione Confermata!' : 'Reservation Confirmed!'}
            </h3>
            <p className="text-luxury-ivory/80">
              {language === 'it' 
                ? 'Ti contatteremo entro 24 ore per finalizzare i dettagli.'
                : 'We will contact you within 24 hours to finalize the details.'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-luxury-charcoal border border-luxury-gold/20">
        <DialogHeader className="border-b border-luxury-gold/20 pb-4">
          <DialogTitle className="text-2xl font-bold text-luxury-ivory flex items-center justify-between">
            {language === 'it' ? 'Prenota' : 'Reserve'} {carName}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-luxury-ivory hover:bg-luxury-gold/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-luxury-ivory font-medium">
                {language === 'it' ? 'Data di inizio' : 'Start Date'}
              </Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-white border-luxury-gold/20 text-black hover:border-luxury-gold hover:bg-luxury-gold/5"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setStartDateOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-luxury-ivory font-medium">
                {language === 'it' ? 'Data di fine' : 'End Date'}
              </Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-white border-luxury-gold/20 text-black hover:border-luxury-gold hover:bg-luxury-gold/5"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setEndDateOpen(false);
                    }}
                    disabled={(date) => !startDate || date <= startDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-luxury-ivory font-medium">
                {language === 'it' ? 'Nome' : 'First Name'}
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-white border-luxury-gold/20 text-black placeholder:text-gray-500 focus:border-luxury-gold hover:border-luxury-gold/40"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-luxury-ivory font-medium">
                {language === 'it' ? 'Cognome' : 'Last Name'}
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-white border-luxury-gold/20 text-black placeholder:text-gray-500 focus:border-luxury-gold hover:border-luxury-gold/40"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-luxury-ivory font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-luxury-gold/20 text-black placeholder:text-gray-500 focus:border-luxury-gold hover:border-luxury-gold/40"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-luxury-ivory font-medium">
                {language === 'it' ? 'Telefono' : 'Phone'}
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white border-luxury-gold/20 text-black placeholder:text-gray-500 focus:border-luxury-gold hover:border-luxury-gold/40"
                required
              />
            </div>
          </div>

          {/* Date of birth and License date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-luxury-ivory font-medium">
                {language === "it" ? "Data di nascita" : "Date of Birth"}
              </Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="bg-white border-luxury-gold/20 text-black placeholder:text-gray-500 focus:border-luxury-gold hover:border-luxury-gold/40"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseDate" className="text-luxury-ivory font-medium">
                {language === "it" ? "Data rilascio patente" : "License Issue Date"}
              </Label>
              <Input
                id="licenseDate"
                type="date"
                value={licenseDate}
                onChange={(e) => setLicenseDate(e.target.value)}
                className="bg-white border-luxury-gold/20 text-black placeholder:text-gray-500 focus:border-luxury-gold hover:border-luxury-gold/40"
                required
              />
            </div>
          </div>

          {/* Insurance Selection */}
          <div className="space-y-4">
            <Label className="text-luxury-ivory font-medium text-lg">
              {language === 'it' ? 'Assicurazione' : 'Insurance'}
            </Label>
            <RadioGroup value={insurance} onValueChange={setInsurance} className="space-y-3">
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-luxury-gold/20">
                <RadioGroupItem value="kasko" id="kasko" />
                <Label htmlFor="kasko" className="text-luxury-ivory cursor-pointer flex-1">
                  <div className="font-medium">KASKO - €100/day</div>
                  <div className="text-sm text-luxury-ivory/70">
                    {language === 'it' ? 'Minimo 2 anni di patente' : 'Minimum 2 years license'}
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-luxury-gold/20">
                <RadioGroupItem value="kasko-black" id="kasko-black" />
                <Label htmlFor="kasko-black" className="text-luxury-ivory cursor-pointer flex-1">
                  <div className="font-medium">KASKO BLACK - €150/day</div>
                  <div className="text-sm text-luxury-ivory/70">
                    {language === 'it' ? 'Minimo 25 anni e 5 anni di patente' : 'Minimum 25 years old and 5 years license'}
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-luxury-gold/20">
                <RadioGroupItem value="kasko-signature" id="kasko-signature" />
                <Label htmlFor="kasko-signature" className="text-luxury-ivory cursor-pointer flex-1">
                  <div className="font-medium">KASKO SIGNATURE - €200/day</div>
                  <div className="text-sm text-luxury-ivory/70">
                    {language === 'it' ? 'Minimo 30 anni e 10 anni di patente' : 'Minimum 30 years old and 10 years license'}
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <Label className="text-luxury-ivory font-medium text-lg">
              {language === 'it' ? 'Opzioni aggiuntive' : 'Additional Options'}
            </Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-luxury-gold/20">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="fullCleaning"
                    checked={fullCleaning}
                    onCheckedChange={(checked) => setFullCleaning(checked === true)}
                    disabled
                  />
                  <Label htmlFor="fullCleaning" className="text-luxury-ivory cursor-pointer">
                    {language === 'it' ? 'Pulizia completa (Obbligatorio)' : 'Full Cleaning (Required)'}
                  </Label>
                </div>
                <span className="text-luxury-gold font-medium">€30</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-luxury-gold/20">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="secondDriver"
                    checked={secondDriver}
                    onCheckedChange={(checked) => setSecondDriver(checked === true)}
                  />
                  <Label htmlFor="secondDriver" className="text-luxury-ivory cursor-pointer">
                    {language === 'it' ? 'Secondo conducente' : 'Second Driver'}
                  </Label>
                </div>
                <span className="text-luxury-gold font-medium">€10/day</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-luxury-gold/20">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="under25"
                    checked={under25}
                    onCheckedChange={(checked) => setUnder25(checked === true)}
                  />
                  <Label htmlFor="under25" className="text-luxury-ivory cursor-pointer">
                    {language === 'it' ? 'Conducente sotto 25 anni' : 'Driver under 25'}
                  </Label>
                </div>
                <span className="text-luxury-gold font-medium">€10/day</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-luxury-gold/20">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="licenseUnder3"
                    checked={licenseUnder3}
                    onCheckedChange={(checked) => setLicenseUnder3(checked === true)}
                  />
                  <Label htmlFor="licenseUnder3" className="text-luxury-ivory cursor-pointer">
                    {language === 'it' ? 'Patente da meno di 3 anni' : 'License under 3 years'}
                  </Label>
                </div>
                <span className="text-luxury-gold font-medium">€20/day</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-luxury-gold/20">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="outOfHours"
                    checked={outOfHours}
                    onCheckedChange={(checked) => setOutOfHours(checked === true)}
                  />
                  <Label htmlFor="outOfHours" className="text-luxury-ivory cursor-pointer">
                    {language === 'it' ? 'Consegna/ritiro fuori orario' : 'Out-of-hours delivery/pickup'}
                  </Label>
                </div>
                <span className="text-luxury-gold font-medium">€50</span>
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-luxury-gold/10 p-4 rounded-lg border border-luxury-gold/20">
            <div className="flex justify-between items-center">
              <span className="text-luxury-ivory font-semibold text-lg">
                {language === 'it' ? 'Totale:' : 'Total:'}
              </span>
              <span className="text-luxury-gold font-bold text-2xl">€{totalPrice}</span>
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
              disabled={isSubmitting || !isInsuranceEligible().valid}
              className={cn(
                "w-full py-3 text-lg font-semibold transition-all duration-300",
                isInsuranceEligible().valid
                  ? "bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-charcoal"
                  : "bg-gray-500 text-white cursor-not-allowed"
              )}
            >
              {isSubmitting
                ? (language === 'it' ? 'Invio in corso...' : 'Submitting...')
                : `${language === 'it' ? 'Prenota ora' : 'Reserve Now'} - €${totalPrice}`}
            </Button>

            {!isInsuranceEligible().valid && (
              <p className="mt-2 text-sm text-red-500 text-center">
                {isInsuranceEligible().message}
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};