import React, { useState } from 'react';
import { Bot, Send, Sparkles, TrendingUp, AlertTriangle, PackageCheck } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { useAdminStore } from '../../store/adminStore';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIChatDrawer: React.FC = () => {
  const { isAIChatOpen, setAIChatOpen, products, orders, inventory } = useAdminStore();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am MATRIN AI Assistant. I monitor your inventory forecasts, customer sentiment, order velocity, and sales trends. How can I help you today?',
      timestamp: 'Just now',
    },
  ]);

  const handleSend = (userQuery?: string) => {
    const textToSend = userQuery || input;
    if (!textToSend.trim()) return;

    const newMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulate AI Intelligence response
    setTimeout(() => {
      let aiText = '';
      const q = textToSend.toLowerCase();

      if (q.includes('stock') || q.includes('inventory')) {
        const lowItems = inventory.filter((i) => i.currentStock <= i.criticalLevel);
        aiText = `Analysis complete: You currently have ${lowItems.length} critical inventory items (e.g. ${lowItems.map((i) => i.name).join(', ')}). I recommend initiating a purchase order to GreenChem Organics immediately to prevent out-of-stock downtime.`;
      } else if (q.includes('forecast') || q.includes('revenue') || q.includes('sales')) {
        aiText = 'Based on linear regression of Q3-Q4 sales velocity, projected MATRIN Enterprise revenue for next month is $148,200 (+19% YoY). Your top growth drivers are Fabric Care steam units and Eco-Series subscriptions.';
      } else if (q.includes('promo') || q.includes('coupon')) {
        aiText = 'Recommended Campaign Strategy: Creating a 15% discount for recurring subscription cleaning pods could increase customer retention by 22% this quarter while maintaining a 68% gross margin.';
      } else {
        aiText = `MATRIN AI Insight: I have analyzed your request "${textToSend}". Total live products: ${products.length}, Total Active Orders: ${orders.length}. Everything is running within optimal operating parameters.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiText,
          timestamp: 'Just now',
        },
      ]);
    }, 600);
  };

  const quickPrompts = [
    { label: 'Forecast next month revenue', query: 'Forecast next month revenue' },
    { label: 'Check low stock alerts', query: 'Check low stock items' },
    { label: 'Recommend promo strategy', query: 'Recommend promo campaign' },
  ];

  return (
    <Drawer
      isOpen={isAIChatOpen}
      onClose={() => setAIChatOpen(false)}
      title={
        <div className="flex items-center gap-2 text-matrin-primary dark:text-blue-400">
          <Bot className="w-5 h-5" />
          <span>MATRIN AI Command Assistant</span>
        </div>
      }
      width="lg"
    >
      <div className="flex flex-col h-[calc(100vh-140px)] justify-between space-y-4">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  m.sender === 'user'
                    ? 'bg-matrin-secondary'
                    : 'bg-matrin-primary shadow-soft'
                }`}
              >
                {m.sender === 'user' ? 'YOU' : <Sparkles className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-matrin-secondary text-white rounded-tr-none'
                    : 'bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder text-matrin-text dark:text-slate-200 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-2 pt-2 border-t border-matrin-border dark:border-matrin-darkborder">
          <div className="text-[10px] font-bold uppercase tracking-wider text-matrin-gray">
            Quick AI Queries:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.query)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-matrin-primary/10 text-matrin-primary dark:text-blue-300 hover:bg-matrin-primary hover:text-white rounded-lg transition-colors"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Footer */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI about sales trends, inventory, or customers..."
            className="flex-1 px-4 py-2.5 text-xs bg-matrin-bg dark:bg-slate-900 border border-matrin-border dark:border-matrin-darkborder rounded-xl text-matrin-text dark:text-white focus:outline-none focus:ring-2 focus:ring-matrin-primary"
          />
          <Button
            variant="primary"
            size="md"
            icon={<Send className="w-4 h-4" />}
            onClick={() => handleSend()}
          >
            Send
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
