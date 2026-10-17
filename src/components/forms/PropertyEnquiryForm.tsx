"use client";

import { useState } from "react";
import { Phone, User, Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { createEnquiry } from "@/lib/db/enquiries";
import { siteConfig } from "@/config/site";

interface PropertyEnquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
  className?: string;
}

export default function PropertyEnquiryForm({
  propertyId,
  propertyTitle,
  className = "",
}: PropertyEnquiryFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createEnquiry({
        property_id: propertyId,
        property_title: propertyTitle,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        enquiry_type: propertyId ? "general" : "call_back",
        message: message.trim() || (propertyTitle ? `Inquiry regarding ${propertyTitle}` : "General real estate advisory enquiry"),
      });

      setIsSuccess(true);
    } catch {
      setErrorMsg("Unable to send enquiry. Please contact us directly via phone or WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center ${className}`}>
        <CheckCircle2 size={40} className="mx-auto text-emerald-600 mb-3" />
        <h4 className="font-serif font-bold text-lg text-emerald-900 mb-1">
          Enquiry Received
        </h4>
        <p className="text-xs text-emerald-800 leading-relaxed mb-4">
          Thank you, <strong>{name}</strong>. Monali Khedekar will connect with you shortly at <strong>{phone}</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSuccess(false);
            setName("");
            setPhone("");
            setEmail("");
            setMessage("");
          }}
          className="text-xs font-semibold text-emerald-700 underline hover:text-emerald-900"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200">
          <AlertCircle size={15} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Your Full Name *
        </label>
        <div className="relative">
          <User size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Anand Joshi"
            className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#102D50] transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Mobile Number *
        </label>
        <div className="relative">
          <Phone size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
            className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#102D50] transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Email Address (Optional)
        </label>
        <div className="relative">
          <Mail size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="anand@example.com"
            className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#102D50] transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Requirement / Message
        </label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={propertyTitle ? `Inquiring about ${propertyTitle}` : "Describe your budget, BHK, or preferred Pune locality..."}
          className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#102D50] transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-[#102D50] to-[#1A4273] hover:from-[#1A4273] hover:to-[#102D50] text-white py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#102D50]/20 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2.5 disabled:opacity-50 group/btn cursor-pointer"
      >
        <Send size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
        <span>{isSubmitting ? "Sending..." : "Submit Enquiry"}</span>
      </button>

      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-[11px] text-slate-500">
          Or speak directly with Monali Khedekar:
        </p>
        <a
          href={`tel:${siteConfig.contact.primaryPhone}`}
          className="text-xs font-bold text-[#D71935] hover:underline"
        >
          {siteConfig.contact.primaryPhoneDisplay}
        </a>
      </div>
    </form>
  );
}
