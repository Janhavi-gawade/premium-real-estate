"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Inquiry sent successfully. Our team will contact you shortly.");
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column - Info */}
          <div>
            <p className="text-[#C8A97E] uppercase tracking-widest text-sm font-semibold mb-4">Contact Us</p>
            <h1 className="font-serif text-4xl md:text-6xl text-primary mb-8 leading-tight">
              Let's Find Your Next Property.
            </h1>
            <p className="text-gray-500 font-light text-lg mb-12 max-w-md">
              Whether you are looking to buy, sell, rent, or invest, our team of experts is ready to assist you.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start">
                <MapPin size={24} className="text-[#C8A97E] mr-6 flex-shrink-0" />
                <div>
                  <h4 className="font-serif text-xl text-primary mb-2">Office Address</h4>
                  <p className="text-gray-500 font-light leading-relaxed">
                    Level 4, Business Bay, <br />
                    Koregaon Park, Pune, <br />
                    Maharashtra 411001
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone size={24} className="text-[#C8A97E] mr-6 flex-shrink-0" />
                <div>
                  <h4 className="font-serif text-xl text-primary mb-2">Contact Details</h4>
                  <p className="text-gray-500 font-light mb-1">
                    <a href="tel:+919876543210" className="hover:text-primary transition-colors">+91 98765 43210</a>
                  </p>
                  <p className="text-gray-500 font-light">
                    <a href="mailto:contact@prestigerealestate.com" className="hover:text-primary transition-colors">contact@prestigerealestate.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock size={24} className="text-[#C8A97E] mr-6 flex-shrink-0" />
                <div>
                  <h4 className="font-serif text-xl text-primary mb-2">Working Hours</h4>
                  <p className="text-gray-500 font-light">
                    Mon - Sat: 9:30 AM - 7:00 PM <br />
                    Sunday: By Appointment Only
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-[#25D366] text-white px-6 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle size={16} className="mr-2" />
                WhatsApp
              </a>
              <a 
                href="tel:+919876543210" 
                className="flex items-center justify-center border border-primary text-primary px-6 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-primary hover:text-background transition-colors"
              >
                <Phone size={16} className="mr-2" />
                Call Now
              </a>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white p-8 md:p-12 border border-gray-100 shadow-xl">
            <h3 className="font-serif text-3xl text-primary mb-8">Send an Inquiry</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Your Name *</label>
                  <input type="text" required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] bg-transparent text-primary" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Phone Number *</label>
                  <input type="tel" required className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] bg-transparent text-primary" />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
                <input type="email" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] bg-transparent text-primary" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Interested In</label>
                  <select className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] bg-transparent text-primary">
                    <option value="buy">Buying</option>
                    <option value="sell">Selling</option>
                    <option value="rent">Renting</option>
                    <option value="invest">Investing</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Budget Range</label>
                  <select className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] bg-transparent text-primary">
                    <option value="under-1">Under ₹1 Cr</option>
                    <option value="1-3">₹1 Cr - ₹3 Cr</option>
                    <option value="3-5">₹3 Cr - ₹5 Cr</option>
                    <option value="above-5">Above ₹5 Cr</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Preferred Location</label>
                <input type="text" placeholder="e.g. Koregaon Park, Baner" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] bg-transparent text-primary" />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Your Message</label>
                <textarea rows={4} className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] bg-transparent text-primary resize-none"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-background py-5 uppercase text-sm tracking-widest font-semibold hover:bg-[#C8A97E] transition-colors mt-8 disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          </div>

        </div>

        {/* Map Placeholder */}
        <div className="mt-24 h-[400px] w-full bg-gray-100 border border-gray-200 relative flex items-center justify-center">
          <div className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=2000&q=80"
                alt="Map Location"
                fill
                className="object-cover opacity-50 grayscale"
              />
          </div>
          <div className="relative z-10 bg-white p-6 shadow-xl text-center flex flex-col items-center">
            <MapPin size={32} className="text-[#C8A97E] mb-2" />
            <h4 className="font-serif text-xl text-primary">Prestige Real Estate</h4>
            <a href="#" className="text-sm text-[#C8A97E] uppercase tracking-widest mt-2 hover:text-primary transition-colors">Get Directions</a>
          </div>
        </div>

      </div>
    </div>
  );
}
