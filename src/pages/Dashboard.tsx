
import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { dataService } from "@/services/dataService";
import { Cliente, Documento, PurchaseOrder } from "@/types";
import { format, addDays, differenceInDays, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Clock, 
  Calendar,
  ArrowUpRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [proximosVencimentos, setProximosVencimentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesData = await dataService.clientes.getAll();
        const documentosData = await dataService.documentos.getAll();
        const posData = await dataService.purchaseOrders.getAll();

        setClientes(clientesData);
        setDocumentos(documentosData);
        setPos(posData);

        // Filtrar documentos que vencem em até 60 dias
        const hoje = new Date();
        const docProximosVencimentos = documentosData
          .filter(
            (doc) =>
              doc.ativo &&
              isBefore(hoje, doc.dataFim) &&
              differenceInDays(doc.dataFim, hoje) <= 60
          )
          .sort((a, b) => a.dataFim.getTime() - b.dataFim.getTime());

        setProximosVencimentos(docProximosVencimentos);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcular estatísticas
  const clientesAtivos = clientes.filter((c) => c.ativo).length;
  const documentosAtivos = documentos.filter((d) => d.ativo).length;
  const valorTotalContratos = documentos
    .filter((d) => d.ativo)
    .reduce((sum, doc) => {
      if (doc.valorTipo === "Mensal") {
        const dataInicio = new Date(doc.dataInicio);
        const dataFim = new Date(doc.dataFim);
        const meses =
          (dataFim.getFullYear() - dataInicio.getFullYear()) * 12 +
          (dataFim.getMonth() - dataInicio.getMonth()) +
          1;
        return sum + doc.valor * meses;
      }
      return sum + doc.valor;
    }, 0);

  const valorTotalPOs = pos.reduce((sum, po) => sum + po.valor, 0);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-sm text-gray-500">Carregando...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Visão geral do sistema de gestão de contratos e POs
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Card className="bg-brand-50 border-brand-100">
              <CardContent className="py-2 px-3 flex items-center">
                <Calendar className="h-4 w-4 text-brand-500 mr-2" />
                <span className="text-sm font-medium">
                  {format(new Date(), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                </span>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="overflow-hidden border-none shadow-lg hover-scale cursor-pointer bg-gradient-to-br from-white to-brand-50" onClick={() => navigate("/clientes")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Clientes Ativos
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-brand-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{clientesAtivos}</div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  de um total de {clientes.length} clientes
                </p>
                <ArrowUpRight className="h-4 w-4 ml-auto text-brand-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-lg hover-scale cursor-pointer bg-gradient-to-br from-white to-brand-50" onClick={() => navigate("/documentos")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Documentos Ativos
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-brand-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{documentosAtivos}</div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  de um total de {documentos.length} documentos
                </p>
                <ArrowUpRight className="h-4 w-4 ml-auto text-brand-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-lg hover-scale bg-gradient-to-br from-white to-brand-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Valor Total de Contratos
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-brand-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {valorTotalContratos.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor acumulado de todos os contratos ativos
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-lg hover-scale cursor-pointer bg-gradient-to-br from-white to-brand-50" onClick={() => navigate("/purchase-orders")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Valor Total de POs
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-brand-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {valorTotalPOs.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  Total de {pos.length} POs cadastradas
                </p>
                <ArrowUpRight className="h-4 w-4 ml-auto text-brand-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-brand-500" />
            Próximos Vencimentos
          </h2>
          {proximosVencimentos.length === 0 ? (
            <Card className="border-none shadow-md bg-gradient-to-r from-green-50 to-green-100 overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex">
                  <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Tudo em dia!</h3>
                    <p className="text-green-700">
                      Não há documentos a vencer nos próximos 60 dias.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {proximosVencimentos.map((doc) => {
                const diasRestantes = differenceInDays(doc.dataFim, new Date());
                let bgColor = "from-green-50 to-green-100";
                let textColor = "text-green-800";
                let iconColor = "text-green-600";
                let progressColor = "bg-green-500";
                let iconBgColor = "bg-green-200";

                if (diasRestantes <= 15) {
                  bgColor = "from-red-50 to-red-100";
                  textColor = "text-red-800";
                  iconColor = "text-red-600";
                  progressColor = "bg-red-500";
                  iconBgColor = "bg-red-200";
                } else if (diasRestantes <= 30) {
                  bgColor = "from-amber-50 to-amber-100";
                  textColor = "text-amber-800";
                  iconColor = "text-amber-600";
                  progressColor = "bg-amber-500";
                  iconBgColor = "bg-amber-200";
                }

                return (
                  <Card key={doc.id} className={`border-none shadow-md bg-gradient-to-r ${bgColor} overflow-hidden hover-scale`}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="flex mb-4 md:mb-0">
                          <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center mr-4`}>
                            <AlertTriangle className={`h-6 w-6 ${iconColor}`} />
                          </div>
                          <div>
                            <h3 className={`text-lg font-semibold ${textColor}`}>
                              {doc.nomeProjeto} - {clientes.find(c => c.id === doc.clienteId)?.nomeFantasia || 'Cliente'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Vence em {format(doc.dataFim, "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                        <div className="md:ml-auto w-full md:w-1/3">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium">Progresso</span>
                              <span className="font-bold">{diasRestantes} dias restantes</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${progressColor}`}
                                style={{ width: `${Math.min(100, Math.max(0, 100 - (diasRestantes / 60) * 100))}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
