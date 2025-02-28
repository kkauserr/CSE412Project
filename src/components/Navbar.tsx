"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide navbar when scrolling down
      } else {
        setIsVisible(true); // Show navbar when scrolling up
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  return (
    <nav
      className={`w-full bg-white shadow-md py-4 px-6 flex items-center fixed top-0 left-0 right-0 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="text-green-700 text-2xl font-bold">
        PetAdopt 🐾
      </Link>

      {/* Desktop Navigation + Button */}
      <div className="hidden md:flex items-center space-x-6 ml-auto">
        <Link href="#about" className="text-green-600 hover:text-green-800">About</Link>
        <Link href="#adopt" className="text-green-600 hover:text-green-800">Adopt</Link>
        <Link href="#contact" className="text-green-600 hover:text-green-800">Contact</Link>
        <Button className="bg-green-600 hover:bg-green-700 text-white">Sign In</Button>
      </div>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden ml-auto">
            <Menu className="w-6 h-6 text-green-700" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-white p-6">
          <div className="flex flex-col space-y-6">
            <Link href="#about" className="text-green-600 text-lg" onClick={() => setIsOpen(false)}>About</Link>
            <Link href="#adopt" className="text-green-600 text-lg" onClick={() => setIsOpen(false)}>Adopt</Link>
            <Link href="#contact" className="text-green-600 text-lg" onClick={() => setIsOpen(false)}>Contact</Link>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Sign In</Button>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}