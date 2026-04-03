"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORY_LABELS } from "@/lib/criteria-templates";
import type { RequestCriterion, CriterionResponse, CvParsedData } from "@/lib/types/criteria";
import {
  ArrowLeft,
  Upload,
  User,
  Euro,
  Send,
  Loader2,
  Plus,
  Check,
  FileText,
  Sparkles,
  CheckCircle2,
  XCircle,
  CalendarDays,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CandidateData {
  id: string;
  firstName: string;
  lastName: string;
  function: string;
  bigNumber?: string;
  qualifications?: string[];
  cvUrl?: string;
  notes?: string;
}

interface RequestData {
  id: string;
  title: string;
  functionRequired: string;
  department?: string;
  hoursPerWeek: number;
  startDate: string;
  endDate: string;
  criteria?: RequestCriterion[];
  schedulePreferences?: string;
  vacationDates?: string;
  maxTravelDistance?: number;
  organization?: { name: string };
}

export default function SubmitCandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Data state
  const [request, setRequest] = useState<RequestData | null>(null);
  const [candidatesList, setCandidatesList] = useState<CandidateData[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [proposedRate, setProposedRate] = useState("");
  const [notes, setNotes] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState("");
  const [criteriaResponses, setCriteriaResponses] = useState<CriterionResponse[]>([]);
  const [candidateVacationDates, setCandidateVacationDates] = useState("");
  const [cvParsedData, setCvParsedData] = useState<CvParsedData | null>(null);
  const [profileSummary, setProfileSummary] = useState("");

  const selectedCandidateData = candidatesList.find((c) => c.id === selectedCandidate);

  // Fetch request and candidates
  useEffect(() => {
    async function fetchData() {
      try {
        const [reqRes, candRes] = await Promise.all([
          fetch(`/api/requests/${id}`),
          fetch('/api/candidates'),
        ]);

        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setRequest(reqData.data);
          // Initialize criteria responses
          if (reqData.data.criteria) {
            setCriteriaResponses(
              reqData.data.criteria.map((c: RequestCriterion) => ({
                criterionId: c.id,
                met: false,
              }))
            );
          }
        }
        if (candRes.ok) {
          const candData = await candRes.json();
          setCandidatesList(candData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const toggleCriterion = (criterionId: string) => {
    setCriteriaResponses((prev) =>
      prev.map((r) =>
        r.criterionId === criterionId ? { ...r, met: !r.met } : r
      )
    );
  };

  const handleCvUpload = async (file: File) => {
    setCvFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCvUrl(data.data.url);

        // Auto-parse the CV
        setIsParsing(true);
        const parseRes = await fetch('/api/cv-parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cvUrl: data.data.url }),
        });

        if (parseRes.ok) {
          const parseData = await parseRes.json();
          setCvParsedData(parseData.data.parsed);
          setProfileSummary(parseData.data.summary);
          toast({ title: 'CV geanalyseerd', description: 'CV is succesvol geüpload en geanalyseerd.' });
        }
      } else {
        toast({ title: 'Upload mislukt', description: 'CV kon niet worden geüpload.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Fout', description: 'Er is iets misgegaan bij het uploaden.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      setIsParsing(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCandidate || !proposedRate || !request) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          candidateId: selectedCandidate,
          proposedRate: parseFloat(proposedRate),
          cvUrl: cvUrl || selectedCandidateData?.cvUrl || undefined,
          notes: notes || undefined,
          criteriaResponses: criteriaResponses.length > 0 ? criteriaResponses : undefined,
          candidateVacationDates: candidateVacationDates || undefined,
          cvParsedData: cvParsedData || undefined,
          profileSummary: profileSummary || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Indienen mislukt');
      }

      toast({
        title: "Kandidaat ingediend",
        description: `${selectedCandidateData?.firstName} ${selectedCandidateData?.lastName} is ingediend voor ${request.title}.`,
      });

      router.push("/agency/requests");
    } catch (error) {
      toast({
        title: "Fout",
        description: error instanceof Error ? error.message : "Er is iets misgegaan",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Kandidaat Indienen" subtitle="Laden..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Aanvraag niet gevonden" subtitle="" />
        <div className="flex-1 p-6 text-center">
          <p className="text-gray-500">Deze aanvraag kon niet worden geladen.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/agency/requests">Terug naar aanvragen</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Group criteria by category
  const groupedCriteria = (request.criteria || []).reduce<Record<string, RequestCriterion[]>>((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  const metCount = criteriaResponses.filter((r) => r.met).length;
  const totalCriteria = criteriaResponses.length;

  return (
    <div className="flex flex-col h-full">
      <Header title="Kandidaat Indienen" subtitle={request.title} />

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Button variant="ghost" asChild>
            <Link href={`/agency/requests/${id}`}>
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
                  <p className="text-sm text-blue-700">
                    {request.organization?.name} {request.department && `• ${request.department}`}
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {request.hoursPerWeek} uur/week
                </Badge>
              </div>
              {request.maxTravelDistance && (
                <p className="text-xs text-blue-600 mt-2">Max. reisafstand: {request.maxTravelDistance} km</p>
              )}
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
              {candidatesList.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Nog geen kandidaten in uw pool.</p>
              ) : (
                <div className="grid gap-3">
                  {candidatesList.map((candidate) => (
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
                              {candidate.firstName[0]}{candidate.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{candidate.firstName} {candidate.lastName}</p>
                            <p className="text-sm text-gray-500">
                              {candidate.function}
                              {candidate.bigNumber && ` • BIG: ${candidate.bigNumber}`}
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
              )}

              <Button variant="outline" className="w-full" asChild>
                <Link href="/agency/candidates/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nieuwe Kandidaat Toevoegen
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Criteria Responses */}
          {request.criteria && request.criteria.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Criteria ({metCount}/{totalCriteria} voldaan)
                </CardTitle>
                <CardDescription>
                  Geef aan of de kandidaat aan de gestelde criteria voldoet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {Object.entries(groupedCriteria).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">
                      {CATEGORY_LABELS[category] || category}
                    </h4>
                    <div className="space-y-2">
                      {items.map((criterion) => {
                        const response = criteriaResponses.find((r) => r.criterionId === criterion.id);
                        const met = response?.met || false;
                        return (
                          <div
                            key={criterion.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              met ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={met}
                                onCheckedChange={() => toggleCriterion(criterion.id)}
                              />
                              <span className="text-sm">{criterion.label}</span>
                              {criterion.required && (
                                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                  Vereist
                                </Badge>
                              )}
                            </div>
                            {met ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-300" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Rate, CV & Details */}
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">&euro;</span>
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
                <p className="text-xs text-gray-500">Exclusief ORT (onregelmatigheidstoeslag)</p>
              </div>

              {/* CV Upload */}
              <div className="space-y-2">
                <Label htmlFor="cv">CV uploaden</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
                  <input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCvUpload(file);
                    }}
                  />
                  <label htmlFor="cv" className="cursor-pointer">
                    {isUploading || isParsing ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                        <p className="text-sm text-emerald-600">
                          {isParsing ? 'CV wordt geanalyseerd...' : 'Uploaden...'}
                        </p>
                      </div>
                    ) : cvFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-emerald-500" />
                        <p className="text-sm font-medium text-emerald-600">{cvFile.name}</p>
                        <p className="text-xs text-gray-500">Klik om te vervangen</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Sleep een bestand of klik om te uploaden</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, DOC of DOCX (max 5MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Parsed CV Summary */}
              {cvParsedData && (
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <h4 className="text-sm font-semibold text-purple-900">AI Analyse</h4>
                    </div>
                    {profileSummary && (
                      <p className="text-sm text-purple-800 mb-3">{profileSummary}</p>
                    )}
                    {cvParsedData.diplomas.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-purple-700 mb-1">Diploma&apos;s</p>
                        <div className="flex flex-wrap gap-1">
                          {cvParsedData.diplomas.map((d, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {d.name} {d.date && `(${d.date})`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {cvParsedData.lastHospital && (
                      <p className="text-xs text-purple-700">
                        Laatst werkzaam: {cvParsedData.lastHospital}
                      </p>
                    )}
                    {cvParsedData.totalYearsExperience && (
                      <p className="text-xs text-purple-700">
                        Werkervaring: {cvParsedData.totalYearsExperience} jaar
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Vacation dates */}
              <div className="space-y-2">
                <Label htmlFor="vacation" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Vakantie in deze periode
                </Label>
                <Textarea
                  id="vacation"
                  value={candidateVacationDates}
                  onChange={(e) => setCandidateVacationDates(e.target.value)}
                  placeholder="bijv. 14 juli t/m 28 juli"
                  rows={2}
                />
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
                  <p>
                    <strong>Kandidaat:</strong>{" "}
                    {selectedCandidateData?.firstName} {selectedCandidateData?.lastName}
                  </p>
                  <p><strong>Uurtarief:</strong> &euro; {proposedRate}</p>
                  <p><strong>Aanvraag:</strong> {request.title} bij {request.organization?.name}</p>
                  {totalCriteria > 0 && (
                    <p><strong>Criteria:</strong> {metCount}/{totalCriteria} voldaan</p>
                  )}
                  {cvFile && <p><strong>CV:</strong> {cvFile.name} (geüpload)</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between pb-8">
            <Button variant="outline" asChild>
              <Link href={`/agency/requests/${id}`}>
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
