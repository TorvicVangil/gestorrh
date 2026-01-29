import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Calendar, Plus, Clock } from "lucide-react";
import { mockVacationRequests } from "@/data/mockData";
import { VacationRequest } from "@/types/hr";
import { useToast } from "@/hooks/use-toast";

const statusVariant = {
  "Pendente": "warning",
  "Aprovado": "success",
  "Reprovado": "danger",
} as const;

export function VacationsPage() {
  const [requests, setRequests] = useState<VacationRequest[]>(mockVacationRequests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newRequest, setNewRequest] = useState({
    startDate: "",
    endDate: "",
  });

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmitRequest = () => {
    if (!newRequest.startDate || !newRequest.endDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione as datas de início e fim das férias.",
        variant: "destructive",
      });
      return;
    }

    const days = calculateDays(newRequest.startDate, newRequest.endDate);
    
    if (days > 30) {
      toast({
        title: "Período inválido",
        description: "O período de férias não pode exceder 30 dias.",
        variant: "destructive",
      });
      return;
    }

    const request: VacationRequest = {
      id: Date.now().toString(),
      employeeId: "1",
      employeeName: "Você",
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      days,
      status: "Pendente",
      requestedAt: new Date().toISOString().split("T")[0],
    };

    setRequests([request, ...requests]);
    setNewRequest({ startDate: "", endDate: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Solicitação enviada",
      description: `Sua solicitação de ${days} dias de férias foi enviada para aprovação.`,
    });
  };

  const columns = [
    {
      key: "period",
      header: "Período",
      render: (item: VacationRequest) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {new Date(item.startDate).toLocaleDateString("pt-BR")} - {new Date(item.endDate).toLocaleDateString("pt-BR")}
          </span>
          <span className="text-xs text-muted-foreground">{item.days} dias</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: VacationRequest) => (
        <StatusBadge variant={statusVariant[item.status]}>{item.status}</StatusBadge>
      ),
    },
    {
      key: "requestedAt",
      header: "Solicitado em",
      render: (item: VacationRequest) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-3 h-3" />
          {new Date(item.requestedAt).toLocaleDateString("pt-BR")}
        </div>
      ),
    },
    {
      key: "approvedBy",
      header: "Aprovado por",
      render: (item: VacationRequest) => (
        <span className="text-sm text-muted-foreground">
          {item.approvedBy || "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Férias" 
        description="Solicite e acompanhe suas férias"
      >
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Solicitar Férias
        </Button>
      </PageHeader>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-card border border-border/50 shadow-card">
          <div className="text-sm text-muted-foreground mb-1">Saldo de Férias</div>
          <div className="text-2xl font-bold text-foreground">30 dias</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50 shadow-card">
          <div className="text-sm text-muted-foreground mb-1">Férias Gozadas</div>
          <div className="text-2xl font-bold text-foreground">0 dias</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50 shadow-card">
          <div className="text-sm text-muted-foreground mb-1">Próximo Período Aquisitivo</div>
          <div className="text-2xl font-bold text-foreground">Jun/2026</div>
        </div>
      </div>

      <DataTable columns={columns} data={requests} />

      {/* Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Solicitar Férias
            </DialogTitle>
            <DialogDescription>
              Selecione o período desejado para suas férias
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newRequest.startDate}
                  onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newRequest.endDate}
                  onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                />
              </div>
            </div>

            {newRequest.startDate && newRequest.endDate && (
              <div className="p-4 bg-secondary/30 rounded-lg text-center">
                <span className="text-sm text-muted-foreground">Total de dias: </span>
                <span className="font-bold text-foreground">
                  {calculateDays(newRequest.startDate, newRequest.endDate)}
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitRequest}>
              Enviar Solicitação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
