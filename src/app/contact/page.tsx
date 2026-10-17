import { Phone, Mail, MapPin, MessageSquare, Clock, ShieldCheck } from "lucide-react";
import PropertyEnquiryForm from "@/components/forms/PropertyEnquiryForm";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Contact Us | Arth Properties Pune",
  description: "Connect with Monali Khedekar at Arth Properties Pune. Call 9689965655 or 9767990606, WhatsApp us, or visit our Baner-Balewadi office for verified real estate guidance.",
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <section className="bg-gradient-to-br from-[#0A1C33] via-[#102D50] to-[#0A1C33] text-white py-16 px-4 sm:px-6 lg:px-8 mb-12 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D71935] bg-white/10 px-3 py-1 rounded-full inline-block mb-3">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            Contact Arth Properties
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Whether you are buying, selling, renting, or seeking investment advice in Pune, we are here to assist you with transparent advice.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details & Direct Call Cards */}
          <div className="space-y-6">
            
            {/* Phone Card */}
            <div className="group bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-red-50 text-[#D71935] rounded-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Phone size={24} />
                </div>
                <div className="flex-grow">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Call Monali Khedekar
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#102D50] mb-2 group-hover:text-[#D71935] transition-colors">
                    Direct Phone Assistance
                  </h3>
                  <div className="space-y-1.5 text-sm">
                    <p>
                      Primary:{" "}
                      <a
                        href={`tel:${siteConfig.contact.primaryPhone}`}
                        className="font-bold text-[#102D50] hover:text-[#D71935] transition-colors"
                      >
                        {siteConfig.contact.primaryPhoneDisplay}
                      </a>
                    </p>
                    <p>
                      Alternate:{" "}
                      <a
                        href={`tel:${siteConfig.contact.alternatePhone}`}
                        className="font-bold text-[#102D50] hover:text-[#D71935] transition-colors"
                      >
                        {siteConfig.contact.alternatePhoneDisplay}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="group bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <MessageSquare size={24} />
                </div>
                <div className="flex-grow">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Instant Messaging
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#102D50] mb-2 group-hover:text-emerald-700 transition-colors">
                    WhatsApp Consultation
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    Send your requirement, budget, or property link directly to Monali Khedekar for quick responses.
                  </p>
                  <a
                    href={siteConfig.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-emerald-600/30 hover:scale-105 active:scale-95"
                  >
                    <span>Open WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="group bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-blue-50 text-[#102D50] rounded-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Mail size={24} />
                </div>
                <div className="flex-grow">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Email Correspondence
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#102D50] mb-1 group-hover:text-[#D71935] transition-colors">
                    Direct Inquiry
                  </h3>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm font-semibold text-[#102D50] hover:text-[#D71935] transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Office Address & Map Card */}
            <div className="group bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3.5 bg-slate-100 text-slate-700 rounded-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Location & Service Area
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#102D50] mb-1">
                    Pune, Maharashtra
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {siteConfig.contact.address.display}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Operating across Baner, Kharadi, Koregaon Park, Wakad, Kothrud, Viman Nagar, and Balewadi.
                  </p>
                </div>
              </div>

              {/* Verified Location Notice */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs text-slate-500">
                <div className="flex items-center gap-2 font-semibold text-slate-700 mb-1">
                  <Clock size={14} className="text-[#102D50]" />
                  <span>Consultation Hours</span>
                </div>
                <span>Monday &ndash; Saturday: 9:30 AM &ndash; 7:30 PM &bull; Sunday: By Prior Appointment for Site Visits</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Consultation Form */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-lg hover:shadow-2xl transition-all duration-500">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D71935]">
              Online Consultation Request
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#102D50] mt-1 mb-2">
              Send an Enquiry
            </h2>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed">
              Fill out your requirements below and Monali Khedekar will contact you with vetted options matching your criteria.
            </p>

            <PropertyEnquiryForm />
          </div>

        </div>
      </div>
    </div>
  );
}
