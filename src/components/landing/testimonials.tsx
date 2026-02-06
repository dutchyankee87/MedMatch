import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "MedMatch heeft onze flex-inhuur volledig getransformeerd. We besparen wekelijks uren op administratie en hebben veel beter inzicht in onze uitgaven.",
    author: "Marieke van den Berg",
    role: "HR Manager",
    company: "Zorggroep Almere",
    type: "org" as const,
  },
  {
    quote:
      "Als uitzendbureau kunnen we nu veel sneller reageren op aanvragen. De automatische ORT-berekening voorkomt discussies achteraf.",
    author: "Peter de Groot",
    role: "Directeur",
    company: "MediFlex Personeelsdiensten",
    type: "agency" as const,
  },
  {
    quote:
      "De kandidatenvergelijking is fantastisch. We zien direct alle opties naast elkaar en kunnen een weloverwogen keuze maken.",
    author: "Sandra Jansen",
    role: "Afdelingshoofd IC",
    company: "St. Antonius Ziekenhuis",
    type: "org" as const,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Wat onze gebruikers zeggen
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ontdek waarom zorgorganisaties en uitzendbureaus kiezen voor
            MedMatch.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className={`relative ${
                t.type === "org"
                  ? "border-t-4 border-t-blue-500"
                  : "border-t-4 border-t-emerald-500"
              }`}
            >
              <CardContent className="p-6">
                <Quote
                  className={`h-8 w-8 mb-4 ${
                    t.type === "org" ? "text-blue-200" : "text-emerald-200"
                  }`}
                />
                <p className="text-gray-700 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback
                      className={
                        t.type === "org"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }
                    >
                      {t.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{t.author}</p>
                    <p className="text-sm text-gray-500">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
