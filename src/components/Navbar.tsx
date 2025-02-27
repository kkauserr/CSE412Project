"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex items-center">
      {/* Logo */}
      <Link href="/" className="text-green-700 text-2xl font-bold">
        PetAdopt 🐾
      </Link>

      {/* Desktop Navigation + Button */}
      <div className="hidden md:flex items-center space-x-6 ml-auto">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-6">
            <NavigationMenuItem>
              <Link href="/" className="text-green-600 hover:text-green-800">Home</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" className="text-green-600 hover:text-green-800">About</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/adopt" className="text-green-600 hover:text-green-800">Adopt</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" className="text-green-600 hover:text-green-800">Contact</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Sign In Button */}
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Sign In
        </Button>
      </div>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden ml-auto">
            <Menu className="w-6 h-6 text-green-700" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-white p-6">
          <div className="flex flex-col space-y-6">
            <Link href="/" className="text-green-600 text-lg" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/about" className="text-green-600 text-lg" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="/adopt" className="text-green-600 text-lg" onClick={() => setIsOpen(false)}>Adopt</Link>
            <Link href="/contact" className="text-green-600 text-lg" onClick={() => setIsOpen(false)}>Contact</Link>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Sign In</Button>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}