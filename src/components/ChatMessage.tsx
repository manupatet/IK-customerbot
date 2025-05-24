import type { ChatMessage as ChatMessageType } from '@/types';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot, User as UserIcon } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={cn("mb-4 flex items-start gap-2.5", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <Avatar className="h-9 w-9 shrink-0 border border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("group flex flex-col", isBot ? "items-start" : "items-end")}>
        <Card 
          className={cn(
            "max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-md", 
            isBot ? "bg-card rounded-bl-none border-border" : "bg-primary text-primary-foreground rounded-br-none border-primary/50"
          )}
        >
          <CardContent className="p-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
          </CardContent>
        </Card>
        <div 
            className={cn(
                "mt-1.5 px-1 text-xs", 
                isBot ? "text-muted-foreground" : "text-primary-foreground/80 group-hover:text-primary-foreground"
            )}
            style={!isBot ? {color: 'hsl(var(--muted-foreground))'} : {}} // Make user timestamp less prominent, matching bot's muted style
        >
            {formattedTime}
            {isBot && message.confidence !== undefined && (
            <span className="ml-2 opacity-80">· Confidence: {(message.confidence * 100).toFixed(0)}%</span>
            )}
        </div>
      </div>
      {!isBot && (
        <Avatar className="h-9 w-9 shrink-0 border border-accent">
          <AvatarFallback className="bg-accent/20 text-accent-foreground">
            <UserIcon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
