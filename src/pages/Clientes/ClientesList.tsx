
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
import { Cliente } from "@/types";
import { dataService } from "@/services/dataService";
import { Plus, Search, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ClientesList = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCliente, setNewCliente] = useState<Partial<Cliente>>({
    razaoSocial: "",
    nomeFantasia: "",
    grupoEconomico: "",
    ativo: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClienteId, setCurrentClienteId] = useState<string | null>(null);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const data = await dataService.clientes.getAll();
      setClientes(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewCliente((prev) => ({ ...prev, ativo: checked }));
  };

  const resetForm = () => {
    setNewCliente({
      razaoSocial: "",
      nomeFantasia: "",
      grupoEconomico: "",
      ativo: true,
    });
    setIsEditing(false);
    setCurrentClienteId(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCliente.razaoSocial || !newCliente.nomeFantasia) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      if (isEditing && currentClienteId) {
        await dataService.clientes.update(currentClienteId, newCliente);
        toast.success("Cliente atualizado com sucesso");
      } else {
        await dataService.clientes.create(newCliente as Omit<Cliente, "id" | "createdAt" | "updatedAt">);
        toast.success("Cliente criado com sucesso");
      }
      
      handleDialogClose();
      fetchClientes();
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast.error("Erro ao salvar cliente");
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setIsEditing(true);
    setCurrentClienteId(cliente.id);
    setNewCliente({
      razaoSocial: cliente.razaoSocial,
      nomeFantasia: cliente.nomeFantasia,
      grupoEconomico: cliente.grupoEconomico,
      ativo: cliente.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await dataService.clientes.delete(id);
        toast.success("Cliente excluído com sucesso");
        fetchClientes();
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        toast.error("Erro ao excluir cliente");
      }
    }
  };

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.grupoEconomico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout requiredPermission="documents">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie os clientes cadastrados no sistema
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Editar Cliente" : "Novo Cliente"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do cliente abaixo.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="razaoSocial" className="col-span-4">
                      Razão Social *
                    </Label>
                    <Input
                      id="razaoSocial"
                      name="razaoSocial"
                      value={newCliente.razaoSocial}
                      onChange={handleInputChange}
                      className="col-span-4"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="nomeFantasia" className="col-span-4">
                      Nome Fantasia *
                    </Label>
                    <Input
                      id="nomeFantasia"
                      name="nomeFantasia"
                      value={newCliente.nomeFantasia}
                      onChange={handleInputChange}
                      className="col-span-4"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Label htmlFor="grupoEconomico" className="col-span-4">
                      Grupo Econômico
                    </Label>
                    <Input
                      id="grupoEconomico"
                      name="grupoEconomico"
                      value={newCliente.grupoEconomico}
                      onChange={handleInputChange}
                      className="col-span-4"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="ativo"
                      checked={newCliente.ativo}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="ativo">Ativo</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              {filteredClientes.length} clientes encontrados
            </CardDescription>
            <div className="mt-2 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredClientes.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Nenhum cliente encontrado
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Nome Fantasia</TableHead>
                      <TableHead className="hidden md:table-cell">Razão Social</TableHead>
                      <TableHead className="hidden md:table-cell">Grupo Econômico</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell>
                          <div className={`h-2.5 w-2.5 rounded-full ${cliente.ativo ? "bg-success-500" : "bg-gray-400"}`}></div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {cliente.nomeFantasia}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{cliente.razaoSocial}</TableCell>
                        <TableCell className="hidden md:table-cell">{cliente.grupoEconomico || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(cliente)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(cliente.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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

export default ClientesList;
