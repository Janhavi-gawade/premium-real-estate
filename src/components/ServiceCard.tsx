"use client";

import { motion } from "framer-motion";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
  };
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group p-8 border border-gray-100 bg-white hover:bg-primary hover:text-background transition-all duration-500"
    >
      <div className="text-4xl font-serif text-gray-200 group-hover:text-[#C8A97E]/30 mb-6 transition-colors">
        {service.id}
      </div>
      <h3 className="text-xl font-serif mb-4 text-primary group-hover:text-[#C8A97E] transition-colors">
        {service.title}
      </h3>
      <p className="text-gray-600 group-hover:text-gray-400 font-light leading-relaxed transition-colors">
        {service.description}
      </p>
      <div className="mt-8 w-12 h-[1px] bg-[#C8A97E] group-hover:w-24 transition-all duration-500" />
    </motion.div>
  );
}
