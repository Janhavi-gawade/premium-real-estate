"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Do not render public footer on admin dashboard pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#0A1C33] text-white pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & Bio */}
          <div className="lg:col-span-2">
            <BrandLogo variant="light" showTagline={true} size="lg" className="mb-4" />
            <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-sm">
              Led by <strong className="text-white">Monali Khedekar</strong>, Arth Properties delivers transparent, value-driven real estate brokerage services across Pune.
            </p>
            <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5 max-w-sm">
              <ShieldCheck size={18} className="text-[#D71935] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">RERA Compliance Note</span>
                <span>{siteConfig.rera.statusNotice}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4 tracking-wide border-b border-slate-800 pb-2">
              Browse
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Home</Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">All Properties</Link>
              </li>
              <li>
                <Link href="/properties?purpose=buy" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Buy Property</Link>
              </li>
              <li>
                <Link href="/properties?purpose=rent" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Rent Property</Link>
              </li>
              <li>
                <Link href="/sell" className="text-white hover:text-[#D71935] hover:translate-x-1 transition-all duration-200 inline-block font-semibold">Sell Your Property</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Prime Localities */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4 tracking-wide border-b border-slate-800 pb-2">
              Pune Prime Areas
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {siteConfig.primeLocations.slice(0, 7).map((loc) => (
                <li key={loc}>
                  <Link
                    href={`/properties?location=${encodeURIComponent(loc)}`}
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{loc}</span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D71935]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4 tracking-wide border-b border-slate-800 pb-2">
              Contact Monali Khedekar
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <Phone size={15} className="mt-0.5 text-[#D71935] flex-shrink-0" />
                <div>
                  <a href={`tel:${siteConfig.contact.primaryPhone}`} className="hover:text-white block font-medium">
                    {siteConfig.contact.primaryPhoneDisplay}
                  </a>
                  <a href={`tel:${siteConfig.contact.alternatePhone}`} className="hover:text-white block text-slate-400">
                    {siteConfig.contact.alternatePhoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={15} className="mt-0.5 text-[#D71935] flex-shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white break-all">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 text-[#D71935] flex-shrink-0" />
                <div className="leading-relaxed">
                  <span>{siteConfig.contact.address.display}</span>
                  <a
                    href={siteConfig.googleBusinessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-[#D71935] hover:text-white transition-colors font-semibold"
                  >
                    <span>View on Google Maps / Business Profile</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            &copy; {currentYear} {siteConfig.name}. All rights reserved. &bull; Pune, Maharashtra
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/admin" className="text-slate-500 hover:text-slate-300 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
