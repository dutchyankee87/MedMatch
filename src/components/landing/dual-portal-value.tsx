"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  FileText,
  Clock,
  Receipt,
  Shield,
  ArrowRight,
  Zap,
  BarChart3,
  Bell,
} from "lucide-react";
import Link from "next/link";

const orgFeatures = [
  {
    icon: FileText,
    title: "Eenvoudig aanvragen plaatsen",
    description:
      "Creëer een personeelsaanvraag in minder dan 2 minuten. Definieer functie, periode, en vereisten.",
  },
  {
    icon: Users,
    title: "Kandidaten vergelijken",
    description:
      "Ontvang kandidaten van meerdere bureaus en vergelijk zij-aan-zij op ervaring, tarief en beschikbaarheid.",
  },
  {
    icon: Clock,
    title: "Automatische ORT-berekening",
    description:
      "Onze engine berekent onregelmatigheidstoeslag automatisch volgens de laatste CAO-richtlijnen.",
  },
  {
    icon: Receipt,
    title: "Gestroomlijnde facturatie",
    description:
      "Keur uren goed met één klik. Facturen worden automatisch gegenereerd en verstuurd.",
  },
  {
    icon: BarChart3,
    title: "Inzicht in uitgaven",
    description:
      "Real-time dashboards tonen uw flex-uitgaven, trends en besparingsmogelijkheden.",
  },
  {
    icon: Shield,
    title: "AVG-compliant & veilig",
    description:
      "Alle gegevens worden beveiligd opgeslagen volgens de strengste privacynormen.",
  },
];

const agencyFeatures = [
  {
    icon: Bell,
    title: "Direct op de hoogte",
    description:
      "Ontvang realtime notificaties voor nieuwe aanvragen die matchen met uw kandidatenbestand.",
  },
  {
    icon: Users,
    title: "Kandidatenpool beheren",
    description:
      "Bouw en onderhoud uw kandidatenbestand met kwalificaties, BIG-registratie en beschikbaarheid.",
  },
  {
    icon: Zap,
    title: "Snel kandidaten indienen",
    description:
      "Met één klik kandidaten koppelen aan aanvragen. Inclusief automatische tarief-suggesties.",
  },
  {
    icon: Clock,
    title: "Eenvoudige urenregistratie",
    description:
      "Registreer gewerkte uren met automatische ORT-berekening en goedkeuringsworkflow.",
  },
  {
    icon: Receipt,
    title: "Professionele facturen",
    description:
      "Genereer PDF-facturen met volledige specificatie van uren, ORT en BTW.",
  },
  {
    icon: BarChart3,
    title: "Business intelligence",
    description:
      "Analyseer uw prestaties, conversieratio's en omzet per klant of kandidaat.",
  },
];

export function DualPortalValue() {
  return (
    <section id="voor-wie" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Voor iedereen in de zorgketen
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Gebouwd voor twee werelden
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Of u nu personeel zoekt of levert, MedMatch stroomlijnt uw hele
            proces.
          </p>
        </div>

        <Tabs defaultValue="org" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-gray-100 rounded-xl">
            <TabsTrigger
              value="org"
              className="rounded-lg h-full data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Zorgorganisaties
            </TabsTrigger>
            <TabsTrigger
              value="agency"
              className="rounded-lg h-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              <Users className="h-5 w-5 mr-2" />
              Uitzendbureaus
            </TabsTrigger>
          </TabsList>

          <TabsContent value="org" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orgFeatures.map((feature) => (
                <Card
                  key={feature.title}
                  className="group hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button
                size="lg"
                asChild
                className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
              >
                <Link href="/auth/register/organization">
                  Start als Zorgorganisatie
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="agency" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencyFeatures.map((feature) => (
                <Card
                  key={feature.title}
                  className="group hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                      <feature.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button
                size="lg"
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8"
              >
                <Link href="/demo/agency/dashboard">
                  Start als Uitzendbureau
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
