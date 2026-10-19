"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink,
  IndianRupee,
  MapPin,
  Maximize2,
  Check,
  RefreshCw,
  Upload,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { Property, PropertyCategory, TransactionType, PropertyStatus, FurnishingStatus } from "@/types";
import { getProperties, createProperty, updateProperty, deleteProperty } from "@/lib/db/properties";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { formatIndianPrice, formatArea, slugify } from "@/lib/utils/formatters";
import { processMultipleImageFiles } from "@/lib/utils/imageUpload";

const STANDARD_AMENITIES = [
  "Clubhouse",
  "Swimming Pool",
  "Gymnasium",
  "24x7 Security with CCTV",
  "Covered Car Parking",
  "100% Power Backup",
  "Landscaped Garden",
  "Children's Play Area",
  "High Speed Elevators",
  "EV Charging Station",
  "Jogging Track",
  "Intercom Facility",
  "Rainwater Harvesting",
  "Solar Water Heating",
  "Fire Fighting System",
  "Visitor Parking"
];

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

type FormData = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  category: PropertyCategory;
  transaction_type: TransactionType;
  price: number;
  price_label: string;
  location: string;
  landmark: string;
  carpet_area: number;
  built_up_area: number;
  bedrooms: number;
  bathrooms: number;
  furnishing_status: FurnishingStatus;
  amenities: string[];
  images: string[];
  featured: boolean;
  status: PropertyStatus;
  is_published: boolean;
};

const emptyFormData: FormData = {
  title: "",
  slug: "",
  description: "",
  category: "residential",
  transaction_type: "buy",
  price: 15000000,
  price_label: "₹1.50 Cr",
  location: "Baner, Pune",
  landmark: "",
  carpet_area: 1200,
  built_up_area: 1500,
  bedrooms: 3,
  bathrooms: 3,
  furnishing_status: "semi-furnished",
  amenities: ["24x7 Security with CCTV", "Covered Car Parking", "100% Power Backup"],
  images: [DEFAULT_IMAGE],
  featured: false,
  status: "available",
  is_published: true,
};

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [customAmenity, setCustomAmenity] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Direct PC Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await getProperties({});
      setProperties(data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();

    const handleSync = () => {
      fetchListings();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("arth_properties_updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("arth_properties_updated", handleSync);
    };
  }, []);

  // Filter listings
  const filteredProperties = properties.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.landmark && p.landmark.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    const matchesType = selectedType === "All" || p.transaction_type === selectedType;

    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData(emptyFormData);
    setNewImageUrl("");
    setCustomAmenity("");
    setShowUrlField(false);
    setUploadProgressText("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (property: Property) => {
    setIsEditing(true);
    setFormData({
      id: property.id,
      title: property.title,
      slug: property.slug,
      description: property.description,
      category: property.category,
      transaction_type: property.transaction_type,
      price: property.price,
      price_label: property.price_label,
      location: property.location,
      landmark: property.landmark || "",
      carpet_area: property.carpet_area,
      built_up_area: property.built_up_area || property.carpet_area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      furnishing_status: property.furnishing_status || "semi-furnished",
      amenities: property.amenities || [],
      images: property.images && property.images.length > 0 ? property.images : [DEFAULT_IMAGE],
      featured: property.featured,
      status: property.status,
      is_published: property.is_published,
    });
    setNewImageUrl("");
    setCustomAmenity("");
    setShowUrlField(false);
    setUploadProgressText("");
    setIsModalOpen(true);
  };

  // Handle Title Change & auto-slug
  const handleTitleChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: isEditing ? prev.slug : slugify(val)
    }));
  };

  // Handle Price Change & auto price label
  const handlePriceChange = (val: number) => {
    setFormData(prev => ({
      ...prev,
      price: val,
      price_label: formatIndianPrice(val, prev.transaction_type)
    }));
  };

  // Handle Transaction Type Change
  const handleTypeChange = (type: TransactionType) => {
    setFormData(prev => ({
      ...prev,
      transaction_type: type,
      price_label: formatIndianPrice(prev.price, type)
    }));
  };

  // Handle Amenity Toggle
  const toggleAmenity = (item: string) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== item)
          : [...prev.amenities, item]
      };
    });
  };

  // Add Custom Amenity
  const handleAddCustomAmenity = () => {
    if (!customAmenity.trim()) return;
    if (!formData.amenities.includes(customAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, customAmenity.trim()]
      }));
    }
    setCustomAmenity("");
  };

  // Set image as Cover (move to index 0)
  const handleSetCover = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const nextImages = [...prev.images];
      const [chosen] = nextImages.splice(index, 1);
      nextImages.unshift(chosen);
      return { ...prev, images: nextImages };
    });
  };

  // Process direct files from PC / Phone / Drag-and-drop
  const handleFilesSelected = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingImages(true);
    setUploadProgressText(`Compressing photo 1 of ${files.length}...`);

    try {
      const urls = await processMultipleImageFiles(files, (curr, total) => {
        setUploadProgressText(`Compressing & preparing photo ${curr} of ${total}...`);
      });

      if (urls.length > 0) {
        setFormData((prev) => {
          // If only default placeholder image was there, replace it
          const onlyHasPlaceholder =
            prev.images.length === 1 && prev.images[0] === DEFAULT_IMAGE;
          const nextImages = onlyHasPlaceholder ? urls : [...prev.images, ...urls];
          return { ...prev, images: nextImages };
        });
      }
    } catch (err) {
      console.error("Error processing photos:", err);
      alert("Failed to process some photos. Please ensure files are valid image formats.");
    } finally {
      setIsUploadingImages(false);
      setUploadProgressText("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  // Add Image URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()]
    }));
    setNewImageUrl("");
  };

  // Remove Image URL
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  // Save Property (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.price) {
      alert("Please fill in Title, Location, and Price.");
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && formData.id) {
        await updateProperty(formData.id, {
          title: formData.title,
          slug: formData.slug || slugify(formData.title),
          description: formData.description,
          category: formData.category,
          transaction_type: formData.transaction_type,
          price: Number(formData.price),
          price_label: formData.price_label || formatIndianPrice(formData.price, formData.transaction_type),
          location: formData.location,
          landmark: formData.landmark,
          carpet_area: Number(formData.carpet_area),
          built_up_area: Number(formData.built_up_area),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          furnishing_status: formData.furnishing_status,
          amenities: formData.amenities,
          images: formData.images.length > 0 ? formData.images : [DEFAULT_IMAGE],
          featured: formData.featured,
          status: formData.status,
          is_published: formData.is_published,
        });
        setFeedbackMsg({ type: "success", text: "Property updated successfully!" });
      } else {
        await createProperty({
          title: formData.title,
          slug: formData.slug || slugify(formData.title),
          description: formData.description || "Premium property listing by Arth Properties, Pune.",
          category: formData.category,
          transaction_type: formData.transaction_type,
          price: Number(formData.price),
          price_label: formData.price_label || formatIndianPrice(formData.price, formData.transaction_type),
          location: formData.location,
          landmark: formData.landmark,
          carpet_area: Number(formData.carpet_area),
          built_up_area: Number(formData.built_up_area),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          furnishing_status: formData.furnishing_status,
          amenities: formData.amenities,
          images: formData.images.length > 0 ? formData.images : [DEFAULT_IMAGE],
          featured: formData.featured,
          status: formData.status,
          is_published: formData.is_published,
        });
        setFeedbackMsg({ type: "success", text: "New property listing added successfully!" });
      }

      setIsModalOpen(false);
      await fetchListings();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      console.error("Save property error:", err);
      setFeedbackMsg({ type: "error", text: "Failed to save property. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = async (id: string, currentStatus: PropertyStatus) => {
    const nextStatusMap: Record<PropertyStatus, PropertyStatus> = {
      available: "sold",
      sold: "rented",
      rented: "available"
    };
    const nextStatus = nextStatusMap[currentStatus];

    try {
      await updateProperty(id, { status: nextStatus });
      setProperties(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p));
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  // Quick Toggle Featured
  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await updateProperty(id, { featured: !currentFeatured });
      setProperties(prev => prev.map(p => p.id === id ? { ...p, featured: !currentFeatured } : p));
    } catch (err) {
      console.error("Featured toggle error:", err);
    }
  };

  // Quick Toggle Published
  const handleTogglePublished = async (id: string, currentPublished: boolean) => {
    try {
      await updateProperty(id, { is_published: !currentPublished });
      setProperties(prev => prev.map(p => p.id === id ? { ...p, is_published: !currentPublished } : p));
    } catch (err) {
      console.error("Published toggle error:", err);
    }
  };

  // Delete Property
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteProperty(deleteId);
      setProperties(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
      setFeedbackMsg({ type: "success", text: "Property listing removed permanently." });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      console.error("Delete property error:", err);
      setFeedbackMsg({ type: "error", text: "Failed to delete property." });
    } finally {
      setIsDeleting(false);
    }
  };

  const countAvailable = properties.filter(p => p.status === 'available').length;
  const countSold = properties.filter(p => p.status === 'sold').length;
  const countRented = properties.filter(p => p.status === 'rented').length;
  const countFeatured = properties.filter(p => p.featured).length;

  return (
    <div className="space-y-6">
      
      {/* HEADER & QUICK STATS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="text-[#D71935]" size={26} />
              Property Management
            </h1>
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Cloud Synced (Visible on all devices)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Local Cache Only (Connecting...)
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Create, update, toggle availability status, and control public visibility of all listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchListings}
            className="p-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            title="Refresh Listings"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D71935] text-white rounded-xl text-sm font-semibold hover:bg-[#b0132a] shadow-sm transition active:scale-[0.98]"
          >
            <Plus size={18} />
            Add New Property
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

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Listings</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{properties.length}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Building2 size={18} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Available</div>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">{countAvailable}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Sold / Rented</div>
            <div className="text-xl font-bold text-amber-700 mt-0.5">{countSold + countRented}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Maximize2 size={18} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Featured</div>
            <div className="text-xl font-bold text-indigo-700 mt-0.5">{countFeatured}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Star size={18} />
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location (Baner, Kharadi), or landmark..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#102D50] focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#102D50]"
          >
            <option value="All">All Categories</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="plots">Plots & Land</option>
            <option value="investment">Investment</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#102D50]"
          >
            <option value="All">All Types</option>
            <option value="buy">For Sale</option>
            <option value="rent">For Rent</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#102D50]"
          >
            <option value="All">All Statuses</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </div>
      </div>

      {/* PROPERTIES TABLE (Desktop) & CARDS (Mobile) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#D71935] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading property portfolio...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="mx-auto text-slate-300 mb-3" size={40} />
            <h3 className="text-base font-semibold text-slate-800">No properties found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No listings matched your active filter criteria. Try clearing filters or add a new property listing.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedStatus("All"); setSelectedType("All"); }}
              className="mt-4 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Type / Cat</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Specs</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-center">Published</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50/60 transition">
                      
                      {/* Property Thumbnail & Title */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.images?.[0] || DEFAULT_IMAGE}
                            alt={prop.title}
                            className="w-14 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate" title={prop.title}>
                              {prop.title}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                              <MapPin size={12} className="shrink-0 text-slate-400" />
                              <span className="truncate">{prop.location}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Transaction Type */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                            prop.transaction_type === 'rent' ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {prop.transaction_type === 'rent' ? "For Rent" : "For Sale"}
                          </span>
                          <span className="text-xs text-slate-600 capitalize">
                            {prop.category}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {prop.price_label || formatIndianPrice(prop.price, prop.transaction_type)}
                      </td>

                      {/* Specs */}
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        <div>{prop.bedrooms > 0 ? `${prop.bedrooms} BHK` : "Commercial/Plot"}</div>
                        <div className="text-slate-400">{formatArea(prop.carpet_area)}</div>
                      </td>

                      {/* Status quick toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(prop.id, prop.status)}
                          title="Click to cycle status: Available -> Sold -> Rented"
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 transition ${
                            prop.status === "available"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : prop.status === "sold"
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            prop.status === "available" ? "bg-emerald-600" : prop.status === "sold" ? "bg-red-600" : "bg-blue-600"
                          }`} />
                          <span className="capitalize">{prop.status}</span>
                        </button>
                      </td>

                      {/* Featured toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(prop.id, prop.featured)}
                          title="Toggle Featured on homepage"
                          className={`p-1.5 rounded-lg transition ${
                            prop.featured ? "text-amber-500 hover:bg-amber-50" : "text-slate-300 hover:text-slate-400"
                          }`}
                        >
                          <Star size={18} fill={prop.featured ? "currentColor" : "none"} />
                        </button>
                      </td>

                      {/* Published toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(prop.id, prop.is_published)}
                          title="Toggle public visibility"
                          className={`p-1.5 rounded-lg transition ${
                            prop.is_published ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-300 hover:text-slate-400"
                          }`}
                        >
                          {prop.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/properties/${prop.slug || prop.id}`}
                            target="_blank"
                            title="Preview Public Page"
                            className="p-1.5 text-slate-500 hover:text-[#102D50] hover:bg-slate-100 rounded-lg transition"
                          >
                            <ExternalLink size={16} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prop)}
                            title="Edit Listing Details"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteId(prop.id)}
                            title="Delete Listing"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Card View */}
            <div className="lg:hidden divide-y divide-slate-100">
              {filteredProperties.map((prop) => (
                <div key={prop.id} className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <img
                      src={prop.images?.[0] || DEFAULT_IMAGE}
                      alt={prop.title}
                      className="w-20 h-20 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          prop.transaction_type === 'rent' ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {prop.transaction_type === 'rent' ? "Rent" : "Sale"}
                        </span>
                        <span className="text-[11px] text-slate-500 capitalize">{prop.category}</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">{prop.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </p>
                      <div className="text-sm font-bold text-[#102D50] mt-1">
                        {prop.price_label || formatIndianPrice(prop.price, prop.transaction_type)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span>{prop.bedrooms > 0 ? `${prop.bedrooms} BHK` : "Plot/Office"}</span>
                      <span>•</span>
                      <span>{formatArea(prop.carpet_area)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(prop.id, prop.status)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          prop.status === "available" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {prop.status}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(prop.id, prop.featured)}
                        className={`p-1 rounded ${prop.featured ? "text-amber-500" : "text-slate-300"}`}
                      >
                        <Star size={16} fill={prop.featured ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Link
                      href={`/properties/${prop.slug || prop.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    >
                      <ExternalLink size={13} />
                      Preview
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(prop)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                      <Edit3 size={13} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(prop.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ADD / EDIT PROPERTY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150 my-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isEditing ? "Edit Property Listing" : "Add New Property Listing"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter accurate specifications for Pune buyers and tenants.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#102D50] border-b pb-1.5">
                  1. Basic Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. The Sovereign Grandeur — 3 BHK Luxury Apartment"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                      placeholder="e.g. the-sovereign-grandeur-3bhk-baner"
                      className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as PropertyCategory })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                    >
                      <option value="residential">Residential (Apartments, Villas)</option>
                      <option value="commercial">Commercial (Offices, Retail)</option>
                      <option value="plots">Plots & Land</option>
                      <option value="investment">High-Yield Investment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Transaction Type *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleTypeChange("buy")}
                        className={`py-2 text-xs font-semibold rounded-lg border transition ${
                          formData.transaction_type === "buy"
                            ? "bg-[#102D50] text-white border-[#102D50]"
                            : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        For Sale (Buy)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTypeChange("rent")}
                        className={`py-2 text-xs font-semibold rounded-lg border transition ${
                          formData.transaction_type === "rent"
                            ? "bg-[#102D50] text-white border-[#102D50]"
                            : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        For Rent
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Price * <span className="font-normal text-slate-500">(e.g. 1.92 Cr, 85 Lakh, or ₹)</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.price_label ? formData.price_label.replace(/^₹\s*/, '') : (formData.price ? String(formData.price) : '')}
                          onChange={(e) => {
                            const val = e.target.value.trim();
                            const crMatch = val.match(/^([\d.]+)\s*(?:cr|crore|crores)?$/i);
                            const lakhMatch = val.match(/^([\d.]+)\s*(?:lakh|lakhs|lac|lacs|l)$/i);
                            if (lakhMatch) {
                              const num = parseFloat(lakhMatch[1]);
                              setFormData(prev => ({
                                ...prev,
                                price: Math.round(num * 100000),
                                price_label: `₹${lakhMatch[1]} Lakh`
                              }));
                            } else if (crMatch && (val.toLowerCase().includes('cr') || parseFloat(crMatch[1]) < 100)) {
                              const num = parseFloat(crMatch[1]);
                              setFormData(prev => ({
                                ...prev,
                                price: Math.round(num * 10000000),
                                price_label: `₹${crMatch[1]} Cr`
                              }));
                            } else {
                              const rawNum = Number(val.replace(/[^\d.]/g, ''));
                              handlePriceChange(isNaN(rawNum) ? 0 : rawNum);
                            }
                          }}
                          placeholder="e.g. 1.92 Cr or 85 Lakh"
                          className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const num = prompt("Enter price in Crores (e.g. 1.92):");
                          if (num && !isNaN(parseFloat(num))) {
                            setFormData(prev => ({
                              ...prev,
                              price: Math.round(parseFloat(num) * 10000000),
                              price_label: `₹${num} Cr`
                            }));
                          }
                        }}
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium border border-slate-300"
                      >
                        + Cr
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] mt-1.5 flex-wrap gap-1">
                      <span className="text-emerald-600 font-semibold">
                        Preview: {formData.price_label || '₹0'}
                      </span>
                      <div className="flex gap-1.5 text-slate-500 items-center">
                        <span>Quick:</span>
                        <button type="button" onClick={() => setFormData(p => ({ ...p, price: 19200000, price_label: "₹1.92 Cr" }))} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] hover:bg-slate-200">1.92 Cr</button>
                        <button type="button" onClick={() => setFormData(p => ({ ...p, price: 25000000, price_label: "₹2.50 Cr" }))} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] hover:bg-slate-200">2.5 Cr</button>
                        <button type="button" onClick={() => setFormData(p => ({ ...p, price: 8500000, price_label: "₹85 Lakh" }))} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] hover:bg-slate-200">85 Lakh</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Specs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#102D50] border-b pb-1.5">
                  2. Location & Dimensions
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location / Locality *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Baner, Pune"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Landmark / Vicinity
                    </label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="e.g. Near Balewadi High Street"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Carpet Area (sq.ft.) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.carpet_area}
                      onChange={(e) => setFormData({ ...formData, carpet_area: Number(e.target.value) })}
                      placeholder="1200"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Built-Up Area (sq.ft.)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.built_up_area}
                      onChange={(e) => setFormData({ ...formData, built_up_area: Number(e.target.value) })}
                      placeholder="1500"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bedrooms (BHK)
                    </label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                    >
                      <option value="0">0 (Commercial / Plot)</option>
                      <option value="1">1 BHK</option>
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4 BHK</option>
                      <option value="5">5+ BHK (Penthouse / Villa)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Furnishing Status
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["unfurnished", "semi-furnished", "fully-furnished"] as FurnishingStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setFormData({ ...formData, furnishing_status: st })}
                          className={`py-2 text-xs font-medium rounded-lg border capitalize transition ${
                            formData.furnishing_status === st
                              ? "bg-[#102D50] text-white border-[#102D50]"
                              : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {st.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Comprehensive Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail high ceilings, marble specifications, balcony orientation, builder pedigree, and society lifestyle amenities..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                />
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#102D50] border-b pb-1.5">
                  3. Society & Property Amenities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STANDARD_AMENITIES.map((am) => {
                    const isSelected = formData.amenities.includes(am);
                    return (
                      <button
                        key={am}
                        type="button"
                        onClick={() => toggleAmenity(am)}
                        className={`px-3 py-1.5 text-xs rounded-lg text-left border flex items-center justify-between transition ${
                          isSelected 
                            ? "bg-slate-900 text-white border-slate-900 font-medium" 
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate">{am}</span>
                        {isSelected && <Check size={14} className="shrink-0 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Amenity */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    placeholder="Add custom amenity (e.g. Private Terrace, Italian Marble)..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAmenity}
                    className="px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Images Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#102D50]">
                    4. Photography & Showcase Images
                  </h4>
                  <span className="text-[11px] font-medium text-slate-500">
                    {formData.images.length} photo{formData.images.length === 1 ? "" : "s"} attached
                  </span>
                </div>

                {/* Hidden File Input for PC upload */}
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
                  onClick={() => !isUploadingImages && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isDraggingOver
                      ? "border-[#102D50] bg-blue-50/80 scale-[1.01]"
                      : "border-slate-300 hover:border-[#102D50] bg-slate-50/60 hover:bg-slate-50"
                  }`}
                >
                  {isUploadingImages ? (
                    <div className="flex flex-col items-center gap-2 py-3">
                      <Loader2 size={30} className="animate-spin text-[#102D50]" />
                      <span className="text-xs font-bold text-slate-800">
                        {uploadProgressText || "Compressing & processing photos..."}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Optimizing resolution and file size for instant loading
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-blue-100/70 text-[#102D50] flex items-center justify-center shadow-xs">
                        <Upload size={22} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#102D50] hover:underline">
                          Click to select photos directly from your PC
                        </span>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          or drag & drop multiple files here from your desktop
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">JPG</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">PNG</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200">WEBP</span>
                        <span>• High-res camera photos automatically compressed</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Attached Gallery Grid */}
                {formData.images.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Photo Gallery (Click &quot;Set Cover&quot; to choose main listing image)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {formData.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-900 shadow-xs"
                        >
                          <img
                            src={imgUrl}
                            alt={`Property photo ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />

                          {/* Hover action bar */}
                          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetCover(idx);
                                }}
                                className="px-2.5 py-1 bg-white/95 hover:bg-white text-slate-900 text-[10.5px] font-bold rounded-md shadow-md flex items-center gap-1 transition cursor-pointer"
                                title="Make this photo the main cover on the catalogue"
                              >
                                <Star size={11} className="text-amber-500 fill-amber-500" />
                                <span>Set Cover</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                              }}
                              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md transition cursor-pointer"
                              title="Delete photo"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Badge indicator */}
                          {idx === 0 ? (
                            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black rounded-md flex items-center gap-1 shadow-sm">
                              <Star size={10} className="fill-slate-950" />
                              Main Cover
                            </span>
                          ) : (
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-medium rounded opacity-80">
                              #{idx + 1}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collapsible URL input for external links */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowUrlField(!showUrlField)}
                    className="text-xs font-semibold text-slate-600 hover:text-[#102D50] flex items-center gap-1.5 transition underline decoration-dotted cursor-pointer"
                  >
                    <span>{showUrlField ? "− Hide web URL input" : "+ Or paste an image link from web / Unsplash"}</span>
                  </button>

                  {showUrlField && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Paste image URL (e.g. https://images.unsplash.com/...)..."
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-700 transition cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Visibility Flags */}
              <div className="space-y-4 pt-2 border-t">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#102D50]">
                  5. Publishing & Availability
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Availability Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#102D50] focus:outline-hidden capitalize"
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold Out</option>
                      <option value="rented">Rented Out</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="feat_check"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-[#D71935] rounded focus:ring-[#D71935]"
                    />
                    <label htmlFor="feat_check" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Feature on Homepage
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="pub_check"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-4 h-4 text-[#102D50] rounded focus:ring-[#102D50]"
                    />
                    <label htmlFor="pub_check" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Publish to Website
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 text-sm font-semibold text-white bg-[#D71935] hover:bg-[#b0132a] rounded-lg transition shadow-sm disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Create Listing"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Delete Property Listing?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently remove this property? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-sm disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
