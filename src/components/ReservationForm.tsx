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

interface ReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  carName: string;
}

export const ReservationForm = ({ isOpen, onClose, carName }: ReservationFormProps) => {
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
  const { toast } = useToast();

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    
    const days = differenceInDays(endDate, startDate);
    if (days <= 0) return 0;

    let total = 0;
    
    // Deposit surcharge
    if (depositOption === "no-deposit") {
      total += days * 40;
    }
    
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
  }, [startDate, endDate, depositOption, insurance, secondDriver, under25, licenseUnder3, outOfHours]);

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
Deposit: ${depositOption === "with-deposit" ? "With deposit" : "No deposit (+€40/day)"}
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
          setDepositOption("with-deposit");
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
              <Popover>
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
                    onSelect={setStartDate}
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
              <Popover>
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
                    onSelect={setEndDate}
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
                className="bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory placeholder:text-luxury-ivory/50 focus:border-luxury-gold hover:border-luxury-gold/40 hover:bg-luxury-charcoal/70"
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
                className="bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory placeholder:text-luxury-ivory/50 focus:border-luxury-gold hover:border-luxury-gold/40 hover:bg-luxury-charcoal/70"
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
                className="bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory placeholder:text-luxury-ivory/50 focus:border-luxury-gold hover:border-luxury-gold/40 hover:bg-luxury-charcoal/70"
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
                className="bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory placeholder:text-luxury-ivory/50 focus:border-luxury-gold hover:border-luxury-gold/40 hover:bg-luxury-charcoal/70"
                placeholder="+39 123 456 7890"
                required
              />
            </div>
          </div>

          {/* Deposit Option */}
          <div className="space-y-3">
            <Label className="text-luxury-ivory font-medium text-lg">Deposit Option</Label>
            <RadioGroup value={depositOption} onValueChange={setDepositOption} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="with-deposit" id="with-deposit" className="border-luxury-gold/50 text-luxury-gold" />
                <Label htmlFor="with-deposit" className="text-luxury-ivory cursor-pointer">With deposit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-deposit" id="no-deposit" className="border-luxury-gold/50 text-luxury-gold" />
                <Label htmlFor="no-deposit" className="text-luxury-ivory cursor-pointer">
                  No deposit <span className="text-luxury-gold">(+€40/day)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Insurance */}
          <div className="space-y-3">
            <Label className="text-luxury-ivory font-medium text-lg">Insurance</Label>
            <Select value={insurance} onValueChange={setInsurance}>
              <SelectTrigger className="bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory focus:border-luxury-gold hover:border-luxury-white/40 hover:bg-luxury-charcoal/70">
                <SelectValue placeholder="Select insurance" />
              </SelectTrigger>
              <SelectContent className="bg-luxury-charcoal border-luxury-gold/20">
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
                  className="border-luxury-gold/50 data-[state=checked]:bg-luxury-gold data-[state=checked]:border-luxury-gold"
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
                  className="border-luxury-gold/50 data-[state=checked]:bg-luxury-gold data-[state=checked]:border-luxury-gold"
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
                  className="border-luxury-gold/50 data-[state=checked]:bg-luxury-gold data-[state=checked]:border-luxury-gold"
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
                  className="border-luxury-gold/50 data-[state=checked]:bg-luxury-gold data-[state=checked]:border-luxury-gold"
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
                  className="border-luxury-gold/50 data-[state=checked]:bg-luxury-gold data-[state=checked]:border-luxury-gold"
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
