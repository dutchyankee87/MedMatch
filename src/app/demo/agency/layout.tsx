import Link from "next/link";
import { DemoSidebar } from "@/components/layout/demo-sidebar";
import { ArrowRight } from "lucide-react";

export default function DemoAgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm font-medium">
            Dit is een demo weergave van het uitzendbureau portaal
          </p>
          <Link
            href="/auth/register/agency"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-emerald-50 transition-colors"
          >
            Registreer als Uitzendbureau
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <DemoSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
