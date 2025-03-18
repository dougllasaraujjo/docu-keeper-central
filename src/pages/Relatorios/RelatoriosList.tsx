import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, FileText, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";

const RelatoriosList = () => {
    const [periodoInicio, setPeriodoInicio] = useState<Date | undefined>(undefined);
    const [periodoFim, setPeriodoFim] = useState<Date | undefined>(undefined);
    const [clienteSelecionado, setClienteSelecionado] = useState("_all");

    // Dados de exemplo para os gráficos
    const dadosContratos = [
        { name: 'Jan', valor: 4000 },
        { name: 'Fev', valor: 3000 },
        { name: 'Mar', valor: 2000 },
        { name: 'Abr', valor: 2780 },
        { name: 'Mai', valor: 1890 },
        { name: 'Jun', valor: 2390 },
    ];

    const dadosFaturamento = [
        { name: 'Jan', valor: 3200 },
        { name: 'Fev', valor: 4500 },
        { name: 'Mar', valor: 5100 },
        { name: 'Abr', valor: 4900 },
        { name: 'Mai', valor: 6200 },
        { name: 'Jun', valor: 5800 },
    ];

    const dadosClientesPorSegmento = [
        { name: 'Tecnologia', value: 14 },
        { name: 'Varejo', value: 8 },
        { name: 'Saúde', value: 6 },
        { name: 'Automotivo', value: 4 },
        { name: 'Outros', value: 3 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Relatórios</h1>
                        <p className="text-muted-foreground">
                            Visualize relatórios e análises dos dados do sistema
                        </p>
                    </div>
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Filtros</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4">
                                <div className="w-full sm:w-auto">
                                    <p className="mb-2 text-sm font-medium">Período Inicial</p>
                                    <DatePicker
                                        selected={periodoInicio}
                                        onSelect={setPeriodoInicio}
                                        className="w-full"
                                        placeholder="Selecione a data"
                                    />
                                </div>
                                <div className="w-full sm:w-auto">
                                    <p className="mb-2 text-sm font-medium">Período Final</p>
                                    <DatePicker
                                        selected={periodoFim}
                                        onSelect={setPeriodoFim}
                                        className="w-full"
                                        placeholder="Selecione a data"
                                    />
                                </div>
                                <div className="w-full sm:w-auto">
                                    <p className="mb-2 text-sm font-medium">Cliente</p>
                                    <Select value={clienteSelecionado} onValueChange={setClienteSelecionado}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Todos os clientes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="_all">Todos os clientes</SelectItem>
                                            <SelectItem value="cliente1">Cliente ABC</SelectItem>
                                            <SelectItem value="cliente2">XYZ Corporation</SelectItem>
                                            <SelectItem value="cliente3">Tech Solutions</SelectItem>
                                            <SelectItem value="cliente4">Global Industries</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button className="mb-0.5">Aplicar Filtros</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="visaogeral" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="visaogeral" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            <span>Visão Geral</span>
                        </TabsTrigger>
                        <TabsTrigger value="contratos" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Contratos</span>
                        </TabsTrigger>
                        <TabsTrigger value="faturamento" className="flex items-center gap-2">
                            <LineChartIcon className="h-4 w-4" />
                            <span>Faturamento</span>
                        </TabsTrigger>
                        <TabsTrigger value="clientes" className="flex items-center gap-2">
                            <PieChartIcon className="h-4 w-4" />
                            <span>Clientes</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="visaogeral" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Contratos Ativos</CardTitle>
                                    <CardDescription>Total de contratos ativos no período</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">32</div>
                                    <div className="text-sm text-muted-foreground mt-1">+15% comparado ao período anterior</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Faturamento Total</CardTitle>
                                    <CardDescription>Soma dos valores faturados no período</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">R$ 246.800,00</div>
                                    <div className="text-sm text-green-600 mt-1">+8,5% comparado ao período anterior</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Saldo de POs</CardTitle>
                                    <CardDescription>Saldo disponível nas POs ativas</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">R$ 184.320,00</div>
                                    <div className="text-sm text-red-600 mt-1">-12% comparado ao período anterior</div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contratos por Mês</CardTitle>
                                    <CardDescription>Evolução de contratos ativos</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={dadosContratos}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => [`${value} contratos`, 'Quantidade']} />
                                                <Legend />
                                                <Bar dataKey="valor" name="Contratos" fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Faturamento por Mês</CardTitle>
                                    <CardDescription>Evolução do faturamento no período</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={dadosFaturamento}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']} />
                                                <Legend />
                                                <Line type="monotone" dataKey="valor" name="Faturamento" stroke="#82ca9d" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="contratos" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Novos Contratos</CardTitle>
                                    <CardDescription>No período selecionado</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">8</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Contratos Renovados</CardTitle>
                                    <CardDescription>No período selecionado</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">5</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Contratos Encerrados</CardTitle>
                                    <CardDescription>No período selecionado</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">3</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Distribuição por Tipo de Formalização</CardTitle>
                                <CardDescription>Documentos agrupados por tipo</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Contrato', value: 18 },
                                                    { name: 'Email', value: 8 },
                                                    { name: 'PO', value: 6 }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={true}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={120}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {
                                                    COLORS.map((color, index) => (
                                                        <Cell key={`cell-${index}`} fill={color} />
                                                    ))
                                                }
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} documentos`, 'Quantidade']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Próximos Contratos a Vencer</CardTitle>
                                <CardDescription>Contratos que vencem nos próximos 90 dias</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Cliente</TableHead>
                                                <TableHead>Projeto</TableHead>
                                                <TableHead>Data de Vencimento</TableHead>
                                                <TableHead>Valor</TableHead>
                                                <TableHead>Dias Restantes</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Cliente ABC</TableCell>
                                                <TableCell>Projeto X</TableCell>
                                                <TableCell>15/08/2023</TableCell>
                                                <TableCell>R$ 25.000,00</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span>28</span>
                                                        <Progress value={70} className="w-20 h-2" />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>XYZ Corporation</TableCell>
                                                <TableCell>Desenvolvimento Web</TableCell>
                                                <TableCell>22/09/2023</TableCell>
                                                <TableCell>R$ 42.500,00</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span>45</span>
                                                        <Progress value={50} className="w-20 h-2" />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Tech Solutions</TableCell>
                                                <TableCell>Consultoria</TableCell>
                                                <TableCell>10/10/2023</TableCell>
                                                <TableCell>R$ 18.750,00</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span>64</span>
                                                        <Progress value={30} className="w-20 h-2" />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="faturamento" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Faturamento Total</CardTitle>
                                    <CardDescription>Período selecionado</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">R$ 246.800,00</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Média Mensal</CardTitle>
                                    <CardDescription>No período selecionado</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">R$ 41.133,33</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Notas Emitidas</CardTitle>
                                    <CardDescription>No período selecionado</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">18</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Faturamento por Cliente</CardTitle>
                                <CardDescription>Top 5 clientes por valor faturado</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            layout="vertical"
                                            data={[
                                                { name: 'Cliente ABC', valor: 85000 },
                                                { name: 'XYZ Corporation', valor: 62500 },
                                                { name: 'Tech Solutions', valor: 45000 },
                                                { name: 'Global Industries', valor: 32000 },
                                                { name: 'Smart Systems', valor: 22300 }
                                            ]}
                                            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number"
                                                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                                            <YAxis dataKey="name" type="category" />
                                            <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']} />
                                            <Bar dataKey="valor" name="Faturamento" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Últimas Notas Fiscais Emitidas</CardTitle>
                                <CardDescription>Notas fiscais mais recentes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Número NF</TableHead>
                                                <TableHead>Cliente</TableHead>
                                                <TableHead>Data Emissão</TableHead>
                                                <TableHead>Valor Serviço</TableHead>
                                                <TableHead>Valor Repasse</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>NF-12345</TableCell>
                                                <TableCell>Cliente ABC</TableCell>
                                                <TableCell>28/06/2023</TableCell>
                                                <TableCell>R$ 18.500,00</TableCell>
                                                <TableCell>R$ 2.500,00</TableCell>
                                                <TableCell className="font-medium">R$ 21.000,00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>NF-12340</TableCell>
                                                <TableCell>XYZ Corporation</TableCell>
                                                <TableCell>25/06/2023</TableCell>
                                                <TableCell>R$ 12.800,00</TableCell>
                                                <TableCell>R$ 0,00</TableCell>
                                                <TableCell className="font-medium">R$ 12.800,00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>NF-12338</TableCell>
                                                <TableCell>Tech Solutions</TableCell>
                                                <TableCell>22/06/2023</TableCell>
                                                <TableCell>R$ 9.500,00</TableCell>
                                                <TableCell>R$ 1.800,00</TableCell>
                                                <TableCell className="font-medium">R$ 11.300,00</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="clientes" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Total de Clientes</CardTitle>
                                    <CardDescription>Clientes ativos</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">35</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Novos Clientes</CardTitle>
                                    <CardDescription>No período selecionado</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">4</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Ticket Médio</CardTitle>
                                    <CardDescription>Valor médio por cliente</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">R$ 7.051,42</div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Clientes por Segmento</CardTitle>
                                    <CardDescription>Distribuição de clientes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={dadosClientesPorSegmento}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={true}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={120}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {
                                                        COLORS.map((color, index) => (
                                                            <Cell key={`cell-${index}`} fill={color} />
                                                        ))
                                                    }
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${value} clientes`, 'Quantidade']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Clientes por Valor Contratado</CardTitle>
                                    <CardDescription>Top 5 clientes por valor total</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                layout="vertical"
                                                data={[
                                                    { name: 'Cliente ABC', valor: 125000 },
                                                    { name: 'XYZ Corporation', valor: 98000 },
                                                    { name: 'Tech Solutions', valor: 86500 },
                                                    { name: 'Global Industries', valor: 75000 },
                                                    { name: 'Smart Systems', valor: 62000 }
                                                ]}
                                                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number"
                                                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                                                <YAxis dataKey="name" type="category" />
                                                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor Contratado']} />
                                                <Bar dataKey="valor" name="Valor Contratado" fill="#82ca9d" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Documentos por Cliente</CardTitle>
                                <CardDescription>Quantidade de documentos ativos por cliente</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Cliente</TableHead>
                                                <TableHead>Grupo Econômico</TableHead>
                                                <TableHead>Contratos</TableHead>
                                                <TableHead>POs</TableHead>
                                                <TableHead>Valor Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-medium">Cliente ABC</TableCell>
                                                <TableCell>Grupo X</TableCell>
                                                <TableCell>3</TableCell>
                                                <TableCell>4</TableCell>
                                                <TableCell>R$ 125.000,00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">XYZ Corporation</TableCell>
                                                <TableCell>Grupo Y</TableCell>
                                                <TableCell>2</TableCell>
                                                <TableCell>5</TableCell>
                                                <TableCell>R$ 98.000,00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Tech Solutions</TableCell>
                                                <TableCell>Grupo Z</TableCell>
                                                <TableCell>4</TableCell>
                                                <TableCell>2</TableCell>
                                                <TableCell>R$ 86.500,00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Global Industries</TableCell>
                                                <TableCell>Grupo Y</TableCell>
                                                <TableCell>2</TableCell>
                                                <TableCell>3</TableCell>
                                                <TableCell>R$ 75.000,00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-medium">Smart Systems</TableCell>
                                                <TableCell>Independente</TableCell>
                                                <TableCell>1</TableCell>
                                                <TableCell>2</TableCell>
                                                <TableCell>R$ 62.000,00</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
};

export default RelatoriosList;