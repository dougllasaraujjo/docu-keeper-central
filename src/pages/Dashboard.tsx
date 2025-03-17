
import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { dataService } from "@/services/dataService";
import { Cliente, Documento, PurchaseOrder } from "@/types";
import { format, addDays, differenceInDays, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, AlertTriangle, CheckCircle, Users } from "lucide-react";
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
        // Calcular meses entre início e fim
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de gestão de contratos e POs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/clientes")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes Ativos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientesAtivos}</div>
              <p className="text-xs text-muted-foreground">
                de um total de {clientes.length} clientes
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/documentos")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Documentos Ativos
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documentosAtivos}</div>
              <p className="text-xs text-muted-foreground">
                de um total de {documentos.length} documentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor Total de Contratos
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {valorTotalContratos.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Valor acumulado de todos os contratos ativos
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/purchase-orders")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor Total de POs
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {valorTotalPOs.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de {pos.length} POs cadastradas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Próximos Vencimentos</h2>
          {proximosVencimentos.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Tudo em dia!</AlertTitle>
              <AlertDescription>
                Não há documentos a vencer nos próximos 60 dias.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {proximosVencimentos.map((doc) => {
                const diasRestantes = differenceInDays(doc.dataFim, new Date());
                let alertVariant = "default";
                let progressColor = "bg-brand-500";

                if (diasRestantes <= 15) {
                  alertVariant = "destructive";
                  progressColor = "bg-red-500";
                } else if (diasRestantes <= 30) {
                  alertVariant = "warning";
                  progressColor = "bg-amber-500";
                }

                return (
                  <Alert key={doc.id} variant={alertVariant as any}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="flex items-center justify-between">
                      <span>
                        {doc.nomeProjeto} - {clientes.find(c => c.id === doc.clienteId)?.nomeFantasia || 'Cliente'}
                      </span>
                      <span className="text-sm font-normal">
                        Vence em {format(doc.dataFim, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progresso</span>
                          <span>{diasRestantes} dias restantes</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${progressColor}`}
                            style={{ width: `${Math.min(100, Math.max(0, 100 - (diasRestantes / 60) * 100))}%` }}
                          ></div>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
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
