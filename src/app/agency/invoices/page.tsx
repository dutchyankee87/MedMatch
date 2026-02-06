"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import {
  Download,
  Eye,
  Euro,
  FileText,
  Send,
  CheckCircle,
  Plus,
} from "lucide-react";

// Mock data
const invoices = [
  {
    id: "1",
    invoiceNumber: "2024-0042",
    organizationName: "Amsterdam UMC",
    candidateName: "Anna de Vries",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-31",
    lineItems: [
      { description: "Reguliere uren (128u)", hours: 128, rate: 52, amount: 6656 },
      { description: "Avondtoeslag (16u, +22%)", hours: 16, rate: 52 * 0.22, amount: 183.04 },
      { description: "Nachttoeslag (8u, +40%)", hours: 8, rate: 52 * 0.40, amount: 166.4 },
      { description: "Weekendtoeslag (16u, +35%)", hours: 16, rate: 52 * 0.35, amount: 291.2 },
    ],
    subtotal: 6656.0,
    ortTotal: 640.64,
    vatAmount: 1532.19,
    total: 8828.83,
    status: "sent" as const,
    dueDate: "2024-02-15",
    createdAt: "2024-02-01",
  },
  {
    id: "2",
    invoiceNumber: "2024-0041",
    organizationName: "OLVG",
    candidateName: "Sophie Jansen",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-31",
    lineItems: [],
    subtotal: 5760.0,
    ortTotal: 480.0,
    vatAmount: 1310.4,
    total: 7550.4,
    status: "paid" as const,
    dueDate: "2024-02-01",
    paidAt: "2024-01-28",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    invoiceNumber: "2024-0039",
    organizationName: "Amsterdam UMC",
    candidateName: "Anna de Vries",
    periodStart: "2023-12-01",
    periodEnd: "2023-12-31",
    lineItems: [],
    subtotal: 6240.0,
    ortTotal: 520.0,
    vatAmount: 1419.6,
    total: 8179.6,
    status: "paid" as const,
    dueDate: "2024-01-15",
    paidAt: "2024-01-10",
    createdAt: "2024-01-01",
  },
];

const statusConfig = {
  draft: { label: "Concept", color: "bg-gray-100 text-gray-800" },
  sent: { label: "Verzonden", color: "bg-blue-100 text-blue-800" },
  paid: { label: "Betaald", color: "bg-emerald-100 text-emerald-800" },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AgencyInvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);

  const openInvoices = invoices.filter((i) => i.status === "sent");
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const totalOpen = openInvoices.reduce((sum, i) => sum + i.total, 0);
  const totalPaid = paidInvoices.reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="flex flex-col h-full">
      <Header title="Facturen" subtitle="Beheer uw facturen" />

      <div className="flex-1 p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Openstaand</p>
                <p className="text-2xl font-bold">{formatCurrency(totalOpen)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-100">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Betaald deze maand</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Totaal facturen</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Alle ({invoices.length})</TabsTrigger>
            <TabsTrigger value="open">Openstaand ({openInvoices.length})</TabsTrigger>
            <TabsTrigger value="paid">Betaald ({paidInvoices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factuurnummer</TableHead>
                    <TableHead>Organisatie</TableHead>
                    <TableHead>Medewerker</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead className="text-right">Bedrag</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => {
                    const status = statusConfig[invoice.status];

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.organizationName}</TableCell>
                        <TableCell>{invoice.candidateName}</TableCell>
                        <TableCell className="text-sm">
                          {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(invoice.total)}
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedInvoice(invoice)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="open" className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factuurnummer</TableHead>
                    <TableHead>Organisatie</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead className="text-right">Bedrag</TableHead>
                    <TableHead>Vervaldatum</TableHead>
                    <TableHead className="w-24">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openInvoices.map((invoice) => {
                    const isOverdue = new Date(invoice.dueDate) < new Date();

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.organizationName}</TableCell>
                        <TableCell className="text-sm">
                          {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(invoice.total)}
                        </TableCell>
                        <TableCell>
                          <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                            {formatDate(invoice.dueDate)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedInvoice(invoice)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="paid" className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factuurnummer</TableHead>
                    <TableHead>Organisatie</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead className="text-right">Bedrag</TableHead>
                    <TableHead>Betaald op</TableHead>
                    <TableHead className="w-24">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paidInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.organizationName}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(invoice.total)}
                      </TableCell>
                      <TableCell>{invoice.paidAt && formatDate(invoice.paidAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Factuur {selectedInvoice?.invoiceNumber}</DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Organisatie</p>
                  <p className="font-medium">{selectedInvoice.organizationName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Medewerker</p>
                  <p className="font-medium">{selectedInvoice.candidateName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Periode</p>
                  <p className="font-medium">
                    {formatDate(selectedInvoice.periodStart)} - {formatDate(selectedInvoice.periodEnd)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={statusConfig[selectedInvoice.status].color}>
                    {statusConfig[selectedInvoice.status].label}
                  </Badge>
                </div>
              </div>

              {/* Line Items */}
              {selectedInvoice.lineItems.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Specificatie</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Omschrijving</TableHead>
                        <TableHead className="text-right">Uren</TableHead>
                        <TableHead className="text-right">Tarief</TableHead>
                        <TableHead className="text-right">Bedrag</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.lineItems.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.hours}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Totals */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotaal</span>
                  <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ORT Toeslagen</span>
                  <span>{formatCurrency(selectedInvoice.ortTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>BTW (21%)</span>
                  <span>{formatCurrency(selectedInvoice.vatAmount)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-lg">
                  <span>Totaal</span>
                  <span className="text-emerald-600">{formatCurrency(selectedInvoice.total)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
