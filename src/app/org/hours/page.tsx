"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  X,
  Clock,
  Euro,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const pendingHours = [
  {
    id: "1",
    candidateName: "Anna de Vries",
    agencyName: "ZorgTalent BV",
    department: "Intensive Care",
    weekNumber: 5,
    year: 2024,
    regularHours: 24,
    eveningHours: 4,
    nightHours: 4,
    weekendHours: 0,
    holidayHours: 0,
    hourlyRate: 52.0,
    submittedAt: "2024-02-04",
  },
  {
    id: "2",
    candidateName: "Sophie Jansen",
    agencyName: "MediFlex",
    department: "Spoedeisende Hulp",
    weekNumber: 5,
    year: 2024,
    regularHours: 32,
    eveningHours: 4,
    nightHours: 0,
    weekendHours: 8,
    holidayHours: 0,
    hourlyRate: 48.0,
    submittedAt: "2024-02-04",
  },
  {
    id: "3",
    candidateName: "Jan Bakker",
    agencyName: "Care4You",
    department: "Verpleegafdeling",
    weekNumber: 5,
    year: 2024,
    regularHours: 36,
    eveningHours: 0,
    nightHours: 4,
    weekendHours: 0,
    holidayHours: 0,
    hourlyRate: 45.0,
    submittedAt: "2024-02-03",
  },
];

// ORT rates
const ORT_RATES = {
  evening: 1.22,
  night: 1.40,
  weekend: 1.35,
  holiday: 2.00,
};

function calculateTotal(entry: typeof pendingHours[0]) {
  const base = entry.regularHours * entry.hourlyRate;
  const evening = entry.eveningHours * entry.hourlyRate * ORT_RATES.evening;
  const night = entry.nightHours * entry.hourlyRate * ORT_RATES.night;
  const weekend = entry.weekendHours * entry.hourlyRate * ORT_RATES.weekend;
  const holiday = entry.holidayHours * entry.hourlyRate * ORT_RATES.holiday;
  return base + evening + night + weekend + holiday;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export default function OrgHoursPage() {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionDialog, setActionDialog] = useState<{
    type: "approve" | "dispute";
    entry?: typeof pendingHours[0];
  } | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === pendingHours.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingHours.map((h) => h.id));
    }
  };

  const handleApprove = async (entry?: typeof pendingHours[0]) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));

    toast({
      title: "Uren goedgekeurd",
      description: entry
        ? `Uren van ${entry.candidateName} zijn goedgekeurd.`
        : `${selectedIds.length} urenregistraties zijn goedgekeurd.`,
    });

    setIsSubmitting(false);
    setActionDialog(null);
    setSelectedIds([]);
  };

  const handleDispute = async () => {
    if (!actionDialog?.entry) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));

    toast({
      title: "Uren betwist",
      description: `De uren van ${actionDialog.entry.candidateName} zijn betwist. Het bureau ontvangt bericht.`,
    });

    setIsSubmitting(false);
    setActionDialog(null);
    setDisputeReason("");
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Uren Goedkeuren" subtitle="Bekijk en keur urenregistraties goed" />

      <div className="flex-1 p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Te beoordelen</p>
                <p className="text-2xl font-bold">{pendingHours.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Totaal uren</p>
                <p className="text-2xl font-bold">
                  {pendingHours.reduce((sum, h) => sum + h.regularHours + h.eveningHours + h.nightHours + h.weekendHours, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-100">
                <Euro className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Totaal bedrag</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(pendingHours.reduce((sum, h) => sum + calculateTotal(h), 0))}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="font-medium text-blue-900">
                {selectedIds.length} registratie(s) geselecteerd
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedIds([])}
                >
                  Deselecteren
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleApprove()}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Alle Goedkeuren
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hours Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ingediende Uren - Week 5, 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === pendingHours.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Medewerker</TableHead>
                  <TableHead>Bureau</TableHead>
                  <TableHead>Afdeling</TableHead>
                  <TableHead className="text-right">Regulier</TableHead>
                  <TableHead className="text-right">ORT</TableHead>
                  <TableHead className="text-right">Totaal</TableHead>
                  <TableHead className="text-right">Bedrag</TableHead>
                  <TableHead className="w-32">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingHours.map((entry) => {
                  const totalHours = entry.regularHours + entry.eveningHours + entry.nightHours + entry.weekendHours;
                  const ortHours = entry.eveningHours + entry.nightHours + entry.weekendHours + entry.holidayHours;
                  const total = calculateTotal(entry);

                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(entry.id)}
                          onCheckedChange={() => toggleSelection(entry.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{entry.candidateName}</TableCell>
                      <TableCell>{entry.agencyName}</TableCell>
                      <TableCell>{entry.department}</TableCell>
                      <TableCell className="text-right">{entry.regularHours}u</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end text-xs">
                          {entry.eveningHours > 0 && (
                            <span className="text-orange-600">{entry.eveningHours}u avond</span>
                          )}
                          {entry.nightHours > 0 && (
                            <span className="text-purple-600">{entry.nightHours}u nacht</span>
                          )}
                          {entry.weekendHours > 0 && (
                            <span className="text-blue-600">{entry.weekendHours}u weekend</span>
                          )}
                          {ortHours === 0 && <span className="text-gray-400">-</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{totalHours}u</TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                        {formatCurrency(total)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setActionDialog({ type: "dispute", entry })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            onClick={() => setActionDialog({ type: "approve", entry })}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ORT Info */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">ORT Tarieven (Onregelmatigheidstoeslag)</h4>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Avond (18-22u):</span>
                <span className="ml-2 font-medium">+22%</span>
              </div>
              <div>
                <span className="text-gray-500">Nacht (22-06u):</span>
                <span className="ml-2 font-medium">+40%</span>
              </div>
              <div>
                <span className="text-gray-500">Weekend:</span>
                <span className="ml-2 font-medium">+35%</span>
              </div>
              <div>
                <span className="text-gray-500">Feestdagen:</span>
                <span className="ml-2 font-medium">+100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approve Dialog */}
      <Dialog
        open={actionDialog?.type === "approve"}
        onOpenChange={() => setActionDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uren Goedkeuren</DialogTitle>
            <DialogDescription>
              Weet u zeker dat u de uren van {actionDialog?.entry?.candidateName} wilt goedkeuren?
            </DialogDescription>
          </DialogHeader>

          {actionDialog?.entry && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Reguliere uren:</span>
                <span className="font-medium">{actionDialog.entry.regularHours}u</span>
              </div>
              <div className="flex justify-between">
                <span>ORT uren:</span>
                <span className="font-medium">
                  {actionDialog.entry.eveningHours + actionDialog.entry.nightHours + actionDialog.entry.weekendHours}u
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold">
                <span>Totaal bedrag:</span>
                <span className="text-emerald-600">{formatCurrency(calculateTotal(actionDialog.entry))}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Annuleren
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleApprove(actionDialog?.entry)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Goedkeuren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog
        open={actionDialog?.type === "dispute"}
        onOpenChange={() => {
          setActionDialog(null);
          setDisputeReason("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Uren Betwisten
            </DialogTitle>
            <DialogDescription>
              Geef aan waarom u de uren van {actionDialog?.entry?.candidateName} betwist.
              Het bureau ontvangt hiervan bericht.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Reden voor betwisting..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Annuleren
            </Button>
            <Button
              variant="destructive"
              onClick={handleDispute}
              disabled={!disputeReason || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="mr-2 h-4 w-4" />
              )}
              Betwisten
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
