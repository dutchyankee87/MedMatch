"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CandidateItem {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  function: string;
  bigNumber?: string;
  qualifications?: string[];
  cvUrl?: string;
  isActive: boolean;
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await fetch('/api/candidates');
        if (res.ok) {
          const data = await res.json();
          setCandidates(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  const filtered = candidates.filter((c) =>
    !search ||
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.function.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Kandidaten" subtitle="Beheer uw kandidatenpool" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Kandidaten" subtitle="Beheer uw kandidatenpool" />

      <div className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Zoek kandidaat..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/agency/candidates/new">
              <Plus className="mr-2 h-4 w-4" />
              Kandidaat Toevoegen
            </Link>
          </Button>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <p>{search ? 'Geen kandidaten gevonden' : 'Nog geen kandidaten. Voeg uw eerste kandidaat toe.'}</p>
            {!search && (
              <Button asChild className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                <Link href="/agency/candidates/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Kandidaat Toevoegen
                </Link>
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((candidate) => (
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
                        {candidate.cvUrl && (
                          <DropdownMenuItem asChild>
                            <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">CV bekijken</a>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 text-sm">
                    {candidate.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{candidate.email}</span>
                      </div>
                    )}
                    {candidate.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{candidate.phone}</span>
                      </div>
                    )}
                    {candidate.bigNumber && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Award className="h-4 w-4" />
                        <span>BIG: {candidate.bigNumber}</span>
                      </div>
                    )}
                  </div>

                  {candidate.qualifications && candidate.qualifications.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {candidate.qualifications.map((qual) => (
                        <Badge key={qual} variant="secondary" className="text-xs">
                          {qual}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <Badge className={candidate.isActive ? "bg-emerald-100 text-emerald-800" : ""} variant={candidate.isActive ? "default" : "secondary"}>
                      {candidate.isActive ? 'Actief' : 'Inactief'}
                    </Badge>
                    {candidate.cvUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4 mr-1" />
                          CV
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
