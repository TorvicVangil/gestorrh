import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  DollarSign,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import { mockEmployees } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  calculatePayroll,
  formatCurrency,
  type PayrollCalculation,
} from "@/utils/payrollCalculations";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface PayrollRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  month: number;
  year: number;
  base_salary: number;
  bonus: number;
  overtime_hours: number;
  overtime_rate: number;
  overtime_value: number;
  attendance_bonus: number;
  inss_discount: number;
  irrf_discount: number;
  vt_discount: number;
  vr_discount: number;
  other_discounts: number;
  other_discounts_description: string | null;
  gross_salary: number;
  net_salary: number;
  notes: string | null;
}

export function PayrollPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [formData, setFormData] = useState({
    bonus: "",
    overtimeHours: "",
    overtimeRate: "1.5",
    attendanceBonus: "",
    vtDiscount: "",
    vrDiscount: "",
    otherDiscounts: "",
    otherDiscountsDescription: "",
    notes: "",
  });

  const [preview, setPreview] = useState<PayrollCalculation | null>(null);

  // Fetch payroll records
  const { data: payrollRecords = [], isLoading } = useQuery({
    queryKey: ["payroll", selectedMonth, selectedYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payroll_records")
        .select("*")
        .eq("month", parseInt(selectedMonth))
        .eq("year", parseInt(selectedYear))
        .order("employee_name");

      if (error) throw error;
      return data as PayrollRecord[];
    },
    enabled: !!user,
  });

  // Save payroll mutation
  const saveMutation = useMutation({
    mutationFn: async (record: Omit<PayrollRecord, "id"> & { user_id: string }) => {
      const { data, error } = await supabase
        .from("payroll_records")
        .upsert(record, { onConflict: "employee_id,month,year" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast({ title: "Folha salva", description: "Cálculo registrado com sucesso." });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a folha.",
        variant: "destructive",
      });
    },
  });

  const selectedEmployee = mockEmployees.find((e) => e.id === selectedEmployeeId);

  const handlePreview = () => {
    if (!selectedEmployee) return;
    const calc = calculatePayroll({
      baseSalary: selectedEmployee.salary,
      bonus: parseFloat(formData.bonus) || 0,
      overtimeHours: parseFloat(formData.overtimeHours) || 0,
      overtimeRate: parseFloat(formData.overtimeRate) || 1.5,
      attendanceBonus: parseFloat(formData.attendanceBonus) || 0,
      vtDiscount: parseFloat(formData.vtDiscount) || 0,
      vrDiscount: parseFloat(formData.vrDiscount) || 0,
      otherDiscounts: parseFloat(formData.otherDiscounts) || 0,
    });
    setPreview(calc);
  };

  const handleSave = () => {
    if (!selectedEmployee || !preview || !user) return;

    saveMutation.mutate({
      user_id: user.id,
      employee_id: selectedEmployee.id,
      employee_name: selectedEmployee.name,
      month: parseInt(selectedMonth),
      year: parseInt(selectedYear),
      base_salary: preview.baseSalary,
      bonus: preview.bonus,
      overtime_hours: preview.overtimeHours,
      overtime_rate: preview.overtimeRate,
      overtime_value: preview.overtimeValue,
      attendance_bonus: preview.attendanceBonus,
      inss_discount: preview.inssDiscount,
      irrf_discount: preview.irrfDiscount,
      vt_discount: preview.vtDiscount,
      vr_discount: preview.vrDiscount,
      other_discounts: preview.otherDiscounts,
      other_discounts_description: formData.otherDiscountsDescription || null,
      gross_salary: preview.grossSalary,
      net_salary: preview.netSalary,
      notes: formData.notes || null,
    });
  };

  const resetForm = () => {
    setSelectedEmployeeId("");
    setFormData({
      bonus: "",
      overtimeHours: "",
      overtimeRate: "1.5",
      attendanceBonus: "",
      vtDiscount: "",
      vrDiscount: "",
      otherDiscounts: "",
      otherDiscountsDescription: "",
      notes: "",
    });
    setPreview(null);
  };

  const filteredRecords = payrollRecords.filter((r) =>
    r.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totals = useMemo(() => {
    return payrollRecords.reduce(
      (acc, r) => ({
        gross: acc.gross + Number(r.gross_salary),
        net: acc.net + Number(r.net_salary),
        discounts: acc.discounts + Number(r.inss_discount) + Number(r.irrf_discount) + Number(r.vt_discount) + Number(r.vr_discount) + Number(r.other_discounts),
        overtime: acc.overtime + Number(r.overtime_value),
      }),
      { gross: 0, net: 0, discounts: 0, overtime: 0 }
    );
  }, [payrollRecords]);

  const columns = [
    {
      key: "employee_name",
      header: "Funcionário",
      render: (item: PayrollRecord) => (
        <span className="font-medium text-foreground">{item.employee_name}</span>
      ),
    },
    {
      key: "base_salary",
      header: "Salário Base",
      render: (item: PayrollRecord) => (
        <span className="text-sm">{formatCurrency(Number(item.base_salary))}</span>
      ),
    },
    {
      key: "additions",
      header: "Acréscimos",
      render: (item: PayrollRecord) => {
        const additions = Number(item.bonus) + Number(item.overtime_value) + Number(item.attendance_bonus);
        return (
          <span className="text-sm text-accent font-medium">
            +{formatCurrency(additions)}
          </span>
        );
      },
    },
    {
      key: "discounts",
      header: "Descontos",
      render: (item: PayrollRecord) => {
        const disc = Number(item.inss_discount) + Number(item.irrf_discount) + Number(item.vt_discount) + Number(item.vr_discount) + Number(item.other_discounts);
        return (
          <span className="text-sm text-destructive font-medium">
            -{formatCurrency(disc)}
          </span>
        );
      },
    },
    {
      key: "net_salary",
      header: "Líquido",
      render: (item: PayrollRecord) => (
        <span className="text-sm font-bold text-foreground">
          {formatCurrency(Number(item.net_salary))}
        </span>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Folha de Pagamento"
        description="Cálculo automático com INSS, IRRF, VT, VR, horas extras e assiduidade"
      >
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" />
          Calcular Folha
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Bruto"
          value={formatCurrency(totals.gross)}
          icon={DollarSign}
          variant="primary"
        />
        <StatCard
          title="Total Líquido"
          value={formatCurrency(totals.net)}
          icon={TrendingUp}
          variant="accent"
        />
        <StatCard
          title="Total Descontos"
          value={formatCurrency(totals.discounts)}
          icon={TrendingDown}
          variant="warning"
        />
        <StatCard
          title="Horas Extras"
          value={formatCurrency(totals.overtime)}
          icon={Clock}
          variant="default"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar funcionário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, i) => (
              <SelectItem key={i} value={(i + 1).toString()}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={filteredRecords} />

      {/* Calculate Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Calcular Folha - {months[parseInt(selectedMonth) - 1]}/{selectedYear}
            </DialogTitle>
            <DialogDescription>
              Selecione o funcionário e informe os valores variáveis
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Employee select */}
            <div className="grid gap-2">
              <Label>Funcionário *</Label>
              <Select value={selectedEmployeeId} onValueChange={(v) => { setSelectedEmployeeId(v); setPreview(null); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees
                    .filter((e) => e.status === "Ativo")
                    .map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name} — {formatCurrency(e.salary)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {selectedEmployee && (
                <p className="text-xs text-muted-foreground">
                  Salário base na carteira: <strong>{formatCurrency(selectedEmployee.salary)}</strong> • {selectedEmployee.position}
                </p>
              )}
            </div>

            <Separator />

            {/* Additions */}
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" /> Acréscimos
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Bônus (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={formData.bonus}
                  onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Assiduidade (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={formData.attendanceBonus}
                  onChange={(e) => setFormData({ ...formData, attendanceBonus: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Horas Extras (qtd)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.overtimeHours}
                  onChange={(e) => setFormData({ ...formData, overtimeHours: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Multiplicador H.E.</Label>
                <Select
                  value={formData.overtimeRate}
                  onValueChange={(v) => setFormData({ ...formData, overtimeRate: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.5">50% (1.5x)</SelectItem>
                    <SelectItem value="2">100% (2x)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Discounts */}
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-destructive" /> Descontos (VT e VR manuais)
            </p>
            <p className="text-xs text-muted-foreground -mt-2">
              INSS e IRRF são calculados automaticamente
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Vale Transporte (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={formData.vtDiscount}
                  onChange={(e) => setFormData({ ...formData, vtDiscount: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Vale Refeição (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={formData.vrDiscount}
                  onChange={(e) => setFormData({ ...formData, vrDiscount: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Outros Descontos (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={formData.otherDiscounts}
                  onChange={(e) => setFormData({ ...formData, otherDiscounts: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Input
                  placeholder="Ex: Adiantamento"
                  value={formData.otherDiscountsDescription}
                  onChange={(e) => setFormData({ ...formData, otherDiscountsDescription: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <Button onClick={handlePreview} variant="outline" className="gap-2" disabled={!selectedEmployeeId}>
              <Calculator className="w-4 h-4" />
              Calcular Prévia
            </Button>

            {/* Preview */}
            {preview && (
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Resumo do Cálculo — {selectedEmployee?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Salário Base</span>
                    <span>{formatCurrency(preview.baseSalary)}</span>
                  </div>
                  {preview.bonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bônus</span>
                      <span className="text-accent">+{formatCurrency(preview.bonus)}</span>
                    </div>
                  )}
                  {preview.overtimeValue > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Horas Extras ({preview.overtimeHours}h × {preview.overtimeRate}x)
                      </span>
                      <span className="text-accent">+{formatCurrency(preview.overtimeValue)}</span>
                    </div>
                  )}
                  {preview.attendanceBonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assiduidade</span>
                      <span className="text-accent">+{formatCurrency(preview.attendanceBonus)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Salário Bruto</span>
                    <span>{formatCurrency(preview.grossSalary)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-destructive">
                    <span>INSS</span>
                    <span>-{formatCurrency(preview.inssDiscount)}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>IRRF</span>
                    <span>-{formatCurrency(preview.irrfDiscount)}</span>
                  </div>
                  {preview.vtDiscount > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Vale Transporte</span>
                      <span>-{formatCurrency(preview.vtDiscount)}</span>
                    </div>
                  )}
                  {preview.vrDiscount > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Vale Refeição</span>
                      <span>-{formatCurrency(preview.vrDiscount)}</span>
                    </div>
                  )}
                  {preview.otherDiscounts > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Outros Descontos</span>
                      <span>-{formatCurrency(preview.otherDiscounts)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-destructive font-medium">
                    <span>Total Descontos</span>
                    <span>-{formatCurrency(preview.totalDiscounts)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Salário Líquido</span>
                    <span className="text-primary">{formatCurrency(preview.netSalary)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!preview || saveMutation.isPending}>
              Salvar Folha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
