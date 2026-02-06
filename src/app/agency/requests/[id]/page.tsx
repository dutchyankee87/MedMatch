import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  MapPin,
  FileText,
  Send,
} from "lucide-react";

// Mock data
const request = {
  id: "1",
  title: "Verpleegkundige IC",
  organization: "Amsterdam UMC",
  organizationAddress: "Meibergdreef 9, Amsterdam",
  department: "Intensive Care",
  functionRequired: "Verpleegkundige",
  startDate: "2024-02-01",
  endDate: "2024-04-30",
  hoursPerWeek: 32,
  description: "Wij zoeken een ervaren IC-verpleegkundige voor onze afdeling Intensive Care. De kandidaat dient zelfstandig te kunnen werken en ervaring te hebben met beademing en hemodynamische monitoring.",
  specialRequirements: "BIG-registratie vereist, minimaal 2 jaar IC-ervaring",
  postedAt: "2024-01-28",
  urgent: true,
};

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
  params: { id: string };
}) {
  return (
    <div className="flex flex-col h-full">
      <Header title={request.title} subtitle={request.organization} />

      <div className="flex-1 p-6 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-2">
          <Link href="/agency/requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar aanvragen
          </Link>
        </Button>

        {/* Request Details */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>{request.title}</CardTitle>
                {request.urgent && (
                  <Badge variant="destructive">Urgent</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <Building2 className="h-4 w-4" />
                <span>{request.organization}</span>
              </div>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href={`/agency/requests/${params.id}/submit`}>
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
                    {formatDate(request.startDate).split(" ").slice(0, 2).join(" ")} -{" "}
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
                  <p className="text-xs text-gray-500">Afdeling</p>
                  <p className="font-medium">{request.department}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Omschrijving</h4>
              <p className="text-gray-600">{request.description}</p>
            </div>

            {/* Requirements */}
            {request.specialRequirements && (
              <div>
                <h4 className="font-semibold mb-2">Vereisten</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">{request.specialRequirements}</p>
                </div>
              </div>
            )}

            {/* Organization Info */}
            <div>
              <h4 className="font-semibold mb-2">Organisatie</h4>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {request.organization.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{request.organization}</p>
                  <p className="text-sm text-gray-500">{request.organizationAddress}</p>
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
              <Link href={`/agency/requests/${params.id}/submit`}>
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
