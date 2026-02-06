import { Button } from "@/components/ui/button";
import { Building2, Users, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-sm text-white/90">
              Gratis starten, geen creditcard nodig
            </span>
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Klaar om uw personeelsplanning te transformeren?
          </h2>

          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Sluit u aan bij honderden zorgorganisaties en uitzendbureaus die
            dagelijks tijd besparen met MedMatch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-700 hover:bg-blue-50 h-14 px-10 text-base shadow-xl"
            >
              <Link href="/auth/register/organization">
                <Building2 className="mr-2 h-5 w-5" />
                Zorgorganisatie
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-white/30 text-white hover:bg-white/10 h-14 px-10 text-base backdrop-blur-sm"
            >
              <Link href="/auth/register/agency">
                <Users className="mr-2 h-5 w-5" />
                Uitzendbureau
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-white/60">
            Vragen? Neem contact op via info@medmatch.nl of bel 020-123 4567
          </p>
        </div>
      </div>
    </section>
  );
}
