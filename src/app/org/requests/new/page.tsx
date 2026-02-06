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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FUNCTIONS = [
  "Verpleegkundige",
  "Verpleegkundige IC",
  "Verpleegkundige SEH",
  "Verpleegkundige OK",
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

type FormData = {
  functionRequired: string;
  department: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  hoursPerWeek: string;
  title: string;
  description: string;
  specialRequirements: string;
};

export default function NewRequestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    functionRequired: "",
    department: "",
    startDate: undefined,
    endDate: undefined,
    hoursPerWeek: "",
    title: "",
    description: "",
    specialRequirements: "",
  });

  const updateFormData = (field: keyof FormData, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate title when function is selected
    if (field === "functionRequired" && value) {
      setFormData((prev) => ({
        ...prev,
        functionRequired: value as string,
        title: prev.title || (value as string),
      }));
    }
  };

  const canProceedStep1 = formData.functionRequired !== "";
  const canProceedStep2 = formData.startDate && formData.endDate && formData.hoursPerWeek;
  const canSubmit = canProceedStep1 && canProceedStep2 && formData.title;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Aanvraag geplaatst",
      description: "Uw aanvraag is verzonden naar alle aangesloten uitzendbureaus.",
    });

    router.push("/org/requests");
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Nieuwe Aanvraag" subtitle="Plaats een personeelsaanvraag" />

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
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
                {s < 3 && (
                  <div
                    className={cn(
                      "w-16 h-1 mx-2 transition-colors",
                      step > s ? "bg-blue-600" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Function */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Welke functie zoekt u?</CardTitle>
                <CardDescription>
                  Selecteer de functie die u nodig heeft
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

          {/* Step 2: Period & Hours */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Periode en uren</CardTitle>
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

          {/* Step 3: Details */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Aanvullende details</CardTitle>
                <CardDescription>
                  Voeg eventuele extra informatie toe voor de bureaus
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

                <div className="space-y-2">
                  <Label htmlFor="requirements">Speciale eisen (optioneel)</Label>
                  <Textarea
                    id="requirements"
                    value={formData.specialRequirements}
                    onChange={(e) => updateFormData("specialRequirements", e.target.value)}
                    placeholder="bijv. Ervaring met dialyse, BIG-registratie vereist..."
                    rows={2}
                  />
                </div>

                {/* Summary */}
                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Samenvatting</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p><strong>Functie:</strong> {formData.functionRequired}</p>
                    {formData.department && (
                      <p><strong>Afdeling:</strong> {formData.department}</p>
                    )}
                    <p>
                      <strong>Periode:</strong>{" "}
                      {formData.startDate && format(formData.startDate, "d MMM yyyy", { locale: nl })} -{" "}
                      {formData.endDate && format(formData.endDate, "d MMM yyyy", { locale: nl })}
                    </p>
                    <p><strong>Uren:</strong> {formData.hoursPerWeek} uur per week</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
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
