
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
import { products as initialProducts } from './data/products';
import { Product, CartItem, User, Employee, Invoice, FinancialTransaction, CurrentAccount } from './types';

const SLIDE_IMAGES = [
  { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200", title: "Nossa Fazenda", subtitle: "Tradição e tecnologia no coração de Angola" },
  { url: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1200", title: "Infraestrutura Moderna", subtitle: "Ambientes controlados para máxima qualidade" },
  { url: "https://images.unsplash.com/photo-1594488358434-738980327f1c?q=80&w=1200", title: "Processamento Rigoroso", subtitle: "Higiene e segurança em cada etapa" },
  { url: "https://images.unsplash.com/photo-1582722134903-b1299002897d?q=80&w=1200", title: "Ovos Premium", subtitle: "Frescor garantido da nossa produção" },
  { url: "https://images.unsplash.com/photo-1604113900260-2144258f847c?q=80&w=1200", title: "Pintinhos de Raça", subtitle: "Genética selecionada para sua granja" },
  { url: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1200", title: "Nutrição de Ponta", subtitle: "Rações balanceadas para alto rendimento" },
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

  const [productCategories, setProductCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('quintadosovos_prod_cats');
    return saved ? JSON.parse(saved) : ['Rações', 'Equipamentos', 'Incubação', 'Saúde', 'Acessórios'];
  });

  const [empCategories, setEmpCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('quintadosovos_emp_cats');
    return saved ? JSON.parse(saved) : ['Produção', 'Gestão', 'Logística', 'Comercial'];
  });

  const [adminCategories, setAdminCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('quintadosovos_admin_cats');
    return saved ? JSON.parse(saved) : ['Super Admin', 'Gerência', 'Operador', 'Financeiro'];
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('quintadosovos_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentAccounts, setCurrentAccounts] = useState<CurrentAccount[]>(() => {
    const saved = localStorage.getItem('quintadosovos_accounts');
    return saved ? JSON.parse(saved) : [
      { id: 1, entityName: "Rações de Angola Lda", type: 'FORNECEDOR', balance: -1500000, status: 'DEVEDOR', lastActivity: "2024-05-01" },
      { id: 2, entityName: "Cooperativa Avícola Sul", type: 'CLIENTE', balance: 450000, status: 'CREDOR', lastActivity: "2024-05-10" }
    ];
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

  // Estados de Edição / Modais
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
    localStorage.setItem('quintadosovos_prod_cats', JSON.stringify(productCategories));
    localStorage.setItem('quintadosovos_emp_cats', JSON.stringify(empCategories));
    localStorage.setItem('quintadosovos_admin_cats', JSON.stringify(adminCategories));
  }, [products, employees, users, transactions, currentAccounts, productCategories, empCategories, adminCategories]);

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
    const totalCost = itemsToProcess.reduce((acc, it) => acc + (it.costPrice || 0) * it.quantity, 0);
    const invoice: Invoice = { id: Math.floor(10000 + Math.random() * 90000), date: new Date().toLocaleString('pt-AO'), items: [...itemsToProcess], total };
    setTransactions(prev => [...prev, { id: Date.now(), date: new Date().toISOString().split('T')[0], description: customCart ? `Venda POS` : `Venda Online`, amount: total, type: 'ENTRADA', category: 'Vendas', cost: totalCost }]);
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

  const handleAddCategory = (type: 'PRODUCT' | 'EMPLOYEE' | 'ADMIN', name: string) => {
    if (!name.trim()) return;
    if (type === 'PRODUCT') setProductCategories(prev => [...new Set([...prev, name])]);
    else if (type === 'EMPLOYEE') setEmpCategories(prev => [...new Set([...prev, name])]);
    else setAdminCategories(prev => [...new Set([...prev, name])]);
    showToast(`Categoria "${name}" adicionada!`);
  };

  // Funções de salvamento de entidades
  const handleSaveProduct = (p: Partial<Product>) => {
    if (editingProduct) {
      setProducts(prev => prev.map(item => item.id === editingProduct.id ? { ...item, ...p } as Product : item));
      showToast("Produto atualizado!");
    } else {
      const newP = { ...p, id: Date.now(), rating: 5 } as Product;
      setProducts(prev => [...prev, newP]);
      showToast("Produto adicionado!");
    }
    setIsProductModalOpen(false);
  };

  const handleSaveEmployee = (e: Partial<Employee>) => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(item => item.id === editingEmployee.id ? { ...item, ...e } as Employee : item));
      showToast("Funcionário atualizado!");
    } else {
      const newE = { ...e, id: Date.now() } as Employee;
      setEmployees(prev => [...prev, newE]);
      showToast("Funcionário contratado!");
    }
    setIsEmployeeModalOpen(false);
  };

  const handleSaveUser = (u: Partial<User>) => {
    if (editingUser) {
      setUsers(prev => prev.map(item => item.id === editingUser.id ? { ...item, ...u } as User : item));
      showToast("Acesso atualizado!");
    } else {
      const newU = { ...u, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] } as User;
      setUsers(prev => [...prev, newU]);
      showToast("Novo acesso criado!");
    }
    setIsUserModalOpen(false);
  };

  const handleSaveAccount = (a: Partial<CurrentAccount>) => {
    const newA = { ...a, id: Date.now(), status: a.balance! < 0 ? 'DEVEDOR' : 'CREDOR' } as CurrentAccount;
    setCurrentAccounts(prev => [...prev, newA]);
    showToast("Conta corrente aberta!");
    setIsAccountModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-amber-100 no-print">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView('store'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-200">
              <i className="fa-solid fa-egg text-2xl"></i>
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-none">
              Quinta<span className="text-amber-600 block text-xs tracking-[0.2em] font-black uppercase">dosOvos</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            <button onClick={() => scrollToSection('home')} className="hover:text-amber-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection('servicos')} className="hover:text-amber-600 transition-colors">Serviços</button>
            <button onClick={() => scrollToSection('sobre')} className="hover:text-amber-600 transition-colors">Sobre Nós</button>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-all">
              <i className="fa-solid fa-cart-shopping text-lg"></i>
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">{cart.reduce((a,b)=>a+b.quantity,0)}</span>}
            </button>
            {isLoggedIn && (
              <button onClick={() => setView(view === 'store' ? 'admin' : 'store')} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl">
                {view === 'admin' ? 'Ver Loja' : 'Painel ERP'}
              </button>
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
              onDeleteProduct={(id) => { if(confirm('Excluir produto?')) setProducts(prev => prev.filter(p => p.id !== id)) }}
              onAddEmployee={() => { setEditingEmployee(null); setIsEmployeeModalOpen(true); }} 
              onEditEmployee={(e) => { setEditingEmployee(e); setIsEmployeeModalOpen(true); }} 
              onDeleteEmployee={(id) => { if(confirm('Remover funcionário?')) setEmployees(prev => prev.filter(e => e.id !== id)) }}
              onPaySalary={(id) => {
                const emp = employees.find(e => e.id === id);
                if (emp) {
                  setTransactions(prev => [...prev, { id: Date.now(), date: new Date().toISOString().split('T')[0], description: `Salário: ${emp.name}`, amount: emp.salary, type: 'SAIDA', category: 'RH' }]);
                  setEmployees(prev => prev.map(e => e.id === id ? { ...e, paymentStatus: 'PAGO' } : e));
                  showToast(`Salário pago para ${emp.name}`);
                }
              }}
              onAddUser={() => { setEditingUser(null); setIsUserModalOpen(true); }} 
              onEditUser={(u) => { setEditingUser(u); setIsUserModalOpen(true); }}
              onDeleteUser={(id) => { if(confirm('Apagar utilizador?')) setUsers(prev => prev.filter(u => u.id !== id)) }}
              onAddAccount={() => { setIsAccountModalOpen(true); }} 
              onAddCategory={handleAddCategory}
              onRemoveCategory={(t, n) => {
                if(t === 'PRODUCT') setProductCategories(p => p.filter(x => x !== n));
                else if(t === 'EMPLOYEE') setEmpCategories(p => p.filter(x => x !== n));
                else setAdminCategories(p => p.filter(x => x !== n));
              }} 
              onLogout={() => { setIsLoggedIn(false); setCurrentUser(null); setView('store'); }}
              onLocalCheckout={handleCheckout}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* HERO SLIDESHOW */}
            <section id="home" className="relative h-[85vh] w-full overflow-hidden bg-slate-900">
              {SLIDE_IMAGES.map((slide, idx) => (
                <div key={idx} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40 z-10" />
                  <img src={slide.url} className="w-full h-full object-cover" alt={slide.title} />
                  <div className="absolute bottom-20 left-10 md:left-24 z-20 max-w-2xl text-white">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none">{slide.title}</h2>
                    <p className="text-lg md:text-xl font-medium text-amber-400 opacity-90">{slide.subtitle}</p>
                    <button onClick={() => scrollToSection('loja')} className="mt-8 bg-amber-600 hover:bg-amber-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95">Explorar Produtos</button>
                  </div>
                </div>
              ))}
              <div className="absolute bottom-10 right-10 z-30 flex gap-2">
                {SLIDE_IMAGES.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 transition-all rounded-full ${idx === currentSlide ? 'w-10 bg-amber-500' : 'w-4 bg-white/30'}`} />
                ))}
              </div>
            </section>

            {/* SECTIONS */}
            <section id="servicos" className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 block mb-2">Nossas Soluções</span>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-16">Excelência Avícola</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: "fa-vial-circle-check", title: "Genética Selecionada", desc: "Pintinhos e ovos férteis com linhagens de alto rendimento." },
                    { icon: "fa-truck-fast", title: "Entrega ao domicílio dos seus produtos", desc: "Logística ágil e segura para receber seus insumos e equipamentos diretamente na sua porta, preservando a qualidade de cada item." },
                    { icon: "fa-chalkboard-user", title: "Consultoria", desc: "Equipe técnica pronta para otimizar sua produção." }
                  ].map((s, i) => (
                    <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-amber-200 hover:shadow-2xl transition-all group text-left">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-600 text-2xl shadow-sm mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all"><i className={`fa-solid ${s.icon}`}></i></div>
                      <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tighter">{s.title}</h3>
                      <p className="text-slate-500 leading-relaxed text-sm font-medium">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="sobre" className="py-24 bg-slate-50 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 block">Nossa História</span>
                  <h2 className="text-5xl font-black text-slate-900 leading-[0.9] uppercase tracking-tighter">Tradição no Coração de Angola</h2>
                  <p className="text-slate-600 leading-relaxed font-medium">Localizada em Huambo, a Quinta dos Ovos une o carinho do campo com a precisão da tecnologia moderna para alimentar o país.</p>
                </div>
                <div className="flex-1 relative">
                  <img src="https://images.unsplash.com/photo-1598965402089-897ce52e8355?q=80&w=800" className="w-full aspect-[4/5] rounded-[3rem] object-cover shadow-2xl rotate-2" alt="Granja Quinta dos Ovos" />
                </div>
              </div>
            </section>

            <section id="loja" className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 text-center md:text-left">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 block mb-2">Loja Online</span>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Nossos Produtos</h2>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {allCategories.map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{cat}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={(p) => { 
                    setCart(prev => {
                      const ex = prev.find(i => i.id === p.id);
                      if(ex) return prev.map(i => i.id === p.id ? {...i, quantity: i.quantity+1} : i);
                      return [...prev, {...p, quantity: 1}];
                    });
                    showToast(`${p.name} adicionado!`);
                  }} />)}
                </div>
              </div>
            </section>

            <footer className="bg-slate-900 pt-24 pb-12 text-white no-print">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-center md:text-left">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white"><i className="fa-solid fa-egg"></i></div>
                      <h2 className="text-xl font-black uppercase tracking-tighter">Quinta dos Ovos</h2>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">Excelência e inovação na avicultura angolana. Sua granja com tecnologia de ponta.</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-amber-600">Navegação</h4>
                    <ul className="space-y-4 text-sm font-bold text-slate-400">
                      <li><button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">Home</button></li>
                      <li><button onClick={() => scrollToSection('servicos')} className="hover:text-white transition-colors">Serviços</button></li>
                      <li><button onClick={() => scrollToSection('sobre')} className="hover:text-white transition-colors">Sobre Nós</button></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-amber-600">Contacto</h4>
                    <p className="text-sm font-bold text-slate-400 mb-2">Huambo, Angola</p>
                    <p className="text-sm font-bold text-slate-400">comercial@quintadosovos.ao</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-amber-600">ERP Local</h4>
                    <button onClick={() => setIsLoginModalOpen(true)} className="w-full py-4 border-2 border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-amber-600 hover:text-amber-600 transition-all">Painel Administrativo</button>
                  </div>
                </div>
                <div className="pt-12 border-t border-slate-800 text-center"><p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">&copy; 2024 Quinta dos Ovos ERP • Angola</p></div>
              </div>
            </footer>
          </div>
        )}
      </main>

      {/* Modais de Entidade */}
      <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onSave={handleSaveProduct} product={editingProduct} categories={productCategories} />
      <EmployeeModal isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} onSave={handleSaveEmployee} employee={editingEmployee} categories={empCategories} />
      <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSave={handleSaveUser} user={editingUser} adminCategories={adminCategories} />
      <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} onSave={handleSaveAccount} />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity+d)} : i))} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} onCheckout={() => handleCheckout()} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
      <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} invoice={currentInvoice} />
      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
    </div>
  );
};

export default App;
