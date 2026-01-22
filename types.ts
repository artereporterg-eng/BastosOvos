
// Define as interfaces fundamentais para o ecossistema do ERP Quinta dos Ovos

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  username: string;
  password?: string;
  role: string;
  category: string;
  displayName: string;
  createdAt: string;
  permissions: string[];
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  category: string;
  salary: number;
  admissionDate: string;
  contact: string;
  paymentStatus: 'PENDENTE' | 'PAGO';
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

export interface FinancialTransaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'ENTRADA' | 'SAIDA';
  category: string;
  cost?: number;
}

export interface CurrentAccount {
  id: number;
  entityName: string;
  type: 'CLIENTE' | 'FORNECEDOR';
  balance: number;
  status: 'DEVEDOR' | 'CREDOR' | 'LIMPO';
  lastActivity: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
