import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";

const Lottery = () => {
  const { t, language } = useLanguage();

  const supercars = [
    { name: "Lamborghini Huracán", value: "€230,000" },
    { name: "Ferrari F8 Tributo", value: "€280,000" },
    { name: "McLaren 720S", value: "€300,000" },
    { name: "Porsche 911 Turbo S", value: "€220,000" },
    { name: "Audi R8 V10", value: "€200,000" },
    { name: "BMW M8 Competition", value: "€180,000" },
    { name: "Mercedes-AMG GT R", value: "€190,000" },
    { name: "Lamborghini Urus", value: "€250,000" },
    { name: "Ferrari Portofino", value: "€240,000" },
    { name: "Aston Martin Vantage", value: "€170,000" },
    { name: "Bentley Continental GT", value: "€220,000" },
    { name: "Maserati MC20", value: "€260,000" },
    { name: "Jaguar F-Type R", value: "€120,000" },
    { name: "Corvette C8 Z06", value: "€150,000" },
    { name: "Nissan GT-R Nismo", value: "€180,000" },
    { name: "Dodge Challenger SRT Hellcat", value: "€90,000" },
    { name: "Ford Mustang Shelby GT500", value: "€85,000" },
    { name: "Chevrolet Camaro ZL1", value: "€75,000" },
    { name: "Alpine A110S", value: "€80,000" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-black text-white py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <Button
              onClick={() => window.history.back()}
              variant="ghost"
              className="mb-8 text-white hover:text-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('lottery.back')}
            </Button>
            
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: '"The Seasons", serif' }}>
                DR7 MILION LOTTERY
              </h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                {t('lottery.heroText')}
              </p>
            </div>
          </div>
        </section>

        {/* Lottery Images Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-black">{t('lottery.ticketTitle')}</h3>
                <img 
                  src="/lovable-uploads/5e5637a8-a5f2-4706-82f7-04258ae88ed9.png" 
                  alt="DR7 Million Lottery Ticket"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Supercars Prize Pool */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-black" style={{ fontFamily: '"The Seasons", serif' }}>
              {t('lottery.prizePoolTitle')}
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {supercars.map((car, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md border">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{car.name}</h3>
                    <span className="text-lg font-bold text-black">{car.value}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-2xl font-bold text-black">
                {t('lottery.totalValue')}
              </p>
            </div>
          </div>
        </section>

        {/* Rules Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-black" style={{ fontFamily: '"The Seasons", serif' }}>
              {t('lottery.rulesTitle')}
            </h2>
            
            <div className="space-y-4 text-lg text-gray-700">
              <div className="flex items-start">
                <span className="font-bold text-black mr-3">•</span>
                <p>{t('lottery.rule1')}</p>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-black mr-3">•</span>
                <p>{t('lottery.rule2')}</p>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-black mr-3">•</span>
                <p>{t('lottery.rule3')}</p>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-black mr-3">•</span>
                <p>{t('lottery.rule4')}</p>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-black mr-3">•</span>
                <p>{t('lottery.rule5')}</p>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-black mr-3">•</span>
                <p>{t('lottery.rule6')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: '"The Seasons", serif' }}>
              {t('lottery.ctaTitle')}
            </h2>
            <p className="text-xl mb-8">
              {t('lottery.ctaText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-black hover:bg-gray-200 font-medium px-8 py-3 text-lg"
                onClick={() => window.location.href = '/'}
              >
                {t('lottery.comingSoon')}
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black font-medium px-8 py-3 text-lg"
                onClick={() => window.history.back()}
              >
                {t('lottery.back')}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Lottery;