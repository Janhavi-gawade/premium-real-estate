"use client";

import { properties } from "@/data/mockData";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import { motion } from "framer-motion";

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const property = properties.find((p) => p.id === id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!property) {
    notFound();
  }

  const handleEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Enquiry sent successfully. We will get back to you soon.");
    }, 1500);
  };

  const whatsappMessage = `Hi, I am interested in ${property.name}. I would like to know more about this property.`;

  return (
    <div className="bg-background min-h-screen text-primary selection:bg-[#C8A97E] selection:text-white">
      
      {/* IMMERSIVE HERO */}
      <section className="relative h-screen min-h-[700px] w-full flex flex-col justify-end px-[5%] md:px-[10%] pb-12">
        <div className="absolute inset-0 z-0">
          <Image 
            src={property.image}
            alt={property.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        
        <div className="relative z-10 text-white w-full flex flex-col md:flex-row justify-between items-end border-b border-white/20 pb-12 mb-4">
          <div className="mb-8 md:mb-0">
            <span className="uppercase text-xs tracking-[0.2em] text-[#C8A97E] font-semibold block mb-4">For {property.purpose}</span>
            <h1 className="font-serif text-5xl md:text-8xl leading-tight mb-2">{property.name}</h1>
            <p className="text-xl font-light text-white/80">{property.location}</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-4xl md:text-5xl">{property.price}</p>
          </div>
        </div>
      </section>

      <div className="max-w-[90%] md:max-w-[80%] mx-auto py-24 flex flex-col lg:flex-row gap-16 lg:gap-32">
        
        {/* LEFT COLUMN - CONTENT */}
        <div className="w-full lg:w-2/3">
          
          {/* Overview */}
          <div className="mb-24">
            <h2 className="uppercase text-xs tracking-[0.2em] font-semibold text-gray-400 mb-12">Property Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 border-y border-gray-100 py-12">
              <div>
                <p className="text-gray-400 uppercase text-[10px] tracking-widest mb-2">Bedrooms</p>
                <p className="font-serif text-3xl">{property.bedrooms}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase text-[10px] tracking-widest mb-2">Bathrooms</p>
                <p className="font-serif text-3xl">{property.bathrooms}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase text-[10px] tracking-widest mb-2">Carpet Area</p>
                <p className="font-serif text-xl md:text-2xl pt-1">{property.area}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase text-[10px] tracking-widest mb-2">Type</p>
                <p className="font-serif text-xl md:text-2xl pt-1">{property.type}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-24">
            <h2 className="font-serif text-3xl md:text-5xl mb-8 leading-tight">A space designed for <br/> uncompromising living.</h2>
            <p className="text-gray-500 text-lg md:text-xl font-light leading-relaxed">
              {property.description} {property.description} This exceptional residence offers a rare combination of location, luxury, and lifestyle. Every detail has been carefully considered to create an environment that feels both expansive and intimate.
            </p>
          </div>

          {/* Gallery Placeholder */}
          <div className="mb-24 space-y-8">
            <div className="relative h-[60vh] w-full overflow-hidden hover-trigger-image">
              <Image src={property.image} alt="Gallery 1" fill className="object-cover" />
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-24 border-t border-gray-100 pt-16">
            <h2 className="uppercase text-xs tracking-[0.2em] font-semibold text-gray-400 mb-12">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#C8A97E] mr-4" />
                  <span className="font-light text-lg">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - STICKY FORM */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-32 bg-[#F9F8F6] p-8 md:p-12 border border-gray-200">
            <h3 className="font-serif text-3xl mb-4">Interested in this property?</h3>
            <p className="text-gray-500 font-light text-sm mb-8">Leave your details and our team will get back to you with more information and floor plans.</p>
            
            <form onSubmit={handleEnquiry} className="space-y-6">
              <div>
                <input type="text" placeholder="Full Name" required className="w-full border-b border-gray-300 py-3 bg-transparent focus:outline-none focus:border-[#C8A97E]" />
              </div>
              <div>
                <input type="tel" placeholder="Phone Number" required className="w-full border-b border-gray-300 py-3 bg-transparent focus:outline-none focus:border-[#C8A97E]" />
              </div>
              <div>
                <input type="email" placeholder="Email Address" required className="w-full border-b border-gray-300 py-3 bg-transparent focus:outline-none focus:border-[#C8A97E]" />
              </div>
              <div>
                <textarea placeholder="Message" rows={3} className="w-full border-b border-gray-300 py-3 bg-transparent focus:outline-none focus:border-[#C8A97E] resize-none" defaultValue={`I am interested in ${property.name}.`}></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-background py-5 uppercase text-xs tracking-[0.2em] font-semibold hover:bg-[#C8A97E] transition-colors mt-4 disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Request Details"}
              </button>
            </form>

            <div className="mt-6 flex flex-col space-y-4">
              <a 
                href={`https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-primary text-primary py-4 text-center uppercase text-xs tracking-[0.2em] font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                WhatsApp Us
              </a>
              <a 
                href="tel:+919876543210"
                className="w-full border border-gray-300 text-gray-500 py-4 text-center uppercase text-xs tracking-[0.2em] font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                Call Advisor
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
