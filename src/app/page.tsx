"use client";

import { properties, services, areas, testimonials } from "@/data/mockData";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Search, MapPin } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

// --- Components ---

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
              visible: { y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
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

function Counter({ end, suffix = "" }: { end: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / 2000; // 2 seconds
        if (progress < 1) {
          setCount(Math.floor(end * progress));
          requestAnimationFrame(animateCount);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(animateCount);
    }
  }, [isInView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Removed duplicate import

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  const featuredProperties = properties.filter(p => p.featured).slice(0, 3);
  const gridProperties = properties.slice(0, 5);

  const [hoveredService, setHoveredService] = useState<number | null>(null);

  return (
    <div className="bg-background text-primary selection:bg-[#C8A97E] selection:text-white">
      
      {/* 1. CINEMATIC HERO */}
      <section ref={heroRef} className="relative h-screen min-h-[800px] flex flex-col justify-end overflow-hidden pb-12 px-[5%] md:px-[10%]">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=2500&q=80"
            alt="Luxury Architecture"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <div className="relative z-10 w-full text-white">
          <div className="max-w-4xl">
            <StaggeredText 
              text="Where Better Living Begins." 
              className="font-serif text-6xl md:text-[8rem] leading-[1.1] mb-8" 
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-col md:flex-row md:items-end justify-between border-t border-white/20 pt-8 mt-12"
            >
              <p className="text-lg md:text-xl font-light tracking-wide max-w-sm mb-8 md:mb-0">
                Curated properties. Personal guidance. Confident decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <MagneticButton href="/properties" className="group flex items-center text-xs uppercase tracking-[0.2em] font-semibold">
                  <span className="mr-4 hover:text-[#C8A97E] transition-colors">Explore Properties</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform text-[#C8A97E]" />
                </MagneticButton>
                <MagneticButton href="/contact" className="group flex items-center text-xs uppercase tracking-[0.2em] font-semibold">
                  <span className="mr-4 hover:text-[#C8A97E] transition-colors">Start a Conversation</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform text-[#C8A97E]" />
                </MagneticButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION / BRAND STATEMENT */}
      <section className="py-32 md:py-48 px-[5%] md:px-[10%]">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          <div className="w-full lg:w-2/3">
            <StaggeredText 
              text="Real estate is more than square feet." 
              className="font-serif text-5xl md:text-7xl leading-[1.2] text-primary" 
            />
          </div>
          <div className="w-full lg:w-1/3 flex flex-col justify-end pt-4">
            <p className="text-gray-500 font-light text-xl leading-relaxed mb-10">
              We help people discover spaces that match the way they want to live, work and invest. An editorial approach to finding your next address.
            </p>
            <Link href="/about" className="inline-block border-b border-primary pb-2 uppercase text-xs tracking-[0.2em] font-semibold w-max hover:text-[#C8A97E] hover:border-[#C8A97E] transition-colors">
              Know Our Approach
            </Link>
          </div>
        </div>
      </section>

      {/* 3. TRUST / NUMBERS */}
      <section className="py-24 border-y border-gray-100 bg-white">
        <div className="px-[5%] md:px-[10%] grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { end: 10, suffix: "+", label: "Years of Experience" },
            { end: 250, suffix: "+", label: "Properties" },
            { end: 500, suffix: "+", label: "Clients" },
            { end: 15, suffix: "+", label: "Prime Locations" }
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="font-serif text-5xl md:text-6xl text-primary mb-4">
                <Counter end={stat.end} suffix={stat.suffix} />
              </p>
              <p className="uppercase text-xs tracking-[0.2em] text-gray-500 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PROPERTY STORY */}
      <section className="py-32 md:py-48 px-[5%] md:px-[10%]">
        <div className="mb-24">
          <h2 className="uppercase text-xs tracking-[0.2em] font-semibold text-gray-400 mb-4">The Collection</h2>
          <StaggeredText text="Signature Properties" className="font-serif text-5xl md:text-7xl" />
        </div>
        
        <div className="space-y-48">
          {featuredProperties.map((property, idx) => (
            <motion.div 
              key={property.id} 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center`}
            >
              <div className="w-full lg:w-2/3">
                <Link href={`/properties/${property.id}`} className="block relative h-[60vh] md:h-[80vh] w-full overflow-hidden hover-trigger-image">
                  <Image 
                    src={property.image}
                    alt={property.name}
                    fill
                    className="object-cover transition-transform duration-[1.5s] hover:scale-105"
                  />
                </Link>
              </div>
              <div className="w-full lg:w-1/3">
                <span className="text-[#C8A97E] font-serif text-3xl md:text-5xl mb-8 block">0{idx + 1}</span>
                <h3 className="font-serif text-4xl md:text-5xl text-primary mb-4">{property.name}</h3>
                <p className="text-gray-500 font-light text-lg mb-8">{property.location}</p>
                
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8 mb-12">
                  <div>
                    <p className="text-gray-400 uppercase text-[10px] tracking-widest mb-1">Type</p>
                    <p className="text-primary font-medium">{property.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 uppercase text-[10px] tracking-widest mb-1">Area</p>
                    <p className="text-primary font-medium">{property.area}</p>
                  </div>
                </div>
                
                <p className="font-serif text-3xl text-primary mb-10">{property.price}</p>
                
                <Link href={`/properties/${property.id}`} className="inline-block border-b border-primary pb-2 uppercase text-xs tracking-[0.2em] font-semibold w-max hover:text-[#C8A97E] hover:border-[#C8A97E] transition-colors">
                  Explore Property
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. ASYMMETRICAL PROPERTY GRID */}
      <section className="py-32 bg-[#F9F8F6]">
        <div className="px-[5%] md:px-[10%]">
          <div className="flex justify-between items-end mb-20 border-b border-gray-200 pb-12">
            <h2 className="font-serif text-4xl md:text-6xl text-primary">More Places <br/> To Explore</h2>
            <Link href="/properties" className="hidden md:inline-block border-b border-primary pb-2 uppercase text-xs tracking-[0.2em] font-semibold w-max hover:text-[#C8A97E] hover:border-[#C8A97E] transition-colors">
              View All Properties
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 auto-rows-[auto]">
            {/* Landscape Large */}
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 50 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="md:col-span-8"
            >
              <Link href={`/properties/${gridProperties[0].id}`} className="group block">
                <div className="relative h-[60vh] overflow-hidden mb-6 hover-trigger-image">
                  <Image src={gridProperties[0].image} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-2xl text-primary">{gridProperties[0].name}</h3>
                    <p className="text-gray-500 font-light text-sm">{gridProperties[0].location}</p>
                  </div>
                  <p className="font-serif text-xl">{gridProperties[0].price}</p>
                </div>
              </Link>
            </motion.div>
            
            {/* Portrait Small */}
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 50 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
              className="md:col-span-4 md:mt-32"
            >
              <Link href={`/properties/${gridProperties[1].id}`} className="group block">
                <div className="relative h-[45vh] overflow-hidden mb-6 hover-trigger-image">
                  <Image src={gridProperties[1].image} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-xl text-primary">{gridProperties[1].name}</h3>
                    <p className="text-gray-500 font-light text-sm">{gridProperties[1].location}</p>
                  </div>
                  <p className="font-serif text-lg">{gridProperties[1].price}</p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. BROKER STORY */}
      <section className="py-32 md:py-48 px-[5%] md:px-[10%]">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
            className="w-full lg:w-1/2 relative h-[80vh] overflow-hidden"
          >
            <Image 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1000&q=80"
              alt="Broker Portrait"
              fill
              className="object-cover"
            />
          </motion.div>
          
          <div className="w-full lg:w-1/2">
            <h2 className="font-serif text-4xl md:text-6xl text-primary mb-10 leading-tight">Property guidance, <br/> without the pressure.</h2>
            <div className="space-y-6 text-gray-500 font-light text-lg leading-relaxed mb-12">
              <p>With over a decade of experience in the luxury real estate market, our approach goes beyond simply showing properties.</p>
              <p>We believe in understanding the unique lifestyle requirements and investment goals of each client to find the perfect match, providing honest, data-driven, and personalized property advice at every step.</p>
            </div>
            
            <div className="mb-16">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" alt="Signature" width={200} height={80} className="opacity-40" />
              <p className="uppercase text-xs tracking-widest text-primary font-semibold mt-4">Arjun Kapoor — Principal Advisor</p>
            </div>
            
            <Link href="/about" className="inline-block border-b border-primary pb-2 uppercase text-xs tracking-[0.2em] font-semibold hover:text-[#C8A97E] hover:border-[#C8A97E] transition-colors">
              Know Our Approach
            </Link>
          </div>
        </div>
      </section>

      {/* 7. SERVICES (INTERACTIVE LIST) */}
      <section className="py-32 bg-primary text-white overflow-hidden">
        <div className="px-[5%] md:px-[10%] mb-24">
          <StaggeredText text="How We Help." className="font-serif text-5xl md:text-7xl" />
        </div>
        
        <div className="relative">
          <div className="px-[5%] md:px-[10%] flex flex-col relative z-10">
            {services.map((service, idx) => (
              <div 
                key={service.id}
                className="group border-b border-white/20 py-12 flex flex-col md:flex-row justify-between md:items-center cursor-pointer hover:pl-8 transition-all duration-500"
                onMouseEnter={() => setHoveredService(idx)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="flex items-start md:items-center mb-4 md:mb-0">
                  <span className="font-serif text-[#C8A97E] text-2xl md:text-4xl mr-8 md:mr-16">0{idx + 1}</span>
                  <h3 className="font-serif text-4xl md:text-7xl group-hover:text-white/80 transition-colors">{service.title}</h3>
                </div>
                <div className="max-w-xs text-white/50 font-light text-sm hidden lg:block overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-32">
                  {service.description}
                </div>
              </div>
            ))}
          </div>
          
          {/* Background Images for Services */}
          <div className="absolute top-0 right-[10%] w-[400px] h-[500px] pointer-events-none hidden lg:block z-0 opacity-0 transition-opacity duration-500" style={{ opacity: hoveredService !== null ? 0.3 : 0 }}>
             <Image 
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
                alt="Service Background"
                fill
                className="object-cover grayscale"
              />
          </div>
        </div>
      </section>

      {/* 8. LOCATIONS */}
      <section className="py-32 md:py-48 px-[5%] md:px-[10%]">
        <div className="mb-24">
          <StaggeredText text="Places We Know." className="font-serif text-5xl md:text-7xl text-primary" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.slice(0, 6).map((area, i) => (
            <Link href={`/properties?location=${area.name}`} key={area.name} className="group relative h-[400px] overflow-hidden bg-[#F9F8F6] p-8 flex flex-col justify-end hover-trigger-image">
              <div className="absolute inset-0 z-0">
                <Image src={area.image} alt={area.name} fill className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-4">
                <h3 className="font-serif text-3xl text-primary group-hover:text-white transition-colors mb-2">{area.name}</h3>
                <p className="uppercase text-xs tracking-widest text-gray-500 group-hover:text-white/80 transition-colors">
                  {area.count} properties available
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. PROPERTY FINDER */}
      <section className="py-32 bg-[#F9F8F6]">
        <div className="px-[5%] md:px-[10%] max-w-5xl mx-auto">
          <h2 className="font-serif text-4xl text-primary mb-12 text-center">Looking for something specific?</h2>
          
          <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 md:items-end">
            <div className="w-full">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Looking to</label>
              <select className="w-full border-b border-gray-300 py-3 bg-transparent font-serif text-xl focus:outline-none focus:border-[#C8A97E]">
                <option>Buy</option>
                <option>Rent</option>
              </select>
            </div>
            <div className="w-full">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Location</label>
              <input type="text" placeholder="e.g. Koregaon Park" className="w-full border-b border-gray-300 py-3 bg-transparent font-serif text-xl focus:outline-none focus:border-[#C8A97E] placeholder:text-gray-300" />
            </div>
            <div className="w-full">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Type</label>
              <select className="w-full border-b border-gray-300 py-3 bg-transparent font-serif text-xl focus:outline-none focus:border-[#C8A97E]">
                <option>All Types</option>
                <option>Apartment</option>
                <option>Villa</option>
              </select>
            </div>
            <button className="w-full md:w-auto bg-primary text-background px-8 py-4 flex items-center justify-center uppercase text-xs tracking-widest hover:bg-[#C8A97E] transition-colors mt-6 md:mt-0 whitespace-nowrap">
              <Search size={16} className="mr-3" />
              Show Properties
            </button>
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section className="py-32 md:py-48 px-[5%] md:px-[10%]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="uppercase text-xs tracking-widest text-gray-400 mb-12">Client Experiences</p>
          <div className="relative">
            <h2 className="font-serif text-3xl md:text-5xl text-primary leading-snug md:leading-normal mb-16 italic">
              "From shortlisting properties to final negotiations, the entire process was smooth, transparent, and completely pressure-free."
            </h2>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-4 overflow-hidden relative">
                <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" alt="Client" fill className="object-cover" />
              </div>
              <p className="uppercase text-xs tracking-widest font-semibold text-primary">Rahul Mehta</p>
              <p className="text-gray-400 text-xs mt-1">Purchased in Koregaon Park</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. INVESTMENT SECTION */}
      <section className="h-[80vh] relative flex items-center justify-center px-[5%] text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2500&q=80"
            alt="Investment Architecture"
            fill
            className="object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 text-white max-w-4xl">
          <h2 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">Some properties are homes. <br/> Some become opportunities.</h2>
          <p className="text-xl font-light text-white/70 mb-12">Expert guidance for high-yield residential and commercial real estate investments.</p>
          <Link href="/contact" className="inline-block border border-white text-white px-10 py-5 uppercase text-xs tracking-[0.2em] font-semibold hover:bg-white hover:text-primary transition-colors">
            Discuss an Investment
          </Link>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="py-32 md:py-48 px-[5%] md:px-[10%] text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <StaggeredText text="Your next address could be here." className="font-serif text-5xl md:text-8xl text-primary mb-16 leading-tight" />
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/properties" className="bg-primary text-white px-10 py-5 uppercase text-xs tracking-[0.2em] font-semibold hover:bg-[#C8A97E] transition-colors">
              Explore Properties
            </Link>
            <Link href="/contact" className="border-b-2 border-primary text-primary px-4 py-5 uppercase text-xs tracking-[0.2em] font-semibold hover:text-[#C8A97E] hover:border-[#C8A97E] transition-colors">
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
