
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const NotPermitted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-6 max-w-md">
        <div className="w-full flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-red-500">
            <Shield className="h-12 w-12" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground mb-6">
          Você não tem permissão para acessar esta página. Entre em contato com um administrador para solicitar acesso.
        </p>
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link to="/dashboard">Voltar ao Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotPermitted;
