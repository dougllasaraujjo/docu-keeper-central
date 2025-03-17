
export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "viewer";
  permissions: {
    documents: boolean;
    purchaseOrders: boolean;
    users: boolean;
  };
};

export type Cliente = {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  grupoEconomico: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Documento = {
  id: string;
  clienteId: string;
  ativo: boolean;
  nomeProjeto: string;
  escopo: string;
  propostas: string[]; // URLs para os arquivos
  tipoFormalizacao: "Contrato" | "Email" | "PO";
  statusContrato?: "Assinado" | "Em Troca de Minutas";
  renovacaoAutomatica?: boolean;
  precisaPO?: boolean;
  infoPO?: string;
  anexos: string[]; // URLs para os arquivos
  minutas: string[]; // URLs para os arquivos
  tipo: "Projeto" | "Ongoing";
  valor: number;
  valorTipo: "Mensal" | "Total";
  dataInicio: Date;
  dataFim: Date;
  condicaoFaturamento: string;
  prazoPagamento: string;
  referenciaAnterior: boolean;
  documentoAnteriorId?: string;
  
  // Cláusulas relevantes
  multas: boolean;
  multasInfo?: string;
  multasAnexo?: string;
  
  regraCancelamento: boolean;
  regraCancelamentoInfo?: string;
  regraCancelamentoAnexo?: string;
  
  garantia: boolean;
  garantiaInfo?: string;
  garantiaAnexo?: string;
  
  proibirContratacao: boolean;
  proibirContratacaoInfo?: string;
  proibirContratacaoAnexo?: string;
  
  limiteResponsabilidade: boolean;
  limiteResponsabilidadeInfo?: string;
  limiteResponsabilidadeAnexo?: string;
  
  repasseFormalizado: boolean;
  repasseFormalizadoInfo?: string;
  repasseFormalizadoAnexo?: string;
  
  usoMarca: boolean;
  usoMarcaInfo?: string;
  usoMarcaAnexo?: string;
  
  exclusividade: boolean;
  exclusividadeInfo?: string;
  exclusividadeAnexo?: string;
  
  // Orientações NF
  destinatarioNome: string;
  destinatarioEmail: string;
  destinatarioInfo?: string;
  assuntoEmailEspecifico: boolean;
  assuntoEmailInfo?: string;
  corpoEmailEspecifico: boolean;
  corpoEmailInfo?: string;
  restricaoDataNF: boolean;
  restricaoDataNFInfo?: string;
  
  createdAt: Date;
  updatedAt: Date;
};

export type PurchaseOrder = {
  id: string;
  clienteId: string;
  documentoId: string;
  numeroPO: string;
  valor: number;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  
  // Orientações NF (podem ser diferentes do contrato)
  destinatarioNome: string;
  destinatarioEmail: string;
  destinatarioInfo?: string;
  assuntoEmailEspecifico: boolean;
  assuntoEmailInfo?: string;
  corpoEmailEspecifico: boolean;
  corpoEmailInfo?: string;
  restricaoDataNF: boolean;
  restricaoDataNFInfo?: string;
  
  createdAt: Date;
  updatedAt: Date;
};

export type Faturamento = {
  id: string;
  purchaseOrderId: string;
  dataNF: Date;
  numeroNF: string;
  valorServico: number;
  valorRepasse: number;
  mesCompetencia: Date; // Apenas mês e ano
  descricao: string;
  createdAt: Date;
  updatedAt: Date;
};
