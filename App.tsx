
import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import Toast from './components/Toast';
import LoginModal from './components/LoginModal';
import InvoiceModal from './components/InvoiceModal';
import { products as initialProducts } from './data/products';
import { Product, CartItem, User, Employee, Invoice, FinancialTransaction, CurrentAccount } from './types';

const MENU_OPTIONS = [
  { id: 'dashboard', label: 'Painel', icon: 'fa-gauge-high' },
  { id: 'caixa', label: 'Caixa (POS)', icon: 'fa-cash-register' },
  { id: 'stock', label: 'Estoque', icon: 'fa-boxes-stacked' },
  { id: 'rh', label: 'RH', icon: 'fa-users-gear' },
  { id: 'users', label: 'Usuários', icon: 'fa-user-lock' },
  { id: 'finance', label: 'Financeiro', icon: 'fa-wallet' },
  { id: 'accounts', label: 'Contas', icon: 'fa-scale-balanced' },
  { id: 'categories', label: 'Categorias', icon: 'fa-tags' },
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  // Estados do Slideshow
  const [currentSlide, setCurrentSlide] = useState(0);

  // Estados para Edição/Registro
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

  // Efeito do Slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDE_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const allCategories = useMemo(() => ['Todos', ...productCategories], [productCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, products]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const imageFile = formData.get('productImageFile') as File;
    let imageStr = editingProduct?.image || "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=400";
    if (imageFile && imageFile.size > 0) imageStr = await readFileAsBase64(imageFile);
    const productData: Partial<Product> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      costPrice: parseFloat(formData.get('costPrice') as string),
      stock: parseInt(formData.get('stock') as string),
      category: formData.get('category') as string,
      image: imageStr,
      rating: editingProduct?.rating || 5.0
    };
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } as Product : p));
      showToast("Produto atualizado!");
    } else {
      setProducts([...products, { ...productData, id: Date.now() } as Product]);
      showToast("Produto cadastrado!");
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const photoFile = formData.get('photoFile') as File;
    const idCardFile = formData.get('idCardFile') as File;
    const cvFile = formData.get('cvFile') as File;
    let photoStr = editingEmployee?.photo;
    let idCardStr = editingEmployee?.idCardDoc;
    let cvStr = editingEmployee?.cvDoc;
    
    if (photoFile && photoFile.size > 0) photoStr = await readFileAsBase64(photoFile);
    if (idCardFile && idCardFile.size > 0) idCardStr = await readFileAsBase64(idCardFile);
    if (cvFile && cvFile.size > 0) cvStr = await readFileAsBase64(cvFile);

    const empData: Partial<Employee> = {
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      category: formData.get('category') as string,
      salary: parseFloat(formData.get('salary') as string),
      contact: formData.get('contact') as string,
      admissionDate: formData.get('admissionDate') as string,
      paymentStatus: (editingEmployee?.paymentStatus || 'PENDENTE') as 'PAGO' | 'PENDENTE',
      photo: photoStr,
      idCardDoc: idCardStr,
      cvDoc: cvStr
    };
    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...editingEmployee, ...empData } : emp));
      showToast("Cadastro atualizado!");
    } else {
      setEmployees([...employees, { ...empData, id: Date.now() } as Employee]);
      showToast("Funcionário registrado!");
    }
    setIsEmployeeModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const selectedPermissions: string[] = [];
    MENU_OPTIONS.forEach(opt => {
      const isChecked = (form.querySelector(`input[name="perm_${opt.id}"]`) as HTMLInputElement)?.checked;
      if (isChecked) selectedPermissions.push(opt.id);
    });
    const userData: User = {
      id: editingUser?.id || Date.now(),
      username: formData.get('username') as string,
      password: formData.get('password') as string || editingUser?.password || '123',
      displayName: formData.get('displayName') as string,
      role: formData.get('role') as 'admin' | 'staff',
      category: formData.get('category') as string,
      permissions: selectedPermissions,
      createdAt: editingUser?.createdAt || new Date().toISOString().split('T')[0]
    };
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? userData : u));
      if (currentUser?.id === userData.id) setCurrentUser(userData);
      showToast("Usuário atualizado!");
    } else {
      setUsers([...users, userData]);
      showToast("Usuário criado!");
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const balance = parseFloat(formData.get('balance') as string);
    const type = formData.get('type') as 'CLIENTE' | 'FORNECEDOR';
    const accountData: CurrentAccount = {
      id: Date.now(),
      entityName: formData.get('entityName') as string,
      type: type,
      balance: balance,
      status: balance === 0 ? 'LIMPO' : (balance < 0 ? 'DEVEDOR' : 'CREDOR'),
      lastActivity: new Date().toISOString().split('T')[0]
    };
    setCurrentAccounts([...currentAccounts, accountData]);
    setIsAccountModalOpen(false);
    showToast("Conta corrente registrada!");
  };

  const handleAddCategory = (type: 'PRODUCT' | 'EMPLOYEE' | 'ADMIN', name: string) => {
    if (type === 'PRODUCT') { if (!productCategories.includes(name)) setProductCategories([...productCategories, name]); }
    else if (type === 'EMPLOYEE') { if (!empCategories.includes(name)) setEmpCategories([...empCategories, name]); }
    else if (type === 'ADMIN') { if (!adminCategories.includes(name)) setAdminCategories([...adminCategories, name]); }
    showToast(`Categoria "${name}" adicionada!`);
  };

  const handleRemoveCategory = (type: 'PRODUCT' | 'EMPLOYEE' | 'ADMIN', name: string) => {
    if (type === 'PRODUCT') setProductCategories(productCategories.filter(c => c !== name));
    else if (type === 'EMPLOYEE') setEmpCategories(empCategories.filter(c => c !== name));
    else if (type === 'ADMIN') setAdminCategories(adminCategories.filter(c => c !== name));
    showToast(`Categoria "${name}" removida!`);
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) { showToast("Produto sem estoque!"); return; }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} adicionado!`);
  };

  const handleCheckout = (customCart?: CartItem[]) => {
    const itemsToProcess = customCart || cart;
    if (itemsToProcess.length === 0) return;

    const total = itemsToProcess.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const totalCost = itemsToProcess.reduce((acc, it) => acc + it.costPrice * it.quantity, 0);
    const invoice: Invoice = { 
      id: Math.floor(10000 + Math.random() * 90000), 
      date: new Date().toLocaleString('pt-AO'), 
      items: [...itemsToProcess], 
      total 
    };
    
    setTransactions(prev => [...prev, { 
      id: Date.now(), 
      date: new Date().toISOString().split('T')[0], 
      description: customCart ? `Venda Caixa (POS)` : `Venda Loja Online`, 
      amount: total, 
      type: 'ENTRADA', 
      category: 'Vendas', 
      cost: totalCost 
    }]);
    
    setProducts(prev => prev.map(p => { 
      const cartItem = itemsToProcess.find(ci => ci.id === p.id); 
      if (cartItem) return { ...p, stock: p.stock - cartItem.quantity }; 
      return p; 
    }));

    setCurrentInvoice(invoice);
    setIsInvoiceOpen(true);
    
    if (!customCart) {
      setCart([]);
      setIsCartOpen(false);
    }
    
    showToast(customCart ? "Venda de caixa finalizada!" : "Pedido online finalizado!");
  };

  const handleLogin = (user: string, pass: string) => {
    const foundUser = users.find(u => u.username === user && u.password === pass);
    if (foundUser) { setIsLoggedIn(true); setCurrentUser(foundUser); setIsLoginModalOpen(false); setView('admin'); showToast(`Bem-vindo, ${foundUser.displayName}!`); }
    else throw new Error("Credenciais Inválidas");
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
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

          <nav className="hidden md:flex items-center gap-10">
            <button onClick={() => scrollToSection('home')} className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-amber-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection('servicos')} className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-amber-600 transition-colors">Serviços</button>
            <button onClick={() => scrollToSection('sobre')} className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-amber-600 transition-colors">Sobre Nós</button>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-all">
              <i className="fa-solid fa-cart-shopping text-lg"></i>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">{cartCount}</span>}
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
              onAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }} onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }} onDeleteProduct={(id) => { if(confirm('Excluir?')) setProducts(products.filter(p => p.id !== id)) }}
              onAddEmployee={() => { setEditingEmployee(null); setIsEmployeeModalOpen(true); }} onEditEmployee={(e) => { setEditingEmployee(e); setIsEmployeeModalOpen(true); }} onDeleteEmployee={(id) => { if(confirm('Remover?')) setEmployees(employees.filter(e => e.id !== id)) }}
              onPaySalary={(id) => {
                const emp = employees.find(x => x.id === id);
                if (emp) {
                  const today = new Date().toISOString().split('T')[0];
                  setTransactions(prev => [...prev, { id: Date.now(), date: today, description: `Salário: ${emp.name}`, amount: emp.salary, type: 'SAIDA', category: 'RH' }]);
                  setEmployees(prev => prev.map(e => e.id === id ? { ...e, lastPaymentDate: today, paymentStatus: 'PAGO' } : e));
                  showToast(`Salário pago para ${emp.name}`);
                }
              }}
              onAddUser={() => { setEditingUser(null); setIsUserModalOpen(true); }} onEditUser={(u) => { setEditingUser(u); setIsUserModalOpen(true); }}
              onDeleteUser={(id) => { if(currentUser?.id === id) { showToast("Não podes apagar a ti mesmo!"); return; } if(confirm('Remover usuário?')) setUsers(users.filter(u => u.id !== id)) }}
              onAddAccount={() => setIsAccountModalOpen(true)} onAddCategory={handleAddCategory} onRemoveCategory={handleRemoveCategory} onLogout={() => { setIsLoggedIn(false); setCurrentUser(null); setView('store'); }}
              onLocalCheckout={handleCheckout}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* HERO SLIDESHOW */}
            <section id="home" className="relative h-[85vh] w-full overflow-hidden bg-slate-900">
              {SLIDE_IMAGES.map((slide, idx) => (
                <div 
                  key={idx} 
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40 z-10" />
                  <img src={slide.url} className="w-full h-full object-cover" alt={slide.title} />
                  <div className="absolute bottom-20 left-10 md:left-24 z-20 max-w-2xl text-white">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none">{slide.title}</h2>
                    <p className="text-lg md:text-xl font-medium text-amber-400 opacity-90">{slide.subtitle}</p>
                    <button onClick={() => scrollToSection('loja')} className="mt-8 bg-amber-600 hover:bg-amber-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-amber-900/20 active:scale-95">
                      Explorar Produtos
                    </button>
                  </div>
                </div>
              ))}
              <div className="absolute bottom-10 right-10 z-30 flex gap-2">
                {SLIDE_IMAGES.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 transition-all rounded-full ${idx === currentSlide ? 'w-10 bg-amber-500' : 'w-4 bg-white/30'}`} />
                ))}
              </div>
            </section>

            {/* SERVIÇOS SECTION */}
            <section id="servicos" className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 block mb-2">Nossas Soluções</span>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">O que fazemos pela sua granja</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: "fa-vial-circle-check", title: "Genética Selecionada", desc: "Fornecemos pintinhos e ovos férteis com as melhores linhagens para alta produtividade." },
                    { icon: "fa-truck-fast", title: "Logística Técnica", desc: "Entrega especializada em todo território nacional, garantindo a integridade dos produtos vivos." },
                    { icon: "fa-chalkboard-user", title: "Consultoria em Manejo", desc: "Equipe de técnicos prontos para auxiliar no planejamento e otimização da sua produção." }
                  ].map((s, i) => (
                    <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-100 transition-all group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-600 text-2xl shadow-sm mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                        <i className={`fa-solid ${s.icon}`}></i>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-4 uppercase tracking-tighter">{s.title}</h3>
                      <p className="text-slate-500 leading-relaxed text-sm font-medium">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SOBRE NÓS SECTION */}
            <section id="sobre" className="py-24 bg-slate-50 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 block">Nossa História</span>
                  <h2 className="text-5xl font-black text-slate-900 leading-[0.9] uppercase tracking-tighter">Compromisso com o Frescor e a Qualidade</h2>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    A Quinta dos Ovos nasceu da paixão pela avicultura sustentável e do desejo de modernizar o setor em Angola. Localizada em um ambiente privilegiado, nossa produção une práticas ancestrais de cuidado animal com a mais alta tecnologia de incubação e nutrição.
                  </p>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Hoje, somos referência no fornecimento de soluções completas para criadores de todos os tamanhos, mantendo sempre o rigor técnico e o carinho com que iniciamos nossa jornada.
                  </p>
                  <div className="grid grid-cols-2 gap-8 pt-4">
                    <div>
                      <div className="text-3xl font-black text-amber-600 leading-none mb-1">10+</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Anos de Experiência</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-amber-600 leading-none mb-1">100%</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qualidade Garantida</div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl rotate-2">
                    <img src="https://images.unsplash.com/photo-1590483736622-39da8caf3501?q=80&w=800" className="w-full h-full object-cover" alt="Equipe Quinta" />
                  </div>
                  <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-amber-600 rounded-[2rem] flex items-center justify-center p-8 text-white shadow-2xl -rotate-6">
                    <p className="text-sm font-black text-center uppercase leading-tight">Líder no Setor Avícola Angolano</p>
                  </div>
                </div>
              </div>
            </section>

            {/* LOJA ONLINE SECTION */}
            <section id="loja" className="py-24 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 block mb-2">Loja Online</span>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Adquira Nossos Produtos</h2>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {allCategories.map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
                </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-slate-900 pt-24 pb-12 text-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white">
                        <i className="fa-solid fa-egg"></i>
                      </div>
                      <h2 className="text-xl font-black uppercase tracking-tighter">Quinta dos Ovos</h2>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                      O parceiro estratégico do avicultor angolano. Qualidade que gera produtividade.
                    </p>
                    <div className="flex gap-4">
                      {['facebook', 'instagram', 'whatsapp'].map(social => (
                        <a key={social} href="#" className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-600 hover:text-white transition-all">
                          <i className={`fa-brands fa-${social}`}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-amber-600">Navegação</h4>
                    <ul className="space-y-4 text-sm font-bold text-slate-400">
                      <li><button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">Home</button></li>
                      <li><button onClick={() => scrollToSection('servicos')} className="hover:text-white transition-colors">Serviços</button></li>
                      <li><button onClick={() => scrollToSection('sobre')} className="hover:text-white transition-colors">Sobre Nós</button></li>
                      <li><button onClick={() => scrollToSection('loja')} className="hover:text-white transition-colors">Loja Online</button></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-amber-600">Contacto</h4>
                    <ul className="space-y-4 text-sm font-bold text-slate-400">
                      <li className="flex items-center gap-3"><i className="fa-solid fa-location-dot text-amber-600"></i> Huambo, Angola</li>
                      <li className="flex items-center gap-3"><i className="fa-solid fa-phone text-amber-600"></i> +244 923 000 000</li>
                      <li className="flex items-center gap-3"><i className="fa-solid fa-envelope text-amber-600"></i> info@quintadosovos.co.ao</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-amber-600">Administrativo</h4>
                    <p className="text-xs text-slate-500 mb-6 font-medium">Acesso exclusivo para funcionários e administradores registrados.</p>
                    <button onClick={() => setIsLoginModalOpen(true)} className="w-full py-4 border-2 border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-amber-600 hover:text-amber-600 transition-all">
                      <i className="fa-solid fa-shield-halved mr-2"></i> Área do Staff
                    </button>
                  </div>
                </div>
                <div className="pt-12 border-t border-slate-800 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">
                    &copy; 2024 Quinta dos Ovos ERP • Made in Angola
                  </p>
                </div>
              </div>
            </footer>
          </div>
        )}
      </main>

      {/* Modal de Gestão de Usuários */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 animate-fade-in shadow-2xl overflow-y-auto max-h-[95vh]">
            <h2 className="text-xl font-black uppercase mb-6">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
            <form onSubmit={handleSaveUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome Completo</label>
                  <input name="displayName" defaultValue={editingUser?.displayName} placeholder="Ex: João Manuel" required className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Username</label>
                  <input name="username" defaultValue={editingUser?.username} placeholder="Ex: joao.erp" required className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Senha</label>
                <input name="password" type="password" placeholder={editingUser ? "Deixe em branco para manter" : "Senha de Acesso"} required={!editingUser} className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Cargo</label>
                  <select name="role" defaultValue={editingUser?.role || 'staff'} className="w-full bg-slate-50 p-4 rounded-2xl outline-none appearance-none cursor-pointer">
                    <option value="admin">Administrador</option>
                    <option value="staff">Funcionário</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Categoria Adm.</label>
                  <select name="category" defaultValue={editingUser?.category} className="w-full bg-slate-50 p-4 rounded-2xl outline-none appearance-none cursor-pointer">
                    <option value="">Sem Categoria</option>
                    {adminCategories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl space-y-4">
                <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved"></i> Permissões de Acesso
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {MENU_OPTIONS.map(opt => (
                    <label key={opt.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-indigo-200 cursor-pointer transition-all group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" name={`perm_${opt.id}`} defaultChecked={editingUser?.permissions?.includes(opt.id) || (!editingUser && opt.id !== 'users')} className="peer w-5 h-5 appearance-none border-2 border-slate-200 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all" />
                        <i className="fa-solid fa-check absolute text-white text-[10px] opacity-0 peer-checked:opacity-100 pointer-events-none"></i>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className={`fa-solid ${opt.icon} text-[10px] text-slate-400 group-hover:text-indigo-500`}></i>
                        <span className="text-xs font-bold text-slate-600">{opt.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">{editingUser ? 'Atualizar Usuário' : 'Criar Usuário'}</button>
                <button type="button" onClick={() => { setIsUserModalOpen(false); setEditingUser(null); }} className="w-full text-slate-400 text-[10px] font-black uppercase mt-2">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modais de Gestão de Estoque */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 animate-fade-in shadow-2xl overflow-y-auto max-h-[95vh]">
            <h2 className="text-xl font-black uppercase mb-6">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="space-y-4">
                <input name="name" defaultValue={editingProduct?.name} placeholder="Nome do Produto" required className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" />
                <textarea name="description" defaultValue={editingProduct?.description} placeholder="Descrição" className="w-full bg-slate-50 p-4 rounded-2xl outline-none h-24" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} placeholder="P. Venda" required className="bg-slate-50 p-4 rounded-2xl outline-none" />
                  <input name="costPrice" type="number" step="0.01" defaultValue={editingProduct?.costPrice} placeholder="P. Custo" required className="bg-slate-50 p-4 rounded-2xl outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input name="stock" type="number" defaultValue={editingProduct?.stock} placeholder="Qtd Estoque" required className="bg-slate-50 p-4 rounded-2xl outline-none" />
                  <select name="category" defaultValue={editingProduct?.category} className="bg-slate-50 p-4 rounded-2xl outline-none">
                    {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Imagem do Produto</h3>
                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600">Carregar Imagem</label>
                  <input type="file" name="productImageFile" accept="image/*" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200" />
                  {editingProduct?.image && <div className="mt-2 text-[10px] text-amber-600 font-bold">Imagem atual detectada.</div>}
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" className="w-full bg-amber-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg">Salvar Produto</button>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="w-full text-slate-400 text-[10px] font-black uppercase">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modais de Gestão de RH */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 animate-fade-in shadow-2xl max-h-[95vh] overflow-y-auto">
            <h2 className="text-xl font-black uppercase mb-6">{editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
            <form onSubmit={handleSaveEmployee} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Dados Pessoais</h3>
                <input name="name" defaultValue={editingEmployee?.name} placeholder="Nome Completo" required className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" />
                <input name="role" defaultValue={editingEmployee?.role} placeholder="Cargo / Função" required className="w-full bg-slate-50 p-4 rounded-2xl outline-none" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="salary" type="number" step="0.01" defaultValue={editingEmployee?.salary} placeholder="Salário (Kz)" required className="bg-slate-50 p-4 rounded-2xl outline-none" />
                  <input name="contact" defaultValue={editingEmployee?.contact} placeholder="Contacto" required className="bg-slate-50 p-4 rounded-2xl outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="admissionDate" type="date" defaultValue={editingEmployee?.admissionDate} className="bg-slate-50 p-4 rounded-2xl outline-none" />
                  <select name="category" defaultValue={editingEmployee?.category} className="bg-slate-50 p-4 rounded-2xl outline-none">
                    {empCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Documentação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600">Foto de Perfil</label>
                    <input type="file" name="photoFile" accept="image/*" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] font-black file:bg-amber-100 file:text-amber-700" />
                    {editingEmployee?.photo && <div className="mt-1 text-[9px] text-emerald-600 font-bold"><i className="fa-solid fa-check"></i> Foto carregada</div>}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600">Bilhete de Identidade (BI)</label>
                    <input type="file" name="idCardFile" accept="image/*,.pdf" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] font-black file:bg-amber-100 file:text-amber-700" />
                    {editingEmployee?.idCardDoc && <div className="mt-1 text-[9px] text-emerald-600 font-bold"><i className="fa-solid fa-check"></i> BI carregado</div>}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-600">Currículo (CV)</label>
                    <input type="file" name="cvFile" accept=".pdf,image/*" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] font-black file:bg-amber-100 file:text-amber-700" />
                    {editingEmployee?.cvDoc && <div className="mt-1 text-[9px] text-emerald-600 font-bold"><i className="fa-solid fa-check"></i> CV carregado</div>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-amber-600 transition-colors">{editingEmployee ? 'Atualizar Funcionário' : 'Registrar Funcionário'}</button>
                <button type="button" onClick={() => { setIsEmployeeModalOpen(false); setEditingEmployee(null); }} className="w-full text-slate-400 text-[10px] font-black uppercase">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Nova Conta Corrente */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 animate-fade-in shadow-2xl">
            <h2 className="text-xl font-black uppercase mb-6">Nova Conta Corrente</h2>
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <input name="entityName" placeholder="Nome do Cliente ou Fornecedor" required className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
              <select name="type" className="w-full bg-slate-50 p-4 rounded-2xl outline-none">
                <option value="CLIENTE">CLIENTE</option>
                <option value="FORNECEDOR">FORNECEDOR</option>
              </select>
              <input name="balance" type="number" step="0.01" placeholder="Saldo Inicial (Kz)" required className="w-full bg-slate-50 p-4 rounded-2xl outline-none" />
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg">Salvar Conta</button>
              <button type="button" onClick={() => setIsAccountModalOpen(false)} className="w-full text-slate-400 text-[10px] font-black uppercase mt-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={(id, d) => setCart(cart.map(it => it.id === id ? {...it, quantity: Math.max(1, it.quantity + d)} : it))} onRemove={(id) => setCart(cart.filter(it => it.id !== id))} onCheckout={() => handleCheckout()} />
      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
      <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} invoice={currentInvoice} />
    </div>
  );
};

export default App;
