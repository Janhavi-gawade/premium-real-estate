"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink, 
  Filter, 
  X, 
  RefreshCw,
  Building2,
  AlertCircle
} from "lucide-react";
import { Enquiry, EnquiryStatus, EnquiryType } from "@/types";
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from "@/lib/db/enquiries";
import { sanitizePhone } from "@/lib/utils/formatters";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchEnquiriesList = async () => {
    setLoading(true);
    try {
      const data = await getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiriesList();

    const handleSync = () => {
      fetchEnquiriesList();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("arth_enquiries_updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("arth_enquiries_updated", handleSync);
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus } : null);
      }
      setFeedbackMsg({ type: "success", text: `Enquiry status updated to '${newStatus}'.` });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      console.error("Error updating status:", err);
      setFeedbackMsg({ type: "error", text: "Failed to update enquiry status." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer enquiry?")) return;
    try {
      await deleteEnquiry(id);
      setEnquiries(prev => prev.filter(e => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      setFeedbackMsg({ type: "success", text: "Enquiry deleted." });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      console.error("Error deleting enquiry:", err);
      setFeedbackMsg({ type: "error", text: "Failed to delete enquiry." });
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      e.name.toLowerCase().includes(query) ||
      e.phone.toLowerCase().includes(query) ||
      (e.email && e.email.toLowerCase().includes(query)) ||
      (e.property_title && e.property_title.toLowerCase().includes(query)) ||
      (e.message && e.message.toLowerCase().includes(query));

    const matchesStatus = statusFilter === "All" || e.status === statusFilter;
    const matchesType = typeFilter === "All" || e.enquiry_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCount = enquiries.length;
  const newCount = enquiries.filter(e => e.status === "new").length;
  const contactedCount = enquiries.filter(e => e.status === "contacted").length;
  const closedCount = enquiries.filter(e => e.status === "closed").length;

  return (
    <div className="space-y-6">
      
      {/* HEADER & QUICK STATS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="text-[#D71935]" size={26} />
            Customer Enquiries & Site Visits
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track inquiries, site visit bookings, and direct consultation requests from home buyers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchEnquiriesList}
            className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            title="Refresh Enquiries"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
            feedbackMsg.type === "success" 
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {feedbackMsg.type === "success" ? <CheckCircle2 size={20} className="text-emerald-600" /> : <AlertCircle size={20} className="text-red-600" />}
            <span className="text-sm font-medium">{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="p-1 hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter("All")}
          className={`p-3.5 rounded-xl border text-left transition shadow-xs ${
            statusFilter === "All" ? "bg-white border-[#102D50] ring-2 ring-[#102D50]/20" : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">All Leads</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">{totalCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("new")}
          className={`p-3.5 rounded-xl border text-left transition shadow-xs ${
            statusFilter === "new" ? "bg-red-50/50 border-red-500 ring-2 ring-red-500/20" : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">New (Uncontacted)</div>
          <div className="text-xl font-bold text-red-700 mt-0.5">{newCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("contacted")}
          className={`p-3.5 rounded-xl border text-left transition shadow-xs ${
            statusFilter === "contacted" ? "bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/20" : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">In Contact</div>
          <div className="text-xl font-bold text-amber-700 mt-0.5">{contactedCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("closed")}
          className={`p-3.5 rounded-xl border text-left transition shadow-xs ${
            statusFilter === "closed" ? "bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/20" : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Closed / Done</div>
          <div className="text-xl font-bold text-emerald-700 mt-0.5">{closedCount}</div>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, phone, email, or property title..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#102D50] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Enquiry Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#102D50]"
          >
            <option value="All">All Types</option>
            <option value="visit_request">Site Visit Requests</option>
            <option value="call_back">Call Back Requests</option>
            <option value="general">General Inquiries</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#102D50]"
          >
            <option value="All">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* ENQUIRIES LIST / TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#D71935] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading enquiries...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="mx-auto text-slate-300 mb-3" size={40} />
            <h3 className="text-base font-semibold text-slate-800">No enquiries match</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              There are currently no customer inquiries matching your active filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredEnquiries.map((enq) => {
              const formattedDate = new Date(enq.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              const waText = encodeURIComponent(
                `Namaste ${enq.name}, Monali Khedekar here from Arth Properties regarding your inquiry for ${enq.property_title || "property consultation in Pune"}. How can I assist you today?`
              );

              return (
                <div key={enq.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left Column: Lead details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{enq.name}</span>
                      
                      {/* Enquiry Type Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
                        enq.enquiry_type === "visit_request" 
                          ? "bg-purple-100 text-purple-800" 
                          : enq.enquiry_type === "call_back"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {enq.enquiry_type === "visit_request" ? "Site Visit Request" : enq.enquiry_type === "call_back" ? "Call Back" : "General Inquiry"}
                      </span>

                      {/* Status Badge */}
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                        enq.status === "new" 
                          ? "bg-red-100 text-red-800 ring-1 ring-red-400" 
                          : enq.status === "contacted"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {enq.status}
                      </span>

                      <span className="text-xs text-slate-400 ml-auto md:ml-2">
                        {formattedDate}
                      </span>
                    </div>

                    {/* Property Referenced */}
                    {enq.property_title && (
                      <div className="text-xs font-semibold text-[#102D50] flex items-center gap-1.5 bg-slate-100/70 px-2.5 py-1 rounded-md w-fit">
                        <Building2 size={13} className="text-[#D71935]" />
                        <span>Property: {enq.property_title}</span>
                      </div>
                    )}

                    {/* Preferred Date if visit request */}
                    {enq.preferred_date && (
                      <div className="text-xs font-medium text-purple-800 flex items-center gap-1.5">
                        <Calendar size={13} />
                        <span>Preferred Visit Date: <strong>{enq.preferred_date}</strong></span>
                      </div>
                    )}

                    {/* Message */}
                    {enq.message && (
                      <p className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 mt-2">
                        &quot;{enq.message}&quot;
                      </p>
                    )}

                    {/* Contact numbers */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1 font-medium">
                        <Phone size={13} className="text-slate-400" />
                        <span>+91 {enq.phone}</span>
                      </div>
                      {enq.email && (
                        <div className="flex items-center gap-1">
                          <Mail size={13} className="text-slate-400" />
                          <span>{enq.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions & Status selector */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    
                    {/* Status Select */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Status:</span>
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                        className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#102D50]"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 mt-1">
                      {/* Call Link */}
                      <a
                        href={`tel:${sanitizePhone(enq.phone)}`}
                        className="p-2 bg-slate-100 text-slate-700 hover:bg-[#102D50] hover:text-white rounded-lg transition"
                        title={`Call ${enq.name}`}
                      >
                        <Phone size={15} />
                      </a>

                      {/* WhatsApp Link */}
                      <a
                        href={`https://wa.me/91${sanitizePhone(enq.phone)}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition"
                        title={`WhatsApp ${enq.name}`}
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.35.491 1.199.534 1.286.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.148.567 4.167 1.558 5.922l-1.566 5.727 5.885-1.544c1.706.929 3.654 1.458 5.723 1.458 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>

                      {/* Email Link */}
                      {enq.email && (
                        <a
                          href={`mailto:${enq.email}`}
                          className="p-2 bg-slate-100 text-slate-700 hover:bg-[#102D50] hover:text-white rounded-lg transition"
                          title={`Email ${enq.email}`}
                        >
                          <Mail size={15} />
                        </a>
                      )}

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(enq.id)}
                        className="p-2 bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                        title="Delete Enquiry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
