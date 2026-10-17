"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone, MessageSquare, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isHeroLightPage = pathname === "/";
  const useTransparentDarkStyle = isHeroLightPage && !isScrolled && !isMenuOpen;

  // Do not render public navbar on admin dashboard pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          useTransparentDarkStyle
            ? "bg-transparent py-5 text-white"
            : "bg-white/95 backdrop-blur-md py-3.5 border-b border-slate-200/90 text-[#102D50] shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <BrandLogo
              variant={useTransparentDarkStyle ? "light" : "dark"}
              showTagline={false}
              size="md"
            />

            {/* Desktop Navigation Links with Animated Sliding Underline Hover Effect */}
            <div className="hidden lg:flex items-center gap-8">
              {siteConfig.navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`group relative text-sm font-medium tracking-wide py-1.5 transition-colors duration-300 ${
                      isActive
                        ? "text-[#D71935] font-semibold"
                        : useTransparentDarkStyle
                        ? "text-slate-200 hover:text-white"
                        : "text-slate-700 hover:text-[#102D50]"
                    }`}
                  >
                    <span>{link.name}</span>
                    
                    {/* Animated Sliding Underline on Hover */}
                    <span 
                      className={`absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300 ease-out ${
                        isActive
                          ? "w-full bg-[#D71935]"
                          : "w-0 bg-[#D71935] group-hover:w-full"
                      }`} 
                    />
                  </Link>
                );
              })}
            </div>

            {/* Desktop Quick Actions */}
            <div className="hidden md:flex items-center gap-3">
              
              {/* Call Link */}
              <a
                href={`tel:${siteConfig.contact.primaryPhone}`}
                className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 ${
                  useTransparentDarkStyle
                    ? "border-white/30 text-white hover:bg-white/10 hover:border-white"
                    : "border-slate-300 text-[#102D50] hover:bg-slate-50 hover:border-[#102D50]/40"
                }`}
                title="Call Monali Khedekar"
              >
                <Phone size={14} className="text-[#D71935]" />
                <span>{siteConfig.contact.primaryPhoneDisplay}</span>
              </a>

              {/* Sell Property CTA Button with Gradient & Scale on Hover */}
              <Link
                href="/sell"
                className="group bg-gradient-to-r from-[#D71935] to-[#B8142C] hover:from-[#B8142C] hover:to-[#D71935] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-red-600/30 hover:scale-105 active:scale-95 flex items-center gap-1.5"
              >
                <span>Sell Property</span>
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {/* Admin Dashboard Link */}
              <Link
                href="/admin"
                className={`text-[11px] font-semibold tracking-wider uppercase px-2 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 ${
                  useTransparentDarkStyle
                    ? "text-white/60 hover:text-white hover:bg-white/10"
                    : "text-slate-400 hover:text-[#102D50] hover:bg-slate-100"
                }`}
                title="Admin Dashboard"
              >
                Admin
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={`tel:${siteConfig.contact.primaryPhone}`}
                className="p-2 rounded-xl bg-[#D71935] text-white shadow-sm hover:scale-105 active:scale-95 transition-transform"
                aria-label="Call Arth Properties"
              >
                <Phone size={18} />
              </a>

              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-xl transition-all ${
                  useTransparentDarkStyle
                    ? "text-white hover:bg-white/10"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                aria-label="Toggle Navigation Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 text-[#102D50] px-6 py-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex flex-col gap-4">
              <div className="pb-3 border-b border-slate-100">
                <BrandLogo variant="dark" showTagline={true} size="sm" />
              </div>

              <div className="flex flex-col gap-2">
                {siteConfig.navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`py-2 text-base font-medium transition-colors ${
                      pathname === link.href
                        ? "text-[#D71935] font-semibold"
                        : "text-slate-700 hover:text-[#102D50]"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Direct Broker Assistance:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${siteConfig.contact.primaryPhone}`}
                    className="flex items-center justify-center gap-2 bg-[#102D50] text-white py-2.5 px-3 rounded-xl text-xs font-semibold shadow-xs"
                  >
                    <Phone size={14} />
                    <span>{siteConfig.contact.primaryPhone}</span>
                  </a>
                  <a
                    href={`tel:${siteConfig.contact.alternatePhone}`}
                    className="flex items-center justify-center gap-2 border border-slate-300 text-[#102D50] py-2.5 px-3 rounded-xl text-xs font-semibold"
                  >
                    <Phone size={14} />
                    <span>{siteConfig.contact.alternatePhone}</span>
                  </a>
                </div>

                <a
                  href={siteConfig.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-sm font-semibold shadow-md active:scale-95 transition-transform"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp Monali Khedekar</span>
                </a>

                <Link
                  href="/admin"
                  className="text-center text-xs text-slate-500 hover:text-[#102D50] pt-1"
                >
                  Admin Portal Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
