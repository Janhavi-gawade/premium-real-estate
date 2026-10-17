"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  MessageSquare, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowRight, 
  Phone, 
  Check, 
  AlertCircle,
  Eye,
  TrendingUp
} from "lucide-react";
import { getProperties } from "@/lib/db/properties";
import { getEnquiries, updateEnquiryStatus } from "@/lib/db/enquiries";
import { getSubmissions, approveSubmissionToProperty } from "@/lib/db/submissions";
import { Property, Enquiry, OwnerSubmission } from "@/types";
import { formatIndianPrice } from "@/lib/utils/formatters";
import { siteConfig } from "@/config/site";

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [submissions, setSubmissions] = useState<OwnerSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [props, enqs, subs] = await Promise.all([
          getProperties({}, true), // include unpublished
          getEnquiries(),
          getSubmissions(),
        ]);
        setProperties(props);
        setEnquiries(enqs);
        setSubmissions(subs);
      } catch (e) {
        console.error("Error loading dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();

    const handleSync = () => {
      loadMetrics();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("arth_submissions_updated", handleSync);
    window.addEventListener("arth_enquiries_updated", handleSync);
    window.addEventListener("arth_properties_updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("arth_submissions_updated", handleSync);
      window.removeEventListener("arth_enquiries_updated", handleSync);
      window.removeEventListener("arth_properties_updated", handleSync);
    };
  }, []);

  const totalProps = properties.length;
  const availableProps = properties.filter(p => p.status === "available").length;
  const soldOrRented = properties.filter(p => p.status === "sold" || p.status === "rented").length;
  const newEnquiries = enquiries.filter(e => e.status === "new").length;
  const pendingSubmissions = submissions.filter(s => s.review_status === "pending").length;

  const handleMarkContacted = async (id: string) => {
    await updateEnquiryStatus(id, "contacted");
    setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: "contacted" } : e));
    setActionSuccess("Enquiry marked as Contacted.");
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleApproveSubmission = async (id: string) => {
    const newProp = await approveSubmissionToProperty(id);
    if (newProp) {
      setSubmissions(submissions.map(s => s.id === id ? { ...s, review_status: "approved" } : s));
      setProperties([newProp, ...properties]);
      setActionSuccess(`Submission approved and added to listings: ${newProp.title}`);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#102D50] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading real-time executive metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D71935]">
            Management Dashboard
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#102D50] mt-1">
            Welcome back, {siteConfig.founder.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live overview of Arth Properties listings, leads, and owner submissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties?action=new"
            className="inline-flex items-center gap-2 bg-[#D71935] hover:bg-[#B8142C] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow"
          >
            <Plus size={16} />
            <span>Add Property</span>
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Properties */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Listings</span>
            <div className="p-2 bg-blue-50 text-[#102D50] rounded-lg">
              <Building2 size={18} />
            </div>
          </div>
          <div className="font-serif font-black text-3xl text-[#102D50] mb-1">
            {totalProps}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {availableProps} Available Now
          </span>
        </div>

        {/* Sold / Rented */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Deals Closed</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="font-serif font-black text-3xl text-[#102D50] mb-1">
            {soldOrRented}
          </div>
          <span className="text-[11px] text-slate-500">
            Sold or Leased Out
          </span>
        </div>

        {/* New Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Inquiries</span>
            <div className="p-2 bg-red-50 text-[#D71935] rounded-lg">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="font-serif font-black text-3xl text-[#D71935] mb-1">
            {newEnquiries}
          </div>
          <span className="text-[11px] text-slate-500">
            {enquiries.length} Total Received
          </span>
        </div>

        {/* Owner Submissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Owner Submissions</span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <FileSpreadsheet size={18} />
            </div>
          </div>
          <div className="font-serif font-black text-3xl text-purple-900 mb-1">
            {pendingSubmissions}
          </div>
          <span className="text-[11px] text-purple-700 font-semibold">
            Pending Broker Review
          </span>
        </div>
      </div>

      {/* TWO COLUMN INBOX: RECENT ENQUIRIES + OWNER SUBMISSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* RECENT ENQUIRIES */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#102D50]">
                Recent Inquiries & Site Visits
              </h2>
              <p className="text-xs text-slate-400">Direct leads from website visitors</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-[#D71935] hover:underline flex items-center gap-1"
            >
              <span>View All ({enquiries.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {enquiries.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No enquiries received yet.</p>
          ) : (
            <div className="space-y-4 flex-grow">
              {enquiries.slice(0, 4).map((enq) => {
                const isNew = enq.status === "new";
                return (
                  <div
                    key={enq.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-bold text-sm text-[#102D50]">{enq.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <a href={`tel:${enq.phone}`} className="hover:text-[#D71935] font-medium flex items-center gap-1">
                            <Phone size={12} />
                            <span>{enq.phone}</span>
                          </a>
                          {enq.email && <span>&bull; {enq.email}</span>}
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isNew ? "bg-red-100 text-red-700" : "bg-slate-200 text-slate-700"
                      }`}>
                        {enq.status}
                      </span>
                    </div>

                    {enq.property_title && (
                      <p className="text-xs font-semibold text-slate-700 bg-white p-2 rounded border border-slate-100 mb-2 truncate">
                        Listing: {enq.property_title}
                      </p>
                    )}

                    {enq.message && (
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3 italic">
                        &ldquo;{enq.message}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-[10px] text-slate-400">
                        {new Date(enq.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/91${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${enq.name}, Monali Khedekar here from Arth Properties regarding your real estate inquiry.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366] text-white px-2.5 py-1 rounded text-[11px] font-semibold"
                        >
                          WhatsApp
                        </a>

                        {isNew && (
                          <button
                            type="button"
                            onClick={() => handleMarkContacted(enq.id)}
                            className="bg-[#102D50] hover:bg-[#1A4273] text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors"
                          >
                            Mark Contacted
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RECENT OWNER SUBMISSIONS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#102D50]">
                Owner Property Submissions
              </h2>
              <p className="text-xs text-slate-400">Sell/Rent submissions awaiting review</p>
            </div>
            <Link
              href="/admin/submissions"
              className="text-xs font-bold text-[#D71935] hover:underline flex items-center gap-1"
            >
              <span>View All ({submissions.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {submissions.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No owner submissions yet.</p>
          ) : (
            <div className="space-y-4 flex-grow">
              {submissions.slice(0, 4).map((sub) => {
                const isPending = sub.review_status === "pending";
                return (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-bold text-sm text-[#102D50]">
                          {sub.property_type} in {sub.location}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Owner: <strong>{sub.owner_name}</strong> &bull; {sub.owner_phone}
                        </p>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isPending ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {sub.review_status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 mb-3 bg-white p-2 rounded border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Expected Price</span>
                        <span className="font-bold">{formatIndianPrice(sub.expected_price)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Carpet Area</span>
                        <span className="font-bold">{sub.carpet_area} sq.ft.</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-[10px] text-slate-400">
                        {new Date(sub.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${sub.owner_phone}`}
                          className="border border-slate-300 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold hover:bg-slate-100"
                        >
                          Call Owner
                        </a>

                        {isPending && (
                          <button
                            type="button"
                            onClick={() => handleApproveSubmission(sub.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                          >
                            <Check size={12} />
                            <span>Approve & List</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
