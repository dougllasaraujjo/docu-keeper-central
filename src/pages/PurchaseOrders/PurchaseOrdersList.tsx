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
import { Input } from "@/components/ui/input";
import { PurchaseOrder, Cliente } from "@/types";
import { dataService } from "@/services/dataService";
import { Plus, Search, Edit, Eye, AlertTriangle, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PurchaseOrdersList = () => {
    const navigate = useNavigate();
    const [pos, setPos] = useState<PurchaseOrder[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroCliente, setFiltroCliente] = useState("_all");
    const [filtroStatus, setFiltroStatus] = useState("_all");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [posData, clientesData] = await Promise.all([
                    dataService.purchaseOrders.getAll(),
                    dataService.clientes.getAll(),
                ]);
                setPos(posData);
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

    const handleViewPO = (id: string) => {
        navigate(`/purchase-orders/${id}`);
    };

    const filteredPOs = pos.filter((po) => {
        const clienteNome = clientes.find(c => c.id === po.clienteId)?.nomeFantasia || "";

        const matchesSearch =
            po.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            po.numeroPO.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCliente = filtroCliente === "_all" || !filtroCliente ? true : po.clienteId === filtroCliente;
        const matchesStatus = filtroStatus === "_all" || !filtroStatus
            ? true
            : filtroStatus === 'ativo'
                ? po.ativo
                : filtroStatus === 'inativo'
                    ? !po.ativo
                    : true;

        return matchesSearch && matchesCliente && matchesStatus;
    });

    const posExpirando = pos.filter(po => {
        if (!po.ativo) return false;
        const hoje = new Date();
        const dataFim = new Date(po.dataFim);
        const diasRestantes = Math.floor((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        return diasRestantes <= 60 && diasRestantes >= 0;
    });

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Purchase Orders</h1>
                        <p className="text-muted-foreground">
                            Gerencie e acompanhe o saldo das POs dos clientes
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova PO
                    </Button>
                </div>

                {posExpirando.length > 0 && (
                    <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-amber-800">POs expirando em breve</h3>
                                    <p className="text-amber-700 mb-2">
                                        Você tem {posExpirando.length} PO(s) que vencerão nos próximos 60 dias.
                                    </p>
                                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-800 hover:bg-amber-100">
                                        Ver todas
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Purchase Orders</CardTitle>
                        <CardDescription>
                            {filteredPOs.length} POs encontradas
                        </CardDescription>
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por número, cliente ou descrição..."
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
                        ) : filteredPOs.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground">
                                Nenhuma PO encontrada
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Número PO</TableHead>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead className="hidden md:table-cell">Vigência</TableHead>
                                            <TableHead>Valor Total</TableHead>
                                            <TableHead className="hidden md:table-cell">Saldo</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPOs.map((po) => {
                                            const cliente = clientes.find(c => c.id === po.clienteId);
                                            const saldoDisponivel = po.valor - (po.valorUtilizado || 0);
                                            const percentUtilizado = (po.valorUtilizado || 0) / po.valor * 100;

                                            return (
                                                <TableRow key={po.id}>
                                                    <TableCell>
                                                        <div className={`h-2.5 w-2.5 rounded-full ${po.ativo ? "bg-success-500" : "bg-gray-400"}`}></div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {po.numeroPO}
                                                    </TableCell>
                                                    <TableCell>{cliente?.nomeFantasia || '-'}</TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {format(new Date(po.dataInicio), "dd/MM/yyyy", { locale: ptBR })} - {format(new Date(po.dataFim), "dd/MM/yyyy", { locale: ptBR })}
                                                    </TableCell>
                                                    <TableCell>
                                                        {po.valor.toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        })}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium">
                                                                {saldoDisponivel.toLocaleString('pt-BR', {
                                                                    style: 'currency',
                                                                    currency: 'BRL'
                                                                })}
                                                            </p>
                                                            <Progress value={percentUtilizado} className="h-1" />
                                                            <p className="text-xs text-muted-foreground">{percentUtilizado.toFixed(0)}% utilizado</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleViewPO(po.id)}
                                                                title="Visualizar PO"
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
            </div>
        </AppLayout>
    );
};

export default PurchaseOrdersList; 