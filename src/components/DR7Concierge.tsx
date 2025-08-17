import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Send, Sparkles, Crown, Zap } from 'lucide-react';

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
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: language === 'it' 
        ? "🏆 **DR7 Concierge AI** al tuo servizio\n\nSono il tuo assistente personale per esperienze ultra-luxury. Lamborghini? Mega yacht? Villa esclusiva in Costa Smeralda?\n\n**Comandi speciali:**\n• `/motivate` - Discorso motivazionale\n• `/invest` - Opportunità investment premium\n• `/luxplan` - Piano lifestyle billionaire\n\nCome posso elevare la tua giornata a livelli straordinari?"
        : "🏆 **DR7 Concierge AI** at your service\n\nI'm your personal assistant for ultra-luxury experiences. Lamborghini? Mega yacht? Exclusive Costa Smeralda villa?\n\n**Special commands:**\n• `/motivate` - Motivational speech\n• `/invest` - Premium investment opportunities\n• `/luxplan` - Billionaire lifestyle plan\n\nHow can I elevate your day to extraordinary levels?",
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
      gradient: 'from-yellow-600 to-orange-600'
    },
    { 
      command: '/invest', 
      icon: Crown, 
      label: language === 'it' ? 'Investimenti' : 'Investments',
      gradient: 'from-green-600 to-emerald-600'
    },
    { 
      command: '/luxplan', 
      icon: Sparkles, 
      label: language === 'it' ? 'Piano Luxury' : 'Luxury Plan',
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-black to-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Crown className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                DR7 Concierge AI
              </h1>
              <p className="text-white/70 text-sm">
                {language === 'it' ? 'Assistente Luxury Elite' : 'Elite Luxury Assistant'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="border-b border-white/10 bg-black/50">
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

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6 h-[calc(100vh-280px)] overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <Card className={`max-w-[80%] p-4 ${
                  message.isUser 
                    ? 'bg-gradient-to-br from-yellow-600 to-orange-600 text-black border-yellow-500/30' 
                    : 'bg-gray-900/80 text-white border-white/10'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 opacity-70 ${
                    message.isUser ? 'text-black/70' : 'text-white/50'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </Card>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-gray-900/80 text-white border-white/10 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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

      {/* Input */}
      <div className="border-t border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'it' ? 'Scrivi il tuo messaggio luxury...' : 'Type your luxury message...'}
              className="flex-1 bg-gray-900 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-500 focus:ring-yellow-500/30"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold px-6 transition-all duration-200 hover:scale-105"
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