import { OwnerSubmission, SubmissionStatus, Property } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { createProperty } from "./properties";

// Initial sample owner submission
const initialSubmissions: OwnerSubmission[] = [
  {
    id: "sub-1",
    owner_name: "Rajesh Shinde",
    owner_phone: "9850123456",
    owner_email: "rajesh.shinde@gmail.com",
    property_type: "3 BHK Apartment",
    location: "Pashan, Pune",
    expected_price: 13500000,
    carpet_area: 1200,
    description: "East-facing 3 BHK in pristine condition with 2 covered car parkings, society gym, and panoramic view of Pashan lake. Clear title, single owner.",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80"],
    review_status: "pending",
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  }
];

const STORAGE_KEY = "arth_owner_submissions_v1";

function loadFromStorage(): OwnerSubmission[] {
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
      console.warn("Could not read submissions from localStorage:", e);
    }
  }
  return [...initialSubmissions];
}

function saveToStorage(items: OwnerSubmission[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event("arth_submissions_updated"));
    } catch (e) {
      console.warn("Could not write submissions to localStorage:", e);
      try {
        const lightweight = items.map(sub => ({
          ...sub,
          images: sub.images.slice(0, 1)
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
        window.dispatchEvent(new Event("arth_submissions_updated"));
      } catch (err2) {
        console.error("Critical localStorage quota error:", err2);
      }
    }
  }
}

let localSubmissionsStore: OwnerSubmission[] = loadFromStorage();

export async function createSubmission(
  data: Omit<OwnerSubmission, 'id' | 'created_at' | 'review_status'>
): Promise<OwnerSubmission> {
  const newSubmission: OwnerSubmission = {
    ...data,
    id: `sub-${Date.now()}`,
    review_status: 'pending',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: dbData, error } = await supabase
        .from('owner_submissions')
        .insert([{
          owner_name: newSubmission.owner_name,
          owner_phone: newSubmission.owner_phone,
          owner_email: newSubmission.owner_email || null,
          property_type: newSubmission.property_type,
          location: newSubmission.location,
          expected_price: newSubmission.expected_price,
          carpet_area: newSubmission.carpet_area,
          description: newSubmission.description || null,
          images: newSubmission.images || [],
          review_status: 'pending',
        }])
        .select()
        .single();

      if (!error && dbData) {
        localSubmissionsStore.unshift(dbData as OwnerSubmission);
        saveToStorage(localSubmissionsStore);
        return dbData as OwnerSubmission;
      }
    } catch (err) {
      console.error("Supabase owner submission error:", err);
    }
  }

  localSubmissionsStore.unshift(newSubmission);
  saveToStorage(localSubmissionsStore);
  return newSubmission;
}

export async function getSubmissions(status?: SubmissionStatus): Promise<OwnerSubmission[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('owner_submissions').select('*').order('created_at', { ascending: false });
      if (status) {
        query = query.eq('review_status', status);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as OwnerSubmission[];
      }
    } catch (err) {
      console.warn("Supabase submissions query error, falling back to local:", err);
    }
  }

  // Refresh from browser storage
  if (typeof window !== "undefined") {
    localSubmissionsStore = loadFromStorage();
  }

  if (status) {
    return localSubmissionsStore.filter(s => s.review_status === status);
  }
  return [...localSubmissionsStore];
}

export async function updateSubmissionStatus(
  id: string,
  review_status: SubmissionStatus,
  admin_notes?: string
): Promise<OwnerSubmission | null> {
  if (typeof window !== "undefined") {
    localSubmissionsStore = loadFromStorage();
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('owner_submissions')
        .update({ review_status, admin_notes })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const idx = localSubmissionsStore.findIndex(s => s.id === id);
        if (idx !== -1) localSubmissionsStore[idx] = data as OwnerSubmission;
        saveToStorage(localSubmissionsStore);
        return data as OwnerSubmission;
      }
    } catch (err) {
      console.error("Supabase update submission error:", err);
    }
  }

  const idx = localSubmissionsStore.findIndex(s => s.id === id);
  if (idx === -1) return null;

  localSubmissionsStore[idx] = {
    ...localSubmissionsStore[idx],
    review_status,
    admin_notes: admin_notes !== undefined ? admin_notes : localSubmissionsStore[idx].admin_notes,
  };
  saveToStorage(localSubmissionsStore);
  return localSubmissionsStore[idx];
}

export async function approveSubmissionToProperty(id: string): Promise<Property | null> {
  if (typeof window !== "undefined") {
    localSubmissionsStore = loadFromStorage();
  }

  const sub = localSubmissionsStore.find(s => s.id === id);
  if (!sub) return null;

  // Convert submission into a draft or active listing
  const newProp = await createProperty({
    title: `${sub.property_type} in ${sub.location}`,
    slug: `owner-listing-${Date.now()}`,
    description: sub.description || `Verified owner property submitted for sale in ${sub.location}. Contact Monali Khedekar for title verification and site visits.`,
    category: sub.property_type.toLowerCase().includes('plot') ? 'plots' : sub.property_type.toLowerCase().includes('commercial') ? 'commercial' : 'residential',
    transaction_type: 'buy',
    price: sub.expected_price,
    price_label: '',
    location: sub.location,
    carpet_area: sub.carpet_area,
    bedrooms: sub.property_type.includes('3') ? 3 : sub.property_type.includes('2') ? 2 : sub.property_type.includes('4') ? 4 : 1,
    bathrooms: 2,
    amenities: ['Power Backup', 'Water Supply', 'Security'],
    images: sub.images.length > 0 ? sub.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    featured: false,
    status: 'available',
    is_published: true,
  });

  await updateSubmissionStatus(id, 'approved', `Approved and converted to property: ${newProp.title}`);
  return newProp;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    localSubmissionsStore = loadFromStorage();
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('owner_submissions').delete().eq('id', id);
      if (!error) {
        localSubmissionsStore = localSubmissionsStore.filter(s => s.id !== id);
        saveToStorage(localSubmissionsStore);
        return true;
      }
    } catch (err) {
      console.error("Supabase delete submission error:", err);
    }
  }

  const prevLen = localSubmissionsStore.length;
  localSubmissionsStore = localSubmissionsStore.filter(s => s.id !== id);
  saveToStorage(localSubmissionsStore);
  return localSubmissionsStore.length < prevLen;
}
