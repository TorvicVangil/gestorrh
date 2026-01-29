import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Briefcase, Calendar, Clock, TrendingUp } from "lucide-react";
import { mockCandidates, mockVacationRequests, mockEmployees } from "@/data/mockData";

const statusVariant = {
  "Novo": "info",
  "Em Análise": "primary",
  "Entrevista Agendada": "warning",
  "Aprovado": "success",
  "Reprovado": "danger",
  "Pendente": "warning",
} as const;

const Dashboard = () => {
  const recentCandidates = mockCandidates.slice(0, 5);
  const pendingVacations = mockVacationRequests.filter(v => v.status === "Pendente");
  const activeEmployees = mockEmployees.filter(e => e.status === "Ativo").length;

  const candidateColumns = [
    {
      key: "name",
      header: "Candidato",
      render: (item: typeof mockCandidates[0]) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{item.name}</span>
          <span className="text-xs text-muted-foreground">{item.position}</span>
        </div>
      ),
    },
    {
      key: "area",
      header: "Área",
      render: (item: typeof mockCandidates[0]) => (
        <span className="text-sm text-muted-foreground">{item.area}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: typeof mockCandidates[0]) => (
        <StatusBadge variant={statusVariant[item.status]}>{item.status}</StatusBadge>
      ),
    },
  ];

  const vacationColumns = [
    {
      key: "employee",
      header: "Funcionário",
      render: (item: typeof mockVacationRequests[0]) => (
        <span className="font-medium text-foreground">{item.employeeName}</span>
      ),
    },
    {
      key: "period",
      header: "Período",
      render: (item: typeof mockVacationRequests[0]) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.startDate).toLocaleDateString("pt-BR")} - {item.days} dias
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: typeof mockVacationRequests[0]) => (
        <StatusBadge variant={statusVariant[item.status]}>{item.status}</StatusBadge>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <PageHeader 
          title="Dashboard" 
          description="Visão geral do sistema de RH"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Funcionários Ativos"
            value={activeEmployees}
            icon={Users}
            variant="primary"
            trend={{ value: 5, positive: true }}
          />
          <StatCard
            title="Candidatos Este Mês"
            value={mockCandidates.length}
            icon={UserPlus}
            variant="accent"
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title="Vagas Abertas"
            value={3}
            icon={Briefcase}
            variant="default"
          />
          <StatCard
            title="Férias Pendentes"
            value={pendingVacations.length}
            icon={Calendar}
            variant="warning"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Candidates */}
          <Card className="border-border/50 shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Candidatos Recentes</CardTitle>
                  <CardDescription className="text-xs">
                    Últimas candidaturas recebidas
                  </CardDescription>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <DataTable columns={candidateColumns} data={recentCandidates} />
            </CardContent>
          </Card>

          {/* Pending Vacations */}
          <Card className="border-border/50 shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Solicitações de Férias</CardTitle>
                  <CardDescription className="text-xs">
                    Aguardando aprovação
                  </CardDescription>
                </div>
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <DataTable 
                columns={vacationColumns} 
                data={pendingVacations}
                emptyMessage="Nenhuma solicitação pendente"
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 p-6 rounded-xl gradient-hero text-white">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Resumo do Mês</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm opacity-80">Contratações</div>
            </div>
            <div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm opacity-80">Desligamentos</div>
            </div>
            <div>
              <div className="text-2xl font-bold">45</div>
              <div className="text-sm opacity-80">Currículos Recebidos</div>
            </div>
            <div>
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm opacity-80">Entrevistas Realizadas</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
