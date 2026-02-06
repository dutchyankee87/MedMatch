"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Phone, Loader2, Save, CreditCard } from "lucide-react";

export default function AgencySettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Mock data
  const [agencyData, setAgencyData] = useState({
    name: "ZorgTalent BV",
    kvkNumber: "87654321",
    address: "Herengracht 100",
    city: "Amsterdam",
    postalCode: "1015 BS",
    contactEmail: "info@zorgtalent.nl",
    contactPhone: "020-1234567",
    iban: "NL91 ABNA 0417 1643 00",
    btwNumber: "NL123456789B01",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({
      title: "Instellingen opgeslagen",
      description: "Uw wijzigingen zijn succesvol opgeslagen.",
    });
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Instellingen" subtitle="Beheer uw bureauinstellingen" />

      <div className="flex-1 p-6 space-y-6 max-w-3xl">
        {/* Agency Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Bureaugegevens
            </CardTitle>
            <CardDescription>
              Basisinformatie over uw uitzendbureau
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bureaunnaam</Label>
                <Input
                  id="name"
                  value={agencyData.name}
                  onChange={(e) => setAgencyData({ ...agencyData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kvk">KvK-nummer</Label>
                <Input
                  id="kvk"
                  value={agencyData.kvkNumber}
                  onChange={(e) => setAgencyData({ ...agencyData, kvkNumber: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                value={agencyData.address}
                onChange={(e) => setAgencyData({ ...agencyData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Plaats</Label>
                <Input
                  id="city"
                  value={agencyData.city}
                  onChange={(e) => setAgencyData({ ...agencyData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal">Postcode</Label>
                <Input
                  id="postal"
                  value={agencyData.postalCode}
                  onChange={(e) => setAgencyData({ ...agencyData, postalCode: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-9"
                    value={agencyData.contactEmail}
                    onChange={(e) => setAgencyData({ ...agencyData, contactEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefoonnummer</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    className="pl-9"
                    value={agencyData.contactPhone}
                    onChange={(e) => setAgencyData({ ...agencyData, contactPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Facturatiegegevens
            </CardTitle>
            <CardDescription>
              Deze gegevens worden gebruikt op uw facturen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  value={agencyData.iban}
                  onChange={(e) => setAgencyData({ ...agencyData, iban: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="btw">BTW-nummer</Label>
                <Input
                  id="btw"
                  value={agencyData.btwNumber}
                  onChange={(e) => setAgencyData({ ...agencyData, btwNumber: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Wijzigingen Opslaan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
