"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Maximize2, 
  Phone, 
  User, 
  Mail, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight,
  Loader2,
  Trash2,
  Camera
} from "lucide-react";
import { createSubmission } from "@/lib/db/submissions";
import { siteConfig } from "@/config/site";
import { processMultipleImageFiles } from "@/lib/utils/imageUpload";

export default function SellPropertyPage() {
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [propertyType, setPropertyType] = useState("3 BHK Apartment");
  const [location, setLocation] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [carpetArea, setCarpetArea] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageList, setImageList] = useState<string[]>([]);
  
  // PC / Mobile File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlOption, setShowUrlOption] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFilesSelected = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingFiles(true);
    setUploadProgress(`Optimizing photo 1 of ${files.length}...`);

    try {
      const urls = await processMultipleImageFiles(files, (curr, total) => {
        setUploadProgress(`Optimizing photo ${curr} of ${total}...`);
      });

      if (urls.length > 0) {
        setImageList((prev) => [...prev, ...urls]);
      }
    } catch (err) {
      console.error("Error processing photos:", err);
    } finally {
      setIsUploadingFiles(false);
      setUploadProgress("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrl.trim() && imageUrl.startsWith("http")) {
      setImageList([...imageList, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageList(imageList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!ownerName.trim()) {
      setErrorMsg("Please enter your name as the property owner.");
      return;
    }
    if (!ownerPhone.trim() || ownerPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg("Please provide a valid 10-digit contact number.");
      return;
    }
    if (!location.trim()) {
      setErrorMsg("Please specify the locality/address in Pune.");
      return;
    }
    const numPrice = parseFloat(expectedPrice.replace(/,/g, ''));
    if (!numPrice || isNaN(numPrice) || numPrice <= 0) {
      setErrorMsg("Please enter a valid expected price.");
      return;
    }
    const numArea = parseFloat(carpetArea.replace(/,/g, ''));
    if (!numArea || isNaN(numArea) || numArea <= 0) {
      setErrorMsg("Please enter the carpet area in sq.ft.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createSubmission({
        owner_name: ownerName.trim(),
        owner_phone: ownerPhone.trim(),
        owner_email: ownerEmail.trim() || undefined,
        property_type: propertyType,
        location: location.trim(),
        expected_price: numPrice,
        carpet_area: numArea,
        description: description.trim() || undefined,
        images: imageList,
      });

      setIsSuccess(true);
    } catch {
      setErrorMsg("Could not submit property details. Please reach out to Monali Khedekar directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-[#102D50] text-white py-14 px-4 sm:px-6 lg:px-8 mb-12 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D71935] bg-white/10 px-3 py-1 rounded-full inline-block mb-3">
            Direct Owner Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Sell or Rent Your Property in Pune
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Partner with Monali Khedekar and Arth Properties. We connect your property with pre-qualified buyers and verified corporate tenants with zero spam and total confidentiality.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-red-50 text-[#D71935] rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#102D50] mb-1">
                Verified Buyers Only
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every buyer inquiry is vetted before scheduling property visits, protecting your privacy.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-[#102D50] rounded-lg">
              <IndianRupee size={24} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#102D50] mb-1">
                Optimal Valuation
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Comparative micro-market analysis to position your asset for maximum return without lingering unsold.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-lg">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#102D50] mb-1">
                End-to-End Closing
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Agreement drafting, title clearance verification, society NOCs, and sub-registrar registration assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10">
          {isSuccess ? (
            <div className="text-center py-12 max-w-lg mx-auto">
              <CheckCircle2 size={64} className="text-emerald-600 mx-auto mb-4 animate-in zoom-in" />
              <h2 className="font-serif text-3xl font-bold text-[#102D50] mb-3">
                Property Submitted Successfully!
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Thank you, <strong>{ownerName}</strong>. Your listing submission has been securely recorded. <strong>Monali Khedekar</strong> will personally review your specifications and contact you at <strong>{ownerPhone}</strong> within 24 hours to schedule an introductory consultation.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 mb-8 text-left">
                <span className="font-semibold text-slate-700 block mb-1">Notice on Public Visibility:</span>
                Under our quality and security standards, owner submissions undergo title diligence and client verification before being published live to the public catalogue.
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setOwnerName("");
                    setOwnerPhone("");
                    setOwnerEmail("");
                    setLocation("");
                    setExpectedPrice("");
                    setCarpetArea("");
                    setDescription("");
                    setImageList([]);
                  }}
                  className="bg-[#102D50] hover:bg-[#1A4273] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto"
                >
                  Submit Another Property
                </button>
                <Link
                  href="/properties"
                  className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto text-center"
                >
                  Browse Current Portfolio
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#102D50] mb-1">
                  Property & Ownership Details
                </h2>
                <p className="text-xs text-slate-500">
                  Please complete the form below. Required fields are marked with an asterisk (*).
                </p>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* SECTION 1: OWNER INFO */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#D71935] mb-4">
                  1. Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Owner Full Name *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="e.g. Monali Khedekar"
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#102D50]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Contact Number *
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        placeholder="10-digit mobile"
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#102D50]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="owner@example.com"
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#102D50]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PROPERTY ATTRIBUTES */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#D71935] mb-4">
                  2. Property Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Property Type *
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-[#102D50]"
                    >
                      <option value="1 BHK Apartment">1 BHK Apartment</option>
                      <option value="2 BHK Apartment">2 BHK Apartment</option>
                      <option value="3 BHK Apartment">3 BHK Apartment</option>
                      <option value="4+ BHK Luxury Apartment">4+ BHK Luxury Apartment</option>
                      <option value="Independent Villa / Bungalow">Independent Villa / Bungalow</option>
                      <option value="Commercial Office Space">Commercial Office Space</option>
                      <option value="Commercial Showroom / Retail">Commercial Showroom / Retail</option>
                      <option value="NA Residential Plot">NA Residential Plot</option>
                      <option value="Agricultural / Industrial Land">Agricultural / Industrial Land</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Locality in Pune *
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Baner, Kharadi, Wakad"
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#102D50]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Expected Price (in ₹) *
                    </label>
                    <div className="relative">
                      <IndianRupee size={16} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="number"
                        required
                        min="10000"
                        value={expectedPrice}
                        onChange={(e) => setExpectedPrice(e.target.value)}
                        placeholder="e.g. 18500000"
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#102D50]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Carpet Area (sq.ft.) *
                    </label>
                    <div className="relative">
                      <Maximize2 size={16} className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="number"
                        required
                        min="50"
                        value={carpetArea}
                        onChange={(e) => setCarpetArea(e.target.value)}
                        placeholder="e.g. 1450"
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#102D50]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Property Description & Key Highlights
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about age of property, floor level, Vastu facing, parking slots, society amenities, furnishing status, and reason for sale..."
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#102D50]"
                  />
                </div>
              </div>

              {/* SECTION 3: PHOTOS */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#D71935]">
                    3. Property Photographs (Optional)
                  </h3>
                  {imageList.length > 0 && (
                    <span className="text-[11px] font-semibold text-slate-500">
                      {imageList.length} photo{imageList.length === 1 ? "" : "s"} selected
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Upload photos directly from your PC or mobile, or enter links. You can also share high-res photos later on WhatsApp with Monali Khedekar.
                </p>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  multiple
                  onChange={(e) => handleFilesSelected(e.target.files)}
                  className="hidden"
                />

                {/* Drag & Drop Upload Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isUploadingFiles && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? "border-[#102D50] bg-blue-50/80 scale-[1.01]"
                      : "border-slate-300 hover:border-[#102D50] bg-slate-50/70 hover:bg-slate-50"
                  }`}
                >
                  {isUploadingFiles ? (
                    <div className="flex flex-col items-center gap-2 py-3">
                      <Loader2 size={28} className="animate-spin text-[#102D50]" />
                      <span className="text-xs font-bold text-slate-800">
                        {uploadProgress || "Optimizing photos..."}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Preparing lightweight images for instant review
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-red-50 text-[#D71935] flex items-center justify-center shadow-xs">
                        <Upload size={22} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#102D50] hover:underline">
                          Choose photos from your PC or Phone
                        </span>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          or drag & drop image files directly here
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        PNG, JPG, JPEG, WEBP accepted (Photos are auto-compressed for speed)
                      </p>
                    </>
                  )}
                </div>

                {/* Preview Grid */}
                {imageList.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {imageList.map((url, i) => (
                      <div key={i} className="relative h-28 rounded-xl overflow-hidden border border-slate-200 group bg-slate-900 shadow-xs">
                        <Image
                          src={url}
                          alt={`Property photo ${i + 1}`}
                          fill
                          unoptimized={Boolean(url.startsWith("data:"))}
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition shadow-sm cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 size={13} />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/80 text-white text-[10px] font-bold rounded">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Optional URL Toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowUrlOption(!showUrlOption)}
                    className="text-xs font-semibold text-slate-600 hover:text-[#102D50] flex items-center gap-1.5 transition underline decoration-dotted cursor-pointer"
                  >
                    <span>{showUrlOption ? "− Hide link input" : "+ Or add photos via web link / URL"}</span>
                  </button>

                  {showUrlOption && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/property-image.jpg"
                        className="flex-grow px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#102D50]"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#102D50]" />
                  <span>Your phone number and price expectation are treated with strict confidentiality.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#D71935] to-[#B8142C] hover:from-[#B8142C] hover:to-[#D71935] text-white px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group/btn cursor-pointer"
                >
                  <span>{isSubmitting ? "Submitting Listing..." : "Submit Listing for Broker Review"}</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* FAQ Section for Owners */}
        <div className="mt-16 bg-white p-8 rounded-2xl border border-slate-200">
          <h3 className="font-serif text-xl font-bold text-[#102D50] mb-6">
            Frequently Asked Questions by Property Owners
          </h3>
          <div className="space-y-5 text-sm text-slate-600">
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">
                How does Arth Properties help sell my property faster?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We tap into our active database of Pune IT professionals, corporate relocations, and repeat NRI investors. We also conduct comparative market pricing so your asset isn't underpriced or sitting stagnant.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">
                Will my listing be published on the website immediately?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                No. To maintain our reputation for verified, authentic properties, Monali Khedekar first conducts a verification call with you, checks title details, and obtains your formal approval before public syndication.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">
                What are the brokerage charges?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We follow standardized real estate association brokerage norms in Pune (typically 2% on outright sales and 1-month rent for lease transactions), due only upon successful registration and payment transfer.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
