import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ChiSiamo = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Chi Siamo
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Valerio & Ilenia — Creatori di DR7 Empire
            </p>
          </div>

          {/* Founders Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-80 mx-auto">
                <img
                  src="/Valerio.jpeg"
                  alt="Valerio - Co-fondatore DR7 Empire"
                  className="w-full h-full object-cover rounded-lg shadow-elegant"
                />
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded">
                  <p className="text-white font-semibold">Valerio</p>
                  <p className="text-white/80 text-sm">Co-fondatore</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-80 mx-auto">
                <img
                  src="/Ilenia.jpeg"
                  alt="Ilenia - Co-fondatrice DR7 Empire"
                  className="w-full h-full object-cover rounded-lg shadow-elegant"
                />
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded">
                  <p className="text-white font-semibold">Ilenia</p>
                  <p className="text-white/80 text-sm">Co-fondatrice</p>
                </div>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12 shadow-elegant">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                DR7 Empire non è un nome. È una misura.
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Nasce da un'idea semplice: il lusso va organizzato, non esibito. Per questo l'abbiamo costruito come un impero del lusso: supercar pronte quando arrivate, ville che respirano ordine, yacht che aspettano la rotta giusta, elicotteri e jet privati che accorciano le distanze, una membership che apre porte con discrezione.
                </p>
                
                <p>
                  Siamo Valerio e Ilenia, co-leader e creatori del brand. Camminiamo allo stesso passo: uniamo la calma delle cose fatte bene alla precisione dei tempi rispettati. La Sardegna ci ha insegnato l'essenziale: il mare all'alba, il vento che cambia, il valore del silenzio. DR7 Empire prende da qui la sua regola: meno rumore, più certezza.
                </p>
                
                <p>
                  Non promettiamo scintille; promettiamo cura. Una chiave consegnata a mano, un itinerario che scorre senza attriti, un arrivo dove è già tutto pronto. Ogni esperienza porta la nostra firma: supercar, ville, yacht, elicotteri, jet, membership — diverse forme, lo stesso standard.
                </p>
                
                <p>
                  La nostra promessa è semplice: tempo guadagnato, bellezza preservata, serenità garantita. Se cercate un effetto speciale, troverete invece una costanza rara: quella delle cose organizzate con intelligenza e rispetto.
                </p>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-2xl font-semibold text-foreground mb-4">
                  Benvenuti in DR7 Empire
                </p>
                <p className="text-lg text-muted-foreground italic">
                  L'impero del lusso che vi accompagna, con discrezione, ovunque scegliate di andare.
                </p>
                <div className="mt-6 flex justify-center">
                  <p className="text-lg font-medium text-primary">
                    — Valerio & Ilenia
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card/30 rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Organizzazione</h3>
              <p className="text-muted-foreground">Il lusso va organizzato, non esibito. Ogni dettaglio è curato con precisione.</p>
            </div>
            
            <div className="text-center p-6 bg-card/30 rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Discrezione</h3>
              <p className="text-muted-foreground">Meno rumore, più certezza. L'eleganza si manifesta nella sottilezza.</p>
            </div>
            
            <div className="text-center p-6 bg-card/30 rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Eccellenza</h3>
              <p className="text-muted-foreground">Diverse forme, lo stesso standard. La qualità non ammette compromessi.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChiSiamo;