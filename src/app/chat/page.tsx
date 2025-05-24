"use client";

import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { getBotResponse } from './actions';
import type { ChatMessage as ChatMessageType, ConversationTurn } from '@/types';
import { Send, LogOut, MessageSquareText, Loader2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot as BotIcon } from 'lucide-react';
import Image from 'next/image';

export default function ChatPage() {
  const { user, logout, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authIsLoading && !user) {
      router.replace('/login');
    }
  }, [user, authIsLoading, router]);

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);
  
  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!input.trim() || isBotTyping) return;

    const newUserMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: Date.now(),
    };
    
    const currentInput = input;
    setInput(''); // Clear input immediately

    setMessages(prev => [...prev, newUserMessage]);
    setIsBotTyping(true);
    
    const conversationTurns: ConversationTurn[] = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        content: msg.text,
    }));
    // Current user message is NOT added to history for *this* call, as it's the 'currentQuestion'
    // The AI flow will use this currentQuestion along with the *past* conversationHistory.

    try {
      const botResponse = await getBotResponse(currentInput, conversationTurns);
      const newBotMessage: ChatMessageType = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse.error || botResponse.answer,
        timestamp: Date.now(),
        confidence: botResponse.confidence,
      };
      setMessages(prev => [...prev, newBotMessage]);
    } catch (e) {
      console.error("Chat submission error", e);
      const errorBotMessage: ChatMessageType = {
        id: `bot-error-${Date.now()}`,
        sender: 'bot',
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsBotTyping(false);
    }
  };

  if (authIsLoading || (!authIsLoading && !user)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">ProductAssist</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user.email}
          </span>
          <Button variant="outline" size="sm" onClick={logout} className="rounded-full">
            <LogOut className="mr-1.5 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-4 sm:p-6">
        <Card className="flex h-full flex-col rounded-xl shadow-xl">
          {messages.length === 0 && !isBotTyping ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <MessageSquareText className="mb-6 h-20 w-20 text-primary/40" />
              <h2 className="text-2xl font-semibold text-foreground">Welcome to ProductAssist!</h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                How can I help you today? Ask about product features, pricing, or anything else. 
                For example: <em className="italic">"Tell me about the Smart Thermostat X1000."</em>
              </p>
               <Image 
                src="https://placehold.co/400x250.png" 
                alt="AI Assistant illustration" 
                width={400} 
                height={250} 
                className="mt-8 rounded-lg opacity-70"
                data-ai-hint="customer support"
                priority={true}
              />
            </div>
          ) : (
            <ScrollArea className="flex-1" viewportRef={scrollViewportRef}>
              <div className="space-y-2 p-4 sm:p-6">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isBotTyping && (
                  <div className="mb-4 flex items-start gap-2.5 justify-start">
                    <Avatar className="h-9 w-9 shrink-0 border border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <BotIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <Card className="max-w-[75%] rounded-xl rounded-bl-none bg-card p-3 shadow-md">
                      <div className="flex items-center space-x-1.5">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-primary/70 [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 animate-pulse rounded-full bg-primary/70 [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 animate-pulse rounded-full bg-primary/70"></span>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          
          <div className="border-t border-border bg-background/50 p-3 sm:p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <Input
                type="text"
                placeholder="Ask about our products..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-full border-input bg-background px-5 py-3 text-base shadow-sm focus-visible:ring-1 focus-visible:ring-primary/80"
                disabled={isBotTyping}
                autoFocus
              />
              <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90" disabled={isBotTyping || !input.trim()}>
                {isBotTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
}
