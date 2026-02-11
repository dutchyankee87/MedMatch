"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Clock,
  Receipt,
  Settings,
  Building2,
  Briefcase,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const demoAgencyNavItems: NavItem[] = [
  { title: "Dashboard", href: "/demo/agency/dashboard", icon: LayoutDashboard },
  { title: "Openstaand", href: "/demo/agency/requests", icon: Briefcase },
  { title: "Kandidaten", href: "/demo/agency/candidates", icon: Users },
  { title: "Plaatsingen", href: "/demo/agency/placements", icon: Building2 },
  { title: "Uren", href: "/demo/agency/hours", icon: Clock },
  { title: "Facturen", href: "/demo/agency/invoices", icon: Receipt },
  { title: "Instellingen", href: "/demo/agency/settings", icon: Settings },
];

export function DemoSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/demo/agency/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold">
            M
          </div>
          <span className="font-semibold text-lg">MedMatch</span>
        </Link>
      </div>

      {/* Quick Action - disabled in demo */}
      <div className="p-4">
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 opacity-75 cursor-not-allowed"
          disabled
        >
          <Users className="mr-2 h-4 w-4" />
          Kandidaat Toevoegen
        </Button>
        <p className="text-xs text-gray-400 text-center mt-2">Beschikbaar na registratie</p>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {demoAgencyNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Demo User */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Demo Account</p>
            <p className="text-xs text-gray-500">Uitzendbureau</p>
          </div>
        </div>
      </div>
    </div>
  );
}
