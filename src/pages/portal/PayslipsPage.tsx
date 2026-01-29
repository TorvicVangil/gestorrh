import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FileText, Download, Eye, Calendar } from "lucide-react";
import { mockPayslips } from "@/data/mockData";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function PayslipsPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [payslips] = useState(mockPayslips);

  const filteredPayslips = payslips.filter(
    (p) => p.year.toString() === selectedYear
  );

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Holerites" 
        description="Visualize e baixe seus contracheques"
      >
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPayslips.length > 0 ? (
          filteredPayslips.map((payslip) => (
            <Card 
              key={payslip.id} 
              className="hover:shadow-lg transition-all duration-300 border-border/50"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(payslip.uploadedAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">
                  {months[payslip.month - 1]}
                </CardTitle>
                <CardDescription className="text-sm mb-4">
                  {payslip.year}
                </CardDescription>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Eye className="w-3 h-3" />
                    Ver
                  </Button>
                  <Button size="sm" className="flex-1 gap-1">
                    <Download className="w-3 h-3" />
                    Baixar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum holerite disponível para {selectedYear}</p>
          </div>
        )}
      </div>
    </div>
  );
}
