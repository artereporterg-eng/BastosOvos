
import React, { useState, useMemo } from 'react';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import Toast from './components/Toast';
import LoginModal from './components/LoginModal';
import { products as initialProducts } from './data/products';
import { Product, CartItem, User } from './types';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categoriesList, setCategoriesList] = useState<string[]>(['Rações', 'Equipamentos', 'Incubação', 'Saúde', 'Acessórios']);
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
    const id = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts([...products, { ...newProduct, id }]);
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

  const handleAddUser = (username: string, role: 'admin' | 'staff') => {
    const id = Math.max(...users.map(u => u.id), 0) + 1;
    const date = new Date().toLocaleDateString('pt-BR');
    setUsers([...users, { id, username, role, createdAt: date }]);
    showToast(`Usuário ${username} criado.`);
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Remover acesso deste usuário?')) {
      setUsers(users.filter(u => u.id !== id));
      showToast("Usuário removido.");
    }
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
    if (window.confirm(`Excluir categoria "${name}"?`)) {
      setCategoriesList(categoriesList.filter(c => c !== name));
      setProducts(products.map(p => p.category === name ? { ...p, category: 'Sem Categoria' } : p));
      if (selectedCategory === name) setSelectedCategory('Todos');
      showToast("Categoria removida.");
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
              <i className="fa-solid fa-egg text-xl"></i>
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
              <i className={`fa-solid ${view === 'admin' ? 'fa-shop' : 'fa-gear'}`}></i>
              <span className="hidden sm:inline">{view === 'admin' ? 'Ver Loja' : 'Painel Admin'}</span>
            </button>
            
            <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block"></div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-500 hover:text-amber-600 transition-all active:scale-90"
            >
              <i className="fa-solid fa-basket-shopping text-xl"></i>
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
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <AdminPanel 
              products={products}
              users={users}
              categories={categoriesList}
              onAdd={handleAddProduct}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              onLogout={onLogout}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="mb-12 relative rounded-[2rem] overflow-hidden bg-emerald-900 text-white p-8 md:p-16">
              <div className="relative z-10 max-w-xl">
                <span className="bg-amber-500 text-amber-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                  Tecnologia no Campo
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-white">
                  Sua produção avícola mais inteligente.
                </h2>
                <p className="text-emerald-100 text-lg mb-8">
                  De chocadeiras automáticas a nutrição de precisão. Encontre tudo o que você precisa para uma criação saudável e produtiva.
                </p>
                <button 
                  onClick={() => {
                    const el = document.getElementById('catalog');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-amber-500 text-amber-950 px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition-all active:scale-95 shadow-xl shadow-amber-900/20"
                >
                  Ver Catálogo
                </button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=2070&auto=format&fit=crop" 
                alt="Poultry Farm" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
              />
            </section>

            {/* Filters */}
            <div id="catalog" className="mb-8 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat 
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <i className="fa-solid fa-seedling text-4xl text-slate-200 mb-4 block"></i>
                <h3 className="text-lg font-semibold text-slate-600">Nenhum item encontrado</h3>
                <p className="text-slate-400">Tente buscar por termos diferentes ou trocar a categoria.</p>
                <button 
                  onClick={() => {setSelectedCategory('Todos'); setSearchQuery('');}}
                  className="mt-4 text-amber-600 font-medium"
                >
                  Ver todos os produtos
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white">
                <i className="fa-solid fa-egg text-sm"></i>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                AvícolaTech<span className="text-amber-600">AI</span>
              </h1>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Liderando a modernização do campo com soluções digitais e consultoria especializada para produtores rurais.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Setores</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-amber-600">Corte</a></li>
              <li><a href="#" className="hover:text-amber-600">Postura</a></li>
              <li><a href="#" className="hover:text-amber-600">Incubação</a></li>
              <li><a href="#" className="hover:text-amber-600">Insumos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Suporte</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-amber-600">Consultoria Técnica</a></li>
              <li><a href="#" className="hover:text-amber-600">Pedidos</a></li>
              <li><a href="#" className="hover:text-amber-600">Garantia</a></li>
              <li><a href="#" className="hover:text-amber-600">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Newsletter</h4>
            <p className="text-sm text-slate-500 mb-4">Receba dicas de manejo e promoções.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Seu e-mail" className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm w-full outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-amber-500" />
              <button className="bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
          <p>© 2024 AvícolaTech AI. Nutrimos o futuro.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><i className="fa-solid fa-location-dot"></i> Matriz Rural, SP</span>
          </div>
        </div>
      </footer>

      {/* Floating Elements */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
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
