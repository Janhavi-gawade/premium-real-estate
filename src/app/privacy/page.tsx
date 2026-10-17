import Link from "next/link";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Privacy Policy | Arth Properties",
  description: "Privacy policy for Arth Properties regarding user inquiries, owner property submissions, and data protection under Indian IT regulations.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D71935] mb-2">
            <ShieldCheck size={16} />
            <span>Legal Documentation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#102D50] mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: October 2026 &bull; Arth Properties, Pune, Maharashtra
          </p>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Note for Client & Legal Review:</strong>
              This policy is tailored to Arth Properties' actual data collection practices (property enquiries, site visit schedules, and owner property submissions). Have your corporate legal advisor verify terms prior to commercial launch.
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl font-bold text-[#102D50] mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-2">
              Arth Properties collects only the information necessary to fulfill real estate brokerage and advisory services:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Contact Information:</strong> Name, mobile phone number, and email address provided when scheduling site visits, requesting callbacks, or submitting inquiries.</li>
              <li><strong>Property Owner Details:</strong> Property address, expected price, carpet area, and photographs submitted via our Sell Your Property portal.</li>
              <li><strong>Technical Logs:</strong> IP address, browser type, and page access timestamps collected for server security and anti-spam verification.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#102D50] mb-3">
              2. How We Use Your Data
            </h2>
            <p className="mb-2">
              We process your personal information exclusively for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Facilitating direct property communications between you and Monali Khedekar.</li>
              <li>Arranging coordinated site visits with housing societies and developers.</li>
              <li>Reviewing and preparing owner listings prior to client-approved publication.</li>
              <li>Complying with regulatory obligations under MahaRERA and Indian law.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#102D50] mb-3">
              3. Data Confidentiality & Non-Disclosure
            </h2>
            <p className="text-xs">
              We <strong>do not</strong> sell, rent, or trade your contact information to third-party telemarketers or marketing aggregators. Information is shared only with verified title search attorneys, sub-registrar officials, and prospective counterparties when explicitly authorized by you during a real estate transaction.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#102D50] mb-3">
              4. Data Retention & Security
            </h2>
            <p className="text-xs">
              Client records are stored securely on persistent database infrastructure with Row Level Security (RLS) and encrypted transport (HTTPS / TLS 1.3). You may request the deletion of your enquiry data at any time by contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-[#102D50] mb-3">
              5. Contacting the Grievance Officer
            </h2>
            <p className="text-xs">
              For any questions regarding this Privacy Policy or your personal data, reach out to Monali Khedekar at <a href={`mailto:${siteConfig.contact.email}`} className="text-[#D71935] underline">{siteConfig.contact.email}</a> or call <a href={`tel:${siteConfig.contact.primaryPhone}`} className="text-[#D71935] underline">{siteConfig.contact.primaryPhoneDisplay}</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
