"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Calendar,
  Clock,
  Search,
  ChevronRight,
  Loader2,
  MapPin,
} from "lucide-react";

interface AgencyRequest {
  id: string;
  title: string;
  functionRequired: string;
  department?: string;
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  maxTravelDistance?: number;
  criteria?: { id: string; label: string; required: boolean }[];
  createdAt: string;
  organization?: { name: string };
  submissions?: { id: string; agencyId: string }[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
  });
}

function getTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Vandaag";
  if (diffDays === 1) return "Gisteren";
  return `${diffDays} dagen geleden`;
}

export default function AgencyRequestsPage() {
  const [requests, setRequests] = useState<AgencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch('/api/requests');
        if (res.ok) {
          const data = await res.json();
          setRequests(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const filtered = requests.filter((r) =>
    !search ||
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.organization?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.functionRequired.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Openstaande Aanvragen" subtitle="Bekijk en reageer op aanvragen" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Openstaande Aanvragen" subtitle="Bekijk en reageer op aanvragen" />

      <div className="flex-1 p-6 space-y-6">
        {/* Search */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Zoek op functie of organisatie..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              <p>{search ? 'Geen resultaten gevonden' : 'Er zijn momenteel geen openstaande aanvragen'}</p>
            </Card>
          ) : (
            filtered.map((request) => (
              <Link key={request.id} href={`/agency/requests/${request.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer mb-4">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{request.title}</h3>
                          {request.criteria && request.criteria.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {request.criteria.length} criteria
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <Building2 className="h-4 w-4" />
                          <span className="font-medium">{request.organization?.name}</span>
                          {request.department && (
                            <>
                              <span className="text-gray-400">&bull;</span>
                              <span>{request.department}</span>
                            </>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(request.startDate)} - {formatDate(request.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{request.hoursPerWeek} uur/week</span>
                          </div>
                          {request.maxTravelDistance && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>Max {request.maxTravelDistance} km</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{getTimeAgo(request.createdAt)}</p>
                          <Button
                            size="sm"
                            className="mt-2 bg-emerald-600 hover:bg-emerald-700"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/agency/requests/${request.id}/submit`;
                            }}
                          >
                            Kandidaat indienen
                          </Button>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
