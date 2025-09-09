import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Send, Sparkles, Crown, Zap, Home } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const DR7Concierge = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: language === 'it'
        ? "DR7 Concierge AI al tuo servizio.\n\nSono il tuo assistente personale per esperienze ultra-luxury. Lamborghini? Mega yacht? Villa esclusiva in Costa Smeralda?\n\nComandi speciali:\n• /motivate - Discorso motivazionale\n• /invest - Opportunità investment premium\n• /luxplan - Piano lifestyle billionaire\n\nCome posso aiutarti oggi?"
        : "DR7 Concierge AI at your service.\n\nI'm your personal assistant for ultra-luxury experiences. Lamborghini? Mega yacht? Exclusive Costa Smeralda villa?\n\nSpecial commands:\n• /motivate - Motivational speech\n• /invest - Premium investment opportunities\n• /luxplan - Billionaire lifestyle plan\n\nHow can I assist you today?",
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [language]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('dr7-concierge', {
        body: { message: input, language }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from DR7 Concierge",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickCommands = [
    {
      command: '/motivate',
      icon: Zap,
      label: language === 'it' ? 'Motivazione' : 'Motivation',
      gradient: 'from-black to-gray-800'
    },
    {
      command: '/invest',
      icon: Crown,
      label: language === 'it' ? 'Investimenti' : 'Investments',
      gradient: 'from-gray-900 to-black'
    },
    {
      command: '/luxplan',
      icon: Sparkles,
      label: language === 'it' ? 'Piano Luxury' : 'Luxury Plan',
      gradient: 'from-black to-white'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 bg-black">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <Crown className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-seasons text-white">DR7 Concierge AI</h1>
              <p className="text-white/70 text-sm">{language === 'it' ? 'Assistente Luxury Elite' : 'Elite Luxury Assistant'}</p>
            </div>
          </div>
          <a href="https://www.dr7exotic.com" target="_blank" rel="noopener noreferrer">
            <Button className="bg-white text-black font-semibold px-4 py-2 flex items-center gap-2">
              <Home className="w-4 h-4" />
              {language === 'it' ? 'Home' : 'Home'}
            </Button>
          </a>
        </div>
      </div>

      <div className="border-b border-white/10 bg-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto">
            {quickCommands.map(({ command, icon: Icon, label, gradient }) => (
              <Button
                key={command}
                variant="outline"
                size="sm"
                onClick={() => setInput(command)}
                className={`flex-shrink-0 bg-gradient-to-r ${gradient} border-white/20 text-white hover:scale-105 transition-all duration-200`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6 h-[calc(100vh-280px)] overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <Card className={`max-w-[80%] p-4 ${message.isUser ? 'bg-white text-black border-white/10' : 'bg-black border-white/10 text-white'}`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                  <div className={`text-xs mt-2 opacity-70 ${message.isUser ? 'text-black/70' : 'text-white/50'}`}>{message.timestamp.toLocaleTimeString()}</div>
                </Card>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-black text-white border-white/10 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-white/70">DR7 is thinking...</span>
                  </div>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'it' ? 'Scrivi il tuo messaggio luxury...' : 'Type your luxury message...'}
              className="flex-1 bg-black border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/30"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-white text-black font-semibold px-6 transition-all duration-200 hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DR7Concierge;
