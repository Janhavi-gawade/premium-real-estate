import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, Compass, Building2, Phone, CheckCircle2, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "About Us | Monali Khedekar & Arth Properties",
  description: "Learn about Arth Properties, Pune's trusted boutique real estate advisory led by Monali Khedekar. Dedicated to transparency, verified documentation, and personalized property solutions.",
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      
      {/* Header Banner */}
      <section className="bg-[#102D50] text-white py-16 px-4 sm:px-6 lg:px-8 mb-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D71935] bg-white/10 px-3 py-1 rounded-full inline-block mb-3">
            Boutique Real Estate Advisory
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            About Arth Properties
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            &ldquo;{siteConfig.tagline}&rdquo; &bull; &ldquo;{siteConfig.secondaryTagline}&rdquo;
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Founder & Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          <div className="relative h-[480px] sm:h-[560px] rounded-2xl overflow-hidden shadow-xl border border-slate-200">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80"
              alt="Monali Khedekar - Real Estate Professional at Arth Properties Pune"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102D50]/90 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs uppercase tracking-widest text-[#D71935] font-bold block mb-1">
                Founder & Principal Consultant
              </span>
              <h3 className="font-serif text-2xl font-bold">
                {siteConfig.founder.name}
              </h3>
              <p className="text-xs text-slate-300">
                {siteConfig.founder.location}
              </p>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D71935]">
              Our Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#102D50] mt-2 mb-6 leading-tight">
              A Personalised, High-Trust Approach to Pune Real Estate
            </h2>

            <div className="space-y-4 text-slate-600 text-sm leading-relaxed mb-8">
              <p>
                Founded by <strong>{siteConfig.founder.name}</strong>, Arth Properties was established with a singular conviction: real estate advisory should be grounded in unassailable integrity, verifiable documentation, and true alignment with the client's aspirations.
              </p>
              <p>
                In a market often characterized by aggressive sales pitches and unclear title histories, Arth Properties acts as your dedicated advocate. Whether you are shortlisting your first 2 BHK in Wakad, acquiring an ultra-luxury penthouse in Koregaon Park, establishing a commercial office in Viman Nagar, or investing in sanctioned NA plots in Bavdhan, we provide clear guidance at every milestone.
              </p>
              <p>
                Our name, <em>&ldquo;Arth&rdquo;</em> (meaning value, purpose, and significance), embodies our foundational promise: to uncover and safeguard the true value behind every home for our clients.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-serif text-2xl font-bold text-[#102D50] block">Buy, Sell, Rent</span>
                <span className="text-xs text-slate-500">Comprehensive transaction services</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-serif text-2xl font-bold text-[#D71935] block">Pune Centric</span>
                <span className="text-xs text-slate-500">Deep localized micro-market expertise</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D71935]">
              Guiding Principles
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#102D50] mt-1">
              How We Protect Your Interests
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-slate-50 hover:bg-white p-8 rounded-2xl border border-slate-200 hover:border-[#102D50]/40 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#102D50] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-serif font-bold text-xl text-[#102D50] mb-2 group-hover:text-[#D71935] transition-colors">
                Uncompromising Due Diligence
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We never promote properties with pending litigation, ambiguous inheritance, or unapproved layouts. Every listing undergoes scrutiny of title clearance and MahaRERA filings.
              </p>
            </div>

            <div className="group bg-slate-50 hover:bg-white p-8 rounded-2xl border border-slate-200 hover:border-[#D71935]/40 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-[#D71935] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <HeartHandshake size={24} />
              </div>
              <h4 className="font-serif font-bold text-xl text-[#102D50] mb-2 group-hover:text-[#D71935] transition-colors">
                Fair & Open Negotiations
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We foster transparent dialogue between sellers and buyers. You will always know genuine base rates, society charges, and legal expenses without hidden developer margins.
              </p>
            </div>

            <div className="group bg-slate-50 hover:bg-white p-8 rounded-2xl border border-slate-200 hover:border-[#102D50]/40 shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out">
              <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Compass size={24} />
              </div>
              <h4 className="font-serif font-bold text-xl text-[#102D50] mb-2 group-hover:text-[#D71935] transition-colors">
                Long-Term Relationship
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our commitment does not terminate with contract signing. We assist through stamp duty payment, registration escort, utility transfer, and tenant leasing services.
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Disclosure Notice */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 mb-16 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#D71935] block mb-1">
                Maharashtra Real Estate Regulatory Authority (MahaRERA)
              </span>
              <h4 className="font-serif text-xl font-bold mb-2">
                Regulatory Standards & Compliance
              </h4>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Arth Properties strictly adheres to the Real Estate (Regulation and Development) Act, 2016. Agent registration and individual project registration details are verified with clients prior to executing formal brokerage transactions.
              </p>
            </div>

            <Link
              href="/contact"
              className="bg-gradient-to-r from-[#D71935] to-[#B8142C] hover:from-[#B8142C] hover:to-[#D71935] text-white px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-red-600/30 hover:scale-105 active:scale-95 flex-shrink-0"
            >
              Get In Touch
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
