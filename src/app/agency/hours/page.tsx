"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks } from "date-fns";
import { nl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Plus,
  Clock,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const placements = [
  {
    id: "1",
    candidateName: "Anna de Vries",
    organization: "Amsterdam UMC",
    department: "Intensive Care",
    hourlyRate: 52.0,
  },
  {
    id: "2",
    candidateName: "Sophie Jansen",
    organization: "OLVG",
    department: "Spoedeisende Hulp",
    hourlyRate: 48.0,
  },
];

const existingHours = [
  {
    id: "1",
    placementId: "1",
    candidateName: "Anna de Vries",
    organization: "Amsterdam UMC",
    weekNumber: 4,
    totalHours: 32,
    regularHours: 24,
    ortHours: 8,
    status: "approved" as const,
  },
  {
    id: "2",
    placementId: "1",
    candidateName: "Anna de Vries",
    organization: "Amsterdam UMC",
    weekNumber: 5,
    totalHours: 36,
    regularHours: 28,
    ortHours: 8,
    status: "pending" as const,
  },
  {
    id: "3",
    placementId: "2",
    candidateName: "Sophie Jansen",
    organization: "OLVG",
    weekNumber: 5,
    totalHours: 40,
    regularHours: 32,
    ortHours: 8,
    status: "pending" as const,
  },
];

const statusConfig = {
  pending: { label: "In behandeling", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Goedgekeurd", color: "bg-emerald-100 text-emerald-800" },
  disputed: { label: "Betwist", color: "bg-red-100 text-red-800" },
};

export default function AgencyHoursPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState("");
  const [selectedWeek, setSelectedWeek] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hour inputs for each day
  const [hours, setHours] = useState({
    monday: { regular: "", evening: "", night: "" },
    tuesday: { regular: "", evening: "", night: "" },
    wednesday: { regular: "", evening: "", night: "" },
    thursday: { regular: "", evening: "", night: "" },
    friday: { regular: "", evening: "", night: "" },
    saturday: { regular: "", evening: "", night: "" },
    sunday: { regular: "", evening: "", night: "" },
  });

  const weekStart = selectedWeek ? startOfWeek(selectedWeek, { weekStartsOn: 1 }) : undefined;
  const weekEnd = weekStart ? endOfWeek(weekStart, { weekStartsOn: 1 }) : undefined;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    toast({
      title: "Uren ingediend",
      description: "De uren zijn verzonden ter goedkeuring.",
    });

    setIsDialogOpen(false);
    setIsSubmitting(false);
    setSelectedPlacement("");
    setSelectedWeek(undefined);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Urenregistratie" subtitle="Registreer en beheer uren" />

      <div className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Uren Overzicht</h2>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Uren Registreren
          </Button>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">In behandeling</TabsTrigger>
            <TabsTrigger value="approved">Goedgekeurd</TabsTrigger>
            <TabsTrigger value="all">Alle</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medewerker</TableHead>
                    <TableHead>Organisatie</TableHead>
                    <TableHead>Week</TableHead>
                    <TableHead className="text-right">Regulier</TableHead>
                    <TableHead className="text-right">ORT</TableHead>
                    <TableHead className="text-right">Totaal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {existingHours
                    .filter((h) => h.status === "pending")
                    .map((entry) => {
                      const status = statusConfig[entry.status];
                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.candidateName}</TableCell>
                          <TableCell>{entry.organization}</TableCell>
                          <TableCell>Week {entry.weekNumber}</TableCell>
                          <TableCell className="text-right">{entry.regularHours}u</TableCell>
                          <TableCell className="text-right">{entry.ortHours}u</TableCell>
                          <TableCell className="text-right font-semibold">{entry.totalHours}u</TableCell>
                          <TableCell>
                            <Badge className={status.color}>{status.label}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medewerker</TableHead>
                    <TableHead>Organisatie</TableHead>
                    <TableHead>Week</TableHead>
                    <TableHead className="text-right">Totaal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {existingHours
                    .filter((h) => h.status === "approved")
                    .map((entry) => {
                      const status = statusConfig[entry.status];
                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.candidateName}</TableCell>
                          <TableCell>{entry.organization}</TableCell>
                          <TableCell>Week {entry.weekNumber}</TableCell>
                          <TableCell className="text-right font-semibold">{entry.totalHours}u</TableCell>
                          <TableCell>
                            <Badge className={status.color}>{status.label}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medewerker</TableHead>
                    <TableHead>Organisatie</TableHead>
                    <TableHead>Week</TableHead>
                    <TableHead className="text-right">Totaal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {existingHours.map((entry) => {
                    const status = statusConfig[entry.status];
                    return (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.candidateName}</TableCell>
                        <TableCell>{entry.organization}</TableCell>
                        <TableCell>Week {entry.weekNumber}</TableCell>
                        <TableCell className="text-right font-semibold">{entry.totalHours}u</TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Register Hours Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Uren Registreren</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plaatsing</Label>
                <Select value={selectedPlacement} onValueChange={setSelectedPlacement}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer plaatsing" />
                  </SelectTrigger>
                  <SelectContent>
                    {placements.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.candidateName} - {p.organization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Week</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedWeek && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {weekStart && weekEnd ? (
                        `${format(weekStart, "d MMM", { locale: nl })} - ${format(weekEnd, "d MMM yyyy", { locale: nl })}`
                      ) : (
                        "Selecteer week"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedWeek}
                      onSelect={setSelectedWeek}
                      locale={nl}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {selectedPlacement && selectedWeek && weekStart && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Vul de gewerkte uren in per dag. ORT wordt automatisch berekend.
                  </p>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dag</TableHead>
                      <TableHead>Regulier (06-18u)</TableHead>
                      <TableHead>Avond (18-22u)</TableHead>
                      <TableHead>Nacht (22-06u)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eachDayOfInterval({ start: weekStart, end: weekEnd! }).map((day, i) => {
                      const dayName = format(day, "EEEE", { locale: nl });
                      const dayKey = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"][i] as keyof typeof hours;
                      const isWeekend = i >= 5;

                      return (
                        <TableRow key={i} className={isWeekend ? "bg-orange-50" : ""}>
                          <TableCell className="font-medium">
                            {dayName.charAt(0).toUpperCase() + dayName.slice(1)}
                            <br />
                            <span className="text-xs text-gray-500">
                              {format(day, "d MMM", { locale: nl })}
                            </span>
                            {isWeekend && (
                              <Badge className="ml-2 text-xs bg-orange-100 text-orange-700">Weekend</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              max="12"
                              placeholder="0"
                              className="w-20"
                              value={hours[dayKey].regular}
                              onChange={(e) =>
                                setHours({
                                  ...hours,
                                  [dayKey]: { ...hours[dayKey], regular: e.target.value },
                                })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              max="4"
                              placeholder="0"
                              className="w-20"
                              value={hours[dayKey].evening}
                              onChange={(e) =>
                                setHours({
                                  ...hours,
                                  [dayKey]: { ...hours[dayKey], evening: e.target.value },
                                })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              max="8"
                              placeholder="0"
                              className="w-20"
                              value={hours[dayKey].night}
                              onChange={(e) =>
                                setHours({
                                  ...hours,
                                  [dayKey]: { ...hours[dayKey], night: e.target.value },
                                })
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuleren
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedPlacement || !selectedWeek || isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verzenden...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Uren Indienen
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
