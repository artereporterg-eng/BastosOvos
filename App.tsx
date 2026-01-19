
import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import Toast from './components/Toast';
import LoginModal from './components/LoginModal';
import AIAssistant from './components/AIAssistant';
import { products as initialProducts } from './data/products';
import { Product, CartItem, User, Employee } from './types';

const App: React.FC = () => {
  // Carregamento inicial do LocalStorage se disponível para simular persistência no React
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('avicolatech_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categoriesList, setCategoriesList] = useState<string[]>(['Rações', 'Equipamentos', 'Incubação', 'Saúde', 'Acessórios']);
  const [employeeCategoriesList, setEmployeeCategoriesList] = useState<string[]>(['Produção', 'Gestão', 'Logística', 'Comercial']);
  
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('avicolatech_employees');
    return saved ? JSON.parse(saved) : [
        { id: 1, name: "Carlos Silva", role: "Técnico de Campo", category: "Produção", salary: 280000.00, admissionDate: "2023-01-15", contact: "(+244) 923 000 001" },
        { id: 2, name: "Ana Oliveira", role: "Gerente Financeira", category: "Gestão", salary: 450000.00, admissionDate: "2022-11-20", contact: "(+244) 923 000 002" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('avicolatech_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('avicolatech_employees', JSON.stringify(employees));
  }, [employees]);

  const [users, setUsers] = useState<User[]>([
    { id: 1, username: 'admin', role: 'admin', createdAt: '01/01/2024' }
  ]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const categories = useMemo(() => {
    return ['Todos', ...categoriesList];
  }, [categoriesList]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, products]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const handleAdminAccess = () => {
    if (isLoggedIn) {
      setView(view === 'store' ? 'admin' : 'store');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    setView('admin');
    showToast("Login administrativo realizado!");
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    setView('store');
    showToast("Sessão encerrada.");
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      showToast("Produto sem estoque!");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} adicionado ao carrinho!`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = Date.now();
    setProducts([...products, { ...newProduct, id } as Product]);
    showToast("Novo produto cadastrado!");
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showToast("Produto atualizado!");
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Excluir este item do catálogo?')) {
      setProducts(products.filter(p => p.id !== id));
      setCart(cart.filter(item => item.id !== id));
      showToast("Produto removido.");
    }
  };

  const handleAddEmployee = (empData: Omit<Employee, 'id'>) => {
    const id = Date.now();
    setEmployees([...employees, { ...empData, id }]);
    showToast("Funcionário registrado!");
  };

  const handleUpdateEmployee = (emp: Employee) => {
    setEmployees(employees.map(e => e.id === emp.id ? { ...e, ...emp } : e));
    showToast("Cadastro atualizado!");
  };

  const handleDeleteEmployee = (id: number) => {
    if (window.confirm('Remover funcionário do sistema?')) {
      setEmployees(employees.filter(e => e.id !== id));
      showToast("Funcionário removido.");
    }
  };

  const handlePaySalary = (id: number) => {
    const date = new Date().toLocaleDateString('pt-AO');
    setEmployees(employees.map(e => e.id === id ? { ...e, lastPaymentDate: date } : e));
    showToast("Pagamento processado com sucesso!");
  };

  const handleAddCategory = (name: string) => {
    if (categoriesList.includes(name)) {
      showToast("Categoria já existe!");
      return;
    }
    setCategoriesList([...categoriesList, name]);
    showToast("Categoria adicionada!");
  };

  const handleUpdateCategory = (oldName: string, newName: string) => {
    setCategoriesList(categoriesList.map(c => c === oldName ? newName : c));
    setProducts(products.map(p => p.category === oldName ? { ...p, category: newName } : p));
    if (selectedCategory === oldName) setSelectedCategory(newName);
    showToast("Categoria renomeada!");
  };

  const handleDeleteCategory = (name: string) => {
    if (window.confirm(`Excluir categoria de produto "${name}"?`)) {
      setCategoriesList(categoriesList.filter(c => c !== name));
      setProducts(products.map(p => p.category === name ? { ...p, category: 'Sem Categoria' } : p));
      if (selectedCategory === name) setSelectedCategory('Todos');
      showToast("Categoria removida.");
    }
  };

  const handleAddEmployeeCategory = (name: string) => {
    if (employeeCategoriesList.includes(name)) {
      showToast("Categoria de funcionário já existe!");
      return;
    }
    setEmployeeCategoriesList([...employeeCategoriesList, name]);
    showToast("Categoria de RH adicionada!");
  };

  const handleUpdateEmployeeCategory = (oldName: string, newName: string) => {
    setEmployeeCategoriesList(employeeCategoriesList.map(c => c === oldName ? newName : c));
    setEmployees(employees.map(e => e.category === oldName ? { ...e, category: newName } : e));
    showToast("Categoria de RH renomeada!");
  };

  const handleDeleteEmployeeCategory = (name: string) => {
    if (window.confirm(`Excluir categoria de funcionário "${name}"?`)) {
      setEmployeeCategoriesList(employeeCategoriesList.filter(c => c !== name));
      setEmployees(employees.map(e => e.category === name ? { ...e, category: 'Sem Categoria' } : e));
      showToast("Categoria de RH removida.");
    }
  };

  const handleCheckout = () => {
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(ci => ci.id === p.id);
      if (cartItem) return { ...p, stock: p.stock - cartItem.quantity };
      return p;
    }));
    setCart([]);
    setIsCartOpen(false);
    showToast("Pedido finalizado com sucesso!");
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-100 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('store')}>
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
              <i className="fa-solid fa-tractor text-xl"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
              AvícolaTech<span className="text-amber-600">AI</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            {view === 'store' && (
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input 
                  type="text" 
                  placeholder="Buscar rações, chocadeiras..." 
                  className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={handleAdminAccess}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                view === 'admin' 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <i className={`fa-solid ${view === 'admin' ? 'fa-shop' : 'fa-chart-line'}`}></i>
              <span className="hidden sm:inline">{view === 'admin' ? 'Ver Loja' : 'Painel Gestão'}</span>
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-500 hover:text-amber-600 transition-all active:scale-90"
            >
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'admin' ? (
          <div className="animate-fade-in">
            <AdminPanel 
              products={products}
              users={users}
              employees={employees}
              categories={categoriesList}
              employeeCategories={employeeCategoriesList}
              onAdd={handleAddProduct}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
              onAddEmployee={handleAddEmployee}
              onUpdateEmployee={handleUpdateEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              onPaySalary={handlePaySalary}
              onLogout={onLogout}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onAddEmployeeCategory={handleAddEmployeeCategory}
              onUpdateEmployeeCategory={handleUpdateEmployeeCategory}
              onDeleteEmployeeCategory={handleDeleteEmployeeCategory}
            />
          </div>
        ) : (
          <>
            <section className="mb-12 relative rounded-[2rem] overflow-hidden bg-amber-600 text-white p-8 md:p-16">
              <div className="relative z-10 max-w-xl">
                <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter text-white">Equipamentos de Elite</h2>
                <p className="text-amber-100 text-lg mb-8">Tecnologia de ponta para automatizar sua granja e aumentar a produtividade.</p>
                <button 
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-amber-600 px-8 py-3 rounded-full font-bold hover:bg-amber-50 transition-all shadow-xl"
                >
                  Explorar Catálogo
                </button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=2070" 
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
            </section>

            <div id="catalog" className="mb-8 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-amber-600 text-white shadow-lg' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>
          </>
        )}
      </main>

      <AIAssistant products={products} />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <Toast 
        message={toastMessage} 
        isVisible={isToastVisible} 
        onClose={() => setIsToastVisible(false)} 
      />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={onLoginSuccess}
      />
    </div>
  );
};

export default App;
