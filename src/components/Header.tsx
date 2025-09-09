import { Button } from "@/components/ui/button";
import { User, LogOut, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { href: "/rentals", label: t("nav.rentcar") || "Rent" },
    { href: "/villa-listings", label: "Experiences" },
    { href: "/membership", label: t("services.membership") || "Membership" },
    { href: "/services", label: "Concierge" },
    { href: "https://wa.me/393457905205", label: t("nav.contact") || "Contact", external: true }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border" role="navigation">
      {/* Desktop & Mobile: Main top bar */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo on left */}
        <Link to="/" className="flex items-center" aria-label="DR7 Exotic Cars Home">
          <img
            src="/DR7logo.png"
            alt="DR7 Exotic Cars & Luxury"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop navigation (hidden on mobile) */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.href}>
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  aria-label={`${link.label} (opens in new window)`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.href}
                  className="text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Right side: Language + Auth */}
        <div className="flex items-center space-x-3">
          {/* Language toggle */}
          <LanguageToggle />

          {/* Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {language === 'it' ? 'Esci' : 'Sign Out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button 
                variant="default" 
                size="sm"
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {language === 'it' ? 'Accedi' : 'Sign In'}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile: Navigation row (always visible) */}
      <div className="md:hidden border-t border-border bg-background">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-6 py-3 overflow-x-auto scrollbar-hide">
            {navLinks.map((link) => (
              <div key={link.href} className="flex-shrink-0">
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    aria-label={`${link.label} (opens in new window)`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className="text-sm text-foreground hover:text-primary transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}