
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
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
