import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Documento, Cliente } from "@/types";
import { dataService } from "@/services/dataService";
import { Plus, Search, Edit, Eye, FileText, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DocumentosList = () => {
    const navigate = useNavigate();
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroCliente, setFiltroCliente] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [documentosData, clientesData] = await Promise.all([
                    dataService.documentos.getAll(),
                    dataService.clientes.getAll(),
                ]);
                setDocumentos(documentosData);
                setClientes(clientesData);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                toast.error("Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewDocumento = (id: string) => {
        navigate(`/documentos/${id}`);
    };

    const filteredDocumentos = documentos.filter((doc) => {
        const clienteNome = clientes.find(c => c.id === doc.clienteId)?.nomeFantasia || "";

        const matchesSearch =
            doc.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clienteNome.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCliente = filtroCliente === "_all" || !filtroCliente ? true : doc.clienteId === filtroCliente;
        const matchesTipo = filtroTipo === "_all" || !filtroTipo ? true : doc.tipo === filtroTipo;
        const matchesStatus = filtroStatus === "_all" || !filtroStatus
            ? true
            : filtroStatus === 'ativo'
                ? doc.ativo
                : filtroStatus === 'inativo'
                    ? !doc.ativo
                    : true;

        return matchesSearch && matchesCliente && matchesTipo && matchesStatus;
    });

    const documentosVencendo = documentos.filter(doc => {
        if (!doc.ativo) return false;
        const hoje = new Date();
        const dataFim = new Date(doc.dataFim);
        const diasRestantes = Math.floor((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        return diasRestantes <= 60 && diasRestantes >= 0;
    });

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Documentos</h1>
                        <p className="text-muted-foreground">
                            Gerencie os contratos, POs e documentos dos clientes
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Documento
                    </Button>
                </div>

                {documentosVencendo.length > 0 && (
                    <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-amber-800">Documentos expirando em breve</h3>
                                    <p className="text-amber-700 mb-2">
                                        Você tem {documentosVencendo.length} documento(s) que vencerão nos próximos 60 dias.
                                    </p>
                                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-800 hover:bg-amber-100">
                                        Ver todos
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Tabs defaultValue="todos" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="todos">Todos</TabsTrigger>
                        <TabsTrigger value="contratos">Contratos</TabsTrigger>
                        <TabsTrigger value="emails">Emails</TabsTrigger>
                        <TabsTrigger value="po">POs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="todos" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Lista de Documentos</CardTitle>
                                <CardDescription>
                                    {filteredDocumentos.length} documentos encontrados
                                </CardDescription>
                                <div className="flex flex-col md:flex-row gap-4 mt-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar documentos..."
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Select value={filtroCliente} onValueChange={setFiltroCliente}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Todos os clientes" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="_all">Todos os clientes</SelectItem>
                                                {clientes.map(cliente => (
                                                    <SelectItem key={cliente.id} value={cliente.id}>
                                                        {cliente.nomeFantasia}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="_all">Todos</SelectItem>
                                                <SelectItem value="ativo">Ativos</SelectItem>
                                                <SelectItem value="inativo">Inativos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex justify-center p-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    </div>
                                ) : filteredDocumentos.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        Nenhum documento encontrado
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Projeto</TableHead>
                                                    <TableHead>Cliente</TableHead>
                                                    <TableHead className="hidden md:table-cell">Tipo</TableHead>
                                                    <TableHead className="hidden md:table-cell">Vigência</TableHead>
                                                    <TableHead className="hidden md:table-cell">Valor</TableHead>
                                                    <TableHead className="text-right">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredDocumentos.map((doc) => {
                                                    const cliente = clientes.find(c => c.id === doc.clienteId);
                                                    return (
                                                        <TableRow key={doc.id}>
                                                            <TableCell>
                                                                <div className={`h-2.5 w-2.5 rounded-full ${doc.ativo ? "bg-success-500" : "bg-gray-400"}`}></div>
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {doc.nomeProjeto}
                                                            </TableCell>
                                                            <TableCell>{cliente?.nomeFantasia || '-'}</TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                <Badge variant="outline" className="capitalize">
                                                                    {doc.tipo || 'N/A'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {format(new Date(doc.dataInicio), "dd/MM/yyyy", { locale: ptBR })} - {format(new Date(doc.dataFim), "dd/MM/yyyy", { locale: ptBR })}
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {doc.valor.toLocaleString('pt-BR', {
                                                                    style: 'currency',
                                                                    currency: 'BRL'
                                                                })}
                                                                {doc.valorTipo === 'Mensal' && '/mês'}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleViewDocumento(doc.id)}
                                                                        title="Visualizar documento"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => { }}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contratos" className="mt-6">
                        <Card>
                            <CardContent className="py-10">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">Filtrando por Contratos</h3>
                                    <p className="text-muted-foreground mt-2">
                                        Esta visualização mostrará apenas documentos do tipo "Contrato"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="emails" className="mt-6">
                        <Card>
                            <CardContent className="py-10">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">Filtrando por Emails</h3>
                                    <p className="text-muted-foreground mt-2">
                                        Esta visualização mostrará apenas documentos do tipo "Email"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="po" className="mt-6">
                        <Card>
                            <CardContent className="py-10">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">Filtrando por POs</h3>
                                    <p className="text-muted-foreground mt-2">
                                        Esta visualização mostrará apenas documentos do tipo "PO"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
};

export default DocumentosList; 