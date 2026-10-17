"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  MessageSquare, 
  FileSpreadsheet, 
  LayoutDashboard, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  UserCheck,
  ShieldAlert
} from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import { getClientAdminSession, logoutAdmin } from "@/lib/auth/adminAuth";
import { siteConfig } from "@/config/site";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // If on /admin/login, bypass auth check
    if (pathname === "/admin/login") {
      setAuthorized(true);
      return;
    }

    const session = getClientAdminSession();
    if (!session || !session.authenticated) {
      setAuthorized(false);
      router.push("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#D71935] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  if (authorized === false) {
    return null;
  }

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Property Listings", href: "/admin/properties", icon: Building2 },
    { name: "Customer Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { name: "Owner Submissions", href: "/admin/submissions", icon: FileSpreadsheet },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* MOBILE TOPBAR */}
      <header className="md:hidden bg-[#102D50] text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <BrandLogo variant="light" size="sm" />
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#102D50] text-white flex flex-col transition-transform duration-300 md:translate-x-0 md:static ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <BrandLogo variant="light" size="sm" showTagline={false} />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Administrator Badge */}
        <div className="px-6 py-4 bg-[#0A1C33]/60 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D71935] flex items-center justify-center font-bold text-xs text-white">
            MK
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-white block truncate">
              {siteConfig.founder.name}
            </span>
            <span className="text-[10px] text-slate-400 block truncate">
              Principal Administrator
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                  isActive
                    ? "bg-[#D71935] text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={15} />
              <span>View Public Site</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow min-w-0 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
}
