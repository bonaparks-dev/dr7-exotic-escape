import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Ship, Plane, Home, ChefHat, RotateCcw, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";


export function ServiceCategories() {
  const { t } = useLanguage();

  const categories = [
    {
      id: 'Exotic Cars',
      title: t('services.supercars'),
      icon: Car,
      video: '/rental1.mp4',
      buttonLabel: t('btn.learnmore'),
      link: '/rentals'
    },
    {
      id: 'yachts',
      title: t('services.yachts'),
      icon: Ship,
      video: '/yacht.MP4',
      buttonLabel: t('btn.learnmore'),
      link: '/yacht-listings'
    },
    {
      id: 'jets',
      title: t('services.jets'),
      icon: Plane,
      video: '/jetprivate.MP4',
      buttonLabel: t('btn.learnmore'),
      link: '/private-jet-listings'
    },
    {
      id: 'villas',
      title: t('services.villas'),
      icon: Home,
      video: '/villa.MP4',
      buttonLabel: t('btn.learnmore'),
      link: '/villa-listings'
    },
    {
      id: 'helicopters',
      title: t('services.helicopters'),
      icon: RotateCcw,
      video: '/helicopter.MP4',
      buttonLabel: t('btn.learnmore'),
      link: '/helicopter-listings'
    },
    {
      id: 'membership',
      title: t('services.membership'),
      icon: Crown,
      video: '/main.MP4',
      buttonLabel: t('btn.learnmore'),
      link: '/membership'
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group overflow-hidden border-0 shadow-card hover:shadow-luxury transition-all duration-500 bg-card/50 backdrop-blur-sm"
            >
              <div className="relative h-64 overflow-hidden">
                <video
                  src={category.video}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>

               <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6 text-white">{category.title}</h3>
                {category.link ? (
                  <a href={category.link}>
                    <Button variant="luxury" className="w-full">
                      {category.buttonLabel}
                    </Button>
                  </a>
                ) : (
                  <Button variant="luxury" className="w-full">
                    {category.buttonLabel}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
