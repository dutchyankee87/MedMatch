import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
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
import { Download, Eye, Euro, FileText, Clock, CheckCircle } from "lucide-react";

// Mock data
const invoices = [
  {
    id: "1",
    invoiceNumber: "2024-0042",
    agencyName: "ZorgTalent BV",
    candidateName: "Anna de Vries",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-31",
    subtotal: 6656.0,
    ortTotal: 832.0,
    vatAmount: 1572.48,
    total: 9060.48,
    status: "sent" as const,
    dueDate: "2024-02-15",
    createdAt: "2024-02-01",
  },
  {
    id: "2",
    invoiceNumber: "2024-0043",
    agencyName: "MediFlex",
    candidateName: "Sophie Jansen",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-31",
    subtotal: 5760.0,
    ortTotal: 720.0,
    vatAmount: 1360.8,
    total: 7840.8,
    status: "sent" as const,
    dueDate: "2024-02-15",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    invoiceNumber: "2024-0038",
    agencyName: "Care4You",
    candidateName: "Jan Bakker",
    periodStart: "2023-12-01",
    periodEnd: "2023-12-31",
    subtotal: 5400.0,
    ortTotal: 540.0,
    vatAmount: 1247.4,
    total: 7187.4,
    status: "paid" as const,
    dueDate: "2024-01-15",
    paidAt: "2024-01-12",
    createdAt: "2024-01-01",
  },
];

const statusConfig = {
  draft: { label: "Concept", color: "bg-gray-100 text-gray-800" },
  sent: { label: "Openstaand", color: "bg-orange-100 text-orange-800" },
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

export default function OrgInvoicesPage() {
  const openInvoices = invoices.filter((i) => i.status === "sent");
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const totalOpen = openInvoices.reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="flex flex-col h-full">
      <Header title="Facturen" subtitle="Bekijk en beheer facturen" />

      <div className="flex-1 p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-100">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Openstaand</p>
                <p className="text-2xl font-bold">{openInvoices.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <Euro className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Te betalen</p>
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
                <p className="text-2xl font-bold">{paidInvoices.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">Openstaand ({openInvoices.length})</TabsTrigger>
            <TabsTrigger value="paid">Betaald ({paidInvoices.length})</TabsTrigger>
            <TabsTrigger value="all">Alle ({invoices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factuurnummer</TableHead>
                    <TableHead>Bureau</TableHead>
                    <TableHead>Medewerker</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead className="text-right">Bedrag</TableHead>
                    <TableHead>Vervaldatum</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openInvoices.map((invoice) => {
                    const status = statusConfig[invoice.status];
                    const isOverdue = new Date(invoice.dueDate) < new Date();

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.agencyName}</TableCell>
                        <TableCell>{invoice.candidateName}</TableCell>
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
                          {isOverdue && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              Verlopen
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
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
                    <TableHead>Bureau</TableHead>
                    <TableHead>Medewerker</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead className="text-right">Bedrag</TableHead>
                    <TableHead>Betaald op</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paidInvoices.map((invoice) => {
                    const status = statusConfig[invoice.status];

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.agencyName}</TableCell>
                        <TableCell>{invoice.candidateName}</TableCell>
                        <TableCell className="text-sm">
                          {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(invoice.total)}
                        </TableCell>
                        <TableCell>{invoice.paidAt && formatDate(invoice.paidAt)}</TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
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

          <TabsContent value="all" className="mt-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factuurnummer</TableHead>
                    <TableHead>Bureau</TableHead>
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
                        <TableCell>{invoice.agencyName}</TableCell>
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
                            <Button size="sm" variant="ghost">
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
        </Tabs>
      </div>
    </div>
  );
}
