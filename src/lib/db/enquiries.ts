import { Enquiry, EnquiryStatus } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

// Initial sample inquiries for admin dashboard demo
const initialEnquiries: Enquiry[] = [
  {
    id: "enq-1",
    property_id: "prop-1",
    property_title: "The Sovereign Grandeur — 3 BHK Luxury Apartment",
    name: "Vikram Malhotra",
    phone: "9822012345",
    email: "vikram.m@gmail.com",
    enquiry_type: "visit_request",
    preferred_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    message: "Interested in the 3 BHK corner unit. Would like to schedule an in-person site visit this Saturday around 11:30 AM.",
    status: "new",
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: "enq-2",
    property_id: "prop-5",
    property_title: "Apex Corporate Park — Grade A Office Floor",
    name: "Sunil Deshmukh",
    phone: "9823198765",
    email: "deshmukh.ventures@gmail.com",
    enquiry_type: "general",
    message: "Seeking floor plans and clear title documents for commercial investment in Viman Nagar.",
    status: "contacted",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "enq-3",
    name: "Pooja Kulkarni",
    phone: "9881145678",
    email: "pooja.k@outlook.com",
    enquiry_type: "call_back",
    message: "Looking for a 2 BHK or 3 BHK near Balewadi / Wakad under ₹1.2 Cr. Please call me back.",
    status: "new",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  }
];

const STORAGE_KEY = "arth_enquiries_v1";

function loadFromStorage(): Enquiry[] {
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
      console.warn("Could not read enquiries from localStorage:", e);
    }
  }
  return [...initialEnquiries];
}

function saveToStorage(items: Enquiry[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event("arth_enquiries_updated"));
    } catch (e) {
      console.warn("Could not write enquiries to localStorage:", e);
    }
  }
}

let localEnquiriesStore: Enquiry[] = loadFromStorage();

export async function createEnquiry(
  data: Omit<Enquiry, 'id' | 'created_at' | 'status'>
): Promise<Enquiry> {
  const newEnquiry: Enquiry = {
    ...data,
    id: `enq-${Date.now()}`,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: dbData, error } = await supabase
        .from('enquiries')
        .insert([{
          property_id: newEnquiry.property_id || null,
          property_title: newEnquiry.property_title || null,
          name: newEnquiry.name,
          phone: newEnquiry.phone,
          email: newEnquiry.email || null,
          enquiry_type: newEnquiry.enquiry_type,
          preferred_date: newEnquiry.preferred_date || null,
          message: newEnquiry.message || null,
          status: 'new',
        }])
        .select()
        .single();

      if (!error && dbData) {
        localEnquiriesStore.unshift(dbData as Enquiry);
        saveToStorage(localEnquiriesStore);
        return dbData as Enquiry;
      }
    } catch (err) {
      console.error("Supabase enquiry error, saving locally:", err);
    }
  }

  localEnquiriesStore.unshift(newEnquiry);
  saveToStorage(localEnquiriesStore);
  return newEnquiry;
}

export async function getEnquiries(status?: EnquiryStatus): Promise<Enquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (status) {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as Enquiry[];
      }
    } catch (err) {
      console.warn("Supabase enquiries query error, falling back to local:", err);
    }
  }

  // Refresh from browser storage
  if (typeof window !== "undefined") {
    localEnquiriesStore = loadFromStorage();
  }

  if (status) {
    return localEnquiriesStore.filter(e => e.status === status);
  }
  return [...localEnquiriesStore];
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<Enquiry | null> {
  if (typeof window !== "undefined") {
    localEnquiriesStore = loadFromStorage();
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const idx = localEnquiriesStore.findIndex(e => e.id === id);
        if (idx !== -1) localEnquiriesStore[idx] = data as Enquiry;
        saveToStorage(localEnquiriesStore);
        return data as Enquiry;
      }
    } catch (err) {
      console.error("Supabase update enquiry status error:", err);
    }
  }

  const idx = localEnquiriesStore.findIndex(e => e.id === id);
  if (idx === -1) return null;

  localEnquiriesStore[idx] = {
    ...localEnquiriesStore[idx],
    status,
  };
  saveToStorage(localEnquiriesStore);
  return localEnquiriesStore[idx];
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    localEnquiriesStore = loadFromStorage();
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('enquiries').delete().eq('id', id);
      if (!error) {
        localEnquiriesStore = localEnquiriesStore.filter(e => e.id !== id);
        saveToStorage(localEnquiriesStore);
        return true;
      }
    } catch (err) {
      console.error("Supabase delete enquiry error:", err);
    }
  }

  const prevLen = localEnquiriesStore.length;
  localEnquiriesStore = localEnquiriesStore.filter(e => e.id !== id);
  saveToStorage(localEnquiriesStore);
  return localEnquiriesStore.length < prevLen;
}
