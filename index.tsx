
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// ==========================================
// 1. DEFINIÇÕES DE TIPOS (TYPES)
// ==========================================
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

// ==========================================
// 2. DADOS INICIAIS (DATA)
// ==========================================
const initialProducts: Product[] = [
  { id: 1, name: "Incubadora Digital Automática", description: "Capacidade para 54 ovos com controle de umidade e viragem automática.", price: 850000.00, category: "Incubação", image: "https://images.unsplash.com/photo-1594488358434-738980327f1c?q=80&w=400&h=400&fit=crop", rating: 4.9, stock: 10, costPrice: 595000.00 },
  { id: 2, name: "Ração Postura Premium 20kg", description: "Balanceada com cálcio e proteínas para máxima produtividade de ovos.", price: 115000.00, category: "Rações", image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=400&h=400&fit=crop", rating: 4.8, stock: 25, costPrice: 80500.00 },
  { id: 3, name: "Bebedouro Automático Nipple", description: "Kit com 10 unidades. Evita desperdício e mantém a água sempre limpa.", price: 89000.00, category: "Equipamentos", image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=400&h=400&fit=crop", rating: 4.7, stock: 15, costPrice: 62300.00 },
  { id: 4, name: "Suplemento Vitamínico Fortalecedor", description: "Complexo A, D3 e E para crescimento saudável de pintinhos.", price: 45000.00, category: "Saúde", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&h=400&fit=crop", rating: 4.6, stock: 40, costPrice: 31500.00 }
];

const SLIDE_IMAGES = [
  { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200", title: "Nossa Fazenda", subtitle: "Tradição e tecnologia no coração de Angola" },
  { url: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1200", title: "Infraestrutura Moderna", subtitle: "Ambientes controlados para máxima qualidade" },
  { url: "https://images.unsplash.com/photo-1582722134903-b1299002897d?q=80&w=1200", title: "Ovos Premium", subtitle: "Frescor garantido da nossa produção" }
];

// ==========================================
// 3. COMPONENTES DE INTERFACE (COMPONENTS)
// ==========================================

const ProductCard: React.FC<{ product: Product, onAddToCart: (p: Product) => void }> = ({ product, onAddToCart }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md group">
    <div className="relative aspect-square overflow-hidden bg-slate-100">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-slate-600 shadow-sm">★ {product.rating}</div>
    </div>
    <div className="p-5">
      <span className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-2 block">{product.category}</span>
      <h3 className="text-lg font-semibold text-slate-800 mb-1 leading-tight group-hover:text-amber-600 transition-colors">{product.name}</h3>
      <p className="text-slate-500 text-sm mb-4 line-clamp-2 h-10">{product.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-slate-900">{product.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz')}</span>
        <button onClick={() => onAddToCart(product)} className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-xl shadow-lg shadow-amber-200 transition-all active:scale-95"><i className="fa-solid fa-cart-plus"></i></button>
      </div>
    </div>
  </div>
);

const CartDrawer: React.FC<{ isOpen: boolean, onClose: () => void, items: CartItem[], onUpdateQuantity: (id: number, d: number) => void, onRemove: (id: number) => void, onCheckout: () => void }> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const formatKz = (v: number) => v.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz');

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[160] transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800"><i className="fa-solid fa-shopping-bag text-amber-600"></i> Seu Pedido</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark text-xl"></i></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4"><i className="fa-solid fa-cart-shopping text-6xl opacity-20"></i><p>Carrinho vazio</p></div>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0"><img src={item.image} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 truncate">{item.name}</h4>
                    <p className="text-sm text-amber-600 font-black mb-1">{formatKz(item.price)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600"><i className="fa-solid fa-minus text-xs"></i></button>
                        <span className="px-3 py-1 text-sm font-medium border-x">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600"><i className="fa-solid fa-plus text-xs"></i></button>
                      </div>
                      <button onClick={() => onRemove(item.id)} className="text-slate-400 hover:text-red-500"><i className="fa-solid fa-trash-can text-sm"></i></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-6 border-t bg-slate-50">
            <div className="flex justify-between items-center mb-6"><span className="text-slate-500 font-medium">Subtotal</span><span className="text-2xl font-bold text-slate-900">{formatKz(total)}</span></div>
            <button disabled={items.length === 0} onClick={onCheckout} className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-200 transition-all active:scale-[0.98]">Finalizar Pedido</button>
          </div>
        </div>
      </div>
    </>
  );
};

const Toast: React.FC<{ message: string, isVisible: boolean, onClose: () => void }> = ({ message, isVisible, onClose }) => {
  useEffect(() => { if (isVisible) { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); } }, [isVisible, onClose]);
  return (
    <div className={`fixed bottom-10 right-10 z-[300] transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"><i className="fa-solid fa-check text-[10px]"></i></div>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

const LoginModal: React.FC<{ isOpen: boolean, onClose: () => void, onLogin: (u: string, p: string) => void }> = ({ isOpen, onClose, onLogin }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-slate-900 p-8 text-white text-center">
          <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><i className="fa-solid fa-lock text-2xl"></i></div>
          <h2 className="text-2xl font-bold uppercase tracking-tighter">Acesso Restrito</h2>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(u, p); }} className="p-8 space-y-4">
          <input type="text" placeholder="Usuário" value={u} onChange={e => setU(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-amber-500" required />
          <input type="password" placeholder="Senha" value={p} onChange={e => setP(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-amber-500" required />
          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-amber-600 transition-all">Entrar</button>
          <button type="button" onClick={onClose} className="w-full text-slate-400 text-xs font-bold uppercase">Cancelar</button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 4. PAINEL ADMINISTRATIVO (ADMIN PANEL)
// ==========================================
const AdminPanel: React.FC<{ 
  currentUser: User, products: Product[], employees: Employee[], transactions: FinancialTransaction[], 
  onAddProduct: () => void, onEditProduct: (p: Product) => void, onDeleteProduct: (id: number) => void,
  onAddEmployee: () => void, onEditEmployee: (e: Employee) => void, onDeleteEmployee: (id: number) => void,
  onPaySalary: (id: number) => void, onLogout: () => void, onLocalCheckout: (cart: CartItem[]) => void
}> = ({ 
  currentUser, products, employees, transactions, onAddProduct, onEditProduct, onDeleteProduct,
  onAddEmployee, onEditEmployee, onDeleteEmployee, onPaySalary, onLogout, onLocalCheckout
}) => {
  const [tab, setTab] = useState('dashboard');
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const formatKz = (v: number) => v.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz');

  const menu = [
    { id: 'dashboard', label: 'Painel', icon: 'fa-gauge' },
    { id: 'caixa', label: 'Caixa (POS)', icon: 'fa-cash-register' },
    { id: 'stock', label: 'Stock', icon: 'fa-boxes-stacked' },
    { id: 'rh', label: 'RH', icon: 'fa-users' },
    { id: 'finance', label: 'Financeiro', icon: 'fa-wallet' }
  ];

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 min-h-[600px] flex flex-col md:flex-row overflow-hidden">
      <aside className="w-full md:w-64 bg-slate-50 border-r p-6 flex flex-col no-print">
        <div className="mb-8"><p className="text-[10px] font-black uppercase text-slate-400">Usuário</p><p className="font-bold text-sm truncate">{currentUser.displayName}</p></div>
        <nav className="flex-1 space-y-1">
          {menu.map(m => (
            <button key={m.id} onClick={() => setTab(m.id)} className={`w-full flex items-center gap-3 p-4 rounded-xl text-xs font-bold transition-all ${tab === m.id ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-white hover:text-amber-600'}`}>
              <i className={`fa-solid ${m.icon}`}></i> {m.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-8 p-4 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl"><i className="fa-solid fa-right-from-bracket mr-2"></i> Sair</button>
      </aside>

      <main className="flex-1 p-8">
        {tab === 'dashboard' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Resumo Geral</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-900 text-white rounded-3xl">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Produtos</p>
                <p className="text-3xl font-black">{products.length}</p>
              </div>
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl text-amber-900">
                <p className="text-[10px] font-black uppercase text-amber-600 mb-1">Funcionários</p>
                <p className="text-3xl font-black">{employees.length}</p>
              </div>
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-emerald-900">
                <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Transações</p>
                <p className="text-3xl font-black">{transactions.length}</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'caixa' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="space-y-4">
              <h3 className="font-black uppercase text-xs">Produtos</h3>
              <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {products.map(p => (
                  <button key={p.id} onClick={() => setPosCart(prev => {
                    const ex = prev.find(i => i.id === p.id);
                    if(ex) return prev.map(i => i.id === p.id ? {...i, quantity: i.quantity+1} : i);
                    return [...prev, {...p, quantity: 1}];
                  })} className="p-4 bg-slate-50 rounded-2xl border hover:border-amber-400 transition-all text-left">
                    <p className="font-bold text-xs truncate">{p.name}</p>
                    <p className="text-xs font-black text-amber-600">{formatKz(p.price)}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col">
              <h3 className="font-black uppercase text-[10px] mb-4">Venda Atual</h3>
              <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
                {posCart.map(i => (
                  <div key={i.id} className="flex justify-between text-[10px]">
                    <span className="truncate flex-1">{i.name}</span>
                    <span className="font-black text-amber-500 ml-2">x{i.quantity}</span>
                    <button onClick={() => setPosCart(p => p.filter(x => x.id !== i.id))} className="ml-2 text-slate-500"><i className="fa-solid fa-trash"></i></button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="flex justify-between font-black text-lg"><span>Total</span><span className="text-amber-500">{formatKz(posCart.reduce((a,b)=>a+(b.price*b.quantity),0))}</span></p>
                <button onClick={() => { onLocalCheckout(posCart); setPosCart([]); }} className="w-full bg-amber-600 mt-4 py-3 rounded-xl font-black uppercase tracking-widest">Fechar Venda</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'stock' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center"><h3 className="font-black uppercase">Inventário</h3><button onClick={onAddProduct} className="bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase">Novo Produto</button></div>
            <div className="overflow-x-auto"><table className="w-full text-xs text-left"><thead className="bg-slate-50 uppercase text-slate-400"><tr><th className="p-4">Produto</th><th className="p-4">Stock</th><th className="p-4">Preço</th><th className="p-4 text-right">Ações</th></tr></thead><tbody>{products.map(p => (<tr key={p.id} className="border-b"><td className="p-4 font-bold">{p.name}</td><td className="p-4"><span className={`px-2 py-0.5 rounded ${p.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'}`}>{p.stock} UN</span></td><td className="p-4 font-black text-amber-600">{formatKz(p.price)}</td><td className="p-4 text-right"><button onClick={() => onEditProduct(p)} className="text-slate-400 hover:text-amber-600 mr-2"><i className="fa-solid fa-pen"></i></button><button onClick={() => onDeleteProduct(p.id)} className="text-slate-400 hover:text-red-500"><i className="fa-solid fa-trash"></i></button></td></tr>))}</tbody></table></div>
          </div>
        )}

        {tab === 'rh' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center"><h3 className="font-black uppercase">Funcionários</h3><button onClick={onAddEmployee} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase">Novo Contrato</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map(e => (
                <div key={e.id} className="p-4 bg-slate-50 border rounded-2xl flex justify-between items-center">
                  <div><p className="font-black text-sm">{e.name}</p><p className="text-[10px] text-amber-600 font-bold uppercase">{e.role}</p></div>
                  <div className="flex gap-2">
                    <button onClick={() => onPaySalary(e.id)} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${e.paymentStatus === 'PAGO' ? 'bg-slate-200 text-slate-500' : 'bg-emerald-500 text-white'}`}>{e.paymentStatus === 'PAGO' ? 'Pago' : 'Pagar'}</button>
                    <button onClick={() => onEditEmployee(e)} className="p-2 text-slate-400"><i className="fa-solid fa-pen"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'finance' && (
          <div className="animate-fade-in space-y-6">
            <h3 className="font-black uppercase">Fluxo Financeiro</h3>
            <div className="overflow-x-auto"><table className="w-full text-xs text-left"><thead className="bg-slate-50 text-slate-400 uppercase"><tr><th className="p-4">Data</th><th className="p-4">Descrição</th><th className="p-4 text-right">Valor</th></tr></thead><tbody>{transactions.slice().reverse().map(t => (<tr key={t.id} className="border-b"><td className="p-4 text-slate-400">{t.date}</td><td className="p-4 font-bold">{t.description}</td><td className={`p-4 text-right font-black ${t.type === 'ENTRADA' ? 'text-emerald-600' : 'text-red-600'}`}>{formatKz(t.amount)}</td></tr>))}</tbody></table></div>
          </div>
        )}
      </main>
    </div>
  );
};

// ==========================================
// 5. APLICAÇÃO PRINCIPAL (APP)
// ==========================================

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('quintadosovos_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    localStorage.setItem('quintadosovos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % SLIDE_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => { setToastMsg(msg); setIsToastVisible(true); };

  const handleLocalCheckout = (items: CartItem[]) => {
    if(items.length === 0) return;
    const total = items.reduce((a,b) => a + (b.price * b.quantity), 0);
    setTransactions(prev => [...prev, { id: Date.now(), date: new Date().toLocaleDateString(), description: 'Venda POS', amount: total, type: 'ENTRADA', category: 'Vendas' }]);
    setProducts(prev => prev.map(p => {
      const ci = items.find(x => x.id === p.id);
      return ci ? { ...p, stock: p.stock - ci.quantity } : p;
    }));
    showToast("Venda processada!");
  };

  const handleStoreCheckout = () => {
    handleLocalCheckout(cart);
    setCart([]);
    setIsCartOpen(false);
    showToast("Pedido Finalizado!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-amber-100 no-print">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('store')}>
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white"><i className="fa-solid fa-egg"></i></div>
            <h1 className="text-xl font-black text-slate-900 leading-none">Quinta<span className="text-amber-600 block text-[10px] tracking-widest uppercase">dosOvos</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-slate-100 rounded-xl hover:text-amber-600 transition-all">
              <i className="fa-solid fa-cart-shopping"></i>
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">{cart.reduce((a,b)=>a+b.quantity,0)}</span>}
            </button>
            {isLoggedIn ? (
              <button onClick={() => setView(view === 'store' ? 'admin' : 'store')} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">{view === 'admin' ? 'Ver Loja' : 'Painel ERP'}</button>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Acesso Gestor</button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {view === 'admin' && currentUser ? (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <AdminPanel 
              currentUser={currentUser} products={products} employees={employees} transactions={transactions}
              onAddProduct={() => {}} onEditProduct={() => {}} onDeleteProduct={() => {}}
              onAddEmployee={() => {}} onEditEmployee={() => {}} onDeleteEmployee={() => {}}
              onPaySalary={(id) => {
                setEmployees(prev => prev.map(e => e.id === id ? {...e, paymentStatus: 'PAGO'} : e));
                showToast("Pagamento realizado!");
              }}
              onLogout={() => { setIsLoggedIn(false); setView('store'); }}
              onLocalCheckout={handleLocalCheckout}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Slideshow */}
            <section className="relative h-[60vh] overflow-hidden bg-slate-900">
              {SLIDE_IMAGES.map((s, i) => (
                <div key={i} className={`absolute inset-0 transition-all duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                  <img src={s.url} className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">{s.title}</h2>
                    <p className="text-lg text-amber-400 font-bold">{s.subtitle}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Produtos */}
            <section className="py-20 max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 text-center">Nossos Insumos & Equipamentos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={(p) => {
                    setCart(prev => {
                      const ex = prev.find(i => i.id === p.id);
                      if(ex) return prev.map(i => i.id === p.id ? {...i, quantity: i.quantity+1} : i);
                      return [...prev, {...p, quantity: 1}];
                    });
                    showToast(`${p.name} adicionado!`);
                  }} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 py-12 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">&copy; 2024 Quinta dos Ovos • Angola • ERP Consolidado</p>
        </div>
      </footer>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={(id, d) => setCart(p => p.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity+d)} : i))} onRemove={(id) => setCart(p => p.filter(i => i.id !== id))} onCheckout={handleStoreCheckout} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={(u, p) => {
        if(u === 'admin' && p === '123') {
          setIsLoggedIn(true);
          setCurrentUser({ id: 1, username: 'admin', displayName: 'Administrador Principal', role: 'admin', permissions: ['dashboard', 'caixa', 'stock', 'rh', 'finance'], createdAt: '' });
          setIsLoginModalOpen(false);
          setView('admin');
          showToast("Bem-vindo de volta!");
        } else {
          alert("Credenciais inválidas");
        }
      }} />
      <Toast message={toastMsg} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
    </div>
  );
};

// Renderização Final
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
