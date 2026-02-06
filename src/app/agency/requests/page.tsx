"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Calendar,
  Clock,
  Search,
  ChevronRight,
  Filter,
} from "lucide-react";

// Mock data
const requests = [
  {
    id: "1",
    title: "Verpleegkundige IC",
    organization: "Amsterdam UMC",
    department: "Intensive Care",
    functionRequired: "Verpleegkundige",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    hoursPerWeek: 32,
    postedAt: "2024-01-28",
    urgent: true,
    hasSubmitted: false,
  },
  {
    id: "2",
    title: "Verzorgende IG Thuiszorg",
    organization: "Cordaan Thuiszorg",
    department: "Thuiszorg Noord",
    functionRequired: "Verzorgende IG",
    startDate: "2024-02-15",
    endDate: "2024-05-31",
    hoursPerWeek: 24,
    postedAt: "2024-01-25",
    urgent: false,
    hasSubmitted: true,
  },
  {
    id: "3",
    title: "Verpleegkundige SEH",
    organization: "OLVG",
    department: "Spoedeisende Hulp",
    functionRequired: "Verpleegkundige",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    hoursPerWeek: 36,
    postedAt: "2024-01-26",
    urgent: false,
    hasSubmitted: false,
  },
  {
    id: "4",
    title: "Verzorgende IG",
    organization: "Amsta",
    department: "Verpleeghuis De Boeg",
    functionRequired: "Verzorgende IG",
    startDate: "2024-02-01",
    endDate: "2024-07-31",
    hoursPerWeek: 28,
    postedAt: "2024-01-27",
    urgent: false,
    hasSubmitted: false,
  },
];

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
  return (
    <div className="flex flex-col h-full">
      <Header title="Openstaande Aanvragen" subtitle="Bekijk en reageer op aanvragen" />

      <div className="flex-1 p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Zoek op functie of organisatie..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Functie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle functies</SelectItem>
              <SelectItem value="verpleegkundige">Verpleegkundige</SelectItem>
              <SelectItem value="verzorgende">Verzorgende IG</SelectItem>
              <SelectItem value="helpende">Helpende</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle aanvragen</SelectItem>
              <SelectItem value="new">Nieuw (niet ingediend)</SelectItem>
              <SelectItem value="submitted">Ingediend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {requests.map((request) => (
            <Link key={request.id} href={`/agency/requests/${request.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{request.title}</h3>
                        {request.urgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                        {request.hasSubmitted && (
                          <Badge className="bg-emerald-100 text-emerald-800">Ingediend</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">{request.organization}</span>
                        <span className="text-gray-400">•</span>
                        <span>{request.department}</span>
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
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{getTimeAgo(request.postedAt)}</p>
                        {!request.hasSubmitted && (
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
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
