
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
  costPrice: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  username: string;
  password?: string;
  role: 'admin' | 'staff';
  category?: string;
  displayName: string;
  createdAt: string;
  permissions: string[]; // Lista de slugs das abas permitidas (ex: 'dashboard', 'stock')
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
  cost?: number;
}

export interface CurrentAccount {
  id: number;
  entityName: string;
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
