import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Upload, Mail, Phone } from "lucide-react";
import { mockCandidates } from "@/data/mockData";
import { Candidate } from "@/types/hr";
import { useToast } from "@/hooks/use-toast";

const statusVariant = {
  "Novo": "info",
  "Em Análise": "primary",
  "Entrevista Agendada": "warning",
  "Aprovado": "success",
  "Reprovado": "danger",
} as const;

const areas = ["Comercial", "TI", "Operacional", "Administrativo", "RH", "Financeiro"] as const;
const sources = ["WhatsApp", "E-mail", "LinkedIn", "Site", "Indicação"] as const;
const statuses = ["Novo", "Em Análise", "Entrevista Agendada", "Aprovado", "Reprovado"] as const;

export function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();

  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    area: "TI" as Candidate["area"],
    source: "Site" as Candidate["source"],
    position: "",
    notes: "",
  });

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = areaFilter === "all" || candidate.area === areaFilter;
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    return matchesSearch && matchesArea && matchesStatus;
  });

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e e-mail do candidato.",
        variant: "destructive",
      });
      return;
    }

    const candidate: Candidate = {
      id: Date.now().toString(),
      ...newCandidate,
      status: "Novo",
      appliedAt: new Date().toISOString().split("T")[0],
    };

    setCandidates([candidate, ...candidates]);
    setNewCandidate({ name: "", email: "", phone: "", area: "TI", source: "Site", position: "", notes: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Candidato adicionado",
      description: `${candidate.name} foi adicionado à lista de candidatos.`,
    });
  };

  const columns = [
    {
      key: "name",
      header: "Candidato",
      render: (item: Candidate) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{item.name}</span>
          <span className="text-xs text-muted-foreground">{item.position}</span>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contato",
      render: (item: Candidate) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="w-3 h-3" />
            {item.email}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Phone className="w-3 h-3" />
            {item.phone}
          </div>
        </div>
      ),
    },
    {
      key: "area",
      header: "Área",
      render: (item: Candidate) => (
        <StatusBadge variant="default" dot={false}>{item.area}</StatusBadge>
      ),
    },
    {
      key: "source",
      header: "Origem",
      render: (item: Candidate) => (
        <span className="text-sm text-muted-foreground">{item.source}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Candidate) => (
        <StatusBadge variant={statusVariant[item.status]}>{item.status}</StatusBadge>
      ),
    },
    {
      key: "appliedAt",
      header: "Data",
      render: (item: Candidate) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.appliedAt).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Candidatos" 
        description="Gerencie os candidatos e processos seletivos"
      >
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Candidato
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar candidatos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Áreas</SelectItem>
            {areas.map((area) => (
              <SelectItem key={area} value={area}>{area}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredCandidates}
        onRowClick={(item) => setSelectedCandidate(item)}
      />

      {/* Add Candidate Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Candidato</DialogTitle>
            <DialogDescription>
              Adicione um novo candidato ao processo seletivo
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                placeholder="Nome do candidato"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={newCandidate.phone}
                  onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="area">Área</Label>
                <Select 
                  value={newCandidate.area} 
                  onValueChange={(value) => setNewCandidate({ ...newCandidate, area: value as Candidate["area"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source">Origem</Label>
                <Select 
                  value={newCandidate.source} 
                  onValueChange={(value) => setNewCandidate({ ...newCandidate, source: value as Candidate["source"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position">Vaga pretendida</Label>
              <Input
                id="position"
                value={newCandidate.position}
                onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                placeholder="Ex: Desenvolvedor Full Stack"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={newCandidate.notes}
                onChange={(e) => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                placeholder="Anotações sobre o candidato..."
                rows={3}
              />
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Arraste o currículo ou clique para anexar
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF ou DOCX até 5MB</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCandidate}>
              Adicionar Candidato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Candidate Detail Dialog */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCandidate?.name}</DialogTitle>
            <DialogDescription>{selectedCandidate?.position}</DialogDescription>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <StatusBadge variant={statusVariant[selectedCandidate.status]}>
                  {selectedCandidate.status}
                </StatusBadge>
                <StatusBadge variant="default" dot={false}>
                  {selectedCandidate.area}
                </StatusBadge>
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {selectedCandidate.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {selectedCandidate.phone}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Select defaultValue={selectedCandidate.status}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button>Atualizar Status</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
