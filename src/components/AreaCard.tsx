"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface AreaCardProps {
  area: {
    name: string;
    count: number;
    image: string;
  };
  index: number;
}

export default function AreaCard({ area, index }: AreaCardProps) {
  return (
    <Link href={`/properties?location=${area.name}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative h-64 overflow-hidden"
      >
        <Image
          src={area.image}
          alt={area.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300" />
        
        <div className="absolute bottom-6 left-6 right-6">
          <h4 className="text-white font-serif text-xl mb-1 group-hover:text-[#C8A97E] transition-colors">
            {area.name}
          </h4>
          <p className="text-gray-300 text-sm font-light uppercase tracking-widest">
            {area.count} Properties
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
