
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  FileText, 
  FileSignature, 
  Users, 
  Settings, 
  LogOut, 
  FileCheck,
  Menu,
  ChevronDown,
  Bell,
  PlusCircle,
  Home,
  Building,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { hasPermission, logout, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <Home className="h-4 w-4 mr-2" />,
      visible: true,
    },
    {
      label: "Clientes",
      path: "/clientes",
      icon: <Building className="h-4 w-4 mr-2" />,
      visible: hasPermission('documents'),
    },
    {
      label: "Documentos",
      path: "/documentos",
      icon: <FileSignature className="h-4 w-4 mr-2" />,
      visible: hasPermission('documents'),
    },
    {
      label: "Purchase Orders",
      path: "/purchase-orders",
      icon: <FileCheck className="h-4 w-4 mr-2" />,
      visible: hasPermission('purchaseOrders'),
    },
    {
      label: "Relatórios",
      path: "/relatorios",
      icon: <BarChart className="h-4 w-4 mr-2" />,
      visible: hasPermission('documents'),
    },
    {
      label: "Usuários",
      path: "/usuarios",
      icon: <Settings className="h-4 w-4 mr-2" />,
      visible: hasPermission('users'),
    }
  ].filter(item => item.visible);

  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : "US";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center">
            <div className="rounded-md bg-primary p-1 mr-2">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              DocuKeeper
            </span>
          </Link>

          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] sm:max-w-sm">
              <nav className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center py-2 px-3 text-sm rounded-md hover:bg-gray-100 transition-colors",
                      isActive(item.path) ? "bg-primary/10 text-primary font-medium" : "text-gray-600"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                        isActive(item.path) ? "bg-primary/10 text-primary" : "text-gray-600"
                      )}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {location.pathname === "/dashboard" && (
              <Button 
                variant="default" 
                size="sm" 
                className="hidden md:flex"
                onClick={() => {}}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Novo Documento
              </Button>
            )}
            {location.pathname === "/dashboard" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex"
                onClick={() => {}}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Nova PO
              </Button>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-gray-500 hover:text-primary"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary">{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Usuário'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'usuario@exemplo.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/perfil" className="cursor-pointer">
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/configuracoes" className="cursor-pointer">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-500 focus:text-red-500"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
