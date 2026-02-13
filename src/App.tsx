import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthPage } from "./pages/AuthPage";

// Recruitment Pages
import { CandidatesPage } from "./pages/recruitment/CandidatesPage";
import { JobOpeningsPage } from "./pages/recruitment/JobOpeningsPage";

// Employee Pages
import { EmployeesPage } from "./pages/employees/EmployeesPage";
import { DocumentsPage } from "./pages/employees/DocumentsPage";

// Payroll Pages
import { PayrollPage } from "./pages/payroll/PayrollPage";

// Portal Pages
import { PayslipsPage } from "./pages/portal/PayslipsPage";
import { VacationsPage } from "./pages/portal/VacationsPage";
import { MedicalCertificatesPage } from "./pages/portal/MedicalCertificatesPage";

const queryClient = new QueryClient();

// Wrapper for pages that need the AppLayout and protection
const ProtectedPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Route */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Dashboard - protected */}
          <Route path="/" element={<ProtectedPageWrapper><Index /></ProtectedPageWrapper>} />
          
          {/* Recruitment Routes */}
          <Route path="/recrutamento/candidatos" element={<ProtectedPageWrapper><CandidatesPage /></ProtectedPageWrapper>} />
          <Route path="/recrutamento/vagas" element={<ProtectedPageWrapper><JobOpeningsPage /></ProtectedPageWrapper>} />
          
          {/* Employee Routes */}
          <Route path="/funcionarios" element={<ProtectedPageWrapper><EmployeesPage /></ProtectedPageWrapper>} />
          <Route path="/funcionarios/documentos" element={<ProtectedPageWrapper><DocumentsPage /></ProtectedPageWrapper>} />
          
          {/* Payroll Routes */}
          <Route path="/folha-pagamento" element={<ProtectedPageWrapper><PayrollPage /></ProtectedPageWrapper>} />
          
          {/* Portal Routes */}
          <Route path="/portal/holerites" element={<ProtectedPageWrapper><PayslipsPage /></ProtectedPageWrapper>} />
          <Route path="/portal/ferias" element={<ProtectedPageWrapper><VacationsPage /></ProtectedPageWrapper>} />
          <Route path="/portal/atestados" element={<ProtectedPageWrapper><MedicalCertificatesPage /></ProtectedPageWrapper>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
