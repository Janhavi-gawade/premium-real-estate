import Link from "next/link";
import { FileText, AlertCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Terms and Conditions | Arth Properties",
  description: "Terms and conditions for utilizing the Arth Properties website, real estate advisory services, and listing portals.",
};

export default function TermsPage() {
  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D71935] mb-2">
            <FileText size={16} />
            <span>Legal Documentation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#102D50] mb-2">
            Terms and Conditions
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: October 2026 &bull; Arth Properties, Pune, Maharashtra
          </p>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Note for Client & Legal Review:</strong>
              These terms define listing verification, brokerage norms, and limitation of liability under Indian real estate statutes. Please have your legal advisor review before full commercial execution.
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-bold text-[#102D50] mb-3">
              1. Platform Purpose & Scope of Services
            </h2>
            <p className="text-xs">
              Arth Properties operates as a professional real estate brokerage and advisory service connecting prospective buyers, tenants, property owners, and real estate developers in Pune, Maharashtra. The website provides informational listings and inquiry dispatch capabilities.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#102D50] mb-3">
              2. Accuracy of Property Information
            </h2>
            <p className="text-xs">
              While Arth Properties exercises due care to verify carpet areas, specifications, pricing, and possession timelines, property information is based on developer brochures, municipal sanction drawings, and owner declarations. Prospective buyers must independently inspect project MahaRERA certificates and conduct legal title scrutiny prior to monetary commitments.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#102D50] mb-3">
              3. Property Owner Listing Submissions
            </h2>
            <p className="text-xs">
              Property owners submitting listings via the &ldquo;Sell Your Property&rdquo; portal warrant that they hold lawful authority, title, or written authorization to market the asset. Arth Properties reserves the right to decline or unpublish any listing that fails title diligence or compliance standards.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#102D50] mb-3">
              4. Professional Brokerage Terms
            </h2>
            <p className="text-xs">
              Brokerage fees for buying, selling, or leasing properties are governed by written agreements entered into prior to registration, adhering to established Pune Association of Realtors (PAR) and industry standards. No transaction commission is charged merely for viewing public listings or submitting website inquiries.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#102D50] mb-3">
              5. Governing Law & Jurisdiction
            </h2>
            <p className="text-xs">
              These terms and all transactions undertaken through Arth Properties are governed by the laws of India and the state of Maharashtra. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in Pune, Maharashtra.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
