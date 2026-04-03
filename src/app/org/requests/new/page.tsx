"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CriteriaSelector } from "@/components/criteria-selector";
import { FUNCTION_CRITERIA_TEMPLATES, CATEGORY_LABELS } from "@/lib/criteria-templates";
import type { RequestCriterion } from "@/lib/types/criteria";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, ArrowLeft, ArrowRight, Check, Loader2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FUNCTIONS = [
  "Verpleegkundige",
  "Verpleegkundige IC",
  "Verpleegkundige SEH",
  "Verpleegkundige OK",
  "Anesthesiemedewerker",
  "Verzorgende IG",
  "Helpende",
  "Gespecialiseerd Verpleegkundige",
  "Verpleegkundig Specialist",
  "Physician Assistant",
];

const DEPARTMENTS = [
  "Intensive Care",
  "Spoedeisende Hulp",
  "Operatiekamer",
  "Verpleegafdeling",
  "Thuiszorg",
  "Revalidatie",
  "Geriatrie",
  "Psychiatrie",
  "Polikliniek",
];

const TOTAL_STEPS = 4;

type FormData = {
  functionRequired: string;
  department: string;
  criteria: RequestCriterion[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  hoursPerWeek: string;
  schedulePreferences: string;
  vacationDates: string;
  maxTravelDistance: string;
  title: string;
  description: string;
};

export default function NewRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    functionRequired: "",
    department: "",
    criteria: [],
    startDate: undefined,
    endDate: undefined,
    hoursPerWeek: "",
    schedulePreferences: "",
    vacationDates: "",
    maxTravelDistance: "",
    title: "",
    description: "",
  });

  // Auto-load criteria template when function changes
  useEffect(() => {
    if (formData.functionRequired) {
      const template = FUNCTION_CRITERIA_TEMPLATES[formData.functionRequired];
      if (template) {
        setFormData((prev) => ({ ...prev, criteria: [...template] }));
      } else {
        setFormData((prev) => ({ ...prev, criteria: [] }));
      }
    }
  }, [formData.functionRequired]);

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate title when function is selected
      if (field === "functionRequired" && value) {
        updated.title = prev.title || (value as string);
      }
      return updated;
    });
  };

  const canProceedStep1 = formData.functionRequired !== "";
  const canProceedStep2 = true; // Criteria are optional (template pre-loaded)
  const canProceedStep3 = formData.startDate && formData.endDate && formData.hoursPerWeek;
  const canSubmit = canProceedStep1 && canProceedStep3 && formData.title;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          functionRequired: formData.functionRequired,
          department: formData.department || undefined,
          startDate: formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : undefined,
          endDate: formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : undefined,
          hoursPerWeek: parseInt(formData.hoursPerWeek, 10),
          criteria: formData.criteria.length > 0 ? formData.criteria : undefined,
          schedulePreferences: formData.schedulePreferences || undefined,
          vacationDates: formData.vacationDates || undefined,
          maxTravelDistance: formData.maxTravelDistance ? parseInt(formData.maxTravelDistance, 10) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Aanvraag kon niet worden geplaatst");
      }

      toast({
        title: "Aanvraag geplaatst",
        description: "Uw aanvraag is verzonden naar alle aangesloten uitzendbureaus.",
      });

      router.push("/org/requests");
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

  const requiredCount = formData.criteria.filter((c) => c.required).length;
  const optionalCount = formData.criteria.filter((c) => !c.required).length;

  return (
    <div className="flex flex-col h-full">
      <Header title="Nieuwe Aanvraag" subtitle="Plaats een personeelsaanvraag" />

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                    step >= s
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  )}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < TOTAL_STEPS && (
                  <div
                    className={cn(
                      "w-12 h-1 mx-2 transition-colors",
                      step > s ? "bg-blue-600" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Function & Department */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Welke functie zoekt u?</CardTitle>
                <CardDescription>
                  Selecteer de functie en afdeling. Op basis van de functie worden relevante criteria automatisch geladen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="function">Functie *</Label>
                  <Select
                    value={formData.functionRequired}
                    onValueChange={(value) => updateFormData("functionRequired", value)}
                  >
                    <SelectTrigger id="function">
                      <SelectValue placeholder="Selecteer een functie" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUNCTIONS.map((func) => (
                        <SelectItem key={func} value={func}>
                          {func}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Afdeling (optioneel)</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => updateFormData("department", value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Selecteer een afdeling" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.functionRequired && FUNCTION_CRITERIA_TEMPLATES[formData.functionRequired] && (
                  <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                    <strong>{formData.criteria.length} criteria</strong> worden automatisch geladen voor {formData.functionRequired}.
                    U kunt deze aanpassen in de volgende stap.
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/org/requests">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Annuleren
                    </Link>
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Volgende
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Criteria */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Criteria & Eisen</CardTitle>
                <CardDescription>
                  Pas de criteria aan voor deze aanvraag. Klik op &quot;Vereist&quot; / &quot;Gewenst&quot; om te wisselen.
                  U kunt ook aangepaste criteria toevoegen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CriteriaSelector
                  criteria={formData.criteria}
                  onChange={(criteria) => updateFormData("criteria", criteria)}
                />

                {formData.criteria.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    <Badge variant="default">{requiredCount} vereist</Badge>
                    <Badge variant="secondary">{optionalCount} gewenst</Badge>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Vorige
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Volgende
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Period, Hours & Preferences */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Periode & Beschikbaarheid</CardTitle>
                <CardDescription>
                  Wanneer en hoeveel uur per week heeft u personeel nodig?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Startdatum *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? (
                            format(formData.startDate, "d MMMM yyyy", { locale: nl })
                          ) : (
                            <span>Selecteer datum</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => updateFormData("startDate", date)}
                          locale={nl}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Einddatum *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? (
                            format(formData.endDate, "d MMMM yyyy", { locale: nl })
                          ) : (
                            <span>Selecteer datum</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => updateFormData("endDate", date)}
                          locale={nl}
                          disabled={(date) =>
                            date < new Date() ||
                            (formData.startDate ? date < formData.startDate : false)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours">Uren per week *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="hours"
                      type="number"
                      min="1"
                      max="40"
                      value={formData.hoursPerWeek}
                      onChange={(e) => updateFormData("hoursPerWeek", e.target.value)}
                      placeholder="bijv. 32"
                      className="w-32"
                    />
                    <span className="text-gray-500">uur per week</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTravel">Maximale reisafstand (optioneel)</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <Input
                      id="maxTravel"
                      type="number"
                      min="0"
                      value={formData.maxTravelDistance}
                      onChange={(e) => updateFormData("maxTravelDistance", e.target.value)}
                      placeholder="bijv. 50"
                      className="w-32"
                    />
                    <span className="text-gray-500">km</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule">Roosterwensen (optioneel)</Label>
                  <Textarea
                    id="schedule"
                    value={formData.schedulePreferences}
                    onChange={(e) => updateFormData("schedulePreferences", e.target.value)}
                    placeholder="bijv. Alleen dagdiensten, geen weekenden"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vacation">Geplande vakantie / sluiting afdeling (optioneel)</Label>
                  <Textarea
                    id="vacation"
                    value={formData.vacationDates}
                    onChange={(e) => updateFormData("vacationDates", e.target.value)}
                    placeholder="bijv. Afdeling gesloten van 21 juli t/m 4 augustus"
                    rows={2}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Vorige
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    disabled={!canProceedStep3}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Volgende
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Overzicht & Bevestigen</CardTitle>
                <CardDescription>
                  Controleer uw aanvraag en voeg eventueel een titel en omschrijving toe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titel aanvraag *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                    placeholder="bijv. Verpleegkundige IC"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Omschrijving (optioneel)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Beschrijf de werkzaamheden..."
                    rows={3}
                  />
                </div>

                {/* Summary */}
                <div className="bg-blue-50 rounded-lg p-4 mt-6 space-y-3">
                  <h4 className="font-semibold text-blue-900">Samenvatting</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p><strong>Functie:</strong> {formData.functionRequired}</p>
                    {formData.department && (
                      <p><strong>Afdeling:</strong> {formData.department}</p>
                    )}
                    <p>
                      <strong>Periode:</strong>{" "}
                      {formData.startDate && format(formData.startDate, "d MMM yyyy", { locale: nl })} &ndash;{" "}
                      {formData.endDate && format(formData.endDate, "d MMM yyyy", { locale: nl })}
                    </p>
                    <p><strong>Uren:</strong> {formData.hoursPerWeek} uur per week</p>
                    {formData.maxTravelDistance && (
                      <p><strong>Max. reisafstand:</strong> {formData.maxTravelDistance} km</p>
                    )}
                  </div>

                  {formData.criteria.length > 0 && (
                    <div className="pt-2 border-t border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-2">
                        Criteria ({formData.criteria.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.criteria.map((c) => (
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

                  {formData.schedulePreferences && (
                    <div className="pt-2 border-t border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Roosterwensen:</strong> {formData.schedulePreferences}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Vorige
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Versturen...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Aanvraag Plaatsen
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
