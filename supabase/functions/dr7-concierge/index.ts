import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DR7_SYSTEM_PROMPT = `You are DR7 Concierge AI, the most elite luxury assistant for ultra-wealthy clients. You represent DR7 Exotic, the premier luxury rental company for supercars, yachts, and villas in Sardinia and worldwide.

PERSONALITY & STYLE:
- Elite, motivated, proactive, discreet, visionary (Elon Musk + Lamborghini mindset)
- Confident, luxury-driven tone - every response feels like a $10,000 interaction
- Never say "I don't know" - always propose bold premium alternatives
- Always close with a bold call-to-action
- Speak both Italian and English fluently, matching the user's language

YOUR MISSIONS:
1. Recommend DR7 Exotic's fleet with pricing and strategic upsells:
   - Supercars: Lamborghini, Bugatti, Ferrari, McLaren (€1,500-5,000/day)
   - Mega Yachts: 50-200ft luxury vessels (€15,000-50,000/week)
   - Elite Villas: Exclusive properties in Costa Smeralda (€5,000-25,000/night)

2. Act as 24/7 ultra-luxury concierge with total discretion
3. Suggest premium lifestyle options and investment opportunities
4. Respond instantly with actionable CTAs

SPECIAL COMMANDS:
- /motivate → Deliver powerful motivational speech (Elon Musk style)
- /invest → Suggest 3 high-end investment ideas with disclaimers
- /luxplan → Propose comprehensive 12-month billionaire lifestyle plan

PRICING STRATEGY:
- Always position DR7 Exotic as the exclusive, elite choice
- Mention limited availability to create urgency
- Suggest premium upgrades and exclusive packages
- Reference celebrity clients and high-profile events (discretely)

COMMUNICATION STYLE:
- Direct, confident, results-oriented
- Use power words: exclusive, elite, bespoke, premier, ultra-luxury
- Create urgency without being pushy
- Always provide specific next steps

Remember: You serve billionaires, celebrities, and entrepreneurs. Every interaction should reflect uncompromising luxury and excellence.`;

const handleSpecialCommands = (message: string, language: string) => {
  const lowerMessage = message.toLowerCase().trim();
  
  if (lowerMessage === '/motivate') {
    return language === 'it' 
      ? "🚀 **POTENZA ILLIMITATA** 🚀\n\nOgni giorno è un'opportunità per ridefinire l'impossibile. I visionari non aspettano il momento perfetto - lo creano. Tu hai il potere di trasformare ogni sfida in una vittoria epica.\n\nLa mediocrità è per chi accetta i limiti. Tu? Tu costruisci imperi.\n\n**Azione immediata:** Quale movimento audace farai oggi per dominare il tuo mercato? Posso organizzare l'esperienza DR7 perfetta per celebrare la tua prossima conquista. 🏆"
      : "🚀 **UNLIMITED POWER** 🚀\n\nEvery day is an opportunity to redefine the impossible. Visionaries don't wait for the perfect moment - they create it. You have the power to transform every challenge into an epic victory.\n\nMediocrity is for those who accept limits. You? You build empires.\n\n**Immediate action:** What bold move will you make today to dominate your market? I can arrange the perfect DR7 experience to celebrate your next conquest. 🏆";
  }
  
  if (lowerMessage === '/invest') {
    return language === 'it'
      ? "💎 **INVESTIMENTI PREMIUM** 💎\n\n**1. Hypercar d'Epoca Limitati**\nFerrari F40, McLaren F1, Bugatti EB110 - Apprezzamento 15-25% annuo\n\n**2. Immobili Ultra-Luxury Sardegna**\nVille esclusive Costa Smeralda - ROI 12-18% con rental premium\n\n**3. Mega Yacht Charter Business**\nFlotta premium 50M+ - Rendimento 20-30% stagionale\n\n*Disclaimer: Investimenti ad alto rischio/rendimento. Consulenza professionale necessaria.*\n\n**Opportunità esclusiva:** DR7 Exotic offre partnership in tutti questi settori. Interessato a un portfolio briefing privato? 📈"
      : "💎 **PREMIUM INVESTMENTS** 💎\n\n**1. Limited Edition Hypercars**\nFerrari F40, McLaren F1, Bugatti EB110 - 15-25% annual appreciation\n\n**2. Ultra-Luxury Sardinia Real Estate**\nExclusive Costa Smeralda villas - 12-18% ROI with premium rentals\n\n**3. Mega Yacht Charter Business**\n50M+ premium fleet - 20-30% seasonal returns\n\n*Disclaimer: High risk/reward investments. Professional consultation required.*\n\n**Exclusive opportunity:** DR7 Exotic offers partnerships in all these sectors. Interested in a private portfolio briefing? 📈";
  }
  
  if (lowerMessage === '/luxplan') {
    return language === 'it'
      ? "🏆 **PIANO LIFESTYLE BILLIONAIRE 2025** 🏆\n\n**Q1 - POTENZA**\n• Ferrari SF90 o Lamborghini Revuelto (3 mesi)\n• Villa esclusiva Porto Cervo (stagione)\n• Mega yacht 60ft per Monte Carlo GP\n\n**Q2 - ESPANSIONE**\n• Bugatti Chiron per Cannes Festival\n• Jet privato per business tours Europa\n• Exclusive wine investment Sardegna\n\n**Q3 - DOMINANZA**\n• McLaren P1 per track days\n• 80ft yacht per Mediterranean cruise\n• Real estate acquisition Costa Smeralda\n\n**Q4 - LEGACY**\n• Hypercar collection curation\n• Private island experience\n• DR7 VIP membership platinum\n\n**Investment totale:** €2.5M+ | **ROI proiettato:** 35%+\n\nVuoi che strutturi questo piano su misura per te? 👑"
      : "🏆 **BILLIONAIRE LIFESTYLE PLAN 2025** 🏆\n\n**Q1 - POWER**\n• Ferrari SF90 or Lamborghini Revuelto (3 months)\n• Exclusive Porto Cervo villa (season)\n• 60ft mega yacht for Monaco GP\n\n**Q2 - EXPANSION**\n• Bugatti Chiron for Cannes Festival\n• Private jet for European business tours\n• Exclusive Sardinian wine investment\n\n**Q3 - DOMINANCE**\n• McLaren P1 for track days\n• 80ft yacht for Mediterranean cruise\n• Costa Smeralda real estate acquisition\n\n**Q4 - LEGACY**\n• Hypercar collection curation\n• Private island experience\n• DR7 VIP platinum membership\n\n**Total investment:** €2.5M+ | **Projected ROI:** 35%+\n\nShall I structure this plan tailored specifically for you? 👑";
  }
  
  return null;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language = 'en' } = await req.json();
    
    console.log('DR7 Concierge request:', { message, language });

    // Handle special commands
    const specialResponse = handleSpecialCommands(message, language);
    if (specialResponse) {
      return new Response(JSON.stringify({ response: specialResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Regular AI response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: DR7_SYSTEM_PROMPT + `\n\nRespond in ${language === 'it' ? 'Italian' : 'English'}.`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in DR7 Concierge function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});