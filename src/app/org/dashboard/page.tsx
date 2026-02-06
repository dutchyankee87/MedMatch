import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  Clock,
  Receipt,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

// Mock data for demo
const stats = [
  { label: "Open Aanvragen", value: 5, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Actieve Plaatsingen", value: 12, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Uren te Beoordelen", value: 8, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Openstaande Facturen", value: 3, icon: Receipt, color: "text-purple-600", bg: "bg-purple-50" },
];

const recentSubmissions = [
  {
    id: "1",
    candidateName: "Anna de Vries",
    agencyName: "ZorgTalent BV",
    function: "Verpleegkundige IC",
    rate: "€ 52,00",
    submittedAt: "2 uur geleden",
  },
  {
    id: "2",
    candidateName: "Jan Bakker",
    agencyName: "MediFlex",
    function: "Verpleegkundige IC",
    rate: "€ 48,50",
    submittedAt: "4 uur geleden",
  },
  {
    id: "3",
    candidateName: "Sophie Jansen",
    agencyName: "Care4You",
    function: "Verzorgende IG",
    rate: "€ 38,00",
    submittedAt: "1 dag geleden",
  },
];

const pendingHours = [
  { candidateName: "Lisa Mulder", period: "Week 5", hours: 32, amount: "€ 1.856,00" },
  { candidateName: "Peter van Dijk", period: "Week 5", hours: 40, amount: "€ 2.180,00" },
];

export default function OrgDashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" subtitle="Welkom terug" />

      <div className="flex-1 p-6 space-y-6">
        {/* Quick Action */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Overzicht</h2>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/org/requests/new">
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe Aanvraag
            </Link>
          </Button>
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
          {/* Recent Submissions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recente Inzendingen</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/org/requests">
                  Bekijk alle
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{submission.candidateName}</p>
                      <p className="text-sm text-gray-500">
                        {submission.agencyName} • {submission.function}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-blue-600">{submission.rate}</p>
                      <p className="text-xs text-gray-400">{submission.submittedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Hours */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Uren Goedkeuren</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/org/hours">
                  Bekijk alle
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingHours.map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-orange-50"
                  >
                    <div>
                      <p className="font-medium">{entry.candidateName}</p>
                      <p className="text-sm text-gray-500">{entry.period}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{entry.hours} uur</p>
                      <p className="text-sm text-orange-600">{entry.amount}</p>
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/org/hours">
                    <Clock className="mr-2 h-4 w-4" />
                    Alle uren bekijken
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Tip van de dag</p>
              <p className="text-sm text-blue-700">
                Vergelijk kandidaten zij-aan-zij om de beste match te vinden.
                Klik op een aanvraag en bekijk alle inzendingen in één overzicht.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
