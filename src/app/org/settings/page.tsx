"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Phone, MapPin, Percent, Loader2, Save } from "lucide-react";

export default function OrgSettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Mock data - would come from API
  const [orgData, setOrgData] = useState({
    name: "Amsterdam UMC",
    kvkNumber: "12345678",
    address: "Meibergdreef 9",
    city: "Amsterdam",
    postalCode: "1105 AZ",
    contactEmail: "hr@amsterdamumc.nl",
    contactPhone: "020-5669111",
  });

  const [ortRates, setOrtRates] = useState({
    evening: "22",
    night: "40",
    weekend: "35",
    holiday: "100",
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
      <Header title="Instellingen" subtitle="Beheer uw organisatie-instellingen" />

      <div className="flex-1 p-6 space-y-6 max-w-3xl">
        {/* Organization Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organisatiegegevens
            </CardTitle>
            <CardDescription>
              Basisinformatie over uw organisatie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organisatienaam</Label>
                <Input
                  id="name"
                  value={orgData.name}
                  onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kvk">KvK-nummer</Label>
                <Input
                  id="kvk"
                  value={orgData.kvkNumber}
                  onChange={(e) => setOrgData({ ...orgData, kvkNumber: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                value={orgData.address}
                onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Plaats</Label>
                <Input
                  id="city"
                  value={orgData.city}
                  onChange={(e) => setOrgData({ ...orgData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal">Postcode</Label>
                <Input
                  id="postal"
                  value={orgData.postalCode}
                  onChange={(e) => setOrgData({ ...orgData, postalCode: e.target.value })}
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
                    value={orgData.contactEmail}
                    onChange={(e) => setOrgData({ ...orgData, contactEmail: e.target.value })}
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
                    value={orgData.contactPhone}
                    onChange={(e) => setOrgData({ ...orgData, contactPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ORT Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              ORT-tarieven
            </CardTitle>
            <CardDescription>
              Onregelmatigheidstoeslag percentages voor uw organisatie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="evening">Avondtoeslag (18:00-22:00)</Label>
                <div className="relative">
                  <Input
                    id="evening"
                    type="number"
                    value={ortRates.evening}
                    onChange={(e) => setOrtRates({ ...ortRates, evening: e.target.value })}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="night">Nachttoeslag (22:00-06:00)</Label>
                <div className="relative">
                  <Input
                    id="night"
                    type="number"
                    value={ortRates.night}
                    onChange={(e) => setOrtRates({ ...ortRates, night: e.target.value })}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weekend">Weekendtoeslag</Label>
                <div className="relative">
                  <Input
                    id="weekend"
                    type="number"
                    value={ortRates.weekend}
                    onChange={(e) => setOrtRates({ ...ortRates, weekend: e.target.value })}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="holiday">Feestdagentoeslag</Label>
                <div className="relative">
                  <Input
                    id="holiday"
                    type="number"
                    value={ortRates.holiday}
                    onChange={(e) => setOrtRates({ ...ortRates, holiday: e.target.value })}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
              <p>
                Deze tarieven worden gebruikt voor de berekening van ORT op facturen.
                Standaardtarieven zijn gebaseerd op de CAO Ziekenhuizen.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
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
