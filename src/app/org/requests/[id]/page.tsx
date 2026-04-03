"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_LABELS } from "@/lib/criteria-templates";
import { estimateCost } from "@/lib/cost-estimation";
import type { RequestCriterion, CriterionResponse, CvParsedData } from "@/lib/types/criteria";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  Check,
  X,
  Download,
  Award,
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Euro,
  MapPin,
  TrendingUp,
  Pause,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubmissionData {
  id: string;
  candidateId: string;
  agencyId: string;
  proposedRate: string;
  cvUrl?: string;
  notes?: string;
  criteriaResponses?: CriterionResponse[];
  candidateVacationDates?: string;
  cvParsedData?: CvParsedData;
  profileSummary?: string;
  matchScore?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  submittedAt: string;
  candidate?: {
    firstName: string;
    lastName: string;
    function: string;
    bigNumber?: string;
    qualifications?: string[];
  };
  agency?: {
    name: string;
  };
}

interface RequestData {
  id: string;
  title: string;
  department?: string;
  functionRequired: string;
  description?: string;
  specialRequirements?: string;
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  criteria?: RequestCriterion[];
  schedulePreferences?: string;
  vacationDates?: string;
  maxTravelDistance?: number;
  status: string;
  submissions?: SubmissionData[];
  organization?: { name: string };
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "In behandeling", color: "bg-yellow-100 text-yellow-800" },
  accepted: { label: "Geaccepteerd", color: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "Afgewezen", color: "bg-red-100 text-red-800" },
  withdrawn: { label: "Ingetrokken", color: "bg-gray-100 text-gray-800" },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function getMatchColor(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
  if (score >= 50) return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-red-100 text-red-800 border-red-200";
}

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { toast } = useToast();
  const [request, setRequest] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);
  const [isActioning, setIsActioning] = useState(false);
  const [message, setMessage] = useState("");
  const [meetingAvailability, setMeetingAvailability] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    async function fetchRequest() {
      try {
        const res = await fetch(`/api/requests/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRequest(data.data);
        }
      } catch (error) {
        console.error('Error fetching request:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRequest();
  }, [id]);

  const handleAction = (submission: SubmissionData, action: "accept" | "reject") => {
    setSelectedSubmission(submission);
    setActionType(action);
  };

  const confirmAction = async () => {
    if (!selectedSubmission || !actionType) return;

    setIsActioning(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          status: actionType === 'accept' ? 'accepted' : 'rejected',
          message: message || undefined,
          meetingAvailability: actionType === 'accept' ? meetingAvailability || undefined : undefined,
          rejectionReason: actionType === 'reject' ? rejectionReason || undefined : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Actie mislukt');
      }

      toast({
        title: actionType === "accept" ? "Kandidaat geaccepteerd" : "Kandidaat afgewezen",
        description: actionType === "accept"
          ? `${selectedSubmission.candidate?.firstName} ${selectedSubmission.candidate?.lastName} is geselecteerd voor een kennismakingsgesprek.`
          : `${selectedSubmission.candidate?.firstName} ${selectedSubmission.candidate?.lastName} is afgewezen. Het bureau ontvangt hiervan bericht.`,
      });

      // Refresh data
      const refreshRes = await fetch(`/api/requests/${id}`);
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setRequest(refreshData.data);
      }
    } catch (error) {
      toast({
        title: "Fout",
        description: error instanceof Error ? error.message : "Er is iets misgegaan",
        variant: "destructive",
      });
    } finally {
      setIsActioning(false);
      setSelectedSubmission(null);
      setActionType(null);
      setMessage("");
      setMeetingAvailability("");
      setRejectionReason("");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Aanvraag" subtitle="Laden..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Niet gevonden" subtitle="" />
        <div className="flex-1 p-6 text-center">
          <p className="text-gray-500">Deze aanvraag kon niet worden gevonden.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/org/requests">Terug naar aanvragen</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Sort submissions by match score (highest first)
  const sortedSubmissions = [...(request.submissions || [])].sort((a, b) => {
    if (a.status === 'accepted') return -1;
    if (b.status === 'accepted') return 1;
    return (b.matchScore || 0) - (a.matchScore || 0);
  });

  const pendingCount = sortedSubmissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="flex flex-col h-full">
      <Header title={request.title} subtitle={request.department || request.functionRequired} />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <Button variant="ghost" asChild className="mb-2">
          <Link href="/org/requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar aanvragen
          </Link>
        </Button>

        {/* Request Details */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {request.title}
                <Badge className={
                  request.status === 'filled' ? 'bg-emerald-100 text-emerald-800' :
                  request.status === 'in_review' ? 'bg-orange-100 text-orange-800' :
                  request.status === 'open' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {request.status === 'filled' ? 'Ingevuld' :
                   request.status === 'in_review' ? 'In behandeling' :
                   request.status === 'open' ? 'Open' : 'Geannuleerd'}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">{request.department}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Periode</p>
                  <p className="font-medium text-sm">
                    {formatDate(request.startDate)} &ndash; {formatDate(request.endDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Uren per week</p>
                  <p className="font-medium">{request.hoursPerWeek} uur</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Functie</p>
                  <p className="font-medium">{request.functionRequired}</p>
                </div>
              </div>
              {request.maxTravelDistance && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-50">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Max. reisafstand</p>
                    <p className="font-medium">{request.maxTravelDistance} km</p>
                  </div>
                </div>
              )}
            </div>

            {request.description && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Omschrijving</h4>
                <p className="text-gray-600 text-sm">{request.description}</p>
              </div>
            )}

            {/* Criteria */}
            {request.criteria && request.criteria.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Criteria ({request.criteria.length})</h4>
                <div className="flex flex-wrap gap-1.5">
                  {request.criteria.map((c) => (
                    <Badge
                      key={c.id}
                      variant={c.required ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {c.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {request.schedulePreferences && (
              <div className="mt-4">
                <h4 className="font-medium mb-1">Roosterwensen</h4>
                <p className="text-gray-600 text-sm">{request.schedulePreferences}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submissions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Ingediende Kandidaten ({sortedSubmissions.length})
            {pendingCount > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                {pendingCount} in behandeling
              </span>
            )}
          </h2>

          {sortedSubmissions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Er zijn nog geen kandidaten ingediend voor deze aanvraag.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sortedSubmissions.map((submission, index) => {
                const status = statusConfig[submission.status] || statusConfig.pending;
                const rate = parseFloat(submission.proposedRate);
                const cost = estimateCost({
                  hourlyRate: rate,
                  hoursPerWeek: request.hoursPerWeek,
                  startDate: request.startDate,
                  endDate: request.endDate,
                });
                const candidateName = `${submission.candidate?.firstName || ''} ${submission.candidate?.lastName || ''}`.trim();
                const initials = `${submission.candidate?.firstName?.[0] || ''}${submission.candidate?.lastName?.[0] || ''}`;

                return (
                  <Card key={submission.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            {index === 0 && submission.status === 'pending' && submission.matchScore && submission.matchScore >= 70 && (
                              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5">
                                <TrendingUp className="h-3 w-3 text-yellow-900" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{candidateName}</h3>
                              <Badge className={status.color}>{status.label}</Badge>
                              {submission.matchScore !== undefined && submission.matchScore !== null && (
                                <Badge className={getMatchColor(submission.matchScore)}>
                                  {submission.matchScore}% match
                                </Badge>
                              )}
                              {index === 0 && submission.status === 'pending' && (
                                <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200">
                                  Beste match
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{submission.candidate?.function}</p>
                            <p className="text-sm text-gray-500">via {submission.agency?.name}</p>

                            {/* BIG number */}
                            {submission.candidate?.bigNumber && (
                              <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                                <Award className="h-4 w-4" />
                                <span>BIG: {submission.candidate.bigNumber}</span>
                              </div>
                            )}

                            {/* AI Profile Summary */}
                            {submission.profileSummary && (
                              <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="flex items-center gap-1 mb-1">
                                  <Sparkles className="h-3 w-3 text-purple-600" />
                                  <span className="text-xs font-semibold text-purple-700">AI Profiel</span>
                                </div>
                                <p className="text-sm text-purple-800">{submission.profileSummary}</p>
                              </div>
                            )}

                            {/* Criteria match indicators */}
                            {submission.criteriaResponses && request.criteria && request.criteria.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-semibold text-gray-500 mb-1.5">Criteria</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {request.criteria.map((criterion) => {
                                    const response = submission.criteriaResponses?.find(
                                      (r) => r.criterionId === criterion.id
                                    );
                                    const met = response?.met || false;
                                    return (
                                      <div
                                        key={criterion.id}
                                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                                          met
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-red-50 text-red-700 border-red-200'
                                        }`}
                                      >
                                        {met ? (
                                          <CheckCircle2 className="h-3 w-3" />
                                        ) : (
                                          <XCircle className="h-3 w-3" />
                                        )}
                                        {criterion.label}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Vacation dates */}
                            {submission.candidateVacationDates && (
                              <p className="text-sm text-orange-600 mt-2">
                                Vakantie: {submission.candidateVacationDates}
                              </p>
                            )}

                            {submission.notes && (
                              <p className="text-sm text-blue-600 mt-2 italic">&ldquo;{submission.notes}&rdquo;</p>
                            )}
                          </div>
                        </div>

                        {/* Right side: Rate + Cost + Actions */}
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(rate)}
                          </p>
                          <p className="text-xs text-gray-500">per uur</p>

                          {/* Cost Estimation */}
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-left">
                            <div className="flex items-center gap-1 mb-1">
                              <Euro className="h-3 w-3 text-gray-500" />
                              <span className="text-xs font-semibold text-gray-600">Kostenindicatie</span>
                            </div>
                            <p className="text-sm font-medium">
                              {formatCurrency(cost.monthlyBase)}<span className="text-xs text-gray-500"> /maand</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Totaal: {formatCurrency(cost.grandTotal)} (incl. ~15% ORT)
                            </p>
                          </div>

                          <div className="flex gap-2 mt-3">
                            {submission.cvUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                asChild
                              >
                                <a href={submission.cvUrl} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4 mr-1" />
                                  CV
                                </a>
                              </Button>
                            )}
                          </div>

                          {submission.status === "pending" && (
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleAction(submission, "reject")}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Afwijzen
                              </Button>
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => handleAction(submission, "accept")}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Uitnodigen
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog open={!!selectedSubmission && !!actionType} onOpenChange={() => {
        setSelectedSubmission(null);
        setActionType(null);
        setMessage("");
        setMeetingAvailability("");
        setRejectionReason("");
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept" ? "Kandidaat Uitnodigen" : "Kandidaat Afwijzen"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "accept"
                ? `Wilt u ${selectedSubmission?.candidate?.firstName} ${selectedSubmission?.candidate?.lastName} uitnodigen voor een kennismakingsgesprek?`
                : `Weet u zeker dat u ${selectedSubmission?.candidate?.firstName} ${selectedSubmission?.candidate?.lastName} wilt afwijzen?`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Bericht naar {selectedSubmission?.agency?.name} (optioneel)
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  actionType === "accept"
                    ? "bijv. Graag uitnodigen voor kennismaking volgende week"
                    : "bijv. Helaas past het profiel niet bij onze wensen"
                }
                className="mt-2"
              />
            </div>

            {actionType === "accept" && (
              <div>
                <label className="text-sm font-medium">
                  Beschikbaarheid kennismakingsgesprek (optioneel)
                </label>
                <Textarea
                  value={meetingAvailability}
                  onChange={(e) => setMeetingAvailability(e.target.value)}
                  placeholder="bijv. Maandag 3 feb 10:00-12:00, Woensdag 5 feb 14:00-16:00"
                  className="mt-2"
                />
              </div>
            )}

            {actionType === "reject" && (
              <div>
                <label className="text-sm font-medium">
                  Reden voor afwijzing (optioneel)
                </label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="bijv. Betere match gevonden"
                  className="mt-2"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSubmission(null);
                setActionType(null);
                setMessage("");
                setMeetingAvailability("");
                setRejectionReason("");
              }}
            >
              Annuleren
            </Button>
            <Button
              onClick={confirmAction}
              disabled={isActioning}
              className={
                actionType === "accept"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {isActioning ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {actionType === "accept" ? "Uitnodigen" : "Afwijzen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
