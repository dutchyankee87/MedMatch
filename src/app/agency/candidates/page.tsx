import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Mail,
  Phone,
  Award,
  FileText,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const candidates = [
  {
    id: "1",
    firstName: "Anna",
    lastName: "de Vries",
    email: "anna.devries@email.nl",
    phone: "06-12345678",
    function: "Verpleegkundige IC",
    bigNumber: "12345678901",
    qualifications: ["BLS", "ALS", "ECMO"],
    isActive: true,
    activePlacements: 1,
  },
  {
    id: "2",
    firstName: "Jan",
    lastName: "Bakker",
    email: "jan.bakker@email.nl",
    phone: "06-87654321",
    function: "Verpleegkundige IC",
    bigNumber: "98765432101",
    qualifications: ["BLS", "ALS"],
    isActive: true,
    activePlacements: 0,
  },
  {
    id: "3",
    firstName: "Sophie",
    lastName: "Jansen",
    email: "sophie.jansen@email.nl",
    phone: "06-11223344",
    function: "Verpleegkundige",
    bigNumber: "11223344556",
    qualifications: ["BLS", "Wound Care"],
    isActive: true,
    activePlacements: 2,
  },
  {
    id: "4",
    firstName: "Peter",
    lastName: "van Dijk",
    email: "peter.vandijk@email.nl",
    phone: "06-55667788",
    function: "Verzorgende IG",
    bigNumber: "66778899001",
    qualifications: ["Medicatie"],
    isActive: false,
    activePlacements: 0,
  },
];

export default function CandidatesPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Kandidaten" subtitle="Beheer uw kandidatenpool" />

      <div className="flex-1 p-6 space-y-6">
        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Zoek kandidaat..." className="pl-9" />
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/agency/candidates/new">
              <Plus className="mr-2 h-4 w-4" />
              Kandidaat Toevoegen
            </Link>
          </Button>
        </div>

        {/* Candidates Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {candidate.firstName[0]}{candidate.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {candidate.firstName} {candidate.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{candidate.function}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Bewerken</DropdownMenuItem>
                      <DropdownMenuItem>CV bekijken</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Deactiveren</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>BIG: {candidate.bigNumber}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {candidate.qualifications.map((qual) => (
                    <Badge key={qual} variant="secondary" className="text-xs">
                      {qual}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    {candidate.isActive ? (
                      <Badge className="bg-emerald-100 text-emerald-800">Actief</Badge>
                    ) : (
                      <Badge variant="secondary">Inactief</Badge>
                    )}
                    {candidate.activePlacements > 0 && (
                      <span className="text-xs text-gray-500">
                        {candidate.activePlacements} plaatsing(en)
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    CV
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
