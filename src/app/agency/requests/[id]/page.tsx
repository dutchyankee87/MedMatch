"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/lib/criteria-templates";
import type { RequestCriterion } from "@/lib/types/criteria";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  MapPin,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface RequestDetail {
  id: string;
  title: string;
  functionRequired: string;
  department?: string;
  description?: string;
  specialRequirements?: string;
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  criteria?: RequestCriterion[];
  schedulePreferences?: string;
  vacationDates?: string;
  maxTravelDistance?: number;
  organization?: { name: string; address?: string };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AgencyRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequest() {
      try {
        const res = await fetch(`/api/requests/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRequest(data.data);
        }
      } catch (error) {
        console.error('Error fetching request:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRequest();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Aanvraag" subtitle="Laden..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Niet gevonden" subtitle="" />
        <div className="flex-1 p-6 text-center">
          <p className="text-gray-500">Aanvraag niet gevonden.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/agency/requests">Terug naar aanvragen</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Group criteria by category
  const groupedCriteria = (request.criteria || []).reduce<Record<string, RequestCriterion[]>>((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      <Header title={request.title} subtitle={request.organization?.name || ''} />

      <div className="flex-1 p-6 space-y-6">
        <Button variant="ghost" asChild className="mb-2">
          <Link href="/agency/requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar aanvragen
          </Link>
        </Button>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>{request.title}</CardTitle>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <Building2 className="h-4 w-4" />
                <span>{request.organization?.name}</span>
              </div>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href={`/agency/requests/${id}/submit`}>
                <Send className="mr-2 h-4 w-4" />
                Kandidaat Indienen
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Info Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Functie</p>
                  <p className="font-medium">{request.functionRequired}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Periode</p>
                  <p className="font-medium text-sm">
                    {formatDate(request.startDate).split(" ").slice(0, 2).join(" ")} &ndash;{" "}
                    {formatDate(request.endDate).split(" ").slice(0, 2).join(" ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <Clock className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Uren per week</p>
                  <p className="font-medium">{request.hoursPerWeek} uur</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-orange-100">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {request.maxTravelDistance ? 'Max. reisafstand' : 'Afdeling'}
                  </p>
                  <p className="font-medium">
                    {request.maxTravelDistance ? `${request.maxTravelDistance} km` : request.department || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {request.description && (
              <div>
                <h4 className="font-semibold mb-2">Omschrijving</h4>
                <p className="text-gray-600">{request.description}</p>
              </div>
            )}

            {/* Structured Criteria */}
            {request.criteria && request.criteria.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  Criteria ({request.criteria.length})
                </h4>
                <div className="space-y-4">
                  {Object.entries(groupedCriteria).map(([category, items]) => (
                    <div key={category}>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        {CATEGORY_LABELS[category] || category}
                      </p>
                      <div className="grid gap-2">
                        {items.map((criterion) => (
                          <div
                            key={criterion.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                          >
                            <span className="text-sm">{criterion.label}</span>
                            <Badge variant={criterion.required ? "default" : "secondary"}>
                              {criterion.required ? "Vereist" : "Gewenst"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legacy requirements */}
            {request.specialRequirements && (
              <div>
                <h4 className="font-semibold mb-2">Aanvullende eisen</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">{request.specialRequirements}</p>
                </div>
              </div>
            )}

            {/* Schedule & Vacation */}
            {request.schedulePreferences && (
              <div>
                <h4 className="font-semibold mb-2">Roosterwensen</h4>
                <p className="text-gray-600">{request.schedulePreferences}</p>
              </div>
            )}
            {request.vacationDates && (
              <div>
                <h4 className="font-semibold mb-2">Vakantie / sluiting</h4>
                <p className="text-gray-600">{request.vacationDates}</p>
              </div>
            )}

            {/* Organization Info */}
            <div>
              <h4 className="font-semibold mb-2">Organisatie</h4>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {request.organization?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-medium">{request.organization?.name}</p>
                  {request.department && (
                    <p className="text-sm text-gray-500">{request.department}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-emerald-900">Heeft u een geschikte kandidaat?</h3>
              <p className="text-sm text-emerald-700 mt-1">
                Dien direct een kandidaat in met CV en uurtarief
              </p>
            </div>
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Link href={`/agency/requests/${id}/submit`}>
                <Send className="mr-2 h-4 w-4" />
                Kandidaat Indienen
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
