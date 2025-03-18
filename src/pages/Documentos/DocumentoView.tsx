import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
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
    Eye,
    Share2,
    FileText,
    Calendar,
    Building,
    Tag,
    Clock,
    CheckCircle,
    User,
    FileUp,
    History,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dados mockados para o Documento
const documentoMock = {
    id: "DOC-2023-0512",
    titulo: "Contrato de Prestação de Serviços - Empresa XYZ",
    cliente: "Empresa XYZ Tecnologia S.A.",
    tipo: "Contrato",
    status: "aprovado",
    categoria: "Prestação de Serviços",
    dataCriacao: "2023-05-10T09:15:00Z",
    dataAtualizacao: "2023-05-18T14:30:00Z",
    dataAprovacao: "2023-05-18T14:30:00Z",
    dataVencimento: "2024-05-10T23:59:59Z",
    tamanho: "3.7 MB",
    formato: "PDF",
    criadorPor: "Mariana Costa",
    aprovadoPor: "Carlos Santos",
    descricao: "Contrato de prestação de serviços de consultoria em TI para o projeto de migração para a nuvem. Inclui escopo, cronograma, valores e condições comerciais.",
    visualizacoes: 28,
    downloads: 12,
    versao: "1.2",
    tags: ["Contrato", "TI", "Consultoria", "2023"],
    versoes: [
        {
            numero: "1.0",
            data: "2023-05-10T09:15:00Z",
            usuario: "Mariana Costa",
            descricao: "Versão inicial do documento"
        },
        {
            numero: "1.1",
            data: "2023-05-15T11:30:00Z",
            usuario: "Mariana Costa",
            descricao: "Ajustes na cláusula de pagamento"
        },
        {
            numero: "1.2",
            data: "2023-05-18T14:30:00Z",
            usuario: "Carlos Santos",
            descricao: "Revisão final e aprovação"
        }
    ],
    comentarios: [
        {
            id: "1",
            usuario: "Ana Silva",
            data: "2023-05-12T10:20:00Z",
            texto: "Favor revisar a cláusula 4.2 referente aos prazos de pagamento."
        },
        {
            id: "2",
            usuario: "Roberto Almeida",
            data: "2023-05-15T09:45:00Z",
            texto: "Aprovado do ponto de vista jurídico."
        },
        {
            id: "3",
            usuario: "Carlos Santos",
            data: "2023-05-18T14:25:00Z",
            texto: "Documento aprovado para execução após as revisões solicitadas."
        }
    ],
    relacionados: [
        {
            id: "DOC-2023-0498",
            titulo: "Proposta Comercial - Projeto Nuvem XYZ",
            tipo: "Proposta",
            dataCriacao: "2023-04-28T15:10:00Z"
        },
        {
            id: "PO-2023-0125",
            titulo: "Purchase Order - Serviços de Consultoria TI",
            tipo: "PO",
            dataCriacao: "2023-05-19T09:30:00Z"
        }
    ],
    log: [
        {
            data: "2023-05-10T09:15:00Z",
            usuario: "Mariana Costa",
            acao: "Criação",
            descricao: "Documento criado no sistema"
        },
        {
            data: "2023-05-12T10:25:00Z",
            usuario: "Ana Silva",
            acao: "Comentário",
            descricao: "Comentário adicionado"
        },
        {
            data: "2023-05-15T11:30:00Z",
            usuario: "Mariana Costa",
            acao: "Atualização",
            descricao: "Nova versão do documento enviada"
        },
        {
            data: "2023-05-18T14:30:00Z",
            usuario: "Carlos Santos",
            acao: "Aprovação",
            descricao: "Documento aprovado"
        }
    ]
};

const DocumentoView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [documento, setDocumento] = useState(documentoMock);
    const [loading, setLoading] = useState(false);

    // Simulação de carregamento do documento
    useEffect(() => {
        setLoading(true);
        // Em um ambiente real, faríamos uma chamada API aqui
        setTimeout(() => {
            setDocumento(documentoMock);
            setLoading(false);
        }, 800);
    }, [id]);

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    };

    const formatDateShort = (dateString: string) => {
        return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pendente":
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pendente</Badge>;
            case "aprovado":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Aprovado</Badge>;
            case "rejeitado":
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Rejeitado</Badge>;
            case "expirado":
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Expirado</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleDownload = () => {
        toast.success("Iniciando download do documento");
        // Lógica de download simulada
    };

    const handleShare = () => {
        toast.success("Link de compartilhamento copiado para a área de transferência");
        // Lógica de compartilhamento simulada
    };

    const handleViewPdf = () => {
        toast.info("Abrindo visualizador de PDF");
        // Lógica de visualização simulada
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
                        <h1 className="text-3xl font-bold">{documento.titulo}</h1>
                        <div className="flex items-center mt-2 gap-3 flex-wrap">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                {documento.tipo}
                            </Badge>
                            {getStatusBadge(documento.status)}
                            <span>•</span>
                            <p className="text-muted-foreground">
                                ID: {documento.id}
                            </p>
                            <span>•</span>
                            <p className="text-muted-foreground">
                                v{documento.versao}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleShare}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Compartilhar
                        </Button>
                        <Button variant="outline" onClick={handleViewPdf}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                        </Button>
                        <Button onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="detalhes">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                        <TabsTrigger value="versoes">Versões</TabsTrigger>
                        <TabsTrigger value="comentarios">Comentários</TabsTrigger>
                        <TabsTrigger value="relacionados">Relacionados</TabsTrigger>
                        <TabsTrigger value="historico">Histórico</TabsTrigger>
                    </TabsList>

                    {/* Tab de Detalhes */}
                    <TabsContent value="detalhes" className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Informações do Documento</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">Descrição</h4>
                                                <p className="text-sm text-gray-600">{documento.descricao}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">Cliente</h4>
                                                <p>{documento.cliente}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">Categoria</h4>
                                                <p>{documento.categoria}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {documento.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
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
                                            <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">Status</h4>
                                                <div className="mt-1">{getStatusBadge(documento.status)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">Data de Criação</h4>
                                                <p>{formatDate(documento.dataCriacao)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium">Última Atualização</h4>
                                                <p>{formatDate(documento.dataAtualizacao)}</p>
                                            </div>
                                        </div>
                                        {documento.status === "aprovado" && (
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium">Data de Aprovação</h4>
                                                    <p>{formatDate(documento.dataAprovacao)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Tab de Versões */}
                    <TabsContent value="versoes" className="pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Versões do Documento</CardTitle>
                                <CardDescription>
                                    Total de {documento.versoes.length} versões - Última versão: {documento.versao}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Versão</TableHead>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Usuário</TableHead>
                                            <TableHead>Descrição</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {documento.versoes.map((versao) => (
                                            <TableRow key={versao.numero}>
                                                <TableCell className="font-medium">{versao.numero}</TableCell>
                                                <TableCell>{formatDate(versao.data)}</TableCell>
                                                <TableCell>{versao.usuario}</TableCell>
                                                <TableCell>{versao.descricao}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab de Comentários */}
                    <TabsContent value="comentarios" className="pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Comentários</CardTitle>
                                <CardDescription>
                                    Total de {documento.comentarios.length} comentários
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Usuário</TableHead>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Texto</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {documento.comentarios.map((comentario) => (
                                            <TableRow key={comentario.id}>
                                                <TableCell className="font-medium">{comentario.id}</TableCell>
                                                <TableCell>{comentario.usuario}</TableCell>
                                                <TableCell>{formatDate(comentario.data)}</TableCell>
                                                <TableCell>{comentario.texto}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab de Relacionados */}
                    <TabsContent value="relacionados" className="pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Documentos Relacionados</CardTitle>
                                <CardDescription>
                                    Total de {documento.relacionados.length} documentos relacionados
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Título</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Data de Criação</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {documento.relacionados.map((relacionado) => (
                                            <TableRow key={relacionado.id}>
                                                <TableCell className="font-medium">{relacionado.id}</TableCell>
                                                <TableCell>{relacionado.titulo}</TableCell>
                                                <TableCell>{relacionado.tipo}</TableCell>
                                                <TableCell>{formatDate(relacionado.dataCriacao)}</TableCell>
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
                                    {documento.log.map((evento, index) => (
                                        <div key={index} className="flex">
                                            <div className="mr-4 flex flex-col items-center">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
                                                    <Clock className="h-5 w-5 text-blue-600" />
                                                </div>
                                                {index < documento.log.length - 1 && (
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

export default DocumentoView; 