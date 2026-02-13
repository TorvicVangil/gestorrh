import { 
  Users, 
  UserPlus, 
  FileText, 
  Calendar, 
  ClipboardList,
  Building2,
  Home,
  Settings,
  Calculator
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const menuGroups = [
  {
    label: "Principal",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
    ]
  },
  {
    label: "Recrutamento",
    items: [
      { title: "Candidatos", url: "/recrutamento/candidatos", icon: UserPlus },
      { title: "Vagas", url: "/recrutamento/vagas", icon: ClipboardList },
    ]
  },
  {
    label: "Funcionários",
    items: [
      { title: "Cadastro", url: "/funcionarios", icon: Users },
      { title: "Documentos", url: "/funcionarios/documentos", icon: FileText },
    ]
  },
  {
    label: "Financeiro",
    items: [
      { title: "Folha de Pagamento", url: "/folha-pagamento", icon: Calculator },
    ]
  },
  {
    label: "Portal do Colaborador",
    items: [
      { title: "Holerites", url: "/portal/holerites", icon: FileText },
      { title: "Férias", url: "/portal/ferias", icon: Calendar },
      { title: "Atestados", url: "/portal/atestados", icon: ClipboardList },
    ]
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground text-sm">RH System</span>
              <span className="text-xs text-sidebar-foreground/60">Gestão de Pessoas</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="mb-2">
            {!collapsed && (
              <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider font-medium px-3 mb-1">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={collapsed ? item.title : undefined}
                    >
                      <NavLink 
                        to={item.url} 
                        end 
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={collapsed ? "Configurações" : undefined}>
              <NavLink 
                to="/configuracoes" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                activeClassName="bg-sidebar-accent text-sidebar-foreground"
              >
                <Settings className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="text-sm">Configurações</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
