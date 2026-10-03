"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import MagneticButton from "@/components/MagneticButton";
import { ArrowRight } from "lucide-react";

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

const detailedServices = [
  {
    id: "01",
    title: "Buying Assistance",
    description: "Find the right property with expert guidance from discovery to closing.",
    problem: "Navigating the market can be overwhelming, with thousands of listings and hidden pitfalls.",
    solution: "We act as your dedicated advisor, shortlisting properties that match your exact criteria and negotiating the best possible price on your behalf.",
    benefits: ["Curated property options", "Expert negotiation", "Legal support", "Post-purchase assistance"],
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "02",
    title: "Selling Assistance",
    description: "Position your property effectively and connect with qualified buyers.",
    problem: "Selling quickly at the right price requires market knowledge and strategic marketing.",
    solution: "From staging advice and professional photography to targeted marketing and rigorous buyer screening, we handle it all.",
    benefits: ["Accurate valuation", "Premium marketing", "Qualified buyer network", "Transaction management"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "03",
    title: "Rental Assistance",
    description: "Find reliable tenants and suitable rental properties with less hassle.",
    problem: "Finding the right rental property or a trustworthy tenant is time-consuming and often risky.",
    solution: "We streamline the process for landlords and tenants, handling viewings, background checks, and lease agreements with utmost professionalism.",
    benefits: ["Extensive network", "Background checks", "Lease agreements", "Move-in support"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "04",
    title: "Investment Advisory",
    description: "Identify opportunities based on location, value and long-term potential.",
    problem: "Real estate investment requires deep market analysis to ensure strong ROI.",
    solution: "Our advisory service provides data-driven insights into emerging micro-markets, commercial yields, and residential appreciation trends.",
    benefits: ["ROI analysis", "Micro-market reports", "Portfolio diversification", "Pre-launch access"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
  }
];

function ServiceBlock({ service, index, setActive }: { service: any, index: number, setActive: (i: number) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (isInView) {
      setActive(index);
    }
  }, [isInView, index, setActive]);

  return (
    <div ref={ref} className="min-h-[80vh] flex flex-col justify-center py-24 border-b border-gray-100 last:border-0 relative">
      <div className="absolute top-24 right-0 text-9xl font-serif text-[#F9F8F6] -z-10 select-none">
        {service.id}
      </div>
      
      {/* Mobile Image (Hidden on Desktop) */}
      <div className="lg:hidden w-full h-[40vh] relative mb-12 overflow-hidden">
        <Image src={service.image} alt={service.title} fill className="object-cover" />
      </div>

      <span className="text-[#C8A97E] font-serif text-3xl mb-6 block">0{index + 1}</span>
      <h2 className="font-serif text-5xl md:text-7xl text-primary mb-8">{service.title}</h2>
      <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed mb-16 max-w-2xl">
        {service.description}
      </p>

      <div className="space-y-12">
        <div>
          <h4 className="uppercase text-xs tracking-widest font-semibold text-primary mb-4 border-b border-gray-200 pb-2 inline-block">The Challenge</h4>
          <p className="text-gray-500 font-light leading-relaxed text-lg max-w-xl">{service.problem}</p>
        </div>
        <div>
          <h4 className="uppercase text-xs tracking-widest font-semibold text-primary mb-4 border-b border-gray-200 pb-2 inline-block">Our Approach</h4>
          <p className="text-gray-500 font-light leading-relaxed text-lg max-w-xl">{service.solution}</p>
        </div>
        
        <div>
          <h4 className="uppercase text-xs tracking-widest font-semibold text-primary mb-6">Key Benefits</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 max-w-2xl">
            {service.benefits.map((benefit: string, i: number) => (
              <li key={i} className="flex items-center text-gray-500 font-light">
                <div className="w-1.5 h-1.5 bg-[#C8A97E] rounded-full mr-4" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-16">
        <MagneticButton href="/contact" className="group flex items-center text-xs uppercase tracking-[0.2em] font-semibold text-primary">
          <span className="mr-4 hover:text-[#C8A97E] transition-colors border-b border-primary pb-1 group-hover:border-[#C8A97E]">Enquire about {service.title}</span>
          <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform text-[#C8A97E]" />
        </MagneticButton>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-background min-h-screen text-primary selection:bg-[#C8A97E] selection:text-white pb-32">
      
      {/* IMMERSIVE HERO */}
      <section className="pt-48 pb-24 px-[5%] md:px-[10%]">
        <div className="max-w-4xl">
          <p className="text-[#C8A97E] uppercase tracking-[0.2em] text-sm font-semibold mb-6">Our Expertise</p>
          <StaggeredText 
            text="Comprehensive Real Estate Services." 
            className="font-serif text-5xl md:text-8xl leading-[1.1] mb-8" 
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-gray-500 font-light text-xl md:text-2xl leading-relaxed max-w-2xl"
          >
            Tailored solutions designed to make your property journey seamless, transparent, and successful.
          </motion.p>
        </div>
      </section>

      {/* EDITORIAL STICKY SCROLL SECTION */}
      <section className="px-[5%] md:px-[10%] relative">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* LEFT: Scrolling Content */}
          <div className="w-full lg:w-1/2">
            {detailedServices.map((service, index) => (
              <ServiceBlock 
                key={service.id} 
                service={service} 
                index={index} 
                setActive={setActiveIndex} 
              />
            ))}
          </div>

          {/* RIGHT: Sticky Image (Desktop Only) */}
          <div className="hidden lg:block w-1/2 relative">
            <div className="sticky top-32 h-[75vh] w-full overflow-hidden">
              {detailedServices.map((service, index) => (
                <div
                  key={`img-${service.id}`}
                  className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                  style={{ opacity: activeIndex === index ? 1 : 0, zIndex: activeIndex === index ? 10 : 0 }}
                >
                  <Image 
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-[10s] ease-out"
                    style={{ transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)' }}
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

    </div>
  );
}
