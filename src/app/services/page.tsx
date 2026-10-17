import Link from "next/link";
import { Building2, Key, TrendingUp, ShieldCheck, FileCheck, Phone, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Real Estate Brokerage Services | Arth Properties Pune",
  description: "Explore Arth Properties' comprehensive real estate services in Pune: Residential buying, property selling, corporate leasing, NA land investment, and title diligence by Monali Khedekar.",
};

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      
      {/* Header */}
      <section className="bg-gradient-to-br from-[#0A1C33] via-[#102D50] to-[#0A1C33] text-white py-16 px-4 sm:px-6 lg:px-8 mb-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D71935] bg-white/10 px-3 py-1 rounded-full inline-block mb-3">
            What We Do
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            Real Estate Services in Pune
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Professional brokerage, legal verification, and transaction support across Buy, Sell, and Rent verticals.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Service 1: Buying Assistance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 pb-16 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D71935] mb-2">
              <Building2 size={16} />
              <span>Service 01 &bull; Buyers</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#102D50] mb-4">
              Property Buying Assistance
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Finding the right home is more than browsing photos. We curate properties matching your exact life stage, budget, and commute preferences across Hadapsar, Magarpatta City, Amanora, Kharadi, Koregaon Park, Baner, and Wakad.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 mb-8">
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Thorough verification of MahaRERA project status and clear title chain.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Accompanied site visits with zero sales pressure.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Hard price negotiations and builder contract scrutiny.</span>
              </li>
            </ul>
            <Link
              href="/properties"
              className="group/btn inline-flex items-center gap-2 bg-[#102D50] hover:bg-[#1A4273] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <span>Browse Properties for Sale</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>

          <div className="bg-slate-50/80 p-8 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300">
            <h3 className="font-serif font-bold text-lg text-[#102D50] mb-3">
              Included for Homebuyers:
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-colors">
                <strong className="text-slate-800 block mb-0.5">Shortlist Analysis:</strong>
                Comparative market analysis showing past 12-month registered transaction rates in the vicinity.
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-colors">
                <strong className="text-slate-800 block mb-0.5">Home Loan Liaison:</strong>
                Assistance with leading banks (SBI, HDFC, ICICI) for fast title search and loan sanction.
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-colors">
                <strong className="text-slate-800 block mb-0.5">Sub-Registrar Registration:</strong>
                Preparation of index II documents, stamp duty challans, and physical appointment escort.
              </div>
            </div>
          </div>
        </div>

        {/* Service 2: Selling Assistance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 pb-16 border-b border-slate-100">
          <div className="order-2 lg:order-1 bg-slate-50/80 p-8 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300">
            <h3 className="font-serif font-bold text-lg text-[#102D50] mb-3">
              Why List with Arth Properties?
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-colors">
                <strong className="text-slate-800 block mb-0.5">Pre-Qualified Buyers:</strong>
                We only bring serious buyers with verified loan eligibility or self-funding to your home.
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-colors">
                <strong className="text-slate-800 block mb-0.5">Optimal Pricing Guidance:</strong>
                Positioning that reflects real demand so your property sells smoothly without lingering for months.
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-colors">
                <strong className="text-slate-800 block mb-0.5">Total Paperwork Assistance:</strong>
                Drafting Agreement to Sale, obtaining Society NOC, and handling TDS compliance.
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D71935] mb-2">
              <Key size={16} />
              <span>Service 02 &bull; Owners</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#102D50] mb-4">
              Property Selling & Strategic Marketing
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Selling an asset requires targeted positioning, dignified presentation, and rigorous buyer screening. Monali Khedekar manages the entire sales lifecycle from pricing to deed execution.
            </p>
            <Link
              href="/sell"
              className="group/btn inline-flex items-center gap-2 bg-gradient-to-r from-[#D71935] to-[#B8142C] hover:from-[#B8142C] hover:to-[#D71935] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow hover:shadow-lg hover:shadow-red-600/30 hover:scale-105 active:scale-95"
            >
              <span>Submit Property Details</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Service 3: Rental & Corporate Leasing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 pb-16 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D71935] mb-2">
              <FileCheck size={16} />
              <span>Service 03 &bull; Tenants & Landlords</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#102D50] mb-4">
              Rental & Lease Management
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              We connect owners of high-grade apartments and commercial spaces with vetted corporate tenants, multinational executives, and responsible families across Pune.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 mb-8">
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Tenant background checks and employer verification.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Biometric e-registration of Leave & License agreements.</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Detailed move-in inventory documentation.</span>
              </li>
            </ul>
            <Link
              href="/properties?purpose=rent"
              className="group/btn inline-flex items-center gap-2 bg-[#102D50] hover:bg-[#1A4273] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <span>View Rental Listings</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>

          <div className="bg-slate-50/80 p-8 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300">
            <h3 className="font-serif font-bold text-lg text-[#102D50] mb-3">
              Rental Concierge Services:
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-colors">
                <strong className="text-slate-800 block mb-0.5">NRI Property Management:</strong>
                Remote leasing, rent collection monitoring, and regular unit inspection for overseas owners.
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-colors">
                <strong className="text-slate-800 block mb-0.5">Commercial Retail Leases:</strong>
                High-street retail and office lease drafting with customized lock-in and escalation terms.
              </div>
            </div>
          </div>
        </div>

        {/* Service 4: Land & Investment Advisory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1 bg-slate-50/80 p-8 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300">
            <h3 className="font-serif font-bold text-lg text-[#102D50] mb-3">
              Investment Parameters Checked:
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-colors">
                <strong className="text-slate-800 block mb-0.5">Sanction Verification:</strong>
                Zone classification, 7/12 extract inspection, mutation entry verification, and NA orders.
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-colors">
                <strong className="text-slate-800 block mb-0.5">Rental Yield Modeling:</strong>
                Evaluation of gross and net rental yields on pre-leased commercial assets.
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D71935] mb-2">
              <TrendingUp size={16} />
              <span>Service 04 &bull; Investors</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#102D50] mb-4">
              Plots & Real Estate Investment Advisory
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Strategic capital allocation in Pune's high-growth corridors. We identify collector-approved NA villa plots, pre-leased commercial office units, and land parcels across Hadapsar, Saswad Road, Shewalwadi, and Bavdhan with strong appreciation tailwinds.
            </p>
            <Link
              href="/properties?category=plots"
              className="group/btn inline-flex items-center gap-2 bg-[#102D50] hover:bg-[#1A4273] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <span>Explore Investment Plots</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
