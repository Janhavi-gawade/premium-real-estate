"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phoneNumber = "+919876543210";
  const defaultMessage = "Hi, I would like to schedule a real estate consultation.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[#25D366]/50 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
