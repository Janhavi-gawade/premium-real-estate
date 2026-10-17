"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileSpreadsheet, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  IndianRupee, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  Building2, 
  X, 
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";
import { OwnerSubmission, SubmissionStatus } from "@/types";
import { getSubmissions, updateSubmissionStatus, approveSubmissionToProperty, deleteSubmission } from "@/lib/db/submissions";
import { formatIndianPrice, formatArea, sanitizePhone } from "@/lib/utils/formatters";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<OwnerSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);

  // Rejection note modal state
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchSubmissionsList = async () => {
    setLoading(true);
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissionsList();

    const handleSync = () => {
      fetchSubmissionsList();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("arth_submissions_updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("arth_submissions_updated", handleSync);
    };
  }, []);

  const handleApproveAndConvert = async (id: string) => {
    if (!confirm("Approve this submission and automatically generate a live property listing in your portfolio?")) {
      return;
    }

    setConvertingId(id);
    try {
      const newProp = await approveSubmissionToProperty(id);
      if (newProp) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, review_status: "approved" as SubmissionStatus } : s));
        setFeedbackMsg({
          type: "success",
          text: `Submission approved! Property "${newProp.title}" was created successfully.`,
        });
      }
    } catch (err) {
      console.error("Approve error:", err);
      setFeedbackMsg({ type: "error", text: "Failed to convert submission to property." });
    } finally {
      setConvertingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    try {
      await updateSubmissionStatus(rejectId, "rejected", rejectReason || "Does not meet current portfolio criteria.");
      setSubmissions(prev => prev.map(s => s.id === rejectId ? { ...s, review_status: "rejected" as SubmissionStatus, admin_notes: rejectReason } : s));
      setRejectId(null);
      setRejectReason("");
      setFeedbackMsg({ type: "success", text: "Submission marked as rejected." });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      console.error("Reject error:", err);
      setFeedbackMsg({ type: "error", text: "Failed to reject submission." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this owner submission?")) return;
    try {
      await deleteSubmission(id);
      setSubmissions(prev => prev.filter(s => s.id !== id));
      setFeedbackMsg({ type: "success", text: "Submission removed permanently." });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setFeedbackMsg({ type: "error", text: "Failed to delete submission." });
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      s.owner_name.toLowerCase().includes(query) ||
      s.owner_phone.toLowerCase().includes(query) ||
      (s.owner_email && s.owner_email.toLowerCase().includes(query)) ||
      s.location.toLowerCase().includes(query) ||
      s.property_type.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "All" || s.review_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = submissions.length;
  const pendingCount = submissions.filter(s => s.review_status === "pending").length;
  const approvedCount = submissions.filter(s => s.review_status === "approved").length;
  const rejectedCount = submissions.filter(s => s.review_status === "rejected").length;

  return (
    <div className="space-y-6">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="text-[#D71935]" size={26} />
            Owner Submissions Review
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review property listings submitted directly by owners for sale or lease across Pune.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSubmissionsList}
            className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            title="Refresh Submissions"
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

      {/* STATS METRIC TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter("All")}
          className={`p-3.5 rounded-xl border text-left transition shadow-xs ${
            statusFilter === "All" ? "bg-white border-[#102D50] ring-2 ring-[#102D50]/20" : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">All Submissions</div>
          <div className="text-xl font-bold text-slate-900 mt-0.5">{totalCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("pending")}
          className={`p-3.5 rounded-xl border text-left transition shadow-xs ${
            statusFilter === "pending" ? "bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/20" : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Pending Review</div>
          <div className="text-xl font-bold text-amber-700 mt-0.5">{pendingCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("approved")}
          className={`p-3.5 rounded-xl border text-left transition shadow-xs ${
            statusFilter === "approved" ? "bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/20" : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Approved & Live</div>
          <div className="text-xl font-bold text-emerald-700 mt-0.5">{approvedCount}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("rejected")}
          className={`p-3.5 rounded-xl border text-left transition shadow-xs ${
            statusFilter === "rejected" ? "bg-red-50/50 border-red-500 ring-2 ring-red-500/20" : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">Rejected</div>
          <div className="text-xl font-bold text-red-700 mt-0.5">{rejectedCount}</div>
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by owner name, phone, Pune locality, or property type..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#102D50] focus:bg-white transition"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#102D50]"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* SUBMISSIONS LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-8 h-8 border-3 border-[#D71935] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading owner submissions...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
            <FileSpreadsheet className="mx-auto text-slate-300 mb-3" size={40} />
            <h3 className="text-base font-semibold text-slate-800">No submissions found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No owner property submissions match your current filters.
            </p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => {
            const formattedDate = new Date(sub.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            const waText = encodeURIComponent(
              `Namaste ${sub.owner_name}, Monali Khedekar here from Arth Properties regarding your property submission (${sub.property_type} in ${sub.location}). We have reviewed your details and would like to coordinate title inspection and photos.`
            );

            return (
              <div 
                key={sub.id} 
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition"
              >
                {/* Header row: Property type, status badge, timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-lg">
                      {sub.property_type}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">in</span>
                    <span className="text-sm font-semibold text-[#102D50] flex items-center gap-1">
                      <MapPin size={13} className="text-[#D71935]" />
                      {sub.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      sub.review_status === "pending"
                        ? "bg-amber-100 text-amber-800 ring-1 ring-amber-300"
                        : sub.review_status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {sub.review_status}
                    </span>
                    <span className="text-xs text-slate-400">{formattedDate}</span>
                  </div>
                </div>

                {/* Main details grid: Specs & Owner Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Financials & Specs */}
                  <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Property Specs & Price
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Expected Valuation:</span>
                      <span className="text-base font-bold text-emerald-700">
                        {formatIndianPrice(sub.expected_price, "buy")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Carpet Area:</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {formatArea(sub.carpet_area)}
                      </span>
                    </div>

                    {sub.description && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <div className="text-xs text-slate-500 font-medium mb-1">Owner Notes:</div>
                        <p className="text-xs text-slate-700 italic">
                          &quot;{sub.description}&quot;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Owner Contact Details */}
                  <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Property Owner Details
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Owner Name:</span>
                      <span className="text-xs font-bold text-slate-900">{sub.owner_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Phone:</span>
                      <span className="text-xs font-semibold text-slate-800">+91 {sub.owner_phone}</span>
                    </div>
                    {sub.owner_email && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">Email:</span>
                        <span className="text-xs text-slate-800">{sub.owner_email}</span>
                      </div>
                    )}

                    {sub.admin_notes && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <div className="text-xs text-slate-500 font-medium mb-0.5">Admin Review Log:</div>
                        <p className="text-xs text-slate-600">{sub.admin_notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Uploaded Images Preview if any */}
                {sub.images && sub.images.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <ImageIcon size={13} />
                      Attached Photos ({sub.images.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sub.images.map((img, idx) => (
                        <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
                          <img
                            src={img}
                            alt="Uploaded property photo"
                            className="w-16 h-14 object-cover rounded-md border border-slate-200 hover:opacity-80 transition"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Bar: Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  {/* Owner Contact Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${sanitizePhone(sub.owner_phone)}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-[#102D50] hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition"
                    >
                      <Phone size={13} />
                      Call Owner
                    </a>

                    <a
                      href={`https://wa.me/91${sanitizePhone(sub.owner_phone)}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-semibold rounded-lg transition"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.35.491 1.199.534 1.286.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.148.567 4.167 1.558 5.922l-1.566 5.727 5.885-1.544c1.706.929 3.654 1.458 5.723 1.458 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                      </svg>
                      WhatsApp
                    </a>

                    {sub.owner_email && (
                      <a
                        href={`mailto:${sub.owner_email}`}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                        title="Email Owner"
                      >
                        <Mail size={15} />
                      </a>
                    )}
                  </div>

                  {/* Workflow Approval & Rejection */}
                  <div className="flex items-center gap-2">
                    {sub.review_status !== "approved" && (
                      <button
                        type="button"
                        onClick={() => handleApproveAndConvert(sub.id)}
                        disabled={convertingId === sub.id}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition active:scale-[0.98] disabled:opacity-50"
                      >
                        <Sparkles size={14} />
                        {convertingId === sub.id ? "Converting..." : "Approve & Convert to Live Listing"}
                      </button>
                    )}

                    {sub.review_status === "approved" && (
                      <Link
                        href="/admin/properties"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
                      >
                        <CheckCircle2 size={13} />
                        View in Properties
                      </Link>
                    )}

                    {sub.review_status === "pending" && (
                      <button
                        type="button"
                        onClick={() => { setRejectId(sub.id); setRejectReason(""); }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs font-semibold rounded-lg transition"
                      >
                        <XCircle size={13} />
                        Reject
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Submission"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* REJECT REASON MODAL */}
      {rejectId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Reject Owner Submission</h3>
              <button onClick={() => setRejectId(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            
            <p className="text-xs text-slate-600">
              Provide an internal reason or notes for rejecting this listing (e.g. out of service area, duplicate, incomplete documents):
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Property is outside Pune municipal limits / Price expectations unrealistic."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
