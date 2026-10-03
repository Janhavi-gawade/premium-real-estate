"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import MagneticButton from "@/components/MagneticButton";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const menuVariants: any = {
    closed: { opacity: 0, y: "-100%", transition: { duration: 0.8, ease: "easeOut" } },
    open: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const linkVariants: any = {
    closed: { opacity: 0, y: 50 },
    open: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: { delay: 0.4 + (i * 0.1), duration: 0.8, ease: "easeOut" }
    })
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          isMenuOpen 
            ? "bg-transparent py-8 text-background" 
            : isScrolled 
              ? "bg-background/95 backdrop-blur-md py-4 border-b border-gray-200 text-primary shadow-sm" 
              : pathname === "/" 
                ? "bg-transparent py-8 text-white" 
                : "bg-transparent py-8 text-primary"
        }`}
      >
        <div className="max-w-[90%] mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-serif tracking-tight z-50">
            PRESTIGE<span className="text-[#C8A97E]">.</span>
          </Link>

          <div className="flex items-center space-x-12">
            <MagneticButton
              href="/contact"
              className="hidden md:block uppercase text-xs tracking-[0.2em] font-semibold hover:text-[#C8A97E] transition-colors z-50 p-4"
            >
              Let's Talk
            </MagneticButton>
            
            <MagneticButton
              className="z-50 uppercase text-xs tracking-[0.2em] font-semibold hover:text-[#C8A97E] transition-colors flex items-center gap-3 p-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="hidden md:block">{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </MagneticButton>
          </div>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-primary z-40 flex flex-col justify-center px-[5%] md:px-[10%]"
          >
            <div className="flex flex-col md:flex-row justify-between w-full mt-24 items-center md:items-start">
              <div className="flex flex-col space-y-6 md:space-y-8 w-full md:w-1/2">
                {navLinks.map((link, i) => (
                  <div key={link.name} className="overflow-hidden">
                    <motion.div custom={i} variants={linkVariants} initial="closed" animate="open" exit="closed">
                      <Link
                        href={link.href}
                        className={`font-serif text-4xl md:text-6xl hover:text-[#C8A97E] transition-colors inline-block ${pathname === link.href ? 'text-[#C8A97E]' : 'text-background'}`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>
              
              <div className="mt-16 md:mt-0 flex flex-col justify-end text-background/60 w-full md:w-1/3">
                <motion.div variants={linkVariants} custom={5} initial="closed" animate="open" exit="closed">
                  <h4 className="text-xs uppercase tracking-widest text-[#C8A97E] mb-4">Contact Info</h4>
                  <p className="mb-2 hover:text-white transition-colors"><a href="mailto:contact@prestige.com">contact@prestige.com</a></p>
                  <p className="mb-8 hover:text-white transition-colors"><a href="tel:+919876543210">+91 98765 43210</a></p>
                  
                  <h4 className="text-xs uppercase tracking-widest text-[#C8A97E] mb-4">Socials</h4>
                  <div className="flex space-x-6">
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-white transition-colors">Facebook</a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
