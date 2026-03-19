"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  Clock,
  Euro,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute bottom-20 right-40 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Vertrouwd door 500+ zorgorganisaties
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              De slimste manier om{" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                zorgpersoneel
              </span>{" "}
              te matchen
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              MedMatch verbindt zorgorganisaties direct met uitzendbureaus. Van
              aanvraag tot factuur, volledig geautomatiseerd conform
              CAO-arbeidsvoorwaarden.
            </p>

            {/* Dual CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-blue-600 hover:bg-blue-700 h-12 px-8 shadow-lg shadow-blue-600/25"
              >
                <Link href="/auth/register/organization">
                  <Building2 className="mr-2 h-5 w-5" />
                  Start als Zorginstelling
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 px-8 border-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
              >
                <Link href="/auth/register/agency">
                  <Users className="mr-2 h-5 w-5" />
                  Start als Uitzendbureau
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">10.000+</p>
                <p className="text-sm text-gray-500">Succesvolle plaatsingen</p>
              </div>
              <div className="w-px h-10 bg-gray-200 hidden sm:block" />
              <div>
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-sm text-gray-500">Klanttevredenheid</p>
              </div>
              <div className="w-px h-10 bg-gray-200 hidden sm:block" />
              <div>
                <p className="text-2xl font-bold text-gray-900">24u</p>
                <p className="text-sm text-gray-500">Gem. responstijd</p>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative hidden lg:block">
            {/* Main Dashboard Card */}
            <div className="rounded-2xl border bg-white shadow-2xl shadow-gray-200/50 p-6">
              {/* Mock header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span className="font-semibold text-gray-900">Dashboard</span>
                </div>
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-200" />
                  <div className="h-3 w-3 rounded-full bg-gray-200" />
                  <div className="h-3 w-3 rounded-full bg-gray-200" />
                </div>
              </div>

              {/* Mock stats row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs text-blue-600 mb-1">Open aanvragen</p>
                  <p className="text-xl font-bold text-blue-700">12</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3">
                  <p className="text-xs text-emerald-600 mb-1">Kandidaten</p>
                  <p className="text-xl font-bold text-emerald-700">34</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <p className="text-xs text-purple-600 mb-1">Plaatsingen</p>
                  <p className="text-xl font-bold text-purple-700">8</p>
                </div>
              </div>

              {/* Mock request list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        IC Verpleegkundige
                      </p>
                      <p className="text-xs text-gray-500">3 kandidaten</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    Nieuw
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Operatieassistent
                      </p>
                      <p className="text-xs text-gray-500">In review</p>
                    </div>
                  </div>
                  <Badge variant="secondary">5 dagen</Badge>
                </div>
              </div>
            </div>

            {/* Floating notification card */}
            <div className="absolute -left-8 top-20 rounded-xl border bg-white shadow-xl p-4 animate-float">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Nieuwe kandidaat</p>
                  <p className="text-xs text-gray-500">ZorgTalent BV</p>
                </div>
              </div>
            </div>

            {/* Floating stats card */}
            <div className="absolute -right-4 bottom-16 rounded-xl border bg-white shadow-xl p-4 animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Euro className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Plaatsing bevestigd</p>
                  <p className="text-xs text-emerald-600 font-medium">
                    +€52/uur
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
