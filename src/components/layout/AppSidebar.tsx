
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, FileSignature, Users, Settings, LogOut, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { hasPermission, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold text-white">DocuKeeper</h2>
        <p className="text-xs text-slate-400">Gestão de Contratos e POs</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/dashboard') ? 'bg-sidebar-accent text-white' : ''}>
                  <Link to="/dashboard">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {hasPermission('documents') && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/clientes') ? 'bg-sidebar-accent text-white' : ''}>
                      <Link to="/clientes">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Clientes</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className={isActive('/documentos') ? 'bg-sidebar-accent text-white' : ''}>
                      <Link to="/documentos">
                        <FileSignature className="h-4 w-4 mr-2" />
                        <span>Documentos/Contratos</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              
              {hasPermission('purchaseOrders') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={isActive('/purchase-orders') ? 'bg-sidebar-accent text-white' : ''}>
                    <Link to="/purchase-orders">
                      <FileCheck className="h-4 w-4 mr-2" />
                      <span>Purchase Orders</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {hasPermission('users') && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={isActive('/usuarios') ? 'bg-sidebar-accent text-white' : ''}>
                    <Link to="/usuarios">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Gerenciar Usuários</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent" 
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
