import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { TrustLogos } from "@/components/landing/trust-logos";
import { DualPortalValue } from "@/components/landing/dual-portal-value";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { Testimonials } from "@/components/landing/testimonials";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-600/25">
              M
            </div>
            <span className="font-semibold text-xl tracking-tight">
              MedMatch
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Mogelijkheden
            </Link>
            <Link
              href="#werkwijze"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Werkwijze
            </Link>
            <Link
              href="#voor-wie"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Voor Wie
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/auth/login">Inloggen</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="hidden sm:inline-flex border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Link href="/auth/register/agency">Bureau Registreren</Link>
            </Button>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25"
            >
              <Link href="/auth/register/organization">Organisatie Registreren</Link>
            </Button>
            {/* Mobile menu button - placeholder for Sheet component */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu openen</span>
            </Button>
          </div>
        </nav>
      </header>

      <main>
        <HeroSection />
        <StatsSection />
        <TrustLogos />
        <DualPortalValue />
        <WorkflowSection />
        <Testimonials />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
