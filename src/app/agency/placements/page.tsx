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
  FileText,
} from "lucide-react";

// Mock data
const placements = [
  {
    id: "1",
    candidateName: "Anna de Vries",
    candidateFunction: "Verpleegkundige IC",
    organizationName: "Amsterdam UMC",
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
    organizationName: "OLVG",
    department: "Spoedeisende Hulp",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    hoursPerWeek: 36,
    hourlyRate: 48.0,
    status: "active" as const,
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

export default function AgencyPlacementsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Actieve Plaatsingen" subtitle="Uw kandidaten die momenteel geplaatst zijn" />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Actieve plaatsingen</p>
              <p className="text-3xl font-bold">{placements.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Totaal uren/week</p>
              <p className="text-3xl font-bold">
                {placements.reduce((sum, p) => sum + p.hoursPerWeek, 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Gem. uurtarief</p>
              <p className="text-3xl font-bold">
                {formatCurrency(
                  placements.reduce((sum, p) => sum + p.hourlyRate, 0) / placements.length
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Placements */}
        <div className="grid gap-4">
          {placements.map((placement) => (
            <Card key={placement.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg">
                        {placement.candidateName.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{placement.candidateName}</h3>
                        <Badge className="bg-emerald-100 text-emerald-800">Actief</Badge>
                      </div>
                      <p className="text-gray-600">{placement.candidateFunction}</p>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span>{placement.organizationName} - {placement.department}</span>
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
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(placement.hourlyRate)}
                    </p>
                    <p className="text-xs text-gray-500">per uur</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Clock className="h-4 w-4 mr-1" />
                        Uren
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Contract
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
