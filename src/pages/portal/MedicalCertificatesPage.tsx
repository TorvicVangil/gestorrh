import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Plus, Upload, Clock, FileText, Camera } from "lucide-react";
import { mockMedicalCertificates } from "@/data/mockData";
import { MedicalCertificate } from "@/types/hr";
import { useToast } from "@/hooks/use-toast";

const statusVariant = {
  "Pendente": "warning",
  "Aprovado": "success",
  "Rejeitado": "danger",
} as const;

export function MedicalCertificatesPage() {
  const [certificates, setCertificates] = useState<MedicalCertificate[]>(mockMedicalCertificates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newCertificate, setNewCertificate] = useState({
    startDate: "",
    days: "",
    reason: "",
  });

  const handleSubmit = () => {
    if (!newCertificate.startDate || !newCertificate.days) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a data de início e quantidade de dias.",
        variant: "destructive",
      });
      return;
    }

    const certificate: MedicalCertificate = {
      id: Date.now().toString(),
      employeeId: "1",
      employeeName: "Você",
      startDate: newCertificate.startDate,
      days: parseInt(newCertificate.days),
      reason: newCertificate.reason,
      submittedAt: new Date().toISOString().split("T")[0],
      status: "Pendente",
    };

    setCertificates([certificate, ...certificates]);
    setNewCertificate({ startDate: "", days: "", reason: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Atestado enviado",
      description: "Seu atestado médico foi enviado para análise.",
    });
  };

  const columns = [
    {
      key: "startDate",
      header: "Período",
      render: (item: MedicalCertificate) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {new Date(item.startDate).toLocaleDateString("pt-BR")}
          </span>
          <span className="text-xs text-muted-foreground">{item.days} dias de afastamento</span>
        </div>
      ),
    },
    {
      key: "reason",
      header: "Motivo",
      render: (item: MedicalCertificate) => (
        <span className="text-sm text-muted-foreground">
          {item.reason || "Não informado"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: MedicalCertificate) => (
        <StatusBadge variant={statusVariant[item.status]}>{item.status}</StatusBadge>
      ),
    },
    {
      key: "submittedAt",
      header: "Enviado em",
      render: (item: MedicalCertificate) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-3 h-3" />
          {new Date(item.submittedAt).toLocaleDateString("pt-BR")}
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Atestados Médicos" 
        description="Envie e acompanhe seus atestados médicos"
      >
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Enviar Atestado
        </Button>
      </PageHeader>

      <DataTable columns={columns} data={certificates} />

      {/* Submit Certificate Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Enviar Atestado Médico
            </DialogTitle>
            <DialogDescription>
              Anexe a foto ou arquivo do seu atestado médico
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Data de Início *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newCertificate.startDate}
                  onChange={(e) => setNewCertificate({ ...newCertificate, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="days">Dias de Afastamento *</Label>
                <Input
                  id="days"
                  type="number"
                  min="1"
                  value={newCertificate.days}
                  onChange={(e) => setNewCertificate({ ...newCertificate, days: e.target.value })}
                  placeholder="Ex: 3"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Motivo (opcional)</Label>
              <Textarea
                id="reason"
                value={newCertificate.reason}
                onChange={(e) => setNewCertificate({ ...newCertificate, reason: e.target.value })}
                placeholder="Descreva brevemente o motivo do afastamento..."
                rows={2}
              />
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex justify-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Tire uma foto ou anexe o arquivo do atestado
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG ou PNG até 5MB</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Enviar Atestado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
