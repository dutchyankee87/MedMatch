import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  Receipt,
  Bell,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Aanvraag Plaatsen",
    description:
      "Zorgorganisatie definieert de behoefte: functie, periode, BIG-vereisten en maximale uurtarief.",
    actor: "org" as const,
    icon: FileText,
  },
  {
    number: "02",
    title: "Bureaus Genotificeerd",
    description:
      "Alle aangesloten uitzendbureaus ontvangen direct een e-mail met de nieuwe aanvraag.",
    actor: "system" as const,
    icon: Bell,
  },
  {
    number: "03",
    title: "Kandidaten Indienen",
    description:
      "Bureaus dienen geschikte kandidaten in met CV, referenties en voorgesteld uurtarief.",
    actor: "agency" as const,
    icon: Users,
  },
  {
    number: "04",
    title: "Selectie & Goedkeuring",
    description:
      "Organisatie vergelijkt kandidaten zij-aan-zij en accepteert de beste match.",
    actor: "org" as const,
    icon: CheckCircle2,
  },
  {
    number: "05",
    title: "Urenregistratie",
    description:
      "Na de werkperiode registreert het bureau de gewerkte uren met automatische ORT-berekening.",
    actor: "agency" as const,
    icon: Clock,
  },
  {
    number: "06",
    title: "Factuur & Betaling",
    description:
      "Na goedkeuring van de uren wordt automatisch een professionele factuur gegenereerd.",
    actor: "agency" as const,
    icon: Receipt,
  },
];

function getActorStyles(actor: "org" | "agency" | "system") {
  switch (actor) {
    case "org":
      return {
        border: "border-blue-200 text-blue-600",
        badge: "bg-blue-50 text-blue-700",
        cardBorder: "border-l-4 border-l-blue-500",
        label: "Zorgorganisatie",
      };
    case "agency":
      return {
        border: "border-emerald-200 text-emerald-600",
        badge: "bg-emerald-50 text-emerald-700",
        cardBorder: "border-l-4 border-l-emerald-500",
        label: "Uitzendbureau",
      };
    case "system":
      return {
        border: "border-gray-200 text-gray-600",
        badge: "bg-gray-50 text-gray-700",
        cardBorder: "",
        label: "Systeem",
      };
  }
}

export function WorkflowSection() {
  return (
    <section id="werkwijze" className="py-20 lg:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Van aanvraag tot factuur
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Zo werkt MedMatch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Een gestroomlijnde workflow die alle stappen automatiseert.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-gray-200 to-emerald-200 hidden lg:block" />

            <div className="space-y-6">
              {steps.map((step) => {
                const styles = getActorStyles(step.actor);
                return (
                  <div key={step.number} className="relative flex gap-6">
                    {/* Step Number Circle */}
                    <div
                      className={`
                        relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 bg-white shadow-md
                        ${styles.border}
                      `}
                    >
                      <step.icon className="h-7 w-7" />
                    </div>

                    {/* Content Card */}
                    <Card className={`flex-1 ${styles.cardBorder}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Badge variant="secondary" className={`mb-2 ${styles.badge}`}>
                              {styles.label}
                            </Badge>
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {step.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                          <span className="text-3xl font-bold text-gray-100">
                            {step.number}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
