import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const { language, t } = useLanguage();
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

  // Auto-open end date picker when start date is selected
  useEffect(() => {
    if (startDate && !endDate) {
      setTimeout(() => {
        setEndDateOpen(true);
      }, 300);
    }
  }, [startDate, endDate]);

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setStartDateOpen(false);
    if (date && date >= endDate!) {
      setEndDate(undefined);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    setEndDateOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !firstName || !lastName || !email || !phone) {
      toast({
        title: "Please fill in all fields",
        description: "All fields are required to submit your reservation.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const days = differenceInDays(endDate, startDate);
    
    try {
      const { error } = await supabase.functions.invoke('send-reservation', {
        body: {
          carName,
          firstName,
          lastName,
          email,
          phone,
          startDate: format(startDate, 'PP'),
          endDate: format(endDate, 'PP'),
          days,
          depositOption,
          insurance,
          fullCleaning,
          secondDriver,
          under25,
          licenseUnder3,
          outOfHours,
          totalPrice,
        },
      });

      if (error) throw error;

      setShowSuccess(true);
      
      // Redirect to WhatsApp after a delay
      setTimeout(() => {
        const additionalOptions = [
          fullCleaning && "Full cleaning with nitrogen sanitization (€30)",
          secondDriver && `Second driver (€${days * 10})`,
          under25 && `Under 25 years old (€${days * 10})`,
          licenseUnder3 && `Driving license under 3 years (€${days * 20})`,
          outOfHours && "Out-of-hours pickup (€50)"
        ].filter(Boolean).join(", ");

        const message = `Hello DR7 Exotic, I just submitted my rental request on your website for the ${carName}. 

Contact: ${firstName} ${lastName}, ${email}, ${phone}
Rental period: ${format(startDate, 'PP')} to ${format(endDate, 'PP')} (${days} days)
Base rental cost: €${days * dailyPrice} (€${dailyPrice}/day)
Insurance: ${insurance.charAt(0).toUpperCase() + insurance.slice(1).replace("-", " ")}
Additional options: ${additionalOptions || "None"}
Total estimated cost: €${totalPrice}`;

        const whatsappUrl = `https://wa.me/393457905205?text=${encodeURIComponent(message)}`;
        window.location.href = whatsappUrl;
        
        // Close modal after WhatsApp opens
        setTimeout(() => {
          onClose();
          setShowSuccess(false);
          // Reset form
          setStartDate(undefined);
          setEndDate(undefined);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          // Removed deposit option
          setInsurance("kasko");
          setFullCleaning(true);
          setSecondDriver(false);
          setUnder25(false);
          setLicenseUnder3(false);
          setOutOfHours(false);
        }, 4000);
      }, 2000);

    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-black border-white/20">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-seasons text-luxury-gold mb-2">Reservation Submitted!</h3>
            <p className="text-luxury-ivory/80 mb-4">
              Thank you for choosing DR7 Exotic. We've sent a confirmation email and will contact you within 24 hours.
            </p>
            <p className="text-sm text-luxury-ivory/60">
              Opening WhatsApp for immediate assistance...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-seasons text-luxury-gold">
            Reserve Your {carName}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-luxury-ivory/60 hover:text-luxury-ivory"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-luxury-ivory font-medium">
                Start Date
              </Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory hover:bg-luxury-gold/20 hover:border-luxury-gold/40",
                      !startDate && "text-luxury-ivory/50"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-luxury-ivory font-medium">
                End Date
              </Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory hover:bg-luxury-gold/20 hover:border-luxury-gold/40",
                      !endDate && "text-luxury-ivory/50"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black border-white/20" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateSelect}
                    disabled={(date) => date < (startDate || new Date())}
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
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-white border-luxury-gold/20 text-black placeholder:text-gray-500 focus:border-luxury-gold hover:border-luxury-gold/40"
                placeholder="Enter your first name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-luxury-ivory font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-white border-luxury-gold/20 text-black placeholder:text-gray-500 focus:border-luxury-gold hover:border-luxury-gold/40"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-luxury-ivory font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-luxury-gold/20 text-black placeholder:text-gray-500 focus:border-luxury-gold hover:border-luxury-gold/40"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-luxury-ivory font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white border-luxury-gold/20 text-black placeholder:text-gray-500 focus:border-luxury-gold hover:border-luxury-gold/40"
                placeholder="+39 123 456 7890"
                required
              />
            </div>
          </div>

          {/* Mileage Rules */}
          <div className="space-y-3 bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-lg">📏</span>
              <Label className="text-luxury-ivory font-medium text-lg">
                {t('mileage.title')}
              </Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-luxury-ivory/90">
              <div>{t('mileage.day1')}</div>
              <div>{t('mileage.day2')}</div>
              <div>{t('mileage.day3')}</div>
              <div>{t('mileage.day4')}</div>
              <div>{t('mileage.day5')}</div>
              <div className="sm:col-span-2 text-luxury-gold font-medium">
                {t('mileage.day6Plus')}
              </div>
            </div>
            {startDate && endDate && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-luxury-gold font-medium">
                  {(() => {
                    const days = differenceInDays(endDate, startDate);
                    let includedKm = 0;
                    if (days === 1) includedKm = 100;
                    else if (days === 2) includedKm = 180;
                    else if (days === 3) includedKm = 240;
                    else if (days === 4) includedKm = 280;
                    else if (days === 5) includedKm = 300;
                    else if (days >= 6) includedKm = 300 + (days - 5) * 60;
                    
                    return language === 'it' 
                      ? `La tua prenotazione di ${days} giorni include ${includedKm} km`
                      : `Your ${days}-day rental includes ${includedKm} km`;
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Rental Summary */}
          <div className="space-y-3 bg-white/5 rounded-lg p-4">
            <Label className="text-luxury-ivory font-medium text-lg">Rental Summary</Label>
            {startDate && endDate && (
              <div className="space-y-2 text-sm text-luxury-ivory/80">
                <div className="flex justify-between">
                  <span>Car rental ({differenceInDays(endDate, startDate)} days)</span>
                  <span>€{differenceInDays(endDate, startDate) * dailyPrice}</span>
                </div>
              </div>
            )}
          </div>

          {/* Insurance */}
          <div className="space-y-3">
            <Label className="text-luxury-ivory font-medium text-lg">Insurance</Label>
            <Select value={insurance} onValueChange={setInsurance}>
              <SelectTrigger className="bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory focus:border-luxury-gold hover:border-luxury-white/40 hover:bg-luxury-charcoal/70">
                <SelectValue placeholder="Select insurance" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20 z-50">
                <SelectItem value="kasko" className="text-luxury-ivory hover:bg-luxury-gold/30 focus:bg-luxury-gold/30">
                  Kasko – €100/day
                </SelectItem>
                <SelectItem value="kasko-black" className="text-luxury-ivory hover:bg-luxury-gold/30 focus:bg-luxury-gold/30">
                  Kasko Black – €150/day
                </SelectItem>
                <SelectItem value="kasko-signature" className="text-luxury-ivory hover:bg-luxury-gold/30 focus:bg-luxury-gold/30">
                  Kasko Signature – €200/day
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <Label className="text-luxury-ivory font-medium text-lg">Additional Options</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="full-cleaning" 
                  checked={fullCleaning} 
                  onCheckedChange={(checked) => setFullCleaning(checked === true)}
                  disabled
                  className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
                />
                <Label htmlFor="full-cleaning" className="text-luxury-ivory cursor-pointer">
                  Full cleaning with nitrogen sanitization – €30 <span className="text-luxury-gold">(Required)</span>
                </Label>
              </div>
              
               <div className="flex items-center space-x-2">
                <Checkbox 
                  id="second-driver" 
                  checked={secondDriver} 
                  onCheckedChange={(checked) => setSecondDriver(checked === true)}
                  className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
                />
                <Label htmlFor="second-driver" className="text-luxury-ivory cursor-pointer">
                  Second driver – €10/day
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="under-25" 
                  checked={under25} 
                  onCheckedChange={(checked) => setUnder25(checked === true)}
                  className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
                />
                <Label htmlFor="under-25" className="text-luxury-ivory cursor-pointer">
                  Under 25 years old – €10/day
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="license-under-3" 
                  checked={licenseUnder3} 
                  onCheckedChange={(checked) => setLicenseUnder3(checked === true)}
                  className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
                />
                <Label htmlFor="license-under-3" className="text-luxury-ivory cursor-pointer">
                  Driving license under 3 years (min. 2years) – €20/day
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="out-of-hours" 
                  checked={outOfHours} 
                  onCheckedChange={(checked) => setOutOfHours(checked === true)}
                  className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black"
                />
                <Label htmlFor="out-of-hours" className="text-luxury-ivory cursor-pointer">
                  Out-of-hours or Sunday pickup – €50
                </Label>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          {startDate && endDate && differenceInDays(endDate, startDate) > 0 && (
            <div className="bg-luxury-charcoal/30 border border-luxury-gold/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-luxury-ivory font-medium">
                  Total for {differenceInDays(endDate, startDate)} day{differenceInDays(endDate, startDate) !== 1 ? 's' : ''}:
                </span>
                <span className="text-luxury-gold font-bold text-xl">€{totalPrice}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-charcoal font-semibold py-3 text-lg transition-all duration-300"
            >
              {isSubmitting ? "Submitting..." : `Reserve Now - €${totalPrice}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
