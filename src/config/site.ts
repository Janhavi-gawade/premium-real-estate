export const siteConfig = {
  name: "Arth Properties",
  tagline: "The Value Behind Every Home",
  secondaryTagline: "Your Dream... Our Commitment",
  description:
    "Pune's premier boutique real estate consultancy led by Monali Khedekar. Curating exceptional residential, commercial, plots, and investment properties with uncompromised integrity and personalised guidance.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://arthproperties.in",
  
  // Real Estate Professional Details
  founder: {
    name: "Monali Khedekar",
    role: "Founder & Principal Real Estate Consultant",
    bio: "With deep-rooted expertise across Hadapsar, Magarpatta City, Amanora, Kharadi, Koregaon Park, and prime Pune micro-markets, Monali Khedekar guides homebuyers, investors, and landowners with verified listings, transparent negotiations, and end-to-end legal and registration assistance.",
    location: "Hadapsar, Pune, Maharashtra, India",
  },

  // Google Business Profile & Verification
  googleBusinessUrl: "https://share.google/RWjt938xzzIlxP3D3",

  // Contact Information
  contact: {
    primaryPhone: "9689965655",
    primaryPhoneDisplay: "+91 96899 65655",
    alternatePhone: "9767990606",
    alternatePhoneDisplay: "+91 97679 90606",
    email: "arthproperties@gmail.com",
    address: {
      line1: "Near Siddhi Driving School, Unnatinagar, Gadital",
      locality: "Hadapsar",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411028",
      country: "India",
      display: "Near Siddhi Driving School, Unnatinagar, Gadital, Hadapsar, Pune, Maharashtra 411028",
      landmark: "Near Siddhi Driving School & Gadital Chowk",
    },
    whatsappNumber: "919689965655",
    whatsappLink: "https://wa.me/919689965655",
  },

  // Compliance & Regulatory
  rera: {
    registered: false,
    statusNotice: "MahaRERA registration details are under client verification. Individual project RERA IDs are verified prior to deal advisory.",
    reraNumber: "Verification in progress",
  },

  // Brand Palette
  brandColors: {
    primaryNavy: "#102D50",
    primaryRed: "#D71935",
    surfaceWhite: "#FFFFFF",
    surfaceLight: "#F8FAFC",
    surfaceMuted: "#E2E8F0",
    textDark: "#0F172A",
    textMuted: "#64748B",
  },

  // Services offered
  services: [
    {
      id: "buy",
      title: "Buy Properties & Resale",
      description: "Curated 1, 2, 3, and 4 BHK residential apartments, penthouses, row houses, and luxury villas with 100% verified titles.",
    },
    {
      id: "sell",
      title: "Sell Your Property",
      description: "Direct owner representation, accurate market valuation, pre-qualified buyer matching, and complete transaction closing.",
    },
    {
      id: "rent",
      title: "Rental & Lease Management",
      description: "Hassle-free corporate and family leasing, verified tenant background checks, and registered Leave & License agreement assistance.",
    },
    {
      id: "commercial",
      title: "Commercial Offices & Retail",
      description: "Prime IT office spaces, high-street retail shops, and pre-leased commercial assets delivering strong rental yields.",
    },
    {
      id: "plots",
      title: "NA Plots & Land Deals",
      description: "Collector-sanctioned NA residential and commercial plots, farmhouse land, and growth corridor parcels with clear 7/12 extracts.",
    },
    {
      id: "legal",
      title: "Legal & Loan Assistance",
      description: "Title search report liaison, Sub-Registrar deed registration, stamp duty consultation, and bank loan approvals with leading lenders.",
    },
  ],

  // Prime Pune localities served (centered on Hadapsar & surrounding corridors + prime Pune)
  primeLocations: [
    "Hadapsar",
    "Magarpatta City",
    "Amanora Park Town",
    "Shewalwadi",
    "Saswad Road",
    "Fursungi",
    "Manjri",
    "Handewadi",
    "Mundhwa",
    "Keshav Nagar",
    "Kharadi",
    "Koregaon Park",
    "Kalyani Nagar",
    "Viman Nagar",
    "Wanowrie",
    "NIBM Road",
    "Baner",
    "Balewadi",
    "Wakad",
    "Kothrud",
    "Bavdhan"
  ],

  // Navigation Links
  navLinks: [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "Sell Your Property", href: "/sell" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
};
