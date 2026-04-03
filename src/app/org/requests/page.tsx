"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Clock, Users, ChevronRight, Loader2 } from "lucide-react";

interface RequestItem {
  id: string;
  title: string;
  department?: string;
  functionRequired: string;
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  status: 'open' | 'in_review' | 'filled' | 'cancelled';
  submissions?: { id: string }[];
  createdAt: string;
}

const statusConfig = {
  open: { label: "Open", color: "bg-blue-100 text-blue-800" },
  in_review: { label: "In behandeling", color: "bg-orange-100 text-orange-800" },
  filled: { label: "Ingevuld", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Geannuleerd", color: "bg-gray-100 text-gray-800" },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RequestCard({ request }: { request: RequestItem }) {
  const status = statusConfig[request.status];
  const submissionCount = request.submissions?.length || 0;

  return (
    <Link href={`/org/requests/${request.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{request.title}</h3>
                <Badge className={status.color}>{status.label}</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-3">{request.department}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{request.hoursPerWeek} uur/week</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{submissionCount} kandidaten</span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function OrgRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const openRequests = requests.filter((r) => r.status === "open");
  const inReviewRequests = requests.filter((r) => r.status === "in_review");
  const filledRequests = requests.filter((r) => r.status === "filled");

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Aanvragen" subtitle="Beheer uw personeelsaanvragen" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Aanvragen" subtitle="Beheer uw personeelsaanvragen" />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">
                  Alle ({requests.length})
                </TabsTrigger>
                <TabsTrigger value="open">
                  Open ({openRequests.length})
                </TabsTrigger>
                <TabsTrigger value="in_review">
                  In behandeling ({inReviewRequests.length})
                </TabsTrigger>
                <TabsTrigger value="filled">
                  Ingevuld ({filledRequests.length})
                </TabsTrigger>
              </TabsList>

              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/org/requests/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nieuwe Aanvraag
                </Link>
              </Button>
            </div>

            <TabsContent value="all" className="mt-6 space-y-4">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              ) : (
                <Card className="p-8 text-center text-gray-500">
                  <p>Nog geen aanvragen. Maak uw eerste aanvraag aan.</p>
                  <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
                    <Link href="/org/requests/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Nieuwe Aanvraag
                    </Link>
                  </Button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="open" className="mt-6 space-y-4">
              {openRequests.length > 0 ? (
                openRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              ) : (
                <Card className="p-8 text-center text-gray-500">
                  <p>Geen open aanvragen</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="in_review" className="mt-6 space-y-4">
              {inReviewRequests.length > 0 ? (
                inReviewRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              ) : (
                <Card className="p-8 text-center text-gray-500">
                  <p>Geen aanvragen in behandeling</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="filled" className="mt-6 space-y-4">
              {filledRequests.length > 0 ? (
                filledRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              ) : (
                <Card className="p-8 text-center text-gray-500">
                  <p>Geen ingevulde aanvragen</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
