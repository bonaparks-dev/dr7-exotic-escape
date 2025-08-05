import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarIcon, X, Check } from "lucide-react";
import { format } from "date-fns";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

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
        },
      });

      if (error) throw error;

      setShowSuccess(true);
      
      // Redirect to WhatsApp after a delay
      setTimeout(() => {
        const message = `Hello DR7 Exotic, I just submitted my rental request on your website for the ${carName}. My contact details: ${firstName} ${lastName}, ${email}, ${phone}. Rental period: ${format(startDate, 'PP')} to ${format(endDate, 'PP')}.`;
        const whatsappUrl = `https://wa.me/393457905205?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
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
        }, 1000);
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
        <DialogContent className="sm:max-w-md bg-luxury-charcoal border-luxury-gold/20">
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-luxury-charcoal border-luxury-gold/20">
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
                      "w-full justify-start text-left font-normal bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory hover:bg-luxury-charcoal/70",
                      !startDate && "text-luxury-ivory/50"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-luxury-white border-luxury-gold/20" align="start">
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
                      "w-full justify-start text-left font-normal bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory hover:bg-luxury-charcoal/70",
                      !endDate && "text-luxury-ivory/50"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-luxury-charcoal border-luxury-gold/20" align="start">
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
                className="bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory placeholder:text-luxury-ivory/50 focus:border-luxury-gold"
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
                className="bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory placeholder:text-luxury-ivory/50 focus:border-luxury-gold"
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
                className="bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory placeholder:text-luxury-ivory/50 focus:border-luxury-gold"
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
                className="bg-luxury-charcoal/50 border-luxury-gold/20 text-luxury-ivory placeholder:text-luxury-ivory/50 focus:border-luxury-gold"
                placeholder="+39 123 456 7890"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-charcoal font-semibold py-3 text-lg transition-all duration-300"
            >
              {isSubmitting ? "Submitting..." : "Reserve Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
