"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Upload,
  User,
  Euro,
  FileText,
  Send,
  Loader2,
  Plus,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - candidates from agency's pool
const candidates = [
  {
    id: "1",
    name: "Anna de Vries",
    function: "Verpleegkundige IC",
    bigNumber: "12345678901",
    experience: "5 jaar IC-ervaring",
    cvUrl: "/cv/anna.pdf",
  },
  {
    id: "2",
    name: "Jan Bakker",
    function: "Verpleegkundige IC",
    bigNumber: "98765432101",
    experience: "3 jaar IC-ervaring",
    cvUrl: "/cv/jan.pdf",
  },
  {
    id: "3",
    name: "Sophie Jansen",
    function: "Verpleegkundige",
    bigNumber: "11223344556",
    experience: "7 jaar ervaring",
    cvUrl: "/cv/sophie.pdf",
  },
];

const request = {
  id: "1",
  title: "Verpleegkundige IC",
  organization: "Amsterdam UMC",
  department: "Intensive Care",
  hoursPerWeek: 32,
  startDate: "2024-02-01",
  endDate: "2024-04-30",
};

export default function SubmitCandidatePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [proposedRate, setProposedRate] = useState("");
  const [notes, setNotes] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  const selectedCandidateData = candidates.find((c) => c.id === selectedCandidate);

  const handleSubmit = async () => {
    if (!selectedCandidate || !proposedRate) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Kandidaat ingediend",
      description: `${selectedCandidateData?.name} is ingediend voor ${request.title} bij ${request.organization}.`,
    });

    router.push("/agency/requests");
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Kandidaat Indienen" subtitle={request.title} />

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Back Button */}
          <Button variant="ghost" asChild>
            <Link href={`/agency/requests/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar aanvraag
            </Link>
          </Button>

          {/* Request Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">{request.title}</h3>
                  <p className="text-sm text-blue-700">{request.organization} • {request.department}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {request.hoursPerWeek} uur/week
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Selecteer Kandidaat
              </CardTitle>
              <CardDescription>
                Kies een kandidaat uit uw pool of voeg een nieuwe toe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    onClick={() => setSelectedCandidate(candidate.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCandidate === candidate.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {candidate.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-gray-500">
                            {candidate.function} • {candidate.experience}
                          </p>
                        </div>
                      </div>
                      {selectedCandidate === candidate.id && (
                        <Check className="h-5 w-5 text-emerald-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/agency/candidates/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nieuwe Kandidaat Toevoegen
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Rate & Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5" />
                Tarief & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Uurtarief *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                  <Input
                    id="rate"
                    type="number"
                    step="0.50"
                    min="0"
                    value={proposedRate}
                    onChange={(e) => setProposedRate(e.target.value)}
                    placeholder="52,00"
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Exclusief ORT (onregelmatigheidstoeslag)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cv">CV uploaden (optioneel)</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
                  <input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="cv" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    {cvFile ? (
                      <p className="text-sm font-medium text-emerald-600">{cvFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">
                          Sleep een bestand of klik om te uploaden
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PDF, DOC of DOCX (max 5MB)</p>
                      </>
                    )}
                  </label>
                </div>
                {selectedCandidateData?.cvUrl && !cvFile && (
                  <p className="text-xs text-gray-500">
                    Standaard CV van kandidaat wordt gebruikt als u geen nieuw CV uploadt
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Opmerkingen (optioneel)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="bijv. Beschikbaarheid, specifieke ervaring, referenties..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary & Submit */}
          {selectedCandidate && proposedRate && (
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-emerald-900 mb-2">Samenvatting</h4>
                <div className="space-y-1 text-sm text-emerald-800">
                  <p><strong>Kandidaat:</strong> {selectedCandidateData?.name}</p>
                  <p><strong>Uurtarief:</strong> € {proposedRate}</p>
                  <p><strong>Aanvraag:</strong> {request.title} bij {request.organization}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/agency/requests/${params.id}`}>
                Annuleren
              </Link>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedCandidate || !proposedRate || isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Versturen...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Kandidaat Indienen
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
