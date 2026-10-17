"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phoneNumber = siteConfig.contact.whatsappNumber;
  const defaultMessage = `Hello Arth Properties (Monali Khedekar), I would like to inquire about property opportunities in Pune.`;

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-[#25D366]/50 active:scale-95 animate-pulse-glow ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Chat with Arth Properties on WhatsApp"
    >
      <MessageCircle size={24} className="fill-white text-[#25D366] animate-bounce" />
      <span className="hidden sm:inline font-bold text-sm tracking-wide">WhatsApp Us</span>
    </a>
  );
}
