
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

const NotPermitted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-brand-50">
      <div className="max-w-md w-full p-8 animate-fade-in">
        <div className="w-full flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
            <Shield className="h-12 w-12" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">Acesso Negado</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Você não tem permissão para acessar esta página. Entre em contato com um administrador para solicitar acesso.
        </p>
        <div className="flex flex-col gap-2">
          <Button asChild className="bg-brand-500 hover:bg-brand-600 transition-colors">
            <Link to="/dashboard" className="flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotPermitted;
