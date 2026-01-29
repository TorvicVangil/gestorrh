import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Upload, FileText, FolderOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const documentCategories = [
  { name: "RG", count: 45, icon: FileText },
  { name: "CPF", count: 45, icon: FileText },
  { name: "Comprovante de Residência", count: 38, icon: FileText },
  { name: "Contrato de Trabalho", count: 45, icon: FileText },
  { name: "CTPS", count: 42, icon: FileText },
  { name: "Outros", count: 12, icon: FolderOpen },
];

export function DocumentsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Documentos" 
        description="Repositório digital de documentos dos funcionários"
      >
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Upload em Massa
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentCategories.map((category) => (
          <Card 
            key={category.name} 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-border/50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <category.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-2xl font-bold text-foreground">{category.count}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-base">{category.name}</CardTitle>
              <CardDescription className="text-xs mt-1">
                documentos arquivados
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors">
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Arraste documentos aqui
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          ou clique para selecionar arquivos
        </p>
        <Button variant="outline">
          Selecionar Arquivos
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          PDF, JPG, PNG ou DOCX até 10MB cada
        </p>
      </div>
    </div>
  );
}
