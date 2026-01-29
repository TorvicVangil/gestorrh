import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Building2, Phone, Mail, MapPin, DollarSign } from "lucide-react";
import { mockEmployees } from "@/data/mockData";
import { Employee } from "@/types/hr";
import { useToast } from "@/hooks/use-toast";

const statusVariant = {
  "Ativo": "success",
  "Férias": "info",
  "Afastado": "warning",
  "Desligado": "danger",
} as const;

const departments = ["TI", "RH", "Comercial", "Financeiro", "Operacional", "Administrativo"];

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
    department: "TI",
    position: "",
    salary: "",
  });

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.cpf) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, e-mail e CPF do funcionário.",
        variant: "destructive",
      });
      return;
    }

    const employee: Employee = {
      id: Date.now().toString(),
      ...newEmployee,
      salary: parseFloat(newEmployee.salary) || 0,
      hireDate: new Date().toISOString().split("T")[0],
      status: "Ativo",
    };

    setEmployees([employee, ...employees]);
    setNewEmployee({ name: "", email: "", phone: "", cpf: "", birthDate: "", department: "TI", position: "", salary: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Funcionário cadastrado",
      description: `${employee.name} foi adicionado ao sistema.`,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const columns = [
    {
      key: "name",
      header: "Funcionário",
      render: (item: Employee) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{item.name}</span>
          <span className="text-xs text-muted-foreground">{item.position}</span>
        </div>
      ),
    },
    {
      key: "department",
      header: "Departamento",
      render: (item: Employee) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{item.department}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Contato",
      render: (item: Employee) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="w-3 h-3" />
            {item.email}
          </div>
        </div>
      ),
    },
    {
      key: "salary",
      header: "Salário",
      render: (item: Employee) => (
        <span className="text-sm font-medium">{formatCurrency(item.salary)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Employee) => (
        <StatusBadge variant={statusVariant[item.status]}>{item.status}</StatusBadge>
      ),
    },
    {
      key: "hireDate",
      header: "Admissão",
      render: (item: Employee) => (
        <span className="text-sm text-muted-foreground">
          {new Date(item.hireDate).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Funcionários" 
        description="Cadastro e gerenciamento de colaboradores"
      >
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Funcionário
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar funcionários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Depts.</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Férias">Férias</SelectItem>
            <SelectItem value="Afastado">Afastado</SelectItem>
            <SelectItem value="Desligado">Desligado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        onRowClick={(item) => setSelectedEmployee(item as Employee)}
      />

      {/* Add Employee Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Funcionário</DialogTitle>
            <DialogDescription>
              Cadastre um novo colaborador no sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                placeholder="Nome do funcionário"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={newEmployee.cpf}
                  onChange={(e) => setNewEmployee({ ...newEmployee, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={newEmployee.birthDate}
                  onChange={(e) => setNewEmployee({ ...newEmployee, birthDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="email@empresa.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Departamento</Label>
                <Select 
                  value={newEmployee.department} 
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Cargo</Label>
                <Input
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  placeholder="Ex: Analista de TI"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="salary">Salário</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="salary"
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                  placeholder="0,00"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddEmployee}>
              Cadastrar Funcionário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Detail Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEmployee?.name}</DialogTitle>
            <DialogDescription>{selectedEmployee?.position} • {selectedEmployee?.department}</DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <Tabs defaultValue="info" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
                <TabsTrigger value="dependents">Dependentes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="mt-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <StatusBadge variant={statusVariant[selectedEmployee.status]}>
                      {selectedEmployee.status}
                    </StatusBadge>
                    <span className="text-sm text-muted-foreground">
                      Admissão: {new Date(selectedEmployee.hireDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {selectedEmployee.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {selectedEmployee.phone}
                    </div>
                  </div>

                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="w-4 h-4" />
                      Salário
                    </div>
                    <div className="text-xl font-bold text-foreground">
                      {formatCurrency(selectedEmployee.salary)}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum documento anexado</p>
                  <Button variant="outline" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Anexar Documento
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="dependents" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum dependente cadastrado</p>
                  <Button variant="outline" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Dependente
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
