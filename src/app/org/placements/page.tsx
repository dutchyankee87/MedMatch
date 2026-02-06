import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  Clock,
  Euro,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

// Mock data
const placements = [
  {
    id: "1",
    candidateName: "Anna de Vries",
    candidateFunction: "Verpleegkundige IC",
    agencyName: "ZorgTalent BV",
    department: "Intensive Care",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    hoursPerWeek: 32,
    hourlyRate: 52.0,
    status: "active" as const,
  },
  {
    id: "2",
    candidateName: "Sophie Jansen",
    candidateFunction: "Verpleegkundige SEH",
    agencyName: "MediFlex",
    department: "Spoedeisende Hulp",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    hoursPerWeek: 36,
    hourlyRate: 48.0,
    status: "active" as const,
  },
  {
    id: "3",
    candidateName: "Jan Bakker",
    candidateFunction: "Verzorgende IG",
    agencyName: "Care4You",
    department: "Verpleegafdeling",
    startDate: "2023-11-01",
    endDate: "2024-01-31",
    hoursPerWeek: 28,
    hourlyRate: 42.0,
    status: "completed" as const,
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export default function OrgPlacementsPage() {
  const activePlacements = placements.filter((p) => p.status === "active");
  const completedPlacements = placements.filter((p) => p.status === "completed");

  return (
    <div className="flex flex-col h-full">
      <Header title="Plaatsingen" subtitle="Overzicht van actieve en afgeronde plaatsingen" />

      <div className="flex-1 p-6 space-y-6">
        {/* Active Placements */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Actieve Plaatsingen ({activePlacements.length})
          </h2>
          <div className="grid gap-4">
            {activePlacements.map((placement) => (
              <Card key={placement.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                          {placement.candidateName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{placement.candidateName}</h3>
                          <Badge className="bg-emerald-100 text-emerald-800">Actief</Badge>
                        </div>
                        <p className="text-gray-600">{placement.candidateFunction}</p>
                        <p className="text-sm text-gray-500">via {placement.agencyName}</p>

                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Building2 className="h-4 w-4" />
                            <span>{placement.department}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(placement.startDate)} - {formatDate(placement.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{placement.hoursPerWeek} uur/week</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(placement.hourlyRate)}
                      </p>
                      <p className="text-xs text-gray-500">per uur</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <FileText className="h-4 w-4 mr-1" />
                        Opdrachtbevestiging
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed Placements */}
        {completedPlacements.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Afgeronde Plaatsingen ({completedPlacements.length})
            </h2>
            <div className="grid gap-4">
              {completedPlacements.map((placement) => (
                <Card key={placement.id} className="bg-gray-50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarFallback className="bg-gray-200 text-gray-600 text-lg">
                            {placement.candidateName.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{placement.candidateName}</h3>
                            <Badge variant="secondary">Afgerond</Badge>
                          </div>
                          <p className="text-gray-600">{placement.candidateFunction}</p>
                          <p className="text-sm text-gray-500">via {placement.agencyName}</p>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {formatDate(placement.startDate)} - {formatDate(placement.endDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
