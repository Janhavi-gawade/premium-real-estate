import { Property, PropertyFilterParams } from "@/types";
import { formatIndianPrice, slugify } from "@/lib/utils/formatters";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

// Initial seed data for Pune properties
const initialProperties: Property[] = [
  {
    id: "prop-1",
    title: "The Sovereign Grandeur — 3 BHK Luxury Apartment",
    slug: "the-sovereign-grandeur-3bhk-baner",
    description: "An opulent 3 BHK residence situated in prime Baner on a high floor with unhindered skyline views. Designed with Italian marble flooring, 10.5 ft floor-to-ceiling heights, expansive deck balcony, and premium modular fittings. Located in close proximity to top schools and the Mumbai-Pune Expressway.",
    category: "residential",
    transaction_type: "buy",
    price: 18500000,
    price_label: "₹1.85 Cr",
    location: "Baner, Pune",
    landmark: "Near Balewadi High Street",
    carpet_area: 1450,
    built_up_area: 1820,
    bedrooms: 3,
    bathrooms: 3,
    furnishing_status: "semi-furnished",
    amenities: ["Clubhouse", "Infinity Swimming Pool", "Gymnasium", "Landscaped Garden", "24x7 Security with CCTV", "2 Covered Car Parks", "100% Power Backup", "EV Charging Station"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    status: "available",
    is_published: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "prop-2",
    title: "Elysium Towers — 4 BHK Ultra-Luxury Residence",
    slug: "elysium-towers-4bhk-kharadi",
    description: "Expansive 4 BHK family apartment in Pune’s booming IT hub of Kharadi. Features private elevator lobby access, sound-insulated double-glazed windows, staff quarters, and double-height living room overlooking the Mula-Mutha river greenery.",
    category: "residential",
    transaction_type: "buy",
    price: 32000000,
    price_label: "₹3.20 Cr",
    location: "Kharadi, Pune",
    landmark: "Behind EON Free Zone",
    carpet_area: 2350,
    built_up_area: 2900,
    bedrooms: 4,
    bathrooms: 4,
    furnishing_status: "fully-furnished",
    amenities: ["Sky Lounge", "Temperature Controlled Pool", "Tennis Court", "High Speed Elevators", "Concierge Service", "Visitor Parking", "Intercom", "Banquet Hall"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    status: "available",
    is_published: true,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "prop-3",
    title: "Koregaon Heritage Villa — 5 BHK Estate",
    slug: "koregaon-heritage-villa-5bhk",
    description: "A rare independent heritage villa nestled in the lush green foliage of Lane 5, Koregaon Park. Features private landscaped gardens, heated plunge pool, dedicated servant quarters, and expansive courtyards offering unparalleled privacy in Pune’s most prestigious enclave.",
    category: "residential",
    transaction_type: "buy",
    price: 55000000,
    price_label: "₹5.50 Cr",
    location: "Koregaon Park, Pune",
    landmark: "Lane 5, Koregaon Park",
    carpet_area: 4200,
    built_up_area: 5100,
    bedrooms: 5,
    bathrooms: 6,
    furnishing_status: "fully-furnished",
    amenities: ["Private Plunge Pool", "Manicured Lawn", "Home Automation", "Security Cabin", "Private Terrace", "Covered Portico for 4 Cars", "Staff Quarters"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    status: "available",
    is_published: true,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: "prop-4",
    title: "Solitaire One — 2 BHK Modern Garden Residence",
    slug: "solitaire-one-2bhk-wakad",
    description: "Smartly configured 2 BHK home crafted for modern urban families and IT professionals. Excellent connectivity to Hinjewadi Phase 1, Dange Chowk, and Bhumkar Chowk. Zero space wastage layout with Vastu-compliant north-east entry.",
    category: "residential",
    transaction_type: "buy",
    price: 9500000,
    price_label: "₹95 Lakh",
    location: "Wakad, Pune",
    landmark: "Near Datta Mandir Road",
    carpet_area: 820,
    built_up_area: 1050,
    bedrooms: 2,
    bathrooms: 2,
    furnishing_status: "semi-furnished",
    amenities: ["Gymnasium", "Children Play Area", "Rooftop Gazebo", "Solar Water Heating", "CCTV Surveillance", "Covered Parking", "Fire Fighting System"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    status: "available",
    is_published: true,
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: "prop-5",
    title: "Apex Corporate Park — Grade A Office Floor",
    slug: "apex-corporate-park-viman-nagar",
    description: "Pre-leased / bare-shell Grade A commercial space strategically situated 10 minutes from Pune International Airport. Triple height welcoming reception, central air conditioning provision, 6 high-speed passenger elevators, and LEED gold certified green building.",
    category: "commercial",
    transaction_type: "buy",
    price: 24000000,
    price_label: "₹2.40 Cr",
    location: "Viman Nagar, Pune",
    landmark: "Opposite Phoenix Marketcity",
    carpet_area: 1650,
    built_up_area: 2100,
    bedrooms: 0,
    bathrooms: 2,
    furnishing_status: "unfurnished",
    amenities: ["24x7 Power Backup", "Basement Parking", "Food Court", "High Speed Fiber Connectivity", "Access Controlled Entry", "BMS Automation"],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    status: "available",
    is_published: true,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "prop-6",
    title: "Sahyadri Greens — NA Premium Residential Villa Plot",
    slug: "sahyadri-greens-villa-plot-bavdhan",
    description: "Collector-approved NA residential plot in a gated villa community with panoramic hill views of Chandani Chowk and Bavdhan valleys. Clear title, demarcation done, water & electricity connections ready to build your custom dream bungalow.",
    category: "plots",
    transaction_type: "buy",
    price: 12500000,
    price_label: "₹1.25 Cr",
    location: "Bavdhan, Pune",
    landmark: "Behind Bavdhan Hills",
    carpet_area: 3200,
    built_up_area: 3200,
    bedrooms: 0,
    bathrooms: 0,
    furnishing_status: "unfurnished",
    amenities: ["Gated Community", "Concrete Internal Roads", "Street Lighting", "Water Connection at Plot", "Boundary Wall", "Clubhouse Access"],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    status: "available",
    is_published: true,
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: "prop-7",
    title: "Metro Prime Suites — 2 BHK Executive Rental",
    slug: "metro-prime-suites-2bhk-balewadi",
    description: "Tastefully furnished 2 BHK apartment available for immediate long-term lease. Ideal for corporate executives and senior IT managers. Walking distance from Balewadi High Street, cafes, and supermarkets.",
    category: "residential",
    transaction_type: "rent",
    price: 42000,
    price_label: "₹42,000 / month",
    location: "Balewadi, Pune",
    landmark: "Adjacent to High Street",
    carpet_area: 980,
    built_up_area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    furnishing_status: "fully-furnished",
    amenities: ["Modular Kitchen with Chimney", "Sofa & Dining Table", "AC in Bedrooms", "Washing Machine", "Covered Parking", "Clubhouse"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    status: "available",
    is_published: true,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "prop-8",
    title: "Kothrud Central — 3 BHK Family Apartment",
    slug: "kothrud-central-3bhk",
    description: "Premium 3 BHK home in established, culturally rich Kothrud. Direct connectivity to Paud Road and Pune Metro station. Peaceful residential neighborhood with reputed schools, parks, and temples nearby.",
    category: "residential",
    transaction_type: "buy",
    price: 21000000,
    price_label: "₹2.10 Cr",
    location: "Kothrud, Pune",
    landmark: "Near Vanaz Metro Station",
    carpet_area: 1380,
    built_up_area: 1750,
    bedrooms: 3,
    bathrooms: 3,
    furnishing_status: "semi-furnished",
    amenities: ["Gymnasium", "Society Office", "Solar Panels", "Rainwater Harvesting", "Video Door Phone", "Reserved Stilt Parking"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    status: "available",
    is_published: true,
    created_at: new Date(Date.now() - 16 * 86400000).toISOString(),
  }
];

const STORAGE_KEY = "arth_properties_v1";

function loadFromStorage(): Property[] {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read properties from localStorage:", e);
    }
  }
  return [...initialProperties];
}

function saveToStorage(items: Property[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event("arth_properties_updated"));
    } catch (e) {
      console.warn("Could not write properties to localStorage:", e);
    }
  }
}

// Fallback in-memory & browser storage for development/preview when Supabase env vars are pending
let localPropertiesStore: Property[] = loadFromStorage();


/**
 * Fetch all properties matching filter criteria
 */
export async function getProperties(
  params: PropertyFilterParams = {},
  includeUnpublished: boolean = false
): Promise<Property[]> {
  // If Supabase is configured, fetch from PostgreSQL
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('properties').select('*');

      if (!includeUnpublished) {
        query = query.eq('is_published', true);
      }

      if (params.purpose && params.purpose !== 'All') {
        query = query.eq('transaction_type', params.purpose.toLowerCase());
      }

      if (params.category && params.category !== 'All') {
        query = query.eq('category', params.category.toLowerCase());
      }

      if (params.status && params.status !== 'All') {
        query = query.eq('status', params.status.toLowerCase());
      }

      if (params.location) {
        query = query.ilike('location', `%${params.location}%`);
      }

      if (params.minPrice) {
        query = query.gte('price', params.minPrice);
      }

      if (params.maxPrice) {
        query = query.lte('price', params.maxPrice);
      }

      if (params.bedrooms && params.bedrooms !== 'All') {
        if (params.bedrooms === '4+') {
          query = query.gte('bedrooms', 4);
        } else {
          query = query.eq('bedrooms', parseInt(params.bedrooms, 10));
        }
      }

      // Sorting
      if (params.sort === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (params.sort === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Property[];
      }
    } catch (err) {
      console.warn("Supabase query error, falling back to local dataset:", err);
    }
  }

  // Local fallback filtering
  if (typeof window !== "undefined") {
    localPropertiesStore = loadFromStorage();
  }
  let results = [...localPropertiesStore];

  if (!includeUnpublished) {
    results = results.filter(p => p.is_published);
  }

  if (params.purpose && params.purpose !== 'All') {
    results = results.filter(p => p.transaction_type.toLowerCase() === params.purpose?.toLowerCase());
  }

  if (params.category && params.category !== 'All') {
    results = results.filter(p => p.category.toLowerCase() === params.category?.toLowerCase());
  }

  if (params.status && params.status !== 'All') {
    results = results.filter(p => p.status.toLowerCase() === params.status?.toLowerCase());
  }

  if (params.location) {
    results = results.filter(p => p.location.toLowerCase().includes(params.location!.toLowerCase()));
  }

  if (params.minPrice) {
    results = results.filter(p => p.price >= params.minPrice!);
  }

  if (params.maxPrice) {
    results = results.filter(p => p.price <= params.maxPrice!);
  }

  if (params.bedrooms && params.bedrooms !== 'All') {
    if (params.bedrooms === '4+') {
      results = results.filter(p => p.bedrooms >= 4);
    } else {
      results = results.filter(p => p.bedrooms === parseInt(params.bedrooms!, 10));
    }
  }

  // Sort
  if (params.sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (params.sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else {
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return results;
}

/**
 * Fetch a single property by slug or ID
 */
export async function getPropertyBySlugOrId(identifier: string): Promise<Property | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
      const query = supabase.from('properties').select('*');
      
      const { data, error } = isUuid
        ? await query.eq('id', identifier).single()
        : await query.eq('slug', identifier).single();

      if (!error && data) {
        return data as Property;
      }
    } catch (err) {
      console.warn("Supabase fetch error, checking local store:", err);
    }
  }

  const prop = localPropertiesStore.find(p => p.slug === identifier || p.id === identifier);
  return prop || null;
}

/**
 * Create a new property listing
 */
export async function createProperty(data: Omit<Property, 'id' | 'created_at'>): Promise<Property> {
  const newSlug = data.slug || slugify(`${data.title}-${data.location}`);
  const priceLabel = data.price_label || formatIndianPrice(data.price, data.transaction_type);

  const newProperty: Property = {
    ...data,
    id: `prop-${Date.now()}`,
    slug: newSlug,
    price_label: priceLabel,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: dbData, error } = await supabase
        .from('properties')
        .insert([{
          title: newProperty.title,
          slug: newProperty.slug,
          description: newProperty.description,
          category: newProperty.category,
          transaction_type: newProperty.transaction_type,
          price: newProperty.price,
          price_label: newProperty.price_label,
          location: newProperty.location,
          landmark: newProperty.landmark,
          carpet_area: newProperty.carpet_area,
          built_up_area: newProperty.built_up_area,
          bedrooms: newProperty.bedrooms,
          bathrooms: newProperty.bathrooms,
          furnishing_status: newProperty.furnishing_status,
          amenities: newProperty.amenities,
          images: newProperty.images,
          featured: newProperty.featured,
          status: newProperty.status,
          is_published: newProperty.is_published,
        }])
        .select()
        .single();

      if (!error && dbData) {
        localPropertiesStore.unshift(dbData as Property);
        saveToStorage(localPropertiesStore);
        return dbData as Property;
      }
    } catch (err) {
      console.error("Supabase insert error, persisting to local store:", err);
    }
  }

  localPropertiesStore.unshift(newProperty);
  saveToStorage(localPropertiesStore);
  return newProperty;
}

/**
 * Update an existing property
 */
export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  if (updates.price && !updates.price_label && updates.transaction_type) {
    updates.price_label = formatIndianPrice(updates.price, updates.transaction_type);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const index = localPropertiesStore.findIndex(p => p.id === id);
        if (index !== -1) localPropertiesStore[index] = data as Property;
        saveToStorage(localPropertiesStore);
        return data as Property;
      }
    } catch (err) {
      console.error("Supabase update error:", err);
    }
  }

  const index = localPropertiesStore.findIndex(p => p.id === id);
  if (index === -1) return null;

  localPropertiesStore[index] = {
    ...localPropertiesStore[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  saveToStorage(localPropertiesStore);
  return localPropertiesStore[index];
}

/**
 * Delete a property
 */
export async function deleteProperty(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (!error) {
        localPropertiesStore = localPropertiesStore.filter(p => p.id !== id);
        saveToStorage(localPropertiesStore);
        return true;
      }
    } catch (err) {
      console.error("Supabase delete error:", err);
    }
  }

  const initialLength = localPropertiesStore.length;
  localPropertiesStore = localPropertiesStore.filter(p => p.id !== id);
  saveToStorage(localPropertiesStore);
  return localPropertiesStore.length < initialLength;
}
