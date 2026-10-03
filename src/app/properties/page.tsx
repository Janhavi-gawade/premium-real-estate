"use client";

import { useState, Suspense } from "react";
import { properties } from "@/data/mockData";
import PropertyCard from "@/components/PropertyCard";
import { Filter, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const initPurpose = searchParams.get('purpose') || 'All';
  const initType = searchParams.get('type') || 'All';
  const initLocation = searchParams.get('location') || '';

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    purpose: initPurpose,
    type: initType,
    location: initLocation,
    sort: "Newest",
  });

  const filteredProperties = properties.filter((property) => {
    if (filters.purpose !== "All" && property.purpose !== filters.purpose) return false;
    if (filters.type !== "All" && !property.type.includes(filters.type)) return false;
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sort === "Price: Low to High") return a.priceValue - b.priceValue;
    if (filters.sort === "Price: High to Low") return b.priceValue - a.priceValue;
    return 0; // "Newest"
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-12">
          <p className="text-[#C8A97E] uppercase tracking-widest text-sm font-semibold mb-4">Portfolio</p>
          <h1 className="font-serif text-4xl md:text-5xl text-primary mb-6">Explore Properties</h1>
          <p className="text-gray-500 max-w-2xl font-light text-lg">
            Discover properties selected for different lifestyles, budgets and investment goals.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center space-x-2 bg-primary text-background py-3 uppercase text-sm tracking-widest w-full"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>

          {/* Filter Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-1/4 lg:shadow-none lg:bg-transparent lg:z-0 overflow-y-auto ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 lg:p-0">
              <div className="flex justify-between items-center mb-8 lg:hidden">
                <h3 className="font-serif text-2xl">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
              </div>

              <div className="space-y-8">
                {/* Purpose */}
                <div>
                  <h4 className="uppercase text-xs font-semibold tracking-widest text-gray-400 mb-4">Purpose</h4>
                  <div className="flex space-x-4">
                    {["All", "Buy", "Rent"].map((p) => (
                      <button
                        key={p}
                        className={`px-4 py-2 border text-sm transition-colors ${filters.purpose === p ? 'border-[#C8A97E] text-[#C8A97E] bg-[#C8A97E]/5' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                        onClick={() => setFilters({ ...filters, purpose: p })}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <h4 className="uppercase text-xs font-semibold tracking-widest text-gray-400 mb-4">Property Type</h4>
                  <select 
                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] bg-transparent"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <option value="All">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <h4 className="uppercase text-xs font-semibold tracking-widest text-gray-400 mb-4">Location</h4>
                  <input 
                    type="text" 
                    placeholder="Search location..."
                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] bg-transparent"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  />
                </div>

                {/* Sort */}
                <div>
                  <h4 className="uppercase text-xs font-semibold tracking-widest text-gray-400 mb-4">Sort By</h4>
                  <select 
                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#C8A97E] bg-transparent"
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  >
                    <option value="Newest">Newest</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                  </select>
                </div>
                
                <button 
                  className="w-full border border-primary text-primary py-3 uppercase text-sm tracking-widest hover:bg-primary hover:text-background transition-colors"
                  onClick={() => {
                    setFilters({ purpose: "All", type: "All", location: "", sort: "Newest" });
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Overlay for mobile filter */}
          {isFilterOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)} />
          )}

          {/* Property Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex justify-between items-center text-sm text-gray-500">
              <p>Showing <span className="font-semibold text-primary">{filteredProperties.length}</span> properties</p>
            </div>
            
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProperties.map((property, idx) => (
                  <PropertyCard key={property.id} property={property} index={idx} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white border border-gray-100">
                <h3 className="font-serif text-2xl text-primary mb-2">No properties found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading properties...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
