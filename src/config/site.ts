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
    bio: "With deep-rooted expertise across Pune's prime residential and commercial micro-markets, Monali Khedekar guides homebuyers, investors, and landowners with verified listings, transparent negotiations, and end-to-end transaction assistance.",
    location: "Pune, Maharashtra, India",
  },

  // Contact Information
  contact: {
    primaryPhone: "9689965655",
    primaryPhoneDisplay: "+91 96899 65655",
    alternatePhone: "9767990606",
    alternatePhoneDisplay: "+91 97679 90606",
    email: "arthproperties@gmail.com",
    address: {
      line1: "Prime Business Hub, Baner - Balewadi Road",
      locality: "Baner",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411045",
      country: "India",
      display: "Baner - Balewadi Road, Pune, Maharashtra 411045",
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
      title: "Buy Properties",
      description: "Exclusive curated residential apartments, luxury villas, and vetted commercial spaces with complete title diligence.",
    },
    {
      id: "sell",
      title: "Sell Properties",
      description: "Strategic pricing, high-intent buyer matching, professional staging advice, and seamless documentation for owners.",
    },
    {
      id: "rent",
      title: "Rental & Lease Management",
      description: "Hassle-free corporate and family leasing, verified tenant background checks, and registered rent agreement assistance.",
    },
    {
      id: "investment",
      title: "Investment & Land Advisory",
      description: "High-yield commercial spaces, NA plots, and pre-launch growth corridor investments backed by micro-market intelligence.",
    },
  ],

  // Prime Pune localities served
  primeLocations: [
    "Baner",
    "Kharadi",
    "Koregaon Park",
    "Balewadi",
    "Wakad",
    "Kothrud",
    "Viman Nagar",
    "Hinjewadi",
    "Bavdhan",
    "Aundh",
    "NIBM Road",
    "Kalyani Nagar"
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
