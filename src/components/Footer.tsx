import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-background pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <Link href="/" className="text-3xl font-serif font-bold tracking-tight mb-6 block">
            PRESTIGE<span className="text-[#C8A97E]">.</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Curated properties, trusted guidance and a seamless real-estate experience. Find a place worth calling home.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-[#C8A97E] text-sm transition-colors">IG</a>
            <a href="#" className="hover:text-[#C8A97E] text-sm transition-colors">FB</a>
            <a href="#" className="hover:text-[#C8A97E] text-sm transition-colors">IN</a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6 text-[#C8A97E]">Navigation</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/properties" className="hover:text-white transition-colors">Properties</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6 text-[#C8A97E]">Contact Us</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start space-x-3">
              <Phone size={18} className="mt-0.5 text-[#C8A97E]" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-start space-x-3">
              <Mail size={18} className="mt-0.5 text-[#C8A97E]" />
              <span>contact@prestigerealestate.com</span>
            </li>
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="mt-0.5 text-[#C8A97E]" />
              <span>Level 4, Business Bay, <br />Pune, Maharashtra 411001</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6 text-[#C8A97E]">Newsletter</h4>
          <p className="text-sm text-gray-300 mb-4">Subscribe to our newsletter for the latest property updates.</p>
          <form className="flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-transparent border border-gray-700 px-4 py-2 w-full text-sm focus:outline-none focus:border-[#C8A97E]"
            />
            <button type="submit" className="bg-[#C8A97E] text-primary px-4 py-2 text-sm font-semibold hover:bg-white transition-colors">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Prestige Real Estate. All Rights Reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
