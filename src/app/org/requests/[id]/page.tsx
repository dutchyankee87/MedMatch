"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  FileText,
  Check,
  X,
  Download,
  Mail,
  Phone,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const request = {
  id: "1",
  title: "Verpleegkundige IC",
  department: "Intensive Care",
  functionRequired: "Verpleegkundige",
  startDate: "2024-02-01",
  endDate: "2024-04-30",
  hoursPerWeek: 32,
  status: "in_review" as const,
  description: "Wij zoeken een ervaren IC-verpleegkundige voor onze afdeling Intensive Care. De kandidaat dient zelfstandig te kunnen werken en ervaring te hebben met beademing en hemodynamische monitoring.",
  specialRequirements: "BIG-registratie vereist, minimaal 2 jaar IC-ervaring",
  createdAt: "2024-01-28",
};

const submissions = [
  {
    id: "1",
    candidateName: "Anna de Vries",
    candidateFunction: "Verpleegkundige IC",
    agencyName: "ZorgTalent BV",
    proposedRate: 52.0,
    cvUrl: "/cv/anna-de-vries.pdf",
    bigNumber: "12345678901",
    experience: "5 jaar IC-ervaring, Amsterdam UMC",
    notes: "Beschikbaar per direct. Heeft ervaring met ECMO.",
    status: "pending" as const,
    submittedAt: "2024-01-29T10:30:00",
  },
  {
    id: "2",
    candidateName: "Jan Bakker",
    candidateFunction: "Verpleegkundige IC",
    agencyName: "MediFlex",
    proposedRate: 48.5,
    cvUrl: "/cv/jan-bakker.pdf",
    bigNumber: "98765432101",
    experience: "3 jaar IC-ervaring, OLVG",
    notes: "Kan starten vanaf 1 februari. Flexibel inzetbaar.",
    status: "pending" as const,
    submittedAt: "2024-01-29T14:15:00",
  },
  {
    id: "3",
    candidateName: "Sophie Jansen",
    candidateFunction: "Verpleegkundige IC",
    agencyName: "Care4You",
    proposedRate: 55.0,
    cvUrl: "/cv/sophie-jansen.pdf",
    bigNumber: "11223344556",
    experience: "7 jaar IC-ervaring, Erasmus MC",
    notes: "Specialist in pediatrische IC. Uitstekende referenties.",
    status: "pending" as const,
    submittedAt: "2024-01-30T09:00:00",
  },
];

const statusConfig = {
  pending: { label: "In behandeling", color: "bg-yellow-100 text-yellow-800" },
  accepted: { label: "Geaccepteerd", color: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "Afgewezen", color: "bg-red-100 text-red-800" },
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

export default function RequestDetailPage() {
  const { toast } = useToast();
  const [selectedSubmission, setSelectedSubmission] = useState<typeof submissions[0] | null>(null);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);
  const [message, setMessage] = useState("");
  const [meetingAvailability, setMeetingAvailability] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const handleAction = (submission: typeof submissions[0], action: "accept" | "reject") => {
    setSelectedSubmission(submission);
    setActionType(action);
  };

  const confirmAction = () => {
    if (!selectedSubmission || !actionType) return;

    toast({
      title: actionType === "accept" ? "Kandidaat geaccepteerd" : "Kandidaat afgewezen",
      description: actionType === "accept"
        ? `${selectedSubmission.candidateName} is geaccepteerd. De opdrachtbevestiging wordt aangemaakt.`
        : `${selectedSubmission.candidateName} is afgewezen. Het bureau ontvangt hiervan bericht.`,
    });

    setSelectedSubmission(null);
    setActionType(null);
    setMessage("");
    setMeetingAvailability("");
    setRejectionReason("");
  };

  return (
    <div className="flex flex-col h-full">
      <Header title={request.title} subtitle={request.department} />

      <div className="flex-1 p-6 space-y-6">
        {/* Back Button */}
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
                <Badge className="bg-orange-100 text-orange-800">In behandeling</Badge>
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">{request.department}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Periode</p>
                  <p className="font-medium">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
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
            </div>

            {request.description && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Omschrijving</h4>
                <p className="text-gray-600 text-sm">{request.description}</p>
              </div>
            )}

            {request.specialRequirements && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Speciale eisen</h4>
                <p className="text-gray-600 text-sm">{request.specialRequirements}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submissions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Ingediende Kandidaten ({submissions.length})
          </h2>

          <div className="grid gap-4">
            {submissions.map((submission) => {
              const status = statusConfig[submission.status];
              return (
                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {submission.candidateName.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{submission.candidateName}</h3>
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                          <p className="text-sm text-gray-500">{submission.candidateFunction}</p>
                          <p className="text-sm text-gray-500">via {submission.agencyName}</p>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Award className="h-4 w-4" />
                              <span>BIG: {submission.bigNumber}</span>
                            </div>
                          </div>

                          {submission.experience && (
                            <p className="text-sm text-gray-600 mt-2">{submission.experience}</p>
                          )}

                          {submission.notes && (
                            <p className="text-sm text-blue-600 mt-2 italic">"{submission.notes}"</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(submission.proposedRate)}
                        </p>
                        <p className="text-xs text-gray-500">per uur</p>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            CV
                          </Button>
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
                              Accepteren
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
              {actionType === "accept" ? "Kandidaat Accepteren" : "Kandidaat Afwijzen"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "accept"
                ? `Weet u zeker dat u ${selectedSubmission?.candidateName} wilt accepteren? Er wordt een opdrachtbevestiging aangemaakt.`
                : `Weet u zeker dat u ${selectedSubmission?.candidateName} wilt afwijzen?`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Bericht naar {selectedSubmission?.agencyName} (optioneel)
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  actionType === "accept"
                    ? "bijv. Graag zo spoedig mogelijk contact opnemen..."
                    : "bijv. Helaas past het profiel niet bij onze wensen..."
                }
                className="mt-2"
              />
            </div>

            {actionType === "accept" && (
              <div>
                <label className="text-sm font-medium">
                  Beschikbaarheid kennismakingsgesprek (optioneel)
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Wanneer kan de teamleider kennismaken met de kandidaat?
                </p>
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
                <p className="text-xs text-gray-500 mt-1">
                  Deze reden wordt ook gedeeld met andere bureaus als een kandidaat wordt geaccepteerd.
                </p>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="bijv. Betere match gevonden, meer ervaring op de gewenste afdeling"
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
              className={
                actionType === "accept"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {actionType === "accept" ? "Accepteren" : "Afwijzen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
