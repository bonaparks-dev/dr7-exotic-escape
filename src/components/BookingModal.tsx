import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MessageCircle, X } from "lucide-react";

interface WashPackage {
  id: string;
  title: string;
  price: string;
}

interface AddOnOption {
  id: string;
  title: string;
  subtitle: string;
  pricing: { duration: string; price: string }[];
}

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const washPackages: WashPackage[] = [
  { id: "full-clean", title: "FULL CLEAN", price: "€25" },
  { id: "top-shine", title: "TOP SHINE", price: "€49" },
  { id: "vip-experience", title: "VIP EXPERIENCE", price: "€75" },
  { id: "dr7-luxury", title: "DR7 LUXURY", price: "€99" }
];

const addOnOptions: AddOnOption[] = [
  {
    id: "city-car",
    title: "Standard City Car",
    subtitle: "Perfect for errands or short waits",
    pricing: [
      { duration: "1h", price: "€15" },
      { duration: "2h", price: "€25" },
      { duration: "3h", price: "€35" }
    ]
  },
  {
    id: "supercar",
    title: "Supercar Experience",
    subtitle: "Feel the thrill of luxury performance",
    pricing: [
      { duration: "1h", price: "€59" },
      { duration: "2h", price: "€99" },
      { duration: "3h", price: "€139" }
    ]
  },
  {
    id: "ferrari-lambo",
    title: "Ferrari / Lamborghini Experience",
    subtitle: "Drive one of our top supercars while we bring yours back to life",
    pricing: [
      { duration: "1h", price: "€149" },
      { duration: "2h", price: "€249" },
      { duration: "3h", price: "€299" }
    ]
  }
];

export const BookingModal = ({ open, onOpenChange }: BookingModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string>>({});

  const handleAddOnChange = (addOnId: string, duration: string, checked: boolean) => {
    setSelectedAddOns(prev => {
      const newState = { ...prev };
      if (checked) {
        newState[addOnId] = duration;
      } else {
        delete newState[addOnId];
      }
      return newState;
    });
  };

  const generateWhatsAppMessage = () => {
    const selectedPkg = washPackages.find(pkg => pkg.id === selectedPackage);
    if (!selectedPkg) return "";

    let message = `Hello DR7 Exotic, I would like to book the following car wash service:\n\n`;
    message += `Package: ${selectedPkg.title} (${selectedPkg.price})\n`;

    const addOnEntries = Object.entries(selectedAddOns);
    if (addOnEntries.length > 0) {
      message += `Add-ons:\n`;
      addOnEntries.forEach(([addOnId, duration]) => {
        const addOn = addOnOptions.find(option => option.id === addOnId);
        const pricing = addOn?.pricing.find(p => p.duration === duration);
        if (addOn && pricing) {
          message += `- ${addOn.title} – ${duration} (${pricing.price})\n`;
        }
      });
    }

    message += `\nThank you!`;
    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = () => {
    const message = generateWhatsAppMessage();
    if (message && selectedPackage) {
      window.open(`https://wa.me/393457905205?text=${message}`, '_blank');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-seasons text-luxury-gold mb-4">
            Book Your DR7 Service
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Wash Packages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-luxury-gold">Select Wash Package</h3>
            <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage}>
              {washPackages.map((pkg) => (
                <div key={pkg.id} className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                  selectedPackage === pkg.id 
                    ? 'border-luxury-gold bg-luxury-gold/10 shadow-lg shadow-luxury-gold/20' 
                    : 'border-luxury-gold/20 hover:bg-luxury-gold/5'
                }`}>
                  <RadioGroupItem value={pkg.id} id={pkg.id} />
                  <Label htmlFor={pkg.id} className="flex-1 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <span className={`${selectedPackage === pkg.id ? 'text-luxury-gold font-semibold' : 'text-luxury-ivory'}`}>
                        {pkg.title}
                      </span>
                      <span className="text-luxury-gold font-bold">{pkg.price}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Add-on Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-luxury-gold">Select One Add-on Only (Optional)</h3>
            {addOnOptions.map((option) => (
              <div key={option.id} className="p-4 rounded-lg border border-luxury-gold/20 bg-luxury-charcoal/30">
                <h4 className="text-luxury-gold font-medium mb-1">{option.title}</h4>
                <p className="text-sm text-luxury-gold/70 mb-3">{option.subtitle}</p>
                <div className="grid grid-cols-3 gap-2">
                  {option.pricing.map((price) => (
                    <div key={price.duration} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${option.id}-${price.duration}`}
                        checked={selectedAddOns[option.id] === price.duration}
                        onCheckedChange={(checked) => 
                          handleAddOnChange(option.id, price.duration, checked as boolean)
                        }
                      />
                      <Label htmlFor={`${option.id}-${price.duration}`} className="text-sm cursor-pointer">
                        <div className="text-luxury-ivory">{price.duration}</div>
                        <div className="text-luxury-gold text-xs">{price.price}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="pt-4 border-t border-luxury-gold/20">
            <Button
              onClick={handleWhatsAppClick}
              disabled={!selectedPackage}
              variant="luxury"
              size="lg"
              className="w-full"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Confirm via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
