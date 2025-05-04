"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

// Dummy data for chats in Ghibli style
const chatData = [
  {
    id: 1,
    name: 'Nama',
    message: 'Nice morning',
    day: 'Uue',
    avatar: '/api/placeholder/40/40',
    isSpecial: false
  },
  {
    id: 2,
    name: 'Janne',
    message: 'Good avsat',
    day: 'Tue',
    avatar: '/api/placeholder/40/40',
    isSpecial: false
  },
  {
    id: 3,
    name: 'Oliver',
    message: 'Just got here',
    day: 'Mo',
    avatar: '/api/placeholder/40/40',
    isSpecial: false
  },
  {
    id: 4,
    name: 'Audrey',
    message: 'Have acusation',
    day: 'Fri',
    avatar: '/api/placeholder/40/40',
    isSpecial: false
  },
  {
    id: 5,
    name: 'Tobiao',
    message: 'Nice, toonup\'',
    day: 'Est',
    avatar: '/api/placeholder/40/40',
    isSpecial: true
  },
  {
    id: 6,
    name: 'Matam',
    message: 'Coming soon...',
    day: 'Et',
    avatar: '/api/placeholder/40/40',
    isSpecial: false
  }
];

export default function ChatComponent() {
  return (
    <div className="flex  justify-center border-l-4 border-muted-foreground  rounded-xl">
      <Card 
        className="w-72  overflow-hidden border-2 border-muted-foreground/30 shadow-md bg-muted"
      >
        <CardHeader 
          className="flex flex-row justify-between items-center py-3 px-4 border-b border-muted-foreground/30 bg-background"
        >
          <h2 
            className="text-2xl font-semibold text-foreground"
          >
            Chats
          </h2>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 text-foreground"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea>
            {chatData.map((chat) => (
              <div 
                key={chat.id}
                className="flex items-center px-4 py-3 border-b border-muted-foreground/20 last:border-0 hover:bg-accent/10 transition-colors"
              >
                <div 
                  className={`flex justify-center items-center w-10 h-10 rounded-full overflow-hidden mr-3 border border-muted-foreground/20 ${chat.isSpecial ? 'bg-accent/30' : 'bg-primary/10'}`}
                >
                  {chat.isSpecial ? (
                    <div className="w-8 h-8 flex items-center justify-center">
                      {/* Placeholder for Totoro-like icon */}
                      <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center relative">
                        <div className="w-4 h-2 bg-secondary-foreground rounded-full absolute top-1" />
                        <div className="w-1 h-1 bg-background rounded-full absolute top-2 left-1" />
                        <div className="w-1 h-1 bg-background rounded-full absolute top-2 right-1" />
                      </div>
                    </div>
                  ) : (
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 
                      className="font-medium text-base text-foreground"
                    >
                      {chat.name}
                    </h3>
                    <span 
                      className="text-xs text-muted-foreground"
                    >
                      {chat.day}
                    </span>
                  </div>
                  <p 
                    className="text-sm truncate text-muted-foreground"
                  >
                    {chat.message}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}