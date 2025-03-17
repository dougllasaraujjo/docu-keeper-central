
import { Cliente, Documento, PurchaseOrder, Faturamento } from "@/types";

// Simulando um banco de dados em memória
let clientes: Cliente[] = [];
let documentos: Documento[] = [];
let purchaseOrders: PurchaseOrder[] = [];
let faturamentos: Faturamento[] = [];

// Gerar IDs únicos
const generateId = () => Math.random().toString(36).substring(2, 9);

// Serviço de Clientes
export const clienteService = {
  getAll: async (): Promise<Cliente[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...clientes];
  },

  getById: async (id: string): Promise<Cliente | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return clientes.find(cliente => cliente.id === id);
  },

  create: async (cliente: Omit<Cliente, "id" | "createdAt" | "updatedAt">): Promise<Cliente> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCliente: Cliente = {
      ...cliente,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    clientes.push(newCliente);
    return newCliente;
  },

  update: async (id: string, cliente: Partial<Cliente>): Promise<Cliente | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = clientes.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    clientes[index] = { 
      ...clientes[index], 
      ...cliente, 
      updatedAt: new Date() 
    };
    return clientes[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const initialLength = clientes.length;
    clientes = clientes.filter(c => c.id !== id);
    return clientes.length !== initialLength;
  }
};

// Serviço de Documentos
export const documentoService = {
  getAll: async (): Promise<Documento[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...documentos];
  },

  getByClienteId: async (clienteId: string): Promise<Documento[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return documentos.filter(doc => doc.clienteId === clienteId);
  },

  getById: async (id: string): Promise<Documento | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return documentos.find(doc => doc.id === id);
  },

  create: async (documento: Omit<Documento, "id" | "createdAt" | "updatedAt">): Promise<Documento> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newDocumento: Documento = {
      ...documento,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    documentos.push(newDocumento);
    return newDocumento;
  },

  update: async (id: string, documento: Partial<Documento>): Promise<Documento | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = documentos.findIndex(d => d.id === id);
    if (index === -1) return undefined;
    
    documentos[index] = { 
      ...documentos[index], 
      ...documento, 
      updatedAt: new Date() 
    };
    return documentos[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const initialLength = documentos.length;
    documentos = documentos.filter(d => d.id !== id);
    return documentos.length !== initialLength;
  }
};

// Serviço de Purchase Orders
export const poService = {
  getAll: async (): Promise<PurchaseOrder[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...purchaseOrders];
  },

  getByClienteId: async (clienteId: string): Promise<PurchaseOrder[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return purchaseOrders.filter(po => po.clienteId === clienteId);
  },

  getByDocumentoId: async (documentoId: string): Promise<PurchaseOrder[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return purchaseOrders.filter(po => po.documentoId === documentoId);
  },

  getById: async (id: string): Promise<PurchaseOrder | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return purchaseOrders.find(po => po.id === id);
  },

  create: async (po: Omit<PurchaseOrder, "id" | "createdAt" | "updatedAt">): Promise<PurchaseOrder> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPO: PurchaseOrder = {
      ...po,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    purchaseOrders.push(newPO);
    return newPO;
  },

  update: async (id: string, po: Partial<PurchaseOrder>): Promise<PurchaseOrder | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = purchaseOrders.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    purchaseOrders[index] = { 
      ...purchaseOrders[index], 
      ...po, 
      updatedAt: new Date() 
    };
    return purchaseOrders[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const initialLength = purchaseOrders.length;
    purchaseOrders = purchaseOrders.filter(p => p.id !== id);
    return purchaseOrders.length !== initialLength;
  }
};

// Serviço de Faturamentos
export const faturamentoService = {
  getAll: async (): Promise<Faturamento[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...faturamentos];
  },

  getByPoId: async (poId: string): Promise<Faturamento[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return faturamentos.filter(fat => fat.purchaseOrderId === poId);
  },

  getById: async (id: string): Promise<Faturamento | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return faturamentos.find(fat => fat.id === id);
  },

  create: async (faturamento: Omit<Faturamento, "id" | "createdAt" | "updatedAt">): Promise<Faturamento> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newFaturamento: Faturamento = {
      ...faturamento,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    faturamentos.push(newFaturamento);
    return newFaturamento;
  },

  update: async (id: string, faturamento: Partial<Faturamento>): Promise<Faturamento | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = faturamentos.findIndex(f => f.id === id);
    if (index === -1) return undefined;
    
    faturamentos[index] = { 
      ...faturamentos[index], 
      ...faturamento, 
      updatedAt: new Date() 
    };
    return faturamentos[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const initialLength = faturamentos.length;
    faturamentos = faturamentos.filter(f => f.id !== id);
    return faturamentos.length !== initialLength;
  },

  // Cálculo de saldo de PO
  calcularSaldoPO: async (poId: string): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const po = await poService.getById(poId);
    if (!po) return 0;
    
    const faturasDaPO = await faturamentoService.getByPoId(poId);
    const valorTotal = faturasDaPO.reduce((sum, fat) => sum + fat.valorServico + fat.valorRepasse, 0);
    
    return po.valor - valorTotal;
  }
};

// Adiciona alguns dados de exemplo
const initializeData = () => {
  // Clientes de exemplo
  const clienteExemplo: Cliente = {
    id: "cl1",
    razaoSocial: "Empresa Exemplo Ltda",
    nomeFantasia: "Exemplo Corp",
    grupoEconomico: "Grupo Exemplo",
    ativo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  clientes.push(clienteExemplo);
  
  // Documento de exemplo
  const documentoExemplo: Documento = {
    id: "doc1",
    clienteId: "cl1",
    ativo: true,
    nomeProjeto: "Projeto Website",
    escopo: "Desenvolvimento de website corporativo",
    propostas: [],
    tipoFormalizacao: "Contrato",
    statusContrato: "Assinado",
    renovacaoAutomatica: true,
    precisaPO: true,
    infoPO: "PO mensal para cada etapa",
    anexos: [],
    minutas: [],
    tipo: "Ongoing",
    valor: 10000,
    valorTipo: "Mensal",
    dataInicio: new Date("2023-01-01"),
    dataFim: new Date("2023-12-31"),
    condicaoFaturamento: "Mensal, até o dia 5",
    prazoPagamento: "30 dias",
    referenciaAnterior: false,
    multas: true,
    multasInfo: "2% ao mês + mora diária",
    regraCancelamento: true,
    regraCancelamentoInfo: "Aviso prévio de 60 dias",
    garantia: false,
    proibirContratacao: true,
    proibirContratacaoInfo: "Por 12 meses após o término",
    limiteResponsabilidade: true,
    limiteResponsabilidadeInfo: "Limitado ao valor do contrato",
    repasseFormalizado: false,
    usoMarca: true,
    usoMarcaInfo: "Permitido em portfólio",
    exclusividade: false,
    destinatarioNome: "Financeiro",
    destinatarioEmail: "financeiro@exemplo.com",
    destinatarioInfo: "Depto Fiscal",
    assuntoEmailEspecifico: true,
    assuntoEmailInfo: "NF - Projeto Website - Mês X",
    corpoEmailEspecifico: false,
    restricaoDataNF: true,
    restricaoDataNFInfo: "Apenas entre os dias 1 e 5",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  documentos.push(documentoExemplo);
  
  // PO de exemplo
  const poExemplo: PurchaseOrder = {
    id: "po1",
    clienteId: "cl1",
    documentoId: "doc1",
    numeroPO: "PO-2023-001",
    valor: 30000,
    descricao: "PO para três meses de desenvolvimento",
    dataInicio: new Date("2023-01-01"),
    dataFim: new Date("2023-03-31"),
    destinatarioNome: "Financeiro",
    destinatarioEmail: "financeiro@exemplo.com",
    destinatarioInfo: "Depto Fiscal",
    assuntoEmailEspecifico: true,
    assuntoEmailInfo: "NF - Projeto Website - Mês X - PO-2023-001",
    corpoEmailEspecifico: false,
    restricaoDataNF: true,
    restricaoDataNFInfo: "Apenas entre os dias 1 e 5",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  purchaseOrders.push(poExemplo);
  
  // Faturamento de exemplo
  const faturamentoExemplo: Faturamento = {
    id: "fat1",
    purchaseOrderId: "po1",
    dataNF: new Date("2023-01-05"),
    numeroNF: "NF-1001",
    valorServico: 8000,
    valorRepasse: 2000,
    mesCompetencia: new Date("2023-01-01"),
    descricao: "Serviços de desenvolvimento - Janeiro/2023",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  faturamentos.push(faturamentoExemplo);
};

// Inicializa os dados de exemplo
initializeData();

// Exporta um objeto com todos os serviços
export const dataService = {
  clientes: clienteService,
  documentos: documentoService,
  purchaseOrders: poService,
  faturamentos: faturamentoService
};
