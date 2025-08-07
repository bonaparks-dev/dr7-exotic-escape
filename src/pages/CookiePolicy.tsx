import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CookiePolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Fixed Back Button */}
      <Button
        onClick={() => navigate('/')}
        className="fixed top-24 left-4 z-40 bg-luxury-charcoal/90 text-luxury-ivory border border-luxury-gold/20 hover:bg-luxury-charcoal backdrop-blur-sm"
        size="sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-seasons text-luxury-gold mb-4 uppercase font-bold">
              Cookie Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              DR7Exotic.com – Updated August 2025
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Section 1 */}
            <section className="bg-luxury-charcoal/10 border border-luxury-gold/20 rounded-lg p-8">
              <h2 className="text-2xl font-seasons text-luxury-gold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Cookie Policy outlines how DR7Exotic.com ("the Site") uses cookies and similar technologies. By using our website, you consent to the practices described in this document.
              </p>
            </section>

            {/* Section 2 */}
            <section className="bg-background border border-luxury-gold/10 rounded-lg p-8">
              <h2 className="text-2xl font-seasons text-luxury-gold mb-4">2. What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small data files stored on your device when you visit a website. They allow us to recognize your browser, remember your preferences, and provide a personalized experience.
              </p>
            </section>

            {/* Section 3 */}
            <section className="bg-luxury-charcoal/10 border border-luxury-gold/20 rounded-lg p-8">
              <h2 className="text-2xl font-seasons text-luxury-gold mb-4">3. Why We Use Cookies</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-luxury-gold mr-3">•</span>
                  Secure login and session management
                </li>
                <li className="flex items-start">
                  <span className="text-luxury-gold mr-3">•</span>
                  Website analytics (via Google Analytics, Meta Pixel)
                </li>
                <li className="flex items-start">
                  <span className="text-luxury-gold mr-3">•</span>
                  Preference and language memory
                </li>
                <li className="flex items-start">
                  <span className="text-luxury-gold mr-3">•</span>
                  Marketing personalization
                </li>
                <li className="flex items-start">
                  <span className="text-luxury-gold mr-3">•</span>
                  Technical optimization and bug tracking
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="bg-background border border-luxury-gold/10 rounded-lg p-8">
              <h2 className="text-2xl font-seasons text-luxury-gold mb-4">4. Types of Cookies We Use</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-luxury-gold mr-3">•</span>
                  <strong>Essential Cookies</strong> – Required for site functionality
                </li>
                <li className="flex items-start">
                  <span className="text-luxury-gold mr-3">•</span>
                  <strong>Session Cookies</strong> – Temporary, deleted after your session
                </li>
                <li className="flex items-start">
                  <span className="text-luxury-gold mr-3">•</span>
                  <strong>Persistent Cookies</strong> – Save preferences between visits
                </li>
                <li className="flex items-start">
                  <span className="text-luxury-gold mr-3">•</span>
                  <strong>Analytics Cookies</strong> – Track user behavior anonymously
                </li>
                <li className="flex items-start">
                  <span className="text-luxury-gold mr-3">•</span>
                  <strong>Marketing Cookies</strong> – Show you relevant ads
                </li>
                <li className="flex items-start">
                  <span className="text-luxury-gold mr-3">•</span>
                  <strong>Third-Party Cookies</strong> – From platforms like Google, Meta
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="bg-luxury-charcoal/10 border border-luxury-gold/20 rounded-lg p-8">
              <h2 className="text-2xl font-seasons text-luxury-gold mb-4">5. Managing Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                You can manage cookie preferences via the cookie pop-up banner or through your browser settings. Disabling cookies may limit your experience on the Site.
              </p>
            </section>

            {/* Section 6 */}
            <section className="bg-background border border-luxury-gold/10 rounded-lg p-8">
              <h2 className="text-2xl font-seasons text-luxury-gold mb-4">6. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about this policy, please email us at{" "}
                <a 
                  href="mailto:info@dr7exotic.com" 
                  className="text-luxury-gold hover:text-luxury-gold/80 transition-colors"
                >
                  info@dr7exotic.com
                </a>
              </p>
            </section>
          </div>

          {/* Footer CTA */}
          <div className="text-center mt-16">
            <Button
              onClick={() => navigate('/')}
              variant="luxury"
              className="text-sm uppercase"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;