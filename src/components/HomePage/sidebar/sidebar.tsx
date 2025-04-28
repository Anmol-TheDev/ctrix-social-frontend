"use client";

import { useState } from "react";
import { 
  FiHome, 
  FiUser, 
  FiMessageSquare, 
  FiBell, 
  FiBookmark, 
  FiSettings, 
  FiUsers, 
  FiSearch, 
  FiMenu, 
  FiX 
} from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Home", icon: FiHome },
    { name: "Profile", icon: FiUser },
    { name: "Messages", icon: FiMessageSquare },
    { name: "Notifications", icon: FiBell },
    { name: "Bookmarks", icon: FiBookmark },
    { name: "Friends", icon: FiUsers },
    { name: "Search", icon: FiSearch },
    { name: "Settings", icon: FiSettings },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <FiMenu size={28} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-full flex-col bg-white">
            <div className="flex h-16 items-center border-b px-4">
              <h2 className="text-lg font-semibold">Social App</h2>
            </div>
            <nav className="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <Button 
                  key={item.name} 
                  variant="ghost" 
                  className="justify-start"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex min-h-screen">
        <div
          className={cn(
            "flex h-screen flex-col border-r bg-secondary transition-all duration-300",
            collapsed ? "w-16" : "w-64"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-4">
            {!collapsed && <h2 className="text-lg font-semibold">Social App</h2>}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCollapsed(!collapsed)}
              className={collapsed ? "mx-auto" : ""}
            >
              {collapsed ? <FiMenu className="h-5 w-5" /> : <FiX className="h-5 w-5" />}
            </Button>
          </div>
          <nav className="flex flex-col gap-6  p-4 w-full items-start ">
            {navItems.map((item) => (
             <div key={item.name}  className="flex items-center">
               <item.icon size={28}/>
               <Button 
                variant="ghost" 
                className={`text-2xl ${!collapsed ? "block": "hidden"}`}
              >
                { item.name}
              </Button>
             </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
