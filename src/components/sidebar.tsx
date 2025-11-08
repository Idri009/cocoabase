"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/seeds", label: "My Seeds", icon: "🌱" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 bg-[#2A1808] text-cream-100 shadow-lg md:flex md:flex-col">
      <div className="px-6 py-8">
        <span className="text-xl font-semibold tracking-tight text-cream-50">
          Cocoa Chain
        </span>
        <p className="mt-2 text-sm text-cream-300">
          Plant, track, and celebrate your cocoa harvests.
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const isActive = item.href === "/"
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <motion.div
              key={item.href}
              whileHover={{ x: 6 }}
              className="rounded-lg"
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-cream-100 text-[#2A1808]"
                    : "text-cream-300 hover:bg-[#3A2210] hover:text-cream-50"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="px-6 py-8 text-xs text-cream-400">
        © {new Date().getFullYear()} Cocoa Chain
      </div>
    </aside>
  );
}

