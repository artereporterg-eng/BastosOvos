
import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import Toast from './components/Toast';
import LoginModal from './components/LoginModal';
import InvoiceModal from './components/InvoiceModal';
import { products as initialProducts } from './data/products';
import { Product, CartItem, User, Employee, Invoice, FinancialTransaction, CurrentAccount } from './types';

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

  const [productCategories, setProductCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('quintadosovos_prod_cats');
    return saved ? JSON.parse(saved) : ['Rações', 'Equipamentos', 'Incubação', 'Saúde', 'Acessórios'];
  });

  const [empCategories, setEmpCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('quintadosovos_emp_cats');
    return saved ? JSON.parse(saved) : ['Produção', 'Gestão', 'Logística', 'Comercial'];
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  // Estados para Edição/Registro
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('quintadosovos_products', JSON.stringify(products));
    localStorage.setItem('quintadosovos_employees', JSON.stringify(employees));
    localStorage.setItem('quintadosovos_transactions', JSON.stringify(transactions));
    localStorage.setItem('quintadosovos_accounts', JSON.stringify(currentAccounts));
    localStorage.setItem('quintadosovos_prod_cats', JSON.stringify(productCategories));
    localStorage.setItem('quintadosovos_emp_cats', JSON.stringify(empCategories));
  }, [products, employees, transactions, currentAccounts, productCategories, empCategories]);

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

    if (imageFile && imageFile.size > 0) {
      imageStr = await readFileAsBase64(imageFile);
    }

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

  const handleAddCategory = (type: 'PRODUCT' | 'EMPLOYEE', name: string) => {
    if (type === 'PRODUCT') {
      if (!productCategories.includes(name)) setProductCategories([...productCategories, name]);
    } else {
      if (!empCategories.includes(name)) setEmpCategories([...empCategories, name]);
    }
    showToast(`Categoria "${name}" adicionada!`);
  };

  const handleRemoveCategory = (type: 'PRODUCT' | 'EMPLOYEE', name: string) => {
    if (type === 'PRODUCT') {
      setProductCategories(productCategories.filter(c => c !== name));
    } else {
      setEmpCategories(empCategories.filter(c => c !== name));
    }
    showToast(`Categoria "${name}" removida!`);
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
    showToast(`${product.name} adicionado!`);
  };

  const handleCheckout = () => {
    const total = cart.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const totalCost = cart.reduce((acc, it) => acc + it.costPrice * it.quantity, 0);

    const invoice: Invoice = {
      id: Math.floor(10000 + Math.random() * 90000),
      date: new Date().toLocaleString('pt-AO'),
      items: [...cart],
      total
    };
    
    setTransactions(prev => [...prev, {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      description: `Venda Loja - Fatura #${invoice.id}`,
      amount: total,
      type: 'ENTRADA',
      category: 'Vendas',
      cost: totalCost
    }]);

    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(ci => ci.id === p.id);
      if (cartItem) return { ...p, stock: p.stock - cartItem.quantity };
      return p;
    }));
    
    setCurrentInvoice(invoice);
    setIsInvoiceOpen(true);
    setCart([]);
    setIsCartOpen(false);
    showToast("Pedido finalizado!");
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-100 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('store')}>
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <i className="fa-solid fa-egg text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">
              Quinta<span className="text-amber-600">dosOvos</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => isLoggedIn ? setView(view === 'store' ? 'admin' : 'store') : setIsLoginModalOpen(true)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'admin' ? 'bg-slate-800 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
            >
              <i className={`fa-solid ${view === 'admin' ? 'fa-shop' : 'fa-chart-line'} mr-2`}></i>
              {view === 'admin' ? 'Ver Loja' : 'Gestão ERP'}
            </button>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-slate-500 hover:text-amber-600 transition-all">
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'admin' ? (
          <AdminPanel 
            products={products}
            employees={employees}
            categories={productCategories}
            employeeCategories={empCategories}
            transactions={transactions}
            currentAccounts={currentAccounts}
            onAddProduct={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            onEditProduct={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }}
            onDeleteProduct={(id) => { if(confirm('Excluir?')) setProducts(products.filter(p => p.id !== id)) }}
            onAddEmployee={() => { setEditingEmployee(null); setIsEmployeeModalOpen(true); }}
            onEditEmployee={(e) => { setEditingEmployee(e); setIsEmployeeModalOpen(true); }}
            onDeleteEmployee={(id) => { if(confirm('Remover?')) setEmployees(employees.filter(e => e.id !== id)) }}
            onPaySalary={(id) => {
              const emp = employees.find(x => x.id === id);
              if (emp) {
                const today = new Date().toISOString().split('T')[0];
                setTransactions(prev => [...prev, { id: Date.now(), date: today, description: `Salário: ${emp.name}`, amount: emp.salary, type: 'SAIDA', category: 'RH' }]);
                setEmployees(prev => prev.map(e => e.id === id ? { ...e, lastPaymentDate: today, paymentStatus: 'PAGO' } : e));
                showToast(`Salário pago para ${emp.name}`);
              }
            }}
            onAddAccount={() => setIsAccountModalOpen(true)}
            onAddCategory={handleAddCategory}
            onRemoveCategory={handleRemoveCategory}
            onLogout={() => { setIsLoggedIn(false); setView('store'); }}
          />
        ) : (
          <div className="animate-fade-in">
             <div className="mb-8 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {allCategories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-amber-600 text-white' : 'bg-white border border-slate-100 text-slate-400'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
            </div>
          </div>
        )}
      </main>

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
                  {editingProduct?.image && (
                    <div className="mt-2 text-[10px] text-amber-600 font-bold">Imagem atual detectada. Deixe vazio para manter.</div>
                  )}
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
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Documentação (Upload)</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600">Foto de Perfil</label>
                    <input type="file" name="photoFile" accept="image/*" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200" />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600">Bilhete de Identidade (BI)</label>
                    <input type="file" name="idCardFile" accept="image/*" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200" />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-600">Curriculum Vitae (CV)</label>
                    <input type="file" name="cvFile" accept=".pdf,image/*" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-amber-600 transition-colors">
                  {editingEmployee ? 'Atualizar Funcionário' : 'Registrar Funcionário'}
                </button>
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

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={(id, d) => setCart(cart.map(it => it.id === id ? {...it, quantity: Math.max(1, it.quantity + d)} : it))} onRemove={(id) => setCart(cart.filter(it => it.id !== id))} onCheckout={handleCheckout} />
      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={() => { setIsLoggedIn(true); setIsLoginModalOpen(false); setView('admin'); }} />
      <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} invoice={currentInvoice} />
    </div>
  );
};

export default App;
