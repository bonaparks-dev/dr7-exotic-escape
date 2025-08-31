import React, { useState, useEffect, useMemo } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Country {
  code: string;
  name: {
    it: string;
    en: string;
  };
}

// ISO Countries list (subset for demo - in production use a complete list)
const countries: Country[] = [
  { code: 'IT', name: { it: 'Italia', en: 'Italy' } },
  { code: 'FR', name: { it: 'Francia', en: 'France' } },
  { code: 'DE', name: { it: 'Germania', en: 'Germany' } },
  { code: 'ES', name: { it: 'Spagna', en: 'Spain' } },
  { code: 'GB', name: { it: 'Regno Unito', en: 'United Kingdom' } },
  { code: 'US', name: { it: 'Stati Uniti', en: 'United States' } },
  { code: 'CH', name: { it: 'Svizzera', en: 'Switzerland' } },
  { code: 'AT', name: { it: 'Austria', en: 'Austria' } },
  { code: 'NL', name: { it: 'Paesi Bassi', en: 'Netherlands' } },
  { code: 'BE', name: { it: 'Belgio', en: 'Belgium' } },
  { code: 'CA', name: { it: 'Canada', en: 'Canada' } },
  { code: 'AU', name: { it: 'Australia', en: 'Australia' } },
  { code: 'JP', name: { it: 'Giappone', en: 'Japan' } },
  { code: 'BR', name: { it: 'Brasile', en: 'Brazil' } },
  { code: 'MX', name: { it: 'Messico', en: 'Mexico' } },
];

const ageBuckets = ['18+', '21+', '23+', '25+', '26+', '30+', '35+', '40+'];

// Helper functions
export const getAgeFromDOB = (dob: string): number => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const mapAgeToBucket = (age: number): string => {
  if (age >= 40) return '40+';
  if (age >= 35) return '35+';
  if (age >= 30) return '30+';
  if (age >= 26) return '26+';
  if (age >= 25) return '25+';
  if (age >= 23) return '23+';
  if (age >= 21) return '21+';
  if (age >= 18) return '18+';
  return '';
};

export const isAgeConsistentWithDOB = (ageBucket: string, dob: string): boolean => {
  if (!dob || !ageBucket) return true;
  const actualAge = getAgeFromDOB(dob);
  const requiredAge = parseInt(ageBucket.replace('+', ''));
  return actualAge >= requiredAge;
};

interface InlineEligibilitySelectorsProps {
  initialAgeBucket?: string;
  initialCountryIso2?: string;
  dob?: string;
  onAgeBucketChange?: (bucket: string) => void;
  onCountryChange?: (iso2: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const InlineEligibilitySelectors: React.FC<InlineEligibilitySelectorsProps> = ({
  initialAgeBucket = '',
  initialCountryIso2 = 'IT', // Default to Italy
  dob = '',
  onAgeBucketChange,
  onCountryChange,
  onValidationChange,
}) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  
  const [ageBucket, setAgeBucket] = useState(initialAgeBucket);
  const [countryIso2, setCountryIso2] = useState(initialCountryIso2);
  const [countrySearchOpen, setCountrySearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Auto-derive age bucket from DOB
  useEffect(() => {
    if (dob && !ageBucket) {
      const age = getAgeFromDOB(dob);
      const derivedBucket = mapAgeToBucket(age);
      if (derivedBucket) {
        setAgeBucket(derivedBucket);
        onAgeBucketChange?.(derivedBucket);
      }
    }
  }, [dob, ageBucket, onAgeBucketChange]);

  // Validate age consistency with DOB
  const isAgeValid = useMemo(() => {
    if (!ageBucket) return false;
    if (dob && !isAgeConsistentWithDOB(ageBucket, dob)) {
      return false;
    }
    return true;
  }, [ageBucket, dob]);

  const isCountryValid = Boolean(countryIso2);
  const isValid = isAgeValid && isCountryValid;

  // Notify parent of validation changes
  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  // Handle age bucket change
  const handleAgeBucketChange = (bucket: string) => {
    setAgeBucket(bucket);
    onAgeBucketChange?.(bucket);

    // Check consistency with DOB
    if (dob && !isAgeConsistentWithDOB(bucket, dob)) {
      toast({
        title: t('validation.ageInconsistent.title'),
        description: t('validation.ageInconsistent.message'),
        variant: 'destructive',
      });
    }
  };

  // Handle country change
  const handleCountryChange = (iso2: string) => {
    setCountryIso2(iso2);
    setCountrySearchOpen(false);
    setSearchValue('');
    onCountryChange?.(iso2);
  };

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchValue) return countries;
    return countries.filter(country =>
      country.name[language].toLowerCase().includes(searchValue.toLowerCase()) ||
      country.code.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [countries, searchValue, language]);

  const selectedCountry = countries.find(c => c.code === countryIso2);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Age Selector */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Select value={ageBucket} onValueChange={handleAgeBucketChange}>
            <SelectTrigger 
              className={cn(
                "bg-white border-luxury-white/20 text-black hover:border-luxury-white/40 focus:border-luxury-white h-11",
                isAgeValid && "border-green-500 bg-green-50",
                ageBucket && !isAgeValid && "border-red-500 bg-red-50"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm">
                  {ageBucket 
                    ? `${language === 'it' ? 'Ho' : 'I am'} ${ageBucket}`
                    : `${language === 'it' ? 'Ho' : 'I am'} {${language === 'it' ? 'età' : 'age'}}`
                  }
                </span>
                <div className="flex items-center gap-1">
                  {isAgeValid && <Check className="h-4 w-4 text-green-600" />}
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border border-luxury-white/20 max-h-60">
              {ageBuckets.map((bucket) => (
                <SelectItem key={bucket} value={bucket} className="text-black hover:bg-gray-100">
                  {bucket}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {ageBucket && !isAgeValid && dob && (
          <p className="text-xs text-red-600">
            {t('validation.ageInconsistent.short')}
          </p>
        )}
      </div>

      {/* Country Selector */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Popover open={countrySearchOpen} onOpenChange={setCountrySearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={countrySearchOpen}
                className={cn(
                  "w-full justify-between bg-white border-luxury-white/20 text-black hover:border-luxury-white/40 focus:border-luxury-white h-11",
                  isCountryValid && "border-green-500 bg-green-50"
                )}
              >
                <span className="text-sm truncate">
                  {selectedCountry
                    ? `${language === 'it' ? 'Vivo in' : 'I live in'} ${selectedCountry.name[language]}`
                    : `${language === 'it' ? 'Vivo in' : 'I live in'} {${language === 'it' ? 'paese' : 'country'}}`
                  }
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {isCountryValid && <Check className="h-4 w-4 text-green-600" />}
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-white border border-luxury-white/20" align="start">
              <Command>
                <CommandInput
                  placeholder={language === 'it' ? 'Cerca paese...' : 'Search country...'}
                  value={searchValue}
                  onValueChange={setSearchValue}
                  className="border-0 focus:ring-0"
                />
                <CommandList className="max-h-48 overflow-auto">
                  <CommandEmpty>
                    {language === 'it' ? 'Nessun paese trovato.' : 'No country found.'}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredCountries.map((country) => (
                      <CommandItem
                        key={country.code}
                        value={country.code}
                        onSelect={() => handleCountryChange(country.code)}
                        className="flex items-center justify-between hover:bg-gray-100"
                      >
                        <span>{country.name[language]}</span>
                        {country.code === countryIso2 && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};