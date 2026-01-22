
import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import Toast from './components/Toast';
import LoginModal from './components/LoginModal';
import InvoiceModal from './components/InvoiceModal';
import ProductModal from './components/ProductModal';
import EmployeeModal from './components/EmployeeModal';
import UserModal from './components/UserModal';
import AccountModal from './components/AccountModal';
import AIAssistant from './components/AIAssistant';
import { products as initialProducts } from './data/products';
import { Product, CartItem, User, Employee, Invoice, FinancialTransaction, CurrentAccount } from './types';

const SLIDE_IMAGES = [
  { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200", title: "Nossa Fazenda", subtitle: "Tradição e tecnologia no coração de Angola" },
  { url: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1200", title: "Infraestrutura Moderna", subtitle: "Ambientes controlados para máxima qualidade" },
  { url: "https://images.unsplash.com/photo-1594488358434-738980327f1c?q=80&w=1200", title: "Processamento Rigoroso", subtitle: "Higiene e segurança em cada etapa" },
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('quintadosovos_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('quintadosovos_employees');
    return saved ? JSON.parse(saved) : [
        { id: 1, name: "Carlos Silva", role: "Técnico de Campo", category: "Produção", salary: 280000.00, admissionDate: "2023-01-15", contact: "923 000 001", paymentStatus: 'PENDENTE' },
        { id: 2, name: "Ana Oliveira", role: "Gerente Financeira", category: "Gestão", salary: 450000.00, admissionDate: "2022-11-20", contact: "923 000 002", paymentStatus: 'PENDENTE' }
    ];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('quintadosovos_users');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        username: 'admin', 
        password: '123', 
        role: 'admin', 
        category: 'Super Admin', 
        displayName: 'Administrador Principal', 
        createdAt: '2023-01-01',
        permissions: ['dashboard', 'caixa', 'stock', 'rh', 'users', 'finance', 'accounts', 'categories']
      }
    ];
  });

  const [productCategories, setProductCategories] = useState<string[]>(['Rações', 'Equipamentos', 'Incubação', 'Saúde', 'Acessórios']);
  const [empCategories, setEmpCategories] = useState<string[]>(['Produção', 'Gestão', 'Logística', 'Comercial']);
  const [adminCategories, setAdminCategories] = useState<string[]>(['Super Admin', 'Gerência', 'Operador', 'Financeiro']);

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('quintadosovos_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentAccounts, setCurrentAccounts] = useState<CurrentAccount[]>(() => {
    const saved = localStorage.getItem('quintadosovos_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Estados de Edição
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('quintadosovos_products', JSON.stringify(products));
    localStorage.setItem('quintadosovos_employees', JSON.stringify(employees));
    localStorage.setItem('quintadosovos_users', JSON.stringify(users));
    localStorage.setItem('quintadosovos_transactions', JSON.stringify(transactions));
    localStorage.setItem('quintadosovos_accounts', JSON.stringify(currentAccounts));
  }, [products, employees, users, transactions, currentAccounts]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % SLIDE_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const allCategories = useMemo(() => ['Todos', ...productCategories], [productCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => selectedCategory === 'Todos' || p.category === selectedCategory);
  }, [selectedCategory, products]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const handleCheckout = (customCart?: CartItem[]) => {
    const itemsToProcess = customCart || cart;
    if (itemsToProcess.length === 0) return;
    const total = itemsToProcess.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const invoice: Invoice = { id: Math.floor(10000 + Math.random() * 90000), date: new Date().toLocaleString('pt-AO'), items: [...itemsToProcess], total };
    
    setTransactions(prev => [...prev, { id: Date.now(), date: new Date().toISOString().split('T')[0], description: customCart ? `Venda POS` : `Venda Online`, amount: total, type: 'ENTRADA', category: 'Vendas' }]);
    
    setProducts(prev => prev.map(p => { 
      const cartItem = itemsToProcess.find(ci => ci.id === p.id); 
      if (cartItem) return { ...p, stock: p.stock - cartItem.quantity }; 
      return p; 
    }));

    setCurrentInvoice(invoice);
    setIsInvoiceOpen(true);
    if (!customCart) { setCart([]); setIsCartOpen(false); }
    showToast("Venda processada com sucesso!");
  };

  const handleLogin = (user: string, pass: string) => {
    const foundUser = users.find(u => u.username === user && u.password === pass);
    if (foundUser) {
      setIsLoggedIn(true);
      setCurrentUser(foundUser);
      setIsLoginModalOpen(false);
      setView('admin');
      showToast(`Bem-vindo, ${foundUser.displayName}!`);
    } else {
      throw new Error("Credenciais Inválidas");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-amber-100 no-print">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('store')}>
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white">
              <i className="fa-solid fa-egg text-xl"></i>
            </div>
            <h1 className="text-xl font-black text-slate-900 leading-none">
              Quinta<span className="text-amber-600 block text-[10px] tracking-widest uppercase">dosOvos</span>
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <button onClick={() => scrollToSection('home')} className="hover:text-amber-600">Home</button>
            <button onClick={() => scrollToSection('loja')} className="hover:text-amber-600">Loja</button>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-slate-100 rounded-xl hover:text-amber-600 transition-all">
              <i className="fa-solid fa-cart-shopping"></i>
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">{cart.reduce((a,b)=>a+b.quantity,0)}</span>}
            </button>
            {isLoggedIn ? (
              <button onClick={() => setView(view === 'store' ? 'admin' : 'store')} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {view === 'admin' ? 'Ver Loja' : 'Painel ERP'}
              </button>
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
              currentUser={currentUser} products={products} employees={employees} users={users} categories={productCategories} employeeCategories={empCategories} adminCategories={adminCategories} transactions={transactions} currentAccounts={currentAccounts}
              onAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }} 
              onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }} 
              onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))}
              onAddEmployee={() => { setEditingEmployee(null); setIsEmployeeModalOpen(true); }} 
              onEditEmployee={(e) => { setEditingEmployee(e); setIsEmployeeModalOpen(true); }} 
              onDeleteEmployee={(id) => setEmployees(prev => prev.filter(e => e.id !== id))}
              onPaySalary={(id) => {
                setEmployees(prev => prev.map(e => e.id === id ? { ...e, paymentStatus: 'PAGO' } : e));
                showToast("Pagamento realizado!");
              }}
              onAddUser={() => { setEditingUser(null); setIsUserModalOpen(true); }} 
              onEditUser={(u) => { setEditingUser(u); setIsUserModalOpen(true); }}
              onDeleteUser={(id) => setUsers(prev => prev.filter(u => u.id !== id))}
              onAddAccount={() => setIsAccountModalOpen(true)} 
              onAddCategory={(type, name) => {}}
              onRemoveCategory={(type, name) => {}} 
              onLogout={() => { setIsLoggedIn(false); setView('store'); }}
              onLocalCheckout={handleCheckout}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <section id="home" className="relative h-[70vh] overflow-hidden bg-slate-900">
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

            <section id="loja" className="py-20 max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Insumos & Equipamentos</h2>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
                  {allCategories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map(p => (
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

      <footer className="bg-slate-900 py-12 text-white border-t border-slate-800 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">&copy; 2024 Quinta dos Ovos • Angola • ERP Certificado</p>
      </footer>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={(id, d) => setCart(p => p.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity+d)} : i))} onRemove={(id) => setCart(p => p.filter(i => i.id !== id))} onCheckout={() => handleCheckout()} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
      <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} invoice={currentInvoice} />
      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
      <AIAssistant products={products} />
      
      {/* Modais de Gestão */}
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onSave={(p) => {
        if(editingProduct) setProducts(prev => prev.map(x => x.id === editingProduct.id ? {...x, ...p} as Product : x));
        else setProducts(prev => [...prev, {...p, id: Date.now(), rating: 5} as Product]);
        setIsProductModalOpen(false);
      }} product={editingProduct} categories={productCategories} />
      
      <EmployeeModal isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} onSave={(e) => {
        if(editingEmployee) setEmployees(prev => prev.map(x => x.id === editingEmployee.id ? {...x, ...e} as Employee : x));
        else setEmployees(prev => [...prev, {...e, id: Date.now()} as Employee]);
        setIsEmployeeModalOpen(false);
      }} employee={editingEmployee} categories={empCategories} />

      <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSave={(u) => {
        if(editingUser) setUsers(prev => prev.map(x => x.id === editingUser.id ? {...x, ...u} as User : x));
        else setUsers(prev => [...prev, {...u, id: Date.now(), createdAt: new Date().toISOString()} as User]);
        setIsUserModalOpen(false);
      }} user={editingUser} adminCategories={adminCategories} />
      
      <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} onSave={(a) => {
        setCurrentAccounts(prev => [...prev, {...a, id: Date.now()} as CurrentAccount]);
        setIsAccountModalOpen(false);
      }} />
    </div>
  );
};

export default App;
