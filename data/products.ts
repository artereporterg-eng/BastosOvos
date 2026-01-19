
import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: "Incubadora Digital Automática",
    description: "Capacidade para 54 ovos com controle de umidade e viragem automática.",
    price: 850000.00,
    category: "Incubação",
    image: "https://images.unsplash.com/photo-1594488358434-738980327f1c?q=80&w=400&h=400&fit=crop",
    rating: 4.9,
    stock: 10,
    // Fix: Added costPrice to satisfy Product interface requirement
    costPrice: 595000.00
  },
  {
    id: 2,
    name: "Ração Postura Premium 20kg",
    description: "Balanceada com cálcio e proteínas para máxima produtividade de ovos.",
    price: 115000.00,
    category: "Rações",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=400&h=400&fit=crop",
    rating: 4.8,
    stock: 25,
    // Fix: Added costPrice to satisfy Product interface requirement
    costPrice: 80500.00
  },
  {
    id: 3,
    name: "Bebedouro Automático Nipple",
    description: "Kit com 10 unidades. Evita desperdício e mantém a água sempre limpa.",
    price: 89000.00,
    category: "Equipamentos",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=400&h=400&fit=crop",
    rating: 4.7,
    stock: 15,
    // Fix: Added costPrice to satisfy Product interface requirement
    costPrice: 62300.00
  },
  {
    id: 4,
    name: "Suplemento Vitamínico Fortalecedor",
    description: "Complexo A, D3 e E para crescimento saudável de pintinhos.",
    price: 45000.00,
    category: "Saúde",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&h=400&fit=crop",
    rating: 4.6,
    stock: 40,
    // Fix: Added costPrice to satisfy Product interface requirement
    costPrice: 31500.00
  },
  {
    id: 5,
    name: "Comedouro Tubular 15kg",
    description: "Chapa galvanizada anti-ferrugem com regulagem de altura.",
    price: 129000.00,
    category: "Equipamentos",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=400&h=400&fit=crop",
    rating: 4.5,
    stock: 12,
    // Fix: Added costPrice to satisfy Product interface requirement
    costPrice: 90300.00
  },
  {
    id: 6,
    name: "Lâmpada de Aquecimento Cerâmica",
    description: "100W de potência. Emite calor sem luz, ideal para o descanso das aves.",
    price: 64000.00,
    category: "Acessórios",
    image: "https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?q=80&w=400&h=400&fit=crop",
    rating: 4.8,
    stock: 20,
    // Fix: Added costPrice to satisfy Product interface requirement
    costPrice: 44800.00
  },
  {
    id: 7,
    name: "Ninho Coletivo Galvanizado",
    description: "6 furos com fundo inclinado para coleta segura de ovos.",
    price: 420000.00,
    category: "Equipamentos",
    image: "https://images.unsplash.com/photo-1569254994521-ddb43af0a944?q=80&w=400&h=400&fit=crop",
    rating: 4.4,
    stock: 5,
    // Fix: Added costPrice to satisfy Product interface requirement
    costPrice: 294000.00
  },
  {
    id: 8,
    name: "Termômetro Higrômetro Digital",
    description: "Sensor externo para monitoramento preciso de granjas e chocadeiras.",
    price: 38000.00,
    category: "Acessórios",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400&h=400&fit=crop",
    rating: 4.7,
    stock: 35,
    // Fix: Added costPrice to satisfy Product interface requirement
    costPrice: 26600.00
  }
];
