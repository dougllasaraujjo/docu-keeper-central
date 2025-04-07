import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Páginas
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import NotPermitted from "./pages/NotPermitted";
import ClientesList from "./pages/Clientes/ClientesList";
import DocumentosList from "./pages/Documentos/DocumentosList";
import DocumentoView from "./pages/Documentos/DocumentoView";
import PurchaseOrdersList from "./pages/PurchaseOrders/PurchaseOrdersList";
import PurchaseOrderView from "./pages/PurchaseOrders/PurchaseOrderView";
import RelatoriosList from "./pages/Relatorios/RelatoriosList";
import UsuariosList from "./pages/Usuarios/UsuariosList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" expand={true} closeButton richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<ClientesList />} />
            <Route path="/documentos" element={<DocumentosList />} />
            <Route path="/documentos/:id" element={<DocumentoView />} />
            <Route path="/purchase-orders" element={<PurchaseOrdersList />} />
            <Route path="/purchase-orders/:id" element={<PurchaseOrderView />} />
            <Route path="/relatorios" element={<RelatoriosList />} />
            <Route path="/usuarios" element={<UsuariosList />} />
            <Route path="/configuracoes" element={<NotFound />} />
            <Route path="/sem-permissao" element={<NotPermitted />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
