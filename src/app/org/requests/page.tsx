import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Clock, Users, ChevronRight } from "lucide-react";

// Mock data
const requests = [
  {
    id: "1",
    title: "Verpleegkundige IC",
    department: "Intensive Care",
    functionRequired: "Verpleegkundige",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    hoursPerWeek: 32,
    status: "open" as const,
    submissionCount: 3,
    createdAt: "2024-01-28",
  },
  {
    id: "2",
    title: "Verzorgende IG Thuiszorg",
    department: "Thuiszorg Noord",
    functionRequired: "Verzorgende IG",
    startDate: "2024-02-15",
    endDate: "2024-05-31",
    hoursPerWeek: 24,
    status: "in_review" as const,
    submissionCount: 5,
    createdAt: "2024-01-25",
  },
  {
    id: "3",
    title: "Verpleegkundige SEH",
    department: "Spoedeisende Hulp",
    functionRequired: "Verpleegkundige",
    startDate: "2024-03-01",
    endDate: "2024-06-30",
    hoursPerWeek: 36,
    status: "filled" as const,
    submissionCount: 4,
    createdAt: "2024-01-20",
  },
];

const statusConfig = {
  open: { label: "Open", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
  in_review: { label: "In behandeling", variant: "secondary" as const, color: "bg-orange-100 text-orange-800" },
  filled: { label: "Ingevuld", variant: "secondary" as const, color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Geannuleerd", variant: "destructive" as const, color: "bg-gray-100 text-gray-800" },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RequestCard({ request }: { request: typeof requests[0] }) {
  const status = statusConfig[request.status];

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
                  <span>{request.submissionCount} kandidaten</span>
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
  const openRequests = requests.filter((r) => r.status === "open");
  const inReviewRequests = requests.filter((r) => r.status === "in_review");
  const filledRequests = requests.filter((r) => r.status === "filled");

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
              {requests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </TabsContent>

            <TabsContent value="open" className="mt-6 space-y-4">
              {openRequests.length > 0 ? (
                openRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              ) : (
                <Card className="p-8 text-center text-gray-500">
                  <p>Geen open aanvragen</p>
                  <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
                    <Link href="/org/requests/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Nieuwe Aanvraag
                    </Link>
                  </Button>
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
