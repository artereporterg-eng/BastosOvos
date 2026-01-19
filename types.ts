
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
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
  photo?: string;
  idCardDoc?: string;
  cvDoc?: string;
}
