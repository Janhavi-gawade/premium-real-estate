"use client";

import { useState } from "react";
import { X, Calendar, Phone, User, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Property } from "@/types";
import { createEnquiry } from "@/lib/db/enquiries";

interface VisitRequestModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function VisitRequestModal({ property, isOpen, onClose }: VisitRequestModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning (10 AM - 1 PM)");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

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
    if (!preferredDate) {
      setErrorMsg("Please select your preferred visit date.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createEnquiry({
        property_id: property.id,
        property_title: property.title,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        enquiry_type: "visit_request",
        preferred_date: preferredDate,
        message: `Preferred Slot: ${preferredTime}. Note: ${message.trim() || "No additional notes"}`,
      });

      setIsSuccess(true);
    } catch {
      setErrorMsg("Unable to submit visit request. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#102D50] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D71935] mb-1">
            <Calendar size={14} />
            <span>Schedule Property Visit</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-white line-clamp-1">
            {property.title}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {property.location} &bull; {property.price_label}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle2 size={54} className="mx-auto text-emerald-600 mb-4 animate-in zoom-in" />
              <h4 className="font-serif text-2xl font-bold text-[#102D50] mb-2">
                Visit Request Received!
              </h4>
              <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. Monali Khedekar or our relationship manager will contact you at <strong>{phone}</strong> to confirm gate entry and escort your visit.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="bg-[#102D50] hover:bg-[#1A4273] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#102D50]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#102D50]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#102D50]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Visit Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={minDate}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#102D50]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Time Slot
                  </label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-3 text-slate-400" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-[#102D50]"
                    >
                      <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
                      <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                      <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Any Specific Requirements or Questions?
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Inquiring about Vastu, car parking, or negotiation flexibility."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#102D50]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D71935] hover:bg-[#B8142C] text-white py-3 rounded-lg font-semibold text-sm transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <span>Confirm Site Visit Request</span>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  No consultation fee. Complete privacy guaranteed.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
