import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Users,
  Clock,
  FileCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              M
            </div>
            <span className="font-semibold text-xl">MedMatch</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Inloggen</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/register/organization">Registreren</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Verbind zorg met talent
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          MedMatch is het platform dat zorgorganisaties verbindt met uitzendbureaus.
          Eenvoudig personeel aanvragen, kandidaten indienen en uren registreren.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/auth/register/organization">
              Start als Zorgorganisatie
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/register/agency">
              Start als Uitzendbureau
            </Link>
          </Button>
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Hoe werkt het?</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Plaats Aanvraag</h3>
              <p className="text-sm text-gray-600">
                Zorgorganisatie plaatst een personeelsaanvraag met functie, periode en uren
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Kandidaat Indienen</h3>
              <p className="text-sm text-gray-600">
                Uitzendbureaus worden genotificeerd en dienen kandidaten in met tarief
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Goedkeuren</h3>
              <p className="text-sm text-gray-600">
                Organisatie vergelijkt kandidaten en accepteert de beste match
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">4. Uren & Facturen</h3>
              <p className="text-sm text-gray-600">
                Automatische ORT-berekening, urenregistratie en factuurgeneratie
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Waarom MedMatch?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Eenvoudig & Snel",
                description: "Plaats een aanvraag in 3 klikken. Geen ingewikkelde formulieren.",
              },
              {
                title: "Automatische ORT",
                description: "Onregelmatigheidstoeslag wordt automatisch berekend volgens CAO.",
              },
              {
                title: "Realtime Updates",
                description: "Direct op de hoogte van nieuwe aanvragen en inzendingen.",
              },
              {
                title: "PDF Facturen",
                description: "Professionele facturen met complete urenspecificatie.",
              },
              {
                title: "Kandidatenvergelijking",
                description: "Vergelijk kandidaten zij-aan-zij voor de beste keuze.",
              },
              {
                title: "Veilig & Betrouwbaar",
                description: "AVG-compliant platform met beveiligde gegevensopslag.",
              },
            ].map((feature, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Klaar om te beginnen?</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Registreer vandaag nog en ontdek hoe MedMatch uw personeelsplanning kan vereenvoudigen.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/auth/register/organization">
              <Building2 className="mr-2 h-4 w-4" />
              Zorgorganisatie
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/register/agency">
              <Users className="mr-2 h-4 w-4" />
              Uitzendbureau
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MedMatch. Alle rechten voorbehouden.</p>
        </div>
      </footer>
    </div>
  );
}
