"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [purpose, setPurpose] = useState("Buy");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/properties?purpose=${purpose}&type=${type}&location=${location}`);
  };

  return (
    <div className="relative h-screen min-h-[800px] flex items-center justify-center">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl text-white"
        >
          <p className="text-[#C8A97E] uppercase tracking-[0.3em] text-sm font-semibold mb-6">
            Premium Real Estate Consultancy
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-8">
            Find a Place <br />
            <span className="italic font-light">Worth Calling Home.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mb-12">
            Curated properties, trusted guidance and a seamless real-estate experience tailored for you.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/properties" 
              className="bg-[#C8A97E] text-primary px-8 py-4 uppercase text-sm tracking-widest font-semibold hover:bg-white transition-colors text-center"
            >
              Explore Properties
            </Link>
            <Link 
              href="/contact" 
              className="border border-white/30 backdrop-blur-sm text-white px-8 py-4 uppercase text-sm tracking-widest hover:bg-white hover:text-primary transition-colors text-center"
            >
              Schedule a Consultation
            </Link>
          </div>
          
          <div className="mt-16 text-sm text-gray-400 font-light tracking-wider flex items-center">
            <span className="w-12 h-[1px] bg-[#C8A97E] mr-4"></span>
            Trusted Property Advisory • Residential • Commercial • Investment
          </div>
        </motion.div>

        {/* Floating Search Panel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="absolute -bottom-32 left-6 right-6 md:left-12 md:right-12 max-w-7xl mx-auto bg-white shadow-2xl p-6 md:p-8 z-30"
        >
          <div className="flex space-x-6 mb-6 border-b border-gray-100 pb-4">
            <button 
              className={`text-lg font-serif pb-2 border-b-2 transition-colors ${purpose === 'Buy' ? 'border-[#C8A97E] text-primary' : 'border-transparent text-gray-400'}`}
              onClick={() => setPurpose('Buy')}
            >
              Buy
            </button>
            <button 
              className={`text-lg font-serif pb-2 border-b-2 transition-colors ${purpose === 'Rent' ? 'border-[#C8A97E] text-primary' : 'border-transparent text-gray-400'}`}
              onClick={() => setPurpose('Rent')}
            >
              Rent
            </button>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-400 mb-2">Property Type</label>
              <select 
                className="border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] text-primary"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-400 mb-2">Location</label>
              <input 
                type="text" 
                placeholder="Search area..." 
                className="border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] text-primary"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs uppercase tracking-widest text-gray-400 mb-2">Budget</label>
              <select className="border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] text-primary">
                <option value="">Any Budget</option>
                <option value="1-3">₹1 Cr - ₹3 Cr</option>
                <option value="3-5">₹3 Cr - ₹5 Cr</option>
                <option value="5+">₹5 Cr +</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="bg-primary text-background h-12 flex items-center justify-center uppercase text-sm tracking-widest hover:bg-[#C8A97E] transition-colors"
            >
              <Search size={18} className="mr-2" />
              Search
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
