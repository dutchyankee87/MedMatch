"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FileText,
  Users,
  Clock,
  Receipt,
  Settings,
  Building2,
  Briefcase,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  type: "org" | "agency";
}

const orgNavItems: NavItem[] = [
  { title: "Dashboard", href: "/org/dashboard", icon: LayoutDashboard },
  { title: "Aanvragen", href: "/org/requests", icon: FileText },
  { title: "Plaatsingen", href: "/org/placements", icon: Users },
  { title: "Uren", href: "/org/hours", icon: Clock },
  { title: "Facturen", href: "/org/invoices", icon: Receipt },
  { title: "Instellingen", href: "/org/settings", icon: Settings },
];

const agencyNavItems: NavItem[] = [
  { title: "Dashboard", href: "/agency/dashboard", icon: LayoutDashboard },
  { title: "Openstaand", href: "/agency/requests", icon: Briefcase },
  { title: "Kandidaten", href: "/agency/candidates", icon: Users },
  { title: "Plaatsingen", href: "/agency/placements", icon: Building2 },
  { title: "Uren", href: "/agency/hours", icon: Clock },
  { title: "Facturen", href: "/agency/invoices", icon: Receipt },
  { title: "Instellingen", href: "/agency/settings", icon: Settings },
];

export function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname();
  const navItems = type === "org" ? orgNavItems : agencyNavItems;
  const isOrg = type === "org";

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href={isOrg ? "/org/dashboard" : "/agency/dashboard"} className="flex items-center gap-2">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold",
            isOrg ? "bg-blue-600" : "bg-emerald-600"
          )}>
            M
          </div>
          <span className="font-semibold text-lg">MedMatch</span>
        </Link>
      </div>

      {/* Quick Action */}
      <div className="p-4">
        {isOrg ? (
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link href="/org/requests/new">
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe Aanvraag
            </Link>
          </Button>
        ) : (
          <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Link href="/agency/candidates/new">
              <Plus className="mr-2 h-4 w-4" />
              Kandidaat Toevoegen
            </Link>
          </Button>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? isOrg
                      ? "bg-blue-50 text-blue-700"
                      : "bg-emerald-50 text-emerald-700"
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

      {/* User */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Account</p>
            <p className="text-xs text-gray-500">
              {isOrg ? "Zorgorganisatie" : "Uitzendbureau"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
