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
import { ArrowLeft, Upload, Loader2, Save, User } from "lucide-react";
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

export default function NewCandidatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    function: "",
    bigNumber: "",
    notes: "",
  });

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.function) {
      toast({
        title: "Ontbrekende gegevens",
        description: "Vul alle verplichte velden in.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    toast({
      title: "Kandidaat toegevoegd",
      description: `${formData.firstName} ${formData.lastName} is toegevoegd aan uw kandidatenpool.`,
    });

    router.push("/agency/candidates");
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Nieuwe Kandidaat" subtitle="Voeg een kandidaat toe aan uw pool" />

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Button variant="ghost" asChild>
            <Link href="/agency/candidates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar kandidaten
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Kandidaatgegevens
              </CardTitle>
              <CardDescription>
                Voer de basisinformatie van de kandidaat in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Voornaam *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Anna"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Achternaam *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="de Vries"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="anna@email.nl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefoonnummer</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="06-12345678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="function">Functie *</Label>
                  <Select
                    value={formData.function}
                    onValueChange={(value) => setFormData({ ...formData, function: value })}
                  >
                    <SelectTrigger id="function">
                      <SelectValue placeholder="Selecteer functie" />
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
                  <Label htmlFor="big">BIG-nummer</Label>
                  <Input
                    id="big"
                    value={formData.bigNumber}
                    onChange={(e) => setFormData({ ...formData, bigNumber: e.target.value })}
                    placeholder="12345678901"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cv">CV uploaden</Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notities</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ervaring, kwalificaties, beschikbaarheid..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/agency/candidates">Annuleren</Link>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opslaan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Kandidaat Toevoegen
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
