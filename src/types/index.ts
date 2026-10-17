export type PropertyCategory = 'residential' | 'commercial' | 'plots' | 'investment';
export type TransactionType = 'buy' | 'rent';
export type PropertyStatus = 'available' | 'sold' | 'rented';
export type FurnishingStatus = 'unfurnished' | 'semi-furnished' | 'fully-furnished';

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: PropertyCategory;
  transaction_type: TransactionType;
  price: number;
  price_label: string;
  location: string; // e.g. "Baner, Pune"
  landmark?: string;
  carpet_area: number; // in sq.ft.
  built_up_area?: number; // in sq.ft.
  bedrooms: number;
  bathrooms: number;
  furnishing_status?: FurnishingStatus;
  amenities: string[];
  images: string[];
  featured: boolean;
  status: PropertyStatus;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export type EnquiryType = 'general' | 'visit_request' | 'call_back';
export type EnquiryStatus = 'new' | 'contacted' | 'closed';

export interface Enquiry {
  id: string;
  property_id?: string | null;
  property_title?: string;
  name: string;
  phone: string;
  email?: string;
  enquiry_type: EnquiryType;
  preferred_date?: string;
  message?: string;
  status: EnquiryStatus;
  created_at: string;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface OwnerSubmission {
  id: string;
  owner_name: string;
  owner_phone: string;
  owner_email?: string;
  property_type: string;
  location: string;
  expected_price: number;
  carpet_area: number;
  description?: string;
  images: string[];
  review_status: SubmissionStatus;
  admin_notes?: string;
  created_at: string;
}

export interface PropertyFilterParams {
  purpose?: string; // "All" | "buy" | "rent"
  category?: string; // "All" | "residential" | "commercial" | "plots" | "investment"
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string; // "All" | "1" | "2" | "3" | "4+"
  status?: string; // "All" | "available" | "sold" | "rented"
  sort?: 'newest' | 'price_asc' | 'price_desc';
}
