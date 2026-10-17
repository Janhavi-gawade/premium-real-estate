"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Square, MapPin, ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Property } from "@/types";
import { formatIndianPrice, formatArea } from "@/lib/utils/formatters";
import { siteConfig } from "@/config/site";

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const isSold = property.status === "sold";
  const isRented = property.status === "rented";

  const coverImage = property.images && property.images.length > 0
    ? property.images[0]
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";

  const formattedPrice = property.price_label || formatIndianPrice(property.price, property.transaction_type);

  const whatsappMsg = `Hello Arth Properties, I am interested in "${property.title}" in ${property.location} (${formattedPrice}). Please share more details.`;
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  const detailUrl = `/properties/${property.slug || property.id}`;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-2xl hover:shadow-[#102D50]/12 hover:-translate-y-2 hover:border-[#102D50]/30 transition-all duration-500 ease-out flex flex-col h-full">
      
      {/* Top Accent Line on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#102D50] via-[#D71935] to-[#102D50] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

      {/* Cover Image & Badges */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
        <Link href={detailUrl} className="block w-full h-full relative">
          <Image
            src={coverImage}
            alt={property.title}
            fill
            unoptimized={coverImage.startsWith("data:")}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Luxury vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2 z-10">
          <span className="bg-[#102D50]/90 backdrop-blur-md text-white text-[11.5px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-xs border border-white/10 group-hover:translate-x-0.5 transition-transform duration-300">
            For {property.transaction_type === "buy" ? "Sale" : "Rent"}
          </span>
          <span className="bg-white/95 text-slate-800 text-[11.5px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg backdrop-blur-md shadow-xs border border-slate-200/80 group-hover:translate-x-0.5 transition-transform duration-300">
            {property.category}
          </span>
          {property.featured && (
            <span className="bg-gradient-to-r from-[#D71935] to-[#B8142C] text-white text-[11.5px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 group-hover:scale-105 transition-transform duration-300">
              <Sparkles size={12} className="text-amber-200" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3.5 right-3.5 z-10">
          {isSold ? (
            <span className="bg-red-600/95 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md backdrop-blur-xs">
              Sold Out
            </span>
          ) : isRented ? (
            <span className="bg-amber-600/95 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md backdrop-blur-xs">
              Rented Out
            </span>
          ) : (
            <span className="bg-emerald-600/95 text-white text-xs font-semibold tracking-wide px-3 py-1.5 rounded-lg shadow-md backdrop-blur-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Available</span>
            </span>
          )}
        </div>

        {/* Price Tag Overlay with Micro-scale on Hover */}
        <div className="absolute bottom-3.5 right-3.5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-200/80 group-hover:scale-105 group-hover:border-[#102D50]/30 transition-all duration-300">
          <p className="font-serif font-black text-xl text-[#102D50] leading-none group-hover:text-[#D71935] transition-colors duration-300">
            {formattedPrice}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Location */}
        <div className="flex items-center text-slate-500 text-sm font-medium mb-2.5 group/loc">
          <MapPin size={15} className="text-[#D71935] mr-1.5 flex-shrink-0 group-hover/loc:scale-110 transition-transform" />
          <span className="truncate">{property.location}</span>
          {property.landmark && (
            <span className="text-slate-400 ml-1.5 truncate">({property.landmark})</span>
          )}
        </div>

        {/* Title */}
        <Link href={detailUrl} className="block mb-3">
          <h3 className="font-serif font-bold text-xl text-[#102D50] leading-snug line-clamp-2 group-hover:text-[#D71935] transition-colors duration-300">
            {property.title}
          </h3>
        </Link>

        {/* Description snippet with generous readable text-sm and leading-relaxed */}
        <p className="text-slate-600 text-sm line-clamp-2 mb-5 leading-relaxed flex-grow">
          {property.description}
        </p>

        {/* Key Specs Row with Larger Font Sizes */}
        <div className="grid grid-cols-3 gap-2 py-3.5 border-t border-b border-slate-100 text-sm text-slate-800 mb-6 bg-slate-50/80 -mx-6 px-6 group-hover:bg-slate-100/60 transition-colors duration-300">
          {property.bedrooms > 0 ? (
            <div className="flex items-center gap-2 hover:text-[#102D50] transition-colors" title="Bedrooms">
              <Bed size={17} className="text-[#102D50] flex-shrink-0" />
              <span className="font-semibold">{property.bedrooms} BHK</span>
            </div>
          ) : (
            <div className="flex items-center gap-2" title="Category">
              <span className="text-slate-500 capitalize">{property.category}</span>
            </div>
          )}

          {property.bathrooms > 0 ? (
            <div className="flex items-center gap-2 hover:text-[#102D50] transition-colors" title="Bathrooms">
              <Bath size={17} className="text-[#102D50] flex-shrink-0" />
              <span>{property.bathrooms} Baths</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Clear Title</span>
            </div>
          )}

          <div className="flex items-center gap-2 hover:text-[#102D50] transition-colors" title="Carpet Area">
            <Square size={16} className="text-[#102D50] flex-shrink-0" />
            <span className="font-medium truncate">{formatArea(property.carpet_area)}</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center gap-3 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 border border-emerald-500/80 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-md hover:shadow-emerald-600/25 rounded-xl text-sm font-semibold active:scale-95 transition-all duration-300"
            title="Inquire on WhatsApp"
          >
            <MessageCircle size={16} className="fill-current text-inherit" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <Link
            href={detailUrl}
            className="flex-grow flex items-center justify-center gap-2 bg-gradient-to-r from-[#102D50] to-[#1A4273] hover:from-[#1A4273] hover:to-[#102D50] text-white py-3 px-4 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-[#102D50]/20 active:scale-[0.98] transition-all duration-300 group/btn"
          >
            <span>View Details</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
