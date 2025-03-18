import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft,
    Download,
    FileText,
    ClipboardCheck,
    Calendar,
    Building,
    DollarSign,
    Truck,
    CheckCircle2,
    AlertCircle,
    Clock,
    User,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dados para diferentes POs
const poDatabase = {
    "po1": {
        id: "PO-2023-0042",
        cliente: "Empresa ABC Ltda",
        status: "aprovado",
        dataCriacao: "2023-06-15T10:30:00Z",
        dataAtualizacao: "2023-06-18T14:45:00Z",
        dataAprovacao: "2023-06-18T14:45:00Z",
        valorTotal: 12750.5,
        descricao: "Compra de materiais para projeto de expansão da unidade industrial.",
        observacoes: "Entrega deve ser feita diretamente na unidade de São Paulo, com agendamento prévio.",
        criadoPor: "Carlos Santos",
        aprovadoPor: "Ana Silva",
        itens: [
            {
                id: "1",
                descricao: "Servidor Dell PowerEdge R740",
                quantidade: 2,
                unidade: "UN",
                valorUnitario: 4500.0,
                valorTotal: 9000.0
            },
            {
                id: "2",
                descricao: "Switch Cisco Catalyst 9200",
                quantidade: 3,
                unidade: "UN",
                valorUnitario: 1250.0,
                valorTotal: 3750.0
            },
            {
                id: "3",
                descricao: "Instalação e configuração",
                quantidade: 1,
                unidade: "SV",
                valorUnitario: 500.0,
                valorTotal: 500.0
            }
        ],
        documentos: [
            {
                id: "DOC-2023-0101",
                nome: "Proposta Comercial.pdf",
                tipo: "Proposta",
                dataUpload: "2023-06-15T10:35:00Z",
                tamanho: "2.4 MB"
            },
            {
                id: "DOC-2023-0102",
                nome: "Especificação Técnica.pdf",
                tipo: "Especificação",
                dataUpload: "2023-06-15T10:40:00Z",
                tamanho: "1.8 MB"
            }
        ],
        historico: [
            {
                data: "2023-06-15T10:30:00Z",
                usuario: "Carlos Santos",
                acao: "Criação da PO",
                descricao: "PO criada no sistema"
            },
            {
                data: "2023-06-15T15:20:00Z",
                usuario: "Mariana Costa",
                acao: "Revisão",
                descricao: "Revisão técnica realizada"
            },
            {
                data: "2023-06-18T14:45:00Z",
                usuario: "Ana Silva",
                acao: "Aprovação",
                descricao: "PO aprovada para execução"
            }
        ]
    },
    "po2": {
        id: "PO-2023-0067",
        cliente: "Tech Solutions S.A.",
        status: "pendente",
        dataCriacao: "2023-07-05T11:20:00Z",
        dataAtualizacao: "2023-07-06T16:30:00Z",
        valorTotal: 8950.75,
        descricao: "Aquisição de licenças de software e serviços de suporte.",
        observacoes: "Aguardando aprovação do departamento financeiro.",
        criadoPor: "Roberto Almeida",
        itens: [
            {
                id: "1",
                descricao: "Licenças Microsoft 365 Business",
                quantidade: 15,
                unidade: "UN",
                valorUnitario: 350.0,
                valorTotal: 5250.0
            },
            {
                id: "2",
                descricao: "Licenças Adobe Creative Cloud",
                quantidade: 3,
                unidade: "UN",
                valorUnitario: 900.25,
                valorTotal: 2700.75
            },
            {
                id: "3",
                descricao: "Suporte Técnico Mensal",
                quantidade: 1,
                unidade: "SV",
                valorUnitario: 1000.0,
                valorTotal: 1000.0
            }
        ],
        documentos: [
            {
                id: "DOC-2023-0145",
                nome: "Cotação de Preços.pdf",
                tipo: "Cotação",
                dataUpload: "2023-07-05T11:25:00Z",
                tamanho: "1.2 MB"
            }
        ],
        historico: [
            {
                data: "2023-07-05T11:20:00Z",
                usuario: "Roberto Almeida",
                acao: "Criação da PO",
                descricao: "PO criada no sistema"
            },
            {
                data: "2023-07-06T16:30:00Z",
                usuario: "Juliana Pereira",
                acao: "Revisão",
                descricao: "Enviado para aprovação financeira"
            }
        ]
    },
    "po3": {
        id: "PO-2023-0083",
        cliente: "Indústrias Globo Ltda",
        status: "rejeitado",
        dataCriacao: "2023-06-28T09:45:00Z",
        dataAtualizacao: "2023-06-30T14:10:00Z",
        dataRejeicao: "2023-06-30T14:10:00Z",
        valorTotal: 22500.0,
        descricao: "Contratação de serviços de consultoria para implementação de ERP.",
        observacoes: "Rejeitado devido ao orçamento exceder o limite aprovado para o trimestre.",
        criadoPor: "Mariana Costa",
        rejeitadoPor: "Carlos Santos",
        itens: [
            {
                id: "1",
                descricao: "Consultoria Implementação ERP",
                quantidade: 1,
                unidade: "SV",
                valorUnitario: 18000.0,
                valorTotal: 18000.0
            },
            {
                id: "2",
                descricao: "Treinamento de Usuários",
                quantidade: 3,
                unidade: "SV",
                valorUnitario: 1500.0,
                valorTotal: 4500.0
            }
        ],
        documentos: [
            {
                id: "DOC-2023-0160",
                nome: "Proposta de Serviços.pdf",
                tipo: "Proposta",
                dataUpload: "2023-06-28T09:50:00Z",
                tamanho: "3.1 MB"
            },
            {
                id: "DOC-2023-0161",
                nome: "Justificativa de Rejeição.pdf",
                tipo: "Justificativa",
                dataUpload: "2023-06-30T14:15:00Z",
                tamanho: "0.8 MB"
            }
        ],
        historico: [
            {
                data: "2023-06-28T09:45:00Z",
                usuario: "Mariana Costa",
                acao: "Criação da PO",
                descricao: "PO criada no sistema"
            },
            {
                data: "2023-06-29T11:30:00Z",
                usuario: "Ana Silva",
                acao: "Revisão",
                descricao: "Enviado para aprovação"
            },
            {
                data: "2023-06-30T14:10:00Z",
                usuario: "Carlos Santos",
                acao: "Rejeição",
                descricao: "PO rejeitada por restrição orçamentária"
            }
        ]
    }
};

const PurchaseOrderView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [po, setPo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carregar dados da PO com base no ID da URL
    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulação de chamada API
        setTimeout(() => {
            try {
                // Verificar se o ID existe no banco de dados
                if (id && poDatabase[id as keyof typeof poDatabase]) {
                    setPo(poDatabase[id as keyof typeof poDatabase]);
                    setLoading(false);
                } else {
                    setError("Purchase Order não encontrada");
                    setLoading(false);
                }
            } catch (err) {
                setError("Erro ao carregar dados da Purchase Order");
                setLoading(false);
            }
        }, 800);
    }, [id]);

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pendente":
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pendente</Badge>;
            case "aprovado":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Aprovado</Badge>;
            case "rejeitado":
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Rejeitado</Badge>;
            case "concluido":
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Concluído</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleDownload = (docId: string, docName: string) => {
        toast.info(`Iniciando download de: ${docName}`);
        // Lógica de download simulada
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AppLayout>
        );
    }

    if (error || !po) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800">{error || "Purchase Order não encontrada"}</h2>
                    <p className="text-gray-600 mt-2">Não foi possível encontrar a PO solicitada.</p>
                    <Button
                        onClick={() => navigate(-1)}
                        className="mt-6"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="mb-4"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                        <h1 className="text-3xl font-bold">Purchase Order: {po.id}</h1>
                        <div className="flex items-center mt-2 gap-3">
                            <p className="text-muted-foreground">
                                Cliente: {po.cliente}
                            </p>
                            <span>•</span>
                            <p className="text-muted-foreground">
                                {formatDate(po.dataCriacao)}
                            </p>
                            <span>•</span>
                            {getStatusBadge(po.status)}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Exportar PDF
                        </Button>
                        <Button>
                            <ClipboardCheck className="mr-2 h-4 w-4" />
                            Gerar Documento
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="detalhes">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                        <TabsTrigger value="itens">Itens</TabsTrigger>
                        <TabsTrigger value="documentos">Documentos</TabsTrigger>
                        <TabsTrigger value="historico">Histórico</TabsTrigger>
                    </TabsList>

                    {/* Tab de Detalhes */}
                    <TabsContent value="detalhes" className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Informações Gerais</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">Cliente</h4>
                                                <p>{po.cliente}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">Valor Total</h4>
                                                <p className="text-lg font-semibold">{formatCurrency(po.valorTotal)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">Descrição</h4>
                                                <p className="text-sm text-gray-600">{po.descricao}</p>
                                            </div>
                                        </div>
                                        {po.observacoes && (
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium">Observações</h4>
                                                    <p className="text-sm text-gray-600">{po.observacoes}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Status e Datas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">Status</h4>
                                                <div className="mt-1">{getStatusBadge(po.status)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">Data de Criação</h4>
                                                <p>{formatDate(po.dataCriacao)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">Última Atualização</h4>
                                                <p>{formatDate(po.dataAtualizacao)}</p>
                                            </div>
                                        </div>
                                        {po.status === "aprovado" && (
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium">Data de Aprovação</h4>
                                                    <p>{formatDate(po.dataAprovacao)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Tab de Itens */}
                    <TabsContent value="itens" className="pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Itens da Purchase Order</CardTitle>
                                <CardDescription>
                                    Total de {po.itens.length} itens - Valor Total: {formatCurrency(po.valorTotal)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Descrição</TableHead>
                                            <TableHead className="text-right">Qtd.</TableHead>
                                            <TableHead className="text-center">Un.</TableHead>
                                            <TableHead className="text-right">Valor Unitário</TableHead>
                                            <TableHead className="text-right">Valor Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {po.itens.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell>{item.descricao}</TableCell>
                                                <TableCell className="text-right">{item.quantidade}</TableCell>
                                                <TableCell className="text-center">{item.unidade}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.valorUnitario)}</TableCell>
                                                <TableCell className="text-right font-medium">{formatCurrency(item.valorTotal)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-right font-bold">
                                                Total:
                                            </TableCell>
                                            <TableCell className="text-right font-bold">
                                                {formatCurrency(po.valorTotal)}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab de Documentos */}
                    <TabsContent value="documentos" className="pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Documentos Anexados</CardTitle>
                                <CardDescription>
                                    {po.documentos.length} documentos anexados a esta PO
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Data de Upload</TableHead>
                                            <TableHead>Tamanho</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {po.documentos.map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell className="font-medium">{doc.id}</TableCell>
                                                <TableCell>{doc.nome}</TableCell>
                                                <TableCell>{doc.tipo}</TableCell>
                                                <TableCell>{formatDate(doc.dataUpload)}</TableCell>
                                                <TableCell>{doc.tamanho}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDownload(doc.id, doc.nome)}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab de Histórico */}
                    <TabsContent value="historico" className="pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Histórico de Atividades</CardTitle>
                                <CardDescription>
                                    Registro cronológico de todas as operações realizadas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {po.historico.map((evento, index) => (
                                        <div key={index} className="flex">
                                            <div className="mr-4 flex flex-col items-center">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
                                                    <Clock className="h-5 w-5 text-blue-600" />
                                                </div>
                                                {index < po.historico.length - 1 && (
                                                    <div className="h-full w-px bg-gray-200 mt-1"></div>
                                                )}
                                            </div>
                                            <div className="pb-6">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{evento.acao}</p>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(evento.data)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mt-1 text-sm">{evento.descricao}</p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Por: {evento.usuario}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
};

export default PurchaseOrderView; 