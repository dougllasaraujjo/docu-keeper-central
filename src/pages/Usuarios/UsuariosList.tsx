import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
    Search,
    Plus,
    Edit,
    Trash,
    UserCog,
    Shield,
    Eye,
    EyeOff,
    Users,
    FileCheck,
    BarChart3,
    Settings,
    FileText
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dados mockados para exemplo
const usuariosMock = [
    {
        id: "1",
        nome: "Ana Silva",
        email: "ana.silva@empresa.com",
        cargo: "Gerente Financeiro",
        ativo: true,
        permissoes: ["documentos", "relatorios", "clientes", "pos"],
        ultimoAcesso: "2023-07-10T14:30:00Z",
        criado: "2023-01-15T10:00:00Z"
    },
    {
        id: "2",
        nome: "Carlos Santos",
        email: "carlos.santos@empresa.com",
        cargo: "Administrador",
        ativo: true,
        permissoes: ["documentos", "relatorios", "clientes", "pos", "usuarios", "configuracoes"],
        ultimoAcesso: "2023-07-11T09:15:00Z",
        criado: "2023-01-15T10:15:00Z"
    },
    {
        id: "3",
        nome: "Mariana Costa",
        email: "mariana.costa@empresa.com",
        cargo: "Analista Financeiro",
        ativo: true,
        permissoes: ["documentos", "relatorios", "clientes"],
        ultimoAcesso: "2023-07-09T16:45:00Z",
        criado: "2023-03-22T14:30:00Z"
    },
    {
        id: "4",
        nome: "Roberto Almeida",
        email: "roberto.almeida@empresa.com",
        cargo: "Assistente Administrativo",
        ativo: false,
        permissoes: ["documentos", "clientes"],
        ultimoAcesso: "2023-05-30T11:20:00Z",
        criado: "2023-04-12T09:00:00Z"
    },
    {
        id: "5",
        nome: "Juliana Pereira",
        email: "juliana.pereira@empresa.com",
        cargo: "Contador",
        ativo: true,
        permissoes: ["documentos", "relatorios", "pos"],
        ultimoAcesso: "2023-07-11T10:30:00Z",
        criado: "2023-02-08T13:45:00Z"
    }
];

const UsuariosList = () => {
    const [usuarios, setUsuarios] = useState(usuariosMock);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("_all");
    const [filtroCargo, setFiltroCargo] = useState("_all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    const [novoUsuario, setNovoUsuario] = useState({
        nome: "",
        email: "",
        cargo: "",
        senha: "",
        ativo: true,
        permissoes: [] as string[]
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNovoUsuario((prev) => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (permissao: string) => {
        setNovoUsuario((prev) => {
            const atual = [...prev.permissoes];
            if (atual.includes(permissao)) {
                return { ...prev, permissoes: atual.filter(p => p !== permissao) };
            } else {
                return { ...prev, permissoes: [...atual, permissao] };
            }
        });
    };

    const handleSwitchChange = (checked: boolean) => {
        setNovoUsuario((prev) => ({ ...prev, ativo: checked }));
    };

    const handleSubmit = () => {
        if (!novoUsuario.nome || !novoUsuario.email) {
            toast.error("Preencha os campos obrigatórios");
            return;
        }

        // Aqui iria a lógica de criação do usuário
        toast.success("Usuário salvo com sucesso!");
        setIsDialogOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setNovoUsuario({
            nome: "",
            email: "",
            cargo: "",
            senha: "",
            ativo: true,
            permissoes: []
        });
        setSenhaVisivel(false);
    };

    const filteredUsuarios = usuarios.filter(usuario => {
        const matchesSearch =
            usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.cargo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filtroStatus === "_all"
            ? true
            : filtroStatus === 'ativo'
                ? usuario.ativo
                : filtroStatus === 'inativo'
                    ? !usuario.ativo
                    : true;

        const matchesCargo = filtroCargo === "_all" || !filtroCargo
            ? true
            : usuario.cargo === filtroCargo;

        return matchesSearch && matchesStatus && matchesCargo;
    });

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Usuários</h1>
                        <p className="text-muted-foreground">
                            Gerencie os usuários do sistema
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Novo Usuário
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Novo Usuário</DialogTitle>
                                <DialogDescription>
                                    Preencha os dados do usuário e defina suas permissões no sistema.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <Label htmlFor="nome" className="col-span-4">
                                        Nome Completo *
                                    </Label>
                                    <Input
                                        id="nome"
                                        name="nome"
                                        value={novoUsuario.nome}
                                        onChange={handleInputChange}
                                        className="col-span-4"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <Label htmlFor="email" className="col-span-4">
                                        Email *
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={novoUsuario.email}
                                        onChange={handleInputChange}
                                        className="col-span-4"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <Label htmlFor="cargo" className="col-span-4">
                                        Cargo / Função
                                    </Label>
                                    <Input
                                        id="cargo"
                                        name="cargo"
                                        value={novoUsuario.cargo}
                                        onChange={handleInputChange}
                                        className="col-span-4"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-2">
                                    <Label htmlFor="senha" className="col-span-4">
                                        Senha *
                                    </Label>
                                    <div className="col-span-4 relative">
                                        <Input
                                            id="senha"
                                            name="senha"
                                            type={senhaVisivel ? "text" : "password"}
                                            value={novoUsuario.senha}
                                            onChange={handleInputChange}
                                            className="pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                            onClick={() => setSenhaVisivel(!senhaVisivel)}
                                        >
                                            {senhaVisivel ? (
                                                <EyeOff className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="ativo"
                                        checked={novoUsuario.ativo}
                                        onCheckedChange={handleSwitchChange}
                                    />
                                    <Label htmlFor="ativo">Usuário Ativo</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-medium">Permissões</Label>
                                    <div className="grid grid-cols-2 gap-3 pt-1">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="permissao-documentos"
                                                checked={novoUsuario.permissoes.includes('documentos')}
                                                onCheckedChange={() => handlePermissionChange('documentos')}
                                            />
                                            <label htmlFor="permissao-documentos" className="text-sm">
                                                Documentos
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="permissao-clientes"
                                                checked={novoUsuario.permissoes.includes('clientes')}
                                                onCheckedChange={() => handlePermissionChange('clientes')}
                                            />
                                            <label htmlFor="permissao-clientes" className="text-sm">
                                                Clientes
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="permissao-pos"
                                                checked={novoUsuario.permissoes.includes('pos')}
                                                onCheckedChange={() => handlePermissionChange('pos')}
                                            />
                                            <label htmlFor="permissao-pos" className="text-sm">
                                                Purchase Orders
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="permissao-relatorios"
                                                checked={novoUsuario.permissoes.includes('relatorios')}
                                                onCheckedChange={() => handlePermissionChange('relatorios')}
                                            />
                                            <label htmlFor="permissao-relatorios" className="text-sm">
                                                Relatórios
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="permissao-usuarios"
                                                checked={novoUsuario.permissoes.includes('usuarios')}
                                                onCheckedChange={() => handlePermissionChange('usuarios')}
                                            />
                                            <label htmlFor="permissao-usuarios" className="text-sm">
                                                Usuários
                                            </label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="permissao-configuracoes"
                                                checked={novoUsuario.permissoes.includes('configuracoes')}
                                                onCheckedChange={() => handlePermissionChange('configuracoes')}
                                            />
                                            <label htmlFor="permissao-configuracoes" className="text-sm">
                                                Configurações
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="button" onClick={handleSubmit}>
                                    Salvar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Usuários</CardTitle>
                        <CardDescription>
                            {filteredUsuarios.length} usuários encontrados
                        </CardDescription>
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar usuários..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="_all">Todos</SelectItem>
                                        <SelectItem value="ativo">Ativos</SelectItem>
                                        <SelectItem value="inativo">Inativos</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={filtroCargo} onValueChange={setFiltroCargo}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Todos os cargos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="_all">Todos os cargos</SelectItem>
                                        <SelectItem value="Administrador">Administrador</SelectItem>
                                        <SelectItem value="Gerente Financeiro">Gerente Financeiro</SelectItem>
                                        <SelectItem value="Analista Financeiro">Analista Financeiro</SelectItem>
                                        <SelectItem value="Contador">Contador</SelectItem>
                                        <SelectItem value="Assistente Administrativo">Assistente Administrativo</SelectItem>
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
                        ) : filteredUsuarios.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground">
                                Nenhum usuário encontrado
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Nome</TableHead>
                                            <TableHead className="hidden md:table-cell">Email</TableHead>
                                            <TableHead className="hidden md:table-cell">Cargo</TableHead>
                                            <TableHead className="hidden md:table-cell">Último Acesso</TableHead>
                                            <TableHead>Permissões</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsuarios.map((usuario) => {
                                            const ultimoAcesso = new Date(usuario.ultimoAcesso);
                                            const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }).format(ultimoAcesso);

                                            return (
                                                <TableRow key={usuario.id}>
                                                    <TableCell>
                                                        <div className={`h-2.5 w-2.5 rounded-full ${usuario.ativo ? "bg-success-500" : "bg-gray-400"}`}></div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {usuario.nome}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">{usuario.email}</TableCell>
                                                    <TableCell className="hidden md:table-cell">{usuario.cargo}</TableCell>
                                                    <TableCell className="hidden md:table-cell">{dataFormatada}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {usuario.permissoes.includes('usuarios') && (
                                                                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center" title="Gestão de Usuários">
                                                                    <UserCog className="h-3 w-3 text-purple-600" />
                                                                </div>
                                                            )}
                                                            {usuario.permissoes.includes('configuracoes') && (
                                                                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center" title="Configurações do Sistema">
                                                                    <Shield className="h-3 w-3 text-indigo-600" />
                                                                </div>
                                                            )}
                                                            {usuario.permissoes.includes('documentos') && (
                                                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center" title="Documentos">
                                                                    <FileText className="h-3 w-3 text-blue-600" />
                                                                </div>
                                                            )}
                                                            {usuario.permissoes.length > 3 && (
                                                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center" title={`+${usuario.permissoes.length - 3} permissões`}>
                                                                    <span className="text-[10px] text-gray-600">+{usuario.permissoes.length - 3}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    toast.info("Função de edição não implementada");
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    toast.info("Função de exclusão não implementada");
                                                                }}
                                                            >
                                                                <Trash className="h-4 w-4" />
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

                {/* <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-800 mb-1">Gestão de Permissões</h3>
                                <p className="text-blue-700 mb-2">
                                    O sistema utiliza um modelo de permissões por módulos. Um usuário só pode acessar os módulos para os quais tem permissão específica.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FileText className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <span className="text-sm text-blue-900">Documentos</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <Users className="h-3 w-3 text-green-600" />
                                        </div>
                                        <span className="text-sm text-blue-900">Clientes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                                            <FileCheck className="h-3 w-3 text-amber-600" />
                                        </div>
                                        <span className="text-sm text-blue-900">Purchase Orders</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                            <BarChart3 className="h-3 w-3 text-red-600" />
                                        </div>
                                        <span className="text-sm text-blue-900">Relatórios</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                                            <UserCog className="h-3 w-3 text-purple-600" />
                                        </div>
                                        <span className="text-sm text-blue-900">Usuários</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <Settings className="h-3 w-3 text-indigo-600" />
                                        </div>
                                        <span className="text-sm text-blue-900">Configurações</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card> */}
            </div>
        </AppLayout>
    );
};

export default UsuariosList; 