"use client";

import { 
  FiHome, 
  FiUser, 
  FiMessageSquare, 
  FiBell, 
  FiBookmark, 
  FiSettings, 
  FiUsers, 
  FiSearch, 
  FiMenu
} from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Sidebar() {
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
      {/* Desktop Sidebar - Fixed on right side */}
      <div className="hidden md:flex flex-col border-r-4  border-muted-foreground bg-secondary min-w-64 rounded-xl ">
        <div className="flex h-16 items-center border-b-4 border-muted-foreground px-4">
          <h2 className="text-lg font-semibold">Social App</h2>
        </div>
        <nav className="flex flex-col gap-6 p-4 w-full">
          {navItems.map((item) => (
            <div key={item.name} className="flex items-center">
              <item.icon size={28} className="min-w-8" />
              <Button variant="ghost" className="text-xl">
                {item.name}
              </Button>
            </div>
          ))}
          <Button className="w-full mt-4">Add Post</Button>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed right-4 top-4 md:hidden z-50">
            <FiMenu size={28} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 p-0">
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
              <Button className="w-full mt-4">Add Post</Button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}