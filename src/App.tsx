import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Recruitment Pages
import { CandidatesPage } from "./pages/recruitment/CandidatesPage";
import { JobOpeningsPage } from "./pages/recruitment/JobOpeningsPage";

// Employee Pages
import { EmployeesPage } from "./pages/employees/EmployeesPage";
import { DocumentsPage } from "./pages/employees/DocumentsPage";

// Portal Pages
import { PayslipsPage } from "./pages/portal/PayslipsPage";
import { VacationsPage } from "./pages/portal/VacationsPage";
import { MedicalCertificatesPage } from "./pages/portal/MedicalCertificatesPage";

const queryClient = new QueryClient();

// Wrapper for pages that need the AppLayout
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <AppLayout>{children}</AppLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Dashboard - has its own layout */}
          <Route path="/" element={<Index />} />
          
          {/* Recruitment Routes */}
          <Route path="/recrutamento/candidatos" element={<PageWrapper><CandidatesPage /></PageWrapper>} />
          <Route path="/recrutamento/vagas" element={<PageWrapper><JobOpeningsPage /></PageWrapper>} />
          
          {/* Employee Routes */}
          <Route path="/funcionarios" element={<PageWrapper><EmployeesPage /></PageWrapper>} />
          <Route path="/funcionarios/documentos" element={<PageWrapper><DocumentsPage /></PageWrapper>} />
          
          {/* Portal Routes */}
          <Route path="/portal/holerites" element={<PageWrapper><PayslipsPage /></PageWrapper>} />
          <Route path="/portal/ferias" element={<PageWrapper><VacationsPage /></PageWrapper>} />
          <Route path="/portal/atestados" element={<PageWrapper><MedicalCertificatesPage /></PageWrapper>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
