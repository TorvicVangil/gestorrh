import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Plus, Users, Briefcase } from "lucide-react";
import { mockJobOpenings } from "@/data/mockData";
import { JobOpening } from "@/types/hr";

const statusVariant = {
  "Aberta": "success",
  "Em Andamento": "warning",
  "Fechada": "default",
} as const;

export function JobOpeningsPage() {
  const [openings] = useState<JobOpening[]>(mockJobOpenings);
  const [selectedOpening, setSelectedOpening] = useState<JobOpening | null>(null);

  const columns = [
    {
      key: "title",
      header: "Vaga",
      render: (item: JobOpening) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{item.title}</span>
          <span className="text-xs text-muted-foreground">{item.department}</span>
        </div>
      ),
    },
    {
      key: "candidates",
      header: "Candidatos",
      render: (item: JobOpening) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{item.candidatesCount}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: JobOpening) => (
        <StatusBadge variant={statusVariant[item.status]}>{item.status}</StatusBadge>
      ),
    },
    {
      key: "createdAt",
      header: "Criada em",
      render: (item: JobOpening) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.createdAt).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Vagas" 
        description="Gerencie as vagas abertas na empresa"
      >
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Vaga
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={openings}
        onRowClick={(item) => setSelectedOpening(item as JobOpening)}
      />

      <Dialog open={!!selectedOpening} onOpenChange={() => setSelectedOpening(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {selectedOpening?.title}
            </DialogTitle>
            <DialogDescription>{selectedOpening?.department}</DialogDescription>
          </DialogHeader>
          
          {selectedOpening && (
            <div className="grid gap-4 py-4">
              <StatusBadge variant={statusVariant[selectedOpening.status]}>
                {selectedOpening.status}
              </StatusBadge>
              
              <div>
                <h4 className="font-medium mb-2">Descrição</h4>
                <p className="text-sm text-muted-foreground">{selectedOpening.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Requisitos</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOpening.requirements.map((req, index) => (
                    <StatusBadge key={index} variant="default" dot={false}>
                      {req}
                    </StatusBadge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedOpening.candidatesCount} candidatos inscritos
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
