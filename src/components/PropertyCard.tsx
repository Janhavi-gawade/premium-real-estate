"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    type: string;
    location: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    description: string;
    image: string;
    featured: boolean;
  };
  index?: number;
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-white border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
    >
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={property.image}
          alt={property.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {property.featured && (
          <div className="absolute top-4 left-4 bg-primary text-background text-xs uppercase tracking-widest px-3 py-1">
            Featured
          </div>
        )}
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-4 py-2 font-serif text-lg text-primary">
          {property.price}
        </div>
      </div>

      <div className="p-6">
        <div className="text-sm text-[#C8A97E] font-medium tracking-wider uppercase mb-2">
          {property.type}
        </div>
        <Link href={`/properties/${property.id}`}>
          <h3 className="font-serif text-2xl text-primary mb-2 hover:text-[#C8A97E] transition-colors">
            {property.name}
          </h3>
        </Link>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={16} className="mr-2" />
          {property.location}
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-6">
          {property.description}
        </p>

        <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 mb-6">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Bed size={20} className="mb-1 text-[#C8A97E]" />
            <span className="text-xs">{property.bedrooms} Beds</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-500 border-x border-gray-100">
            <Bath size={20} className="mb-1 text-[#C8A97E]" />
            <span className="text-xs">{property.bathrooms} Baths</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Square size={20} className="mb-1 text-[#C8A97E]" />
            <span className="text-xs">{property.area}</span>
          </div>
        </div>

        <Link
          href={`/properties/${property.id}`}
          className="block w-full text-center border border-primary text-primary py-3 text-sm uppercase tracking-widest hover:bg-primary hover:text-background transition-colors"
        >
          View Property
        </Link>
      </div>
    </motion.div>
  );
}
