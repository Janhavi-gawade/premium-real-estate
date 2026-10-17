"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  Building2,
  Sparkles,
  ChevronRight,
  Info
} from "lucide-react";
import { getPropertyBySlugOrId, getProperties } from "@/lib/db/properties";
import { Property } from "@/types";
import { formatIndianPrice, formatArea } from "@/lib/utils/formatters";
import PropertyCard from "@/components/PropertyCard";
import VisitRequestModal from "@/components/forms/VisitRequestModal";
import PropertyEnquiryForm from "@/components/forms/PropertyEnquiryForm";
import { siteConfig } from "@/config/site";

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const found = await getPropertyBySlugOrId(id);
        if (found) {
          setProperty(found);
          const all = await getProperties({ category: found.category });
          setSimilarProperties(all.filter(p => p.id !== found.id).slice(0, 3));
        } else {
          setProperty(null);
        }
      } catch (err) {
        console.error("Failed to load property:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#102D50] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    notFound();
  }

  const isSold = property.status === "sold";
  const isRented = property.status === "rented";
  const isAvailable = property.status === "available";

  const formattedPrice = property.price_label || formatIndianPrice(property.price, property.transaction_type);

  const images = property.images && property.images.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const whatsappMsg = `Hello Monali Khedekar, I am interested in viewing "${property.title}" in ${property.location} (${formattedPrice}). Please share the brochure and schedule a visit.`;
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      
      {/* Top Breadcrumb & Share */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          href="/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#102D50] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Catalogue</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#102D50] bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
        >
          <Share2 size={14} />
          <span>{isCopied ? "Link Copied!" : "Share Listing"}</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO TITLE & PRICE BAR */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[#102D50] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                For {property.transaction_type === "buy" ? "Sale" : "Rent"}
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded">
                {property.category}
              </span>
              {isSold ? (
                <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                  Sold Out
                </span>
              ) : isRented ? (
                <span className="bg-amber-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                  Leased / Rented
                </span>
              ) : (
                <span className="bg-emerald-600 text-white text-xs font-semibold tracking-wide px-3 py-1 rounded">
                  Available
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#102D50] leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center text-slate-500 text-sm mt-1.5">
              <MapPin size={16} className="text-[#D71935] mr-1.5 flex-shrink-0" />
              <span>{property.location}</span>
              {property.landmark && (
                <span className="text-slate-400 ml-1.5">({property.landmark})</span>
              )}
            </div>
          </div>

          <div className="md:text-right flex flex-col items-start md:items-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Asking Price
            </span>
            <div className="font-serif font-black text-3xl sm:text-4xl text-[#102D50]">
              {formattedPrice}
            </div>
            {property.transaction_type === "buy" && property.carpet_area > 0 && (
              <span className="text-xs text-slate-400 mt-0.5">
                Approx. ₹{Math.round(property.price / property.carpet_area).toLocaleString("en-IN")} / sq.ft. carpet
              </span>
            )}
          </div>
        </div>

        {/* IMAGE GALLERY SECTION */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-8">
          {/* Main Large Image */}
          <div className="relative h-[340px] sm:h-[480px] lg:h-[540px] w-full rounded-xl overflow-hidden bg-slate-100">
            <Image
              src={images[activeImageIndex]}
              alt={`${property.title} - Photo ${activeImageIndex + 1}`}
              fill
              priority
              unoptimized={Boolean(images[activeImageIndex]?.startsWith("data:"))}
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? "border-[#D71935] scale-105 shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    unoptimized={Boolean(img?.startsWith("data:"))}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MAIN BODY: 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLUMNS: SPECIFICATIONS, DESCRIPTION, AMENITIES */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Specs Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#102D50] mb-4 pb-3 border-b border-slate-100">
                Key Property Specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-800">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Carpet Area
                  </span>
                  <div className="flex items-center gap-2">
                    <Square size={18} className="text-[#102D50]" />
                    <span className="font-bold text-sm sm:text-base">{formatArea(property.carpet_area)}</span>
                  </div>
                </div>

                {property.built_up_area && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                      Built-Up Area
                    </span>
                    <div className="flex items-center gap-2">
                      <Square size={18} className="text-[#102D50]" />
                      <span className="font-bold text-sm sm:text-base">{formatArea(property.built_up_area)}</span>
                    </div>
                  </div>
                )}

                {property.bedrooms > 0 && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                      Bedrooms
                    </span>
                    <div className="flex items-center gap-2">
                      <Bed size={18} className="text-[#102D50]" />
                      <span className="font-bold text-sm sm:text-base">{property.bedrooms} BHK</span>
                    </div>
                  </div>
                )}

                {property.bathrooms > 0 && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                      Bathrooms
                    </span>
                    <div className="flex items-center gap-2">
                      <Bath size={18} className="text-[#102D50]" />
                      <span className="font-bold text-sm sm:text-base">{property.bathrooms} Baths</span>
                    </div>
                  </div>
                )}

                {property.furnishing_status && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                      Furnishing
                    </span>
                    <span className="font-bold text-sm sm:text-base capitalize">
                      {property.furnishing_status.replace("-", " ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="font-serif font-bold text-2xl text-[#102D50] mb-4 pb-3 border-b border-slate-100">
                Detailed Overview
              </h3>
              <div className="prose prose-slate max-w-none text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </div>
            </div>

            {/* Amenities & Features */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h3 className="font-serif font-bold text-2xl text-[#102D50] mb-4 pb-3 border-b border-slate-100">
                  Society Amenities & Infrastructure
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {property.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-sm font-semibold text-slate-800"
                    >
                      <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance & Due Diligence Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex items-start gap-4 shadow-md">
              <ShieldCheck size={32} className="text-[#D71935] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-bold text-xl mb-1.5">
                  Arth Properties Title & RERA Due Diligence
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  Under the stewardship of Monali Khedekar, this property has been vetted for clear title chain, municipal sanction plans, and commencement certificate status.
                </p>
                <div className="text-xs text-slate-400">
                  &bull; Complete legal verification documents are made available to prospective buyers prior to earnest money deposit.
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 1 COLUMN: INTERACTIVE ACTIONS & ENQUIRY BOX */}
          <div className="space-y-6">
            
            {/* Quick Action Box */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-lg sticky top-28">
              <h3 className="font-serif font-bold text-2xl text-[#102D50] mb-1.5">
                Direct Broker Connect
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Consult with <strong>Monali Khedekar</strong> regarding this listing.
              </p>

              {/* Status Alert if Sold/Rented */}
              {!isAvailable && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 mb-4 flex items-center gap-2">
                  <Info size={16} className="flex-shrink-0" />
                  <span>This listing is currently {property.status}. Similar properties are available in {property.location}.</span>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {/* Schedule Visit Modal Trigger with Gradient & Hover Lift */}
                <button
                  type="button"
                  onClick={() => setIsVisitModalOpen(true)}
                  className="w-full bg-gradient-to-r from-[#D71935] to-[#B8142C] hover:from-[#B8142C] hover:to-[#D71935] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar size={16} />
                  <span>Schedule Site Visit</span>
                </button>

                {/* Direct WhatsApp with Glow */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} className="fill-white text-[#25D366]" />
                  <span>WhatsApp Monali Khedekar</span>
                </a>

                {/* Direct Call with Hover Lift */}
                <a
                  href={`tel:${siteConfig.contact.primaryPhone}`}
                  className="w-full bg-[#102D50] hover:bg-[#1A4273] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow hover:shadow-lg hover:shadow-[#102D50]/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  <span>Call {siteConfig.contact.primaryPhoneDisplay}</span>
                </a>
              </div>

              {/* Instant Inline Enquiry Form */}
              <div className="pt-6 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Or Send An Instant Callback Request:
                </span>
                <PropertyEnquiryForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                />
              </div>
            </div>

          </div>

        </div>

        {/* SIMILAR PROPERTIES SECTION */}
        {similarProperties.length > 0 && (
          <div className="mt-20 pt-16 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#D71935]">
                  Related Options
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#102D50] mt-1">
                  Similar Properties in Pune
                </h3>
              </div>
              <Link
                href="/properties"
                className="text-xs font-bold uppercase tracking-wider text-[#102D50] hover:text-[#D71935] flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((simProp) => (
                <PropertyCard key={simProp.id} property={simProp} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* VISIT REQUEST MODAL */}
      <VisitRequestModal
        property={property}
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
      />

    </div>
  );
}
