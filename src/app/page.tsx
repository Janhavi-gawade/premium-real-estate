"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  ChevronRight,
  HelpCircle,
  Clock,
  Compass,
  FileCheck,
  TrendingUp,
  Award
} from "lucide-react";
import { getProperties } from "@/lib/db/properties";
import { Property } from "@/types";
import PropertyCard from "@/components/PropertyCard";
import PropertyEnquiryForm from "@/components/forms/PropertyEnquiryForm";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [purpose, setPurpose] = useState("buy");
  const [category, setCategory] = useState("residential");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        const allProps = await getProperties();
        const featured = allProps.filter(p => p.featured);
        // Prioritize featured, and include recently added properties up to 6
        const combined = [...featured, ...allProps.filter(p => !p.featured)];
        setFeaturedProperties(combined.slice(0, 6));
      } catch (err) {
        console.error("Failed to load properties:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const searchUrl = `/properties?purpose=${purpose}&category=${category}${location ? `&location=${encodeURIComponent(location)}` : ''}${bedrooms !== 'All' ? `&bedrooms=${bedrooms}` : ''}`;

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[700px] lg:min-h-[780px] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-[#0A1C33] text-white overflow-hidden">
        
        {/* Background Image with Deep Overlay and Specular Glow */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Architecture in Pune"
            fill
            priority
            className="object-cover opacity-25 scale-105 animate-float duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C33] via-[#0A1C33]/80 to-[#0A1C33]/50" />
          {/* Ambient Radial Glow */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#D71935]/15 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center w-full">
          
          {/* Tagline Badge with Micro-hover & Google Verified Link */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
            <div className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-200 transition-all duration-300 hover:scale-105 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D71935] animate-pulse" />
              <span>{siteConfig.secondaryTagline}</span>
            </div>
            <a
              href={siteConfig.googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 hover:text-white backdrop-blur-md border border-emerald-400/30 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 hover:scale-105"
            >
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Google Verified &bull; Hadapsar, Pune</span>
            </a>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight drop-shadow-sm">
            The Value Behind <br className="hidden sm:inline" />
            <span className="text-white">Every Home</span>{" "}
            <span className="text-[#D71935] underline decoration-[#D71935]/30 underline-offset-8">in Pune</span>
          </h1>

          <p className="text-slate-200 text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Curated residences, luxury penthouses, verified NA plots, and prime commercial investments guided by <strong>Monali Khedekar</strong>.
          </p>

          {/* SEARCH INTERFACE WIDGET */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200 text-slate-800 text-left max-w-4xl mx-auto transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(16,45,80,0.3)]">
            
            {/* Tabs for Buy vs Rent */}
            <div className="flex gap-2 mb-5 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setPurpose("buy")}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                  purpose === "buy"
                    ? "bg-[#102D50] text-white shadow-md shadow-[#102D50]/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Buy Properties
              </button>
              <button
                type="button"
                onClick={() => setPurpose("rent")}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                  purpose === "rent"
                    ? "bg-[#102D50] text-white shadow-md shadow-[#102D50]/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Rent / Lease
              </button>
              <Link
                href="/sell"
                className="ml-auto text-xs sm:text-sm font-semibold text-[#D71935] hover:text-[#B8142C] flex items-center gap-1 self-center hover:translate-x-0.5 transition-transform"
              >
                <span>Sell Property?</span>
                <ChevronRight size={15} />
              </Link>
            </div>

            {/* Filter Inputs Grid with Improved Labels & Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-3 px-3.5 rounded-xl text-sm sm:text-base text-[#102D50] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#102D50] focus:bg-white transition-all"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="plots">Plots & Land</option>
                  <option value="investment">Investment</option>
                </select>
              </div>

              {/* Location in Pune */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Pune Locality
                </label>
                <div className="relative">
                  <MapPin size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Hadapsar, Magarpatta, Kharadi, Baner"
                    className="w-full bg-slate-50 border border-slate-200 py-3 pl-10 pr-3.5 rounded-xl text-sm sm:text-base text-[#102D50] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#102D50] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Bedrooms (BHK) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-3 px-3.5 rounded-xl text-sm sm:text-base text-[#102D50] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#102D50] focus:bg-white transition-all"
                >
                  <option value="All">Any BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4+">4+ BHK / Villa</option>
                </select>
              </div>

              {/* Search CTA Button */}
              <div className="flex items-end">
                <Link
                  href={searchUrl}
                  className="w-full bg-gradient-to-r from-[#D71935] to-[#B8142C] hover:from-[#B8142C] hover:to-[#D71935] text-white py-3 px-4 rounded-xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/search"
                >
                  <Search size={18} className="group-hover/search:scale-110 transition-transform" />
                  <span>Search Properties</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Locality Chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm text-slate-300">
            <span className="text-slate-300 font-medium">Popular Pune Hubs:</span>
            {siteConfig.primeLocations.slice(0, 6).map((loc) => (
              <Link
                key={loc}
                href={`/properties?location=${encodeURIComponent(loc)}`}
                className="bg-white/10 hover:bg-white hover:text-[#102D50] text-white px-3.5 py-1.5 rounded-full transition-all duration-300 border border-white/15 hover:border-white hover:scale-105 hover:shadow-md active:scale-95 font-medium"
              >
                {loc}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 2. CATEGORY QUICK-ENTRY CARDS WITH LARGER READABLE BODY TEXT */}
      <section className="py-20 sm:py-24 bg-slate-50/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#D71935]">
              Real Estate Verticals
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#102D50] mt-2">
              Find Property by Category
            </h2>
            <div className="w-16 h-1 bg-[#D71935] mx-auto mt-3.5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Residential */}
            <Link
              href="/properties?category=residential"
              className="group relative bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-2xl hover:shadow-[#102D50]/12 hover:border-[#102D50] hover:-translate-y-2.5 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#102D50] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#102D50] flex items-center justify-center mb-5 group-hover:bg-[#102D50] group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
                  <Building2 size={28} />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#102D50] mb-2.5 group-hover:text-[#D71935] transition-colors">
                  Residential Homes
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  1, 2, 3, and 4 BHK luxury & budget flats, penthouses, and row houses in Hadapsar, Magarpatta City, Amanora, Kharadi, and Koregaon Park.
                </p>
              </div>
              <span className="text-sm font-bold text-[#D71935] flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                <span>Explore Homes</span>
                <ArrowRight size={16} />
              </span>
            </Link>

            {/* Commercial */}
            <Link
              href="/properties?category=commercial"
              className="group relative bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-2xl hover:shadow-[#D71935]/12 hover:border-[#D71935] hover:-translate-y-2.5 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#D71935] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#D71935] flex items-center justify-center mb-5 group-hover:bg-[#D71935] group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
                  <Compass size={28} />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#102D50] mb-2.5 group-hover:text-[#D71935] transition-colors">
                  Commercial Spaces
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Grade-A office floors, high-street retail shops, and corporate pre-leased assets in Magarpatta Cybercity, Kharadi, and Viman Nagar.
                </p>
              </div>
              <span className="text-sm font-bold text-[#D71935] flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                <span>View Commercial</span>
                <ArrowRight size={16} />
              </span>
            </Link>

            {/* Plots */}
            <Link
              href="/properties?category=plots"
              className="group relative bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:shadow-2xl hover:shadow-emerald-700/12 hover:border-emerald-700 hover:-translate-y-2.5 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-700 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 group-hover:bg-emerald-700 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
                  <MapPin size={28} />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#102D50] mb-2.5 group-hover:text-emerald-700 transition-colors">
                  Plots & Land
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Collector NA sanctioned villa plots and development land parcels in Saswad Road, Shewalwadi, Hadapsar, and Bavdhan.
                </p>
              </div>
              <span className="text-sm font-bold text-emerald-700 flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                <span>Browse Plots</span>
                <ArrowRight size={16} />
              </span>
            </Link>

            {/* Sell Your Property */}
            <Link
              href="/sell"
              className="group relative bg-[#102D50] text-white p-7 rounded-2xl border border-[#102D50] shadow-md hover:shadow-2xl hover:shadow-[#102D50]/30 hover:bg-[#0A1C33] hover:-translate-y-2.5 transition-all duration-500 flex flex-col justify-between"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#D71935] rounded-t-2xl" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#D71935] flex items-center justify-center mb-5 group-hover:bg-[#D71935] group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xs">
                  <Key size={28} />
                </div>
                <h3 className="font-serif font-bold text-2xl text-white mb-2.5">
                  Sell / Rent Owner Portal
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  List your property directly with Monali Khedekar for targeted marketing to pre-screened buyers and corporate tenants.
                </p>
              </div>
              <span className="text-sm font-bold text-white flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                <span>List With Us</span>
                <ArrowRight size={16} />
              </span>
            </Link>

          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#D71935]">
                Curated Collection
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#102D50] mt-2">
                Featured Properties in Pune
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-xl mt-2 leading-relaxed">
                Handpicked listings with verified titles, prime connectivity, and exceptional lifestyle amenities.
              </p>
            </div>

            <Link
              href="/properties"
              className="group/link inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#102D50] hover:text-[#D71935] transition-colors py-2"
            >
              <span className="underline decoration-slate-300 underline-offset-4 group-hover/link:decoration-[#D71935]">
                Explore All Listings
              </span>
              <ArrowRight size={16} className="group-hover/link:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-600 text-sm sm:text-base">No featured properties currently active.</p>
            </div>
          )}

        </div>
      </section>

      {/* 4. WHY CHOOSE ARTH PROPERTIES */}
      <section className="py-24 bg-slate-50/80 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#D71935]">
                Why Arth Properties
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#102D50] mt-2 mb-6 leading-tight">
                Integrity, Micro-Market Depth, & Client Commitment
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
                Real estate is one of the most substantial financial commitments in an individual's lifetime. Under the leadership of <strong>Monali Khedekar</strong>, Arth Properties eliminates ambiguous pricing, biased sales pressure, and unverified promises.
              </p>

              <div className="space-y-4">
                
                {/* Due Diligence Card */}
                <div className="group flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="p-3 rounded-xl bg-red-50 text-[#D71935] flex-shrink-0 group-hover:scale-110 group-hover:bg-[#D71935] group-hover:text-white transition-all duration-300">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base group-hover:text-[#D71935] transition-colors">
                      100% Title Due Diligence
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">
                      Every residential project, villa, or plot undergoes rigorous verification of clear ownership, Sanction Plans, Commencement Certificate (CC), and MahaRERA filings.
                    </p>
                  </div>
                </div>

                {/* Hyper-Local Intelligence Card */}
                <div className="group flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="p-3 rounded-xl bg-blue-50 text-[#102D50] flex-shrink-0 group-hover:scale-110 group-hover:bg-[#102D50] group-hover:text-white transition-all duration-300">
                    <Compass size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base group-hover:text-[#102D50] transition-colors">
                      Hyper-Local Pune Intelligence
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">
                      From Magarpatta Cybercity and Hadapsar expansions to Saswad Road growth corridors and Kharadi IT hubs, we ensure your purchase has proven capital appreciation potential.
                    </p>
                  </div>
                </div>

                {/* Transparent Negotiations Card */}
                <div className="group flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="p-3 rounded-xl bg-slate-100 text-slate-800 flex-shrink-0 group-hover:scale-110 group-hover:bg-slate-800 group-hover:text-white transition-all duration-300">
                    <FileCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base group-hover:text-slate-900 transition-colors">
                      Transparent Negotiations & Registration
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">
                      Direct owner/developer negotiations with zero hidden brokerage markups, stamp duty guidance, and on-site sub-registrar assistance.
                    </p>
                  </div>
                </div>

              </div>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link
                  href="/about"
                  className="bg-[#102D50] hover:bg-[#1A4273] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-7 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  Meet Monali Khedekar
                </Link>
                <a
                  href={`tel:${siteConfig.contact.primaryPhone}`}
                  className="text-sm font-bold text-[#D71935] hover:text-[#B8142C] flex items-center gap-2 py-2 hover:translate-x-1 transition-transform"
                >
                  <Phone size={16} />
                  <span>Call {siteConfig.contact.primaryPhoneDisplay}</span>
                </a>
              </div>
            </div>

            {/* Visual representation - Monali Khedekar */}
            <div className="group relative h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <Image
                src="/monali-khedekar.jpg"
                alt="Monali Khedekar - Founder & Principal Consultant at Arth Properties, Hadapsar, Pune"
                fill
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C33]/95 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 group-hover:border-white/40 transition-colors">
                <p className="font-serif text-2xl font-bold mb-1.5">
                  &ldquo;Your Dream... Our Commitment&rdquo;
                </p>
                <p className="text-sm text-slate-300">
                  Monali Khedekar &bull; Arth Properties, Pune
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HOW THE ASSISTANCE PROCESS WORKS WITH ENLARGED STEP DESCRIPTIONS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#D71935]">
              Seamless Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#102D50] mt-2">
              How Arth Properties Assists You
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Our structured 4-step advisory process delivers clarity from first inquiry to key handover.
            </p>
            <div className="w-16 h-1 bg-[#D71935] mx-auto mt-3.5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="group bg-slate-50/80 hover:bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-[#102D50]/40 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out flex flex-col justify-between">
              <div>
                <span className="font-serif text-4xl font-black text-slate-300 group-hover:text-[#102D50] group-hover:scale-110 block mb-3.5 transition-all duration-300">
                  01
                </span>
                <h3 className="font-serif font-bold text-xl text-[#102D50] mb-2.5 group-hover:text-[#D71935] transition-colors">
                  Requirement Discovery
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We understand your budget, preferred Pune micro-market, Vastu considerations, carpet area preferences, and possession timeline.
                </p>
              </div>
              <div className="w-8 h-1 bg-slate-200 group-hover:w-full group-hover:bg-[#102D50] transition-all duration-500 mt-6 rounded-full" />
            </div>

            {/* Step 2 */}
            <div className="group bg-slate-50/80 hover:bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-[#102D50]/40 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out flex flex-col justify-between">
              <div>
                <span className="font-serif text-4xl font-black text-slate-300 group-hover:text-[#102D50] group-hover:scale-110 block mb-3.5 transition-all duration-300">
                  02
                </span>
                <h3 className="font-serif font-bold text-xl text-[#102D50] mb-2.5 group-hover:text-[#D71935] transition-colors">
                  Escorted Site Visits
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We arrange coordinated, scheduled visits to shortlisted sample flats or site locations with dedicated advisory support.
                </p>
              </div>
              <div className="w-8 h-1 bg-slate-200 group-hover:w-full group-hover:bg-[#102D50] transition-all duration-500 mt-6 rounded-full" />
            </div>

            {/* Step 3 */}
            <div className="group bg-slate-50/80 hover:bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-[#102D50]/40 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out flex flex-col justify-between">
              <div>
                <span className="font-serif text-4xl font-black text-slate-300 group-hover:text-[#102D50] group-hover:scale-110 block mb-3.5 transition-all duration-300">
                  03
                </span>
                <h3 className="font-serif font-bold text-xl text-[#102D50] mb-2.5 group-hover:text-[#D71935] transition-colors">
                  Title & Negotiation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our advisory reviews RERA approvals, title deeds, and developer agreements, negotiating optimal terms on your behalf.
                </p>
              </div>
              <div className="w-8 h-1 bg-slate-200 group-hover:w-full group-hover:bg-[#102D50] transition-all duration-500 mt-6 rounded-full" />
            </div>

            {/* Step 4 */}
            <div className="group bg-slate-50/80 hover:bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-[#D71935]/40 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out flex flex-col justify-between">
              <div>
                <span className="font-serif text-4xl font-black text-[#D71935] group-hover:scale-110 block mb-3.5 transition-all duration-300">
                  04
                </span>
                <h3 className="font-serif font-bold text-xl text-[#102D50] mb-2.5 group-hover:text-[#D71935] transition-colors">
                  Registration & Handover
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Complete assistance through stamp duty challans, sub-registrar document registration, and smooth possession inspection.
                </p>
              </div>
              <div className="w-8 h-1 bg-[#D71935]/40 group-hover:w-full group-hover:bg-[#D71935] transition-all duration-500 mt-6 rounded-full" />
            </div>

          </div>
        </div>
      </section>

      {/* 6. REAL ESTATE ADVISORY & FAQ SECTION WITH ACCESSIBLE TEXT */}
      <section className="py-24 bg-slate-50/80 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Left Column: Direct Consultation Form Card */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-lg hover:shadow-2xl transition-all duration-500">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#D71935]">
                Direct Consultation
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#102D50] mt-1.5 mb-2">
                Connect with Monali Khedekar
              </h3>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed">
                Looking to buy, sell, or rent? Fill in your requirements below and our principal consultant will reach out directly.
              </p>
              <PropertyEnquiryForm />
            </div>

            {/* Right Column: Pune Real Estate FAQs with Large Legible Answers */}
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#D71935]">
                Client Guidance
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#102D50] mt-1.5 mb-8">
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                
                <div className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-l-4 hover:border-l-[#D71935] hover:shadow-lg hover:translate-x-1.5 transition-all duration-300">
                  <h4 className="font-bold text-base text-[#102D50] group-hover:text-[#D71935] mb-2.5 transition-colors">
                    What is the current Stamp Duty and Registration charge in Pune, Maharashtra?
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Under Maharashtra government regulations, residential property registrations in Pune Municipal Corporation (PMC) and PCMC typically attract 7% total stamp duty (including metro cess and local body tax) plus 1% registration fee (capped at ₹30,000). Women homebuyers receive a 1% rebate on stamp duty under applicable state provisions.
                  </p>
                </div>

                <div className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-l-4 hover:border-l-[#D71935] hover:shadow-lg hover:translate-x-1.5 transition-all duration-300">
                  <h4 className="font-bold text-base text-[#102D50] group-hover:text-[#D71935] mb-2.5 transition-colors">
                    Why is MahaRERA verification essential before booking an under-construction flat?
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    MahaRERA registration guarantees that the developer has deposited 70% of project funds in an escrow account solely for construction, possesses sanctioned architectural drawings, and guarantees possession within the legally declared completion date.
                  </p>
                </div>

                <div className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-l-4 hover:border-l-[#D71935] hover:shadow-lg hover:translate-x-1.5 transition-all duration-300">
                  <h4 className="font-bold text-base text-[#102D50] group-hover:text-[#D71935] mb-2.5 transition-colors">
                    Does Arth Properties help with home loans and bank title clearance?
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Yes. We coordinate with leading nationalized and private banks (including SBI, HDFC, ICICI) to facilitate project approval reports, swift home loan sanctions, and competitive interest rates for our clients.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. CONTACT CTA BANNER WITH RADIANT GLOW */}
      <section className="relative bg-gradient-to-br from-[#0A1C33] via-[#102D50] to-[#0A1C33] text-white py-20 sm:py-24 overflow-hidden">
        
        {/* Ambient Red glow in CTA background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D71935]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-sm">
            Ready to Discover Your Next Property in Pune?
          </h2>
          <p className="text-slate-200 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Speak directly with <strong>Monali Khedekar</strong> at Arth Properties. No middle agents, no unsolicited calls, only transparent guidance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            
            {/* Call Action Button */}
            <a
              href={`tel:${siteConfig.contact.primaryPhone}`}
              className="bg-[#D71935] hover:bg-[#B8142C] text-white px-8 py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-red-600/30 hover:scale-105 active:scale-95 flex items-center gap-2.5"
            >
              <Phone size={18} />
              <span>Call {siteConfig.contact.primaryPhoneDisplay}</span>
            </a>

            {/* WhatsApp Action Button */}
            <a
              href={siteConfig.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-8 py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-emerald-600/30 hover:scale-105 active:scale-95 flex items-center gap-2.5"
            >
              <span>Chat on WhatsApp</span>
            </a>

            {/* Catalog Button */}
            <Link
              href="/properties"
              className="bg-white/10 hover:bg-white text-white hover:text-[#102D50] border border-white/20 px-8 py-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Browse Catalog
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}
