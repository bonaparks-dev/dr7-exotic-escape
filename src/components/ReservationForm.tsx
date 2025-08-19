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
  const [dob, setDob] = useState(""); // New field: Date of birth
  const [licenseDate, setLicenseDate] = useState(""); // New field: License date
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
  {/* Date de naissance + Permis */}
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

          {/* Message d'erreur si conditions non respectées */}
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
                "w-full py-3 text-lg font-semibold transition-all
"w-full py-3 text-lg font-semibold transition-all duration-300",
                isInsuranceEligible().valid
                  ? "bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-charcoal"
                  : "bg-gray-500 text-white cursor-not-allowed"
              )}
            >
              {isSubmitting
                ? "Submitting..."
                : `Reserve Now - €${totalPrice}`}
            </Button>

            {!isInsuranceEligible().valid && (
              <p className="mt-2 text-sm text-red-500 text-center">
                {language === 'it'
                  ? isInsuranceEligible().message.it
                  : isInsuranceEligible().message.en}
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
  const isInsuranceEligible = () => {
    const age = under25 ? 24 : 30; // simulate based on checkbox
    const licenseYears = licenseUnder3 ? 2 : 10; // simulate based on checkbox

    if (insurance === "kasko" && licenseYears < 2) {
      return {
        valid: false,
        message: {
          en: "KASKO insurance requires at least 2 years of driving license.",
          it: "L'assicurazione KASKO richiede almeno 2 anni di patente.",
        },
      };
    }

    if (insurance === "kasko-black") {
      if (age < 25 || licenseYears < 5) {
        return {
          valid: false,
          message: {
            en: "KASKO BLACK requires minimum 25 years of age and 5 years of license.",
            it: "KASKO BLACK richiede almeno 25 anni e 5 anni di patente.",
          },
        };
      }
    }

    if (insurance === "kasko-signature") {
      if (age < 30 || licenseYears < 10) {
        return {
          valid: false,
          message: {
            en: "KASKO SIGNATURE requires minimum 30 years of age and 10 years of license.",
            it: "KASKO SIGNATURE richiede almeno 30 anni e 10 anni di patente.",
          },
        };
      }
    }

    return {
      valid: true,
      message: {
        en: "",
        it: "",
      },
    };
  };
