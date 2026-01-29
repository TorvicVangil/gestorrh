export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: "Comercial" | "TI" | "Operacional" | "Administrativo" | "RH" | "Financeiro";
  status: "Novo" | "Em Análise" | "Entrevista Agendada" | "Aprovado" | "Reprovado";
  resumeUrl?: string;
  source: "WhatsApp" | "E-mail" | "LinkedIn" | "Site" | "Indicação";
  appliedAt: string;
  notes?: string;
  position?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  rg?: string;
  birthDate: string;
  hireDate: string;
  department: string;
  position: string;
  salary: number;
  status: "Ativo" | "Férias" | "Afastado" | "Desligado";
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  dependents?: Dependent[];
  documents?: Document[];
}

export interface Dependent {
  id: string;
  name: string;
  relationship: "Cônjuge" | "Filho(a)" | "Pai" | "Mãe" | "Outro";
  birthDate: string;
  cpf?: string;
}

export interface Document {
  id: string;
  type: "RG" | "CPF" | "Comprovante de Residência" | "Contrato de Trabalho" | "CTPS" | "Outro";
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  fileUrl: string;
  uploadedAt: string;
}

export interface VacationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  days: number;
  status: "Pendente" | "Aprovado" | "Reprovado";
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface MedicalCertificate {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  days: number;
  reason?: string;
  fileUrl?: string;
  submittedAt: string;
  status: "Pendente" | "Aprovado" | "Rejeitado";
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  status: "Aberta" | "Em Andamento" | "Fechada";
  createdAt: string;
  candidatesCount: number;
}
