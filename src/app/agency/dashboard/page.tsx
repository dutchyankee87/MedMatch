import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  Clock,
  Receipt,
  Plus,
  ArrowRight,
  Building2,
  CheckCircle2,
} from "lucide-react";

// Mock data for demo
const stats = [
  { label: "Openstaande Aanvragen", value: 8, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Actieve Plaatsingen", value: 15, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Ingediende Kandidaten", value: 23, icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Openstaande Facturen", value: 4, icon: Receipt, color: "text-orange-600", bg: "bg-orange-50" },
];

const openRequests = [
  {
    id: "1",
    title: "Verpleegkundige IC",
    organization: "Amsterdam UMC",
    period: "1 feb - 30 apr",
    hoursPerWeek: 32,
    postedAt: "Vandaag",
    urgent: true,
  },
  {
    id: "2",
    title: "Verzorgende IG",
    organization: "Cordaan Thuiszorg",
    period: "15 feb - 31 mei",
    hoursPerWeek: 24,
    postedAt: "Gisteren",
    urgent: false,
  },
  {
    id: "3",
    title: "Verpleegkundige SEH",
    organization: "OLVG",
    period: "1 mrt - 30 jun",
    hoursPerWeek: 36,
    postedAt: "2 dagen geleden",
    urgent: false,
  },
];

const pendingSubmissions = [
  {
    candidateName: "Anna de Vries",
    requestTitle: "Verpleegkundige IC",
    organization: "Amsterdam UMC",
    status: "pending",
    submittedAt: "2 uur geleden",
  },
  {
    candidateName: "Jan Bakker",
    requestTitle: "Verzorgende IG",
    organization: "Cordaan",
    status: "pending",
    submittedAt: "1 dag geleden",
  },
];

export default function AgencyDashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" subtitle="Welkom terug" />

      <div className="flex-1 p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Overzicht</h2>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/agency/candidates/new">
                <Plus className="mr-2 h-4 w-4" />
                Kandidaat Toevoegen
              </Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/agency/requests">
                <Briefcase className="mr-2 h-4 w-4" />
                Bekijk Aanvragen
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Open Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Nieuwe Aanvragen</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/agency/requests">
                  Bekijk alle
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {openRequests.map((request) => (
                  <Link
                    key={request.id}
                    href={`/agency/requests/${request.id}`}
                    className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{request.title}</p>
                          {request.urgent && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Building2 className="h-3 w-3" />
                          <span>{request.organization}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium">{request.hoursPerWeek} uur/week</p>
                        <p className="text-xs text-gray-400">{request.postedAt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Submissions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">In Afwachting</CardTitle>
              <Badge variant="secondary">{pendingSubmissions.length} pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingSubmissions.map((submission, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-yellow-50 border border-yellow-100"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{submission.candidateName}</p>
                        <p className="text-sm text-gray-600">{submission.requestTitle}</p>
                        <p className="text-xs text-gray-500">{submission.organization}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          In behandeling
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">{submission.submittedAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Totaal deze maand:</span>
                  <span className="font-semibold">23 inzendingen</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-500">Geaccepteerd:</span>
                  <span className="font-semibold text-emerald-600">18 (78%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hours Registration Reminder */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">Uren registreren</p>
                <p className="text-sm text-purple-700">
                  Vergeet niet de uren van afgelopen week te registreren voor uw actieve plaatsingen.
                </p>
              </div>
            </div>
            <Button variant="outline" className="bg-white" asChild>
              <Link href="/agency/hours">
                Naar urenregistratie
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
