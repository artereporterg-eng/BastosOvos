
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
  costPrice: number; // Adicionado para cálculo de lucro
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  category: string;
  salary: number;
  admissionDate: string;
  contact: string;
  lastPaymentDate?: string;
  paymentStatus?: 'PAGO' | 'PENDENTE';
  photo?: string;
  idCardDoc?: string;
  cvDoc?: string;
}

export interface Invoice {
  id: number;
  date: string;
  items: CartItem[];
  total: number;
}

export type TransactionType = 'ENTRADA' | 'SAIDA';

export interface FinancialTransaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  cost?: number; // Custo total associado à transação (ex: Custo das Mercadorias Vendidas)
}

export interface CurrentAccount {
  id: number;
  entityName: string; // Nome do Cliente ou Fornecedor
  type: 'CLIENTE' | 'FORNECEDOR';
  balance: number;
  status: 'LIMPO' | 'DEVEDOR' | 'CREDOR';
  lastActivity: string;
}

// Added ChatMessage interface to fix import error in AIAssistant.tsx
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
