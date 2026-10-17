"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, X, Search, RotateCcw, Building2, MapPin, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { getProperties } from "@/lib/db/properties";
import { Property, PropertyFilterParams } from "@/types";
import PropertyCard from "@/components/PropertyCard";
import { siteConfig } from "@/config/site";

function PropertiesCatalog() {
  const searchParams = useSearchParams();

  // Query parameter defaults
  const initPurpose = searchParams.get("purpose") || "All";
  const initCategory = searchParams.get("category") || "All";
  const initLocation = searchParams.get("location") || "";
  const initBedrooms = searchParams.get("bedrooms") || "All";

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter state
  const [purpose, setPurpose] = useState(initPurpose);
  const [category, setCategory] = useState(initCategory);
  const [location, setLocation] = useState(initLocation);
  const [bedrooms, setBedrooms] = useState(initBedrooms);
  const [status, setStatus] = useState("All");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">("newest");

  // Sync state if URL query params change
  useEffect(() => {
    if (searchParams.get("purpose")) setPurpose(searchParams.get("purpose")!);
    if (searchParams.get("category")) setCategory(searchParams.get("category")!);
    if (searchParams.get("location")) setLocation(searchParams.get("location")!);
    if (searchParams.get("bedrooms")) setBedrooms(searchParams.get("bedrooms")!);
  }, [searchParams]);

  useEffect(() => {
    async function fetchFilteredProperties() {
      setLoading(true);
      try {
        const params: PropertyFilterParams = {
          purpose,
          category,
          location: location.trim() || undefined,
          bedrooms,
          status,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          sort,
        };

        const data = await getProperties(params);
        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredProperties();
  }, [purpose, category, location, bedrooms, status, minPrice, maxPrice, sort]);

  const handleResetFilters = () => {
    setPurpose("All");
    setCategory("All");
    setLocation("");
    setBedrooms("All");
    setStatus("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
  };

  const hasActiveFilters =
    purpose !== "All" ||
    category !== "All" ||
    location !== "" ||
    bedrooms !== "All" ||
    status !== "All" ||
    minPrice !== "" ||
    maxPrice !== "";

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D71935]">
                Verified Real Estate Portfolio
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#102D50] mt-1">
                Explore Properties in Pune
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Showing {properties.length} curated listings managed by Monali Khedekar &bull; Arth Properties
              </p>
            </div>

            {/* Mobile Filter & Sort Triggers */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center justify-center gap-2 bg-[#102D50] text-white px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex-grow"
              >
                <Filter size={16} />
                <span>Filters {hasActiveFilters && "(Active)"}</span>
              </button>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="bg-white border border-slate-300 py-2.5 px-3 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Quick Locality Filter Bar with Hover Elevations */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm">
            <span className="text-slate-400 flex-shrink-0 font-medium">Quick Locality:</span>
            {siteConfig.primeLocations.map((loc) => {
              const isSelected = location.toLowerCase() === loc.toLowerCase();
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(isSelected ? "" : loc)}
                  className={`px-3.5 py-1.5 rounded-full border transition-all duration-300 flex-shrink-0 font-medium hover:scale-105 active:scale-95 ${
                    isSelected
                      ? "bg-[#102D50] text-white border-[#102D50] shadow-sm shadow-[#102D50]/20"
                      : "bg-white text-slate-600 border-slate-200 hover:border-[#102D50] hover:text-[#102D50] hover:shadow-xs"
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Cards */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-28 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-base font-bold text-[#102D50]">
                  <SlidersHorizontal size={17} />
                  <span>Filter Catalogue</span>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-[#D71935] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Purpose (Buy / Rent) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Transaction Purpose
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["All", "Buy", "Rent"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPurpose(p)}
                      className={`py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors ${
                        purpose.toLowerCase() === p.toLowerCase()
                          ? "bg-[#102D50] text-white border-[#102D50]"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-[#102D50]"
                >
                  <option value="All">All Categories</option>
                  <option value="residential">Residential Homes</option>
                  <option value="commercial">Commercial Spaces</option>
                  <option value="plots">Plots & Land</option>
                  <option value="investment">Investment Assets</option>
                </select>
              </div>

              {/* Bedrooms (BHK) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Bedrooms (BHK)
                </label>
                <div className="grid grid-cols-5 gap-1 text-center">
                  {["All", "1", "2", "3", "4+"].map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => setBedrooms(bhk)}
                      className={`py-1.5 text-xs sm:text-sm font-semibold rounded border transition-colors ${
                        bedrooms === bhk
                          ? "bg-[#102D50] text-white border-[#102D50]"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Locality in Pune
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search locality..."
                    className="w-full bg-slate-50 border border-slate-200 py-2.5 pl-9 pr-3 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#102D50]"
                  />
                </div>
              </div>

              {/* Availability Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-[#102D50]"
                >
                  <option value="All">All Statuses</option>
                  <option value="available">Available Only</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Budget (₹ in INR)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    className="bg-slate-50 border border-slate-200 py-1.5 px-2.5 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-[#102D50]"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    className="bg-slate-50 border border-slate-200 py-1.5 px-2.5 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-[#102D50]"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* LISTINGS CONTAINER */}
          <main className="flex-grow">
            {/* Desktop Top Toolbar */}
            <div className="hidden lg:flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-slate-200 mb-6 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">
                Found <strong className="text-[#102D50]">{properties.length}</strong> matching properties
              </span>

              <div className="flex items-center gap-2">
                <ArrowUpDown size={14} className="text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 py-1 px-3 rounded text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-96 rounded-xl bg-slate-200/70 animate-pulse" />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="font-serif text-2xl font-bold text-[#102D50] mb-2">
                  No Properties Match Your Filter Criteria
                </h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                  Try adjusting your budget, BHK requirement, or locality filter to see more options in Pune.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-[#102D50] hover:bg-[#1A4273] text-white px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  <RotateCcw size={14} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </main>

        </div>

      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="font-serif text-xl font-bold text-[#102D50]">
                Filter Catalogue
              </h3>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 flex-grow">
              {/* Purpose */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Purpose
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["All", "Buy", "Rent"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPurpose(p)}
                      className={`py-2 text-xs font-semibold rounded-lg border ${
                        purpose.toLowerCase() === p.toLowerCase()
                          ? "bg-[#102D50] text-white border-[#102D50]"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg text-sm"
                >
                  <option value="All">All Categories</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="plots">Plots</option>
                  <option value="investment">Investment</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Bedrooms
                </label>
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {["All", "1", "2", "3", "4+"].map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => setBedrooms(bhk)}
                      className={`py-2 text-xs font-semibold rounded border ${
                        bedrooms === bhk
                          ? "bg-[#102D50] text-white border-[#102D50]"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Locality
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Baner"
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-1/2 border border-slate-300 py-2.5 rounded-lg text-xs font-semibold text-slate-700"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-1/2 bg-[#102D50] text-white py-2.5 rounded-lg text-xs font-semibold"
              >
                View ({properties.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-sm text-slate-500">Loading properties catalogue...</div>}>
      <PropertiesCatalog />
    </Suspense>
  );
}
