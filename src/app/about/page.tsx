"use client";

import Image from "next/image";
import Link from "next/link";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/mockData";
import { motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";

function StaggeredText({ text, className }: { text: string, className?: string }) {
  const words = text.split(" ");
  return (
    <motion.div 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-100px" }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className={className}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] pb-2">
          <motion.span
            variants={{
              hidden: { y: "100%" },
              visible: { y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="pt-48 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center mb-32 max-w-4xl mx-auto">
          <p className="text-[#C8A97E] uppercase tracking-[0.2em] text-sm font-semibold mb-8">About Us</p>
          <StaggeredText 
            text="Experience That Helps You Make Better Property Decisions." 
            className="font-serif text-5xl md:text-7xl text-primary leading-tight" 
          />
        </div>

        {/* Broker Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative h-[600px] w-full">
            <Image 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
              alt="Professional Broker"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-4xl text-primary mb-6">Arjun Kapoor</h2>
            <p className="uppercase text-sm tracking-widest text-[#C8A97E] font-semibold mb-8">Principal Advisor</p>
            
            <div className="space-y-6 text-gray-600 font-light text-lg leading-relaxed mb-10">
              <p>
                With over a decade of experience in the luxury real estate market, Arjun has built a reputation for providing honest, data-driven, and personalized property advice.
              </p>
              <p>
                His approach goes beyond simply showing properties; it's about understanding the unique lifestyle requirements and investment goals of each client to find the perfect match.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-8 mb-10">
              <div>
                <p className="font-serif text-4xl text-primary mb-1">12+</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Years Experience</p>
              </div>
              <div>
                <p className="font-serif text-4xl text-primary mb-1">₹500Cr+</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Sales Volume</p>
              </div>
            </div>
            
            <MagneticButton href="/contact" className="inline-block bg-primary text-background px-8 py-4 uppercase text-xs tracking-[0.2em] hover:bg-[#C8A97E] transition-colors">
              Schedule a Meeting
            </MagneticButton>
          </div>
        </div>

        {/* Approach */}
        <div className="bg-white p-12 md:p-24 border border-gray-100 mb-32 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-primary mb-12">Our Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-serif text-xl text-primary mb-4">Curated Selection</h3>
              <p className="text-gray-500 font-light">We only present properties that meet our strict criteria for quality, location, and value potential.</p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-primary mb-4">Transparent Process</h3>
              <p className="text-gray-500 font-light">Clear communication and honest advice at every step of the transaction, with no hidden surprises.</p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-primary mb-4">Long-term Vision</h3>
              <p className="text-gray-500 font-light">We focus on building lasting relationships and helping clients build wealth through smart real estate decisions.</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-primary mb-4">Client Experiences</h2>
            <p className="text-gray-500">Don't just take our word for it.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 border border-gray-100 relative pt-12">
                <Quote className="absolute top-6 left-8 text-[#C8A97E]/20 w-12 h-12" />
                <p className="text-gray-600 font-light italic mb-8 relative z-10 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <p className="uppercase text-xs tracking-widest font-semibold text-primary">
                  — {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
