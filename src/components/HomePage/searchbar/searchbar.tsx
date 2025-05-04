"use client"
import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function GhibliSearchbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
   
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="bg-card/80 backdrop-blur-sm border border-primary/20 rounded-xl shadow-lg overflow-hidden transition-all duration-300">
        <div className="p-2 md:p-4">
          <div className="relative flex items-center">
            <div className="absolute left-3 text-muted-foreground">
              <FaSearch size={16} />
            </div>
            
            <Input
              type="text"
              placeholder="Search the world of Ghibli..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
              className={`pl-10 pr-10  bg-background/70 border-primary/10 focus:border-primary focus:ring-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all text-2xl `}
            />
            
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-16 text-muted-foreground hover:text-foreground"
              >
                <FaTimes size={14} />
              </button>
            )}
            
            {/* <Button 
              onClick={handleSearch} 
              className="absolute right-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-3 py-1 flex items-center justify-center"
            >
              Search
            </Button> */}
          </div>
        </div>
      </Card>
    </div>
  );
}