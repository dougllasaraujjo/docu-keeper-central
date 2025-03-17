
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
  ArrowUpRight,
  ArrowRight,
  FileCheck,
  BarChart4
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [proximosVencimentos, setProximosVencimentos] = useState<Documento[]>([]);
  const [documentosRecentes, setDocumentosRecentes] = useState<Documento[]>([]);
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

        // Documentos recentes (últimos 2)
        const docRecentes = [...documentosData]
          .sort((a, b) => b.dataInicio.getTime() - a.dataInicio.getTime())
          .slice(0, 2);
        
        setDocumentosRecentes(docRecentes);
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
  const valorUtilizadoPOs = pos.reduce((sum, po) => sum + (po.valorUtilizado || 0), 0);
  const percentUtilizado = valorTotalPOs > 0 ? (valorUtilizadoPOs / valorTotalPOs) * 100 : 0;

  // Dados para o gráfico
  const chartData = [
    {
      name: 'Jan',
      documentos: 4,
      pos: 2,
    },
    {
      name: 'Fev',
      documentos: 3,
      pos: 1,
    },
    {
      name: 'Mar',
      documentos: 5,
      pos: 3,
    },
    {
      name: 'Abr',
      documentos: 2,
      pos: 4,
    },
    {
      name: 'Mai',
      documentos: 6,
      pos: 3,
    },
    {
      name: 'Jun',
      documentos: 4,
      pos: 5,
    },
  ];

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
              Visão geral dos seus documentos e ordens de compra
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="default" 
              size="sm" 
              className="md:hidden"
              onClick={() => {}}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Novo Documento
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="md:hidden"
              onClick={() => {}}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Nova PO
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white" onClick={() => navigate("/documentos")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Documentos Ativos
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileSignature className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{documentosAtivos}</div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  de um total de {documentos.length} documentos
                </p>
                <div className="ml-auto rounded-full bg-primary/5 p-1">
                  <ArrowRight className="h-3 w-3 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white" onClick={() => navigate("/purchase-orders")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                POs Ativas
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{pos.filter(p => p.ativo).length}</div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  de um total de {pos.length} POs
                </p>
                <div className="ml-auto rounded-full bg-primary/5 p-1">
                  <ArrowRight className="h-3 w-3 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Valor Total Faturado
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart4 className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {valorUtilizadoPOs.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total de 3 notas fiscais
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">
                Alertas
              </CardTitle>
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {proximosVencimentos.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                POs expirando nos próximos 60 dias
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border shadow-sm overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Uso de POs</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => navigate('/purchase-orders')}>
                  Ver detalhes
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              <CardDescription>
                Consumo total de ordens de compra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
                  <p className="text-2xl font-bold">
                    {valorTotalPOs.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Utilizado</p>
                  <p className="text-2xl font-bold">
                    {valorUtilizadoPOs.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{percentUtilizado.toFixed(1)}% utilizado</span>
                </div>
                <Progress value={percentUtilizado} className="h-2" indicatorClassName="bg-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Documentos Recentes</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => navigate('/documentos')}>
                  Ver todos
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              <CardDescription>
                Últimos documentos adicionados ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {documentosRecentes.map((doc) => {
                  const cliente = clientes.find(c => c.id === doc.clienteId);
                  return (
                    <div key={doc.id} className="flex items-center p-4 hover:bg-gray-50">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center ${doc.ativo ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <FileText className={`h-5 w-5 ${doc.ativo ? 'text-green-600' : 'text-gray-500'}`} />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-medium text-sm">{doc.nomeProjeto}</p>
                        <p className="text-xs text-muted-foreground">{cliente?.nomeFantasia}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${doc.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {doc.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {doc.valorTipo === 'Mensal' ? (
                            `R$ ${doc.valor.toLocaleString('pt-BR')}/mês`
                          ) : (
                            `R$ ${doc.valor.toLocaleString('pt-BR')}`
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Próximos Vencimentos
            </h2>
            {proximosVencimentos.length > 0 && (
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Ver todos
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}
          </div>
          
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
                  <Card key={doc.id} className={`border-none shadow-md bg-gradient-to-r ${bgColor} overflow-hidden hover:shadow-lg transition-shadow`}>
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
