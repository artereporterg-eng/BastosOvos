
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Employee, User, FinancialTransaction, CurrentAccount, CartItem } from '../types';

interface AdminPanelProps {
  currentUser: User;
  products: Product[];
  employees: Employee[];
  users: User[];
  categories: string[];
  employeeCategories: string[];
  adminCategories: string[];
  transactions: FinancialTransaction[];
  currentAccounts: CurrentAccount[];
  onAddProduct: () => void;
  onEditProduct: (p: Product) => void;
  onDeleteProduct: (id: number) => void;
  onAddEmployee: () => void;
  onEditEmployee: (e: Employee) => void;
  onDeleteEmployee: (id: number) => void;
  onPaySalary: (id: number) => void;
  onAddUser: () => void;
  onEditUser: (u: User) => void;
  onDeleteUser: (id: number) => void;
  onAddAccount: () => void;
  onAddCategory: (type: 'PRODUCT' | 'EMPLOYEE' | 'ADMIN', name: string) => void;
  onRemoveCategory: (type: 'PRODUCT' | 'EMPLOYEE' | 'ADMIN', name: string) => void;
  onLogout: () => void;
  onLocalCheckout: (cart: CartItem[]) => void;
}

const MENU_DEFS = [
  { id: 'dashboard', label: 'Painel de Controle', icon: 'fa-gauge-high' },
  { id: 'caixa', label: 'Caixa (POS)', icon: 'fa-cash-register' },
  { id: 'stock', label: 'Inventário & Estoque', icon: 'fa-boxes-stacked' },
  { id: 'rh', label: 'Recursos Humanos', icon: 'fa-users-gear' },
  { id: 'users', label: 'Usuários do Sistema', icon: 'fa-user-lock' },
  { id: 'finance', label: 'Fluxo Financeiro', icon: 'fa-wallet' },
  { id: 'accounts', label: 'Contas Correntes', icon: 'fa-scale-balanced' },
  { id: 'categories', label: 'Gerir Categorias', icon: 'fa-tags' },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  currentUser, products, employees, users, categories, employeeCategories, adminCategories, transactions, currentAccounts,
  onAddProduct, onEditProduct, onDeleteProduct,
  onAddEmployee, onEditEmployee, onDeleteEmployee, onPaySalary,
  onAddUser, onEditUser, onDeleteUser,
  onAddAccount, onAddCategory, onRemoveCategory, onLogout, onLocalCheckout
}) => {
  const [tab, setTab] = useState<string>(() => {
    return currentUser.permissions?.length > 0 ? currentUser.permissions[0] : 'dashboard';
  });
  
  const [newCatName, setNewCatName] = useState('');
  const [catType, setCatType] = useState<'PRODUCT' | 'EMPLOYEE' | 'ADMIN'>('PRODUCT');
  
  // Estados do Caixa (POS)
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [posSearch, setPosSearch] = useState('');

  useEffect(() => {
    if (currentUser.permissions && !currentUser.permissions.includes(tab)) {
       setTab(currentUser.permissions[0] || 'dashboard');
    }
  }, [currentUser.permissions, tab]);

  const formatKz = (v: number) => v.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz');

  const isAdmin = currentUser.role === 'admin';

  const stockValuationCost = useMemo(() => products.reduce((acc, p) => acc + (p.costPrice * p.stock), 0), [products]);
  const totalRevenue = useMemo(() => transactions.filter(t => t.type === 'ENTRADA').reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === 'SAIDA').reduce((acc, t) => acc + t.amount, 0), [transactions]);

  const salesTransactions = useMemo(() => transactions.filter(t => t.category === 'Vendas'), [transactions]);
  const totalSalesRevenue = useMemo(() => salesTransactions.reduce((acc, t) => acc + t.amount, 0), [salesTransactions]);

  const handleAddCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(catType, newCatName.trim());
    setNewCatName('');
  };

  // Funções do Caixa
  const filteredPosProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(posSearch.toLowerCase()) || p.category.toLowerCase().includes(posSearch.toLowerCase()));
  }, [posSearch, products]);

  const addToPosCart = (p: Product) => {
    if (p.stock <= 0) return;
    setPosCart(prev => {
      const existing = prev.find(item => item.id === p.id);
      if (existing) {
        if (existing.quantity >= p.stock) return prev;
        return prev.map(item => item.id === p.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...p, quantity: 1 }];
    });
  };

  const updatePosQuantity = (id: number, delta: number) => {
    setPosCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        if (newQty > item.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromPosCart = (id: number) => {
    setPosCart(prev => prev.filter(item => item.id !== id));
  };

  const handlePosCheckout = () => {
    if (posCart.length === 0) return;
    onLocalCheckout(posCart);
    setPosCart([]);
    setPosSearch('');
  };

  const posTotal = posCart.reduce((acc, it) => acc + it.price * it.quantity, 0);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[700px] flex flex-col md:flex-row animate-fade-in">
      {/* Sidebar Dinâmica */}
      <aside className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2 no-print">
        <div className="mb-4 px-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Acesso: {currentUser.role === 'admin' ? 'Admin' : 'Staff'}</h2>
          <p className="text-sm font-bold text-slate-800 truncate">{currentUser.displayName}</p>
          {currentUser.category && (
            <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 block w-fit">{currentUser.category}</span>
          )}
        </div>
        
        <div className="mb-4 px-4 border-t pt-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menu de Gestão</h2>
        </div>
        
        {MENU_DEFS.map(menu => {
          const hasAccess = currentUser.permissions?.includes(menu.id);
          if (!hasAccess) return null;

          return (
            <button 
              key={menu.id}
              onClick={() => setTab(menu.id)} 
              className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${tab === menu.id ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-white hover:text-amber-600'}`}
            >
              <i className={`fa-solid ${menu.icon}`}></i> {menu.label}
            </button>
          );
        })}

        <div className="mt-auto pt-6 border-t border-slate-200">
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-50">
            <i className="fa-solid fa-right-from-bracket"></i> Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <section className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
        {tab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Visão Geral</h2>
              <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-xs font-bold border border-amber-100 uppercase tracking-widest">ERP Administrativo</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-4">Entradas</span>
                <div className="text-2xl font-black text-emerald-700">{formatKz(totalRevenue)}</div>
              </div>
              <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-red-600 tracking-widest mb-4">Saídas</span>
                <div className="text-2xl font-black text-red-700">{formatKz(totalExpenses)}</div>
              </div>
              <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex flex-col justify-between shadow-xl shadow-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Saldo Atual</span>
                <div className="text-2xl font-black text-white">{formatKz(totalRevenue - totalExpenses)}</div>
              </div>
              <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-4">Vlr. Estoque</span>
                <div className="text-2xl font-black text-amber-700">{formatKz(stockValuationCost)}</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'caixa' && (
          <div className="space-y-8 animate-fade-in flex flex-col h-full lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Faturação Local</h2>
                <div className="relative w-full max-w-xs">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input 
                    type="text" 
                    placeholder="Buscar produto..." 
                    value={posSearch}
                    onChange={(e) => setPosSearch(e.target.value)}
                    className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                {filteredPosProducts.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => addToPosCart(p)}
                    disabled={p.stock <= 0}
                    className={`text-left p-4 rounded-[2rem] border transition-all flex flex-col justify-between group ${p.stock <= 0 ? 'bg-slate-50 border-slate-100 opacity-50 grayscale cursor-not-allowed' : 'bg-white border-slate-100 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-100'}`}
                  >
                    <div className="aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-slate-50">
                      <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm truncate">{p.name}</h4>
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-xs font-black text-amber-600">{formatKz(p.price)}</span>
                        <span className="text-[8px] font-black uppercase text-slate-400">{p.stock} em stock</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-96 bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col h-[75vh]">
              <div className="flex items-center gap-3 mb-8">
                <i className="fa-solid fa-cart-shopping text-amber-500 text-xl"></i>
                <h3 className="text-xl font-black uppercase tracking-tighter">Carrinho</h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                {posCart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
                    <i className="fa-solid fa-basket-shopping text-5xl"></i>
                    <p className="text-xs font-bold uppercase tracking-widest">Carrinho Vazio</p>
                  </div>
                ) : (
                  posCart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl group border border-slate-800 hover:border-slate-700 transition-all">
                      <div className="flex-1">
                        <h4 className="text-xs font-bold truncate pr-2">{item.name}</h4>
                        <span className="text-[10px] text-amber-500 font-black">{formatKz(item.price)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                          <button onClick={() => updatePosQuantity(item.id, -1)} className="px-2 py-1 text-slate-400 hover:text-white transition-colors">
                            <i className="fa-solid fa-minus text-[8px]"></i>
                          </button>
                          <span className="px-2 text-[10px] font-black">{item.quantity}</span>
                          <button onClick={() => updatePosQuantity(item.id, 1)} className="px-2 py-1 text-slate-400 hover:text-white transition-colors">
                            <i className="fa-solid fa-plus text-[8px]"></i>
                          </button>
                        </div>
                        <button onClick={() => removeFromPosCart(item.id)} className="text-slate-600 hover:text-red-500 transition-colors">
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black uppercase text-slate-500 tracking-widest">Total Geral</span>
                  <span className="text-2xl font-black text-amber-500">{formatKz(posTotal)}</span>
                </div>
                <button 
                  onClick={handlePosCheckout}
                  disabled={posCart.length === 0}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-800 disabled:text-slate-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-amber-900/20 active:scale-95 transition-all"
                >
                  <i className="fa-solid fa-receipt mr-2"></i> Finalizar Venda
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'stock' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Gestão de Inventário</h2>
              {isAdmin && (
                <button onClick={onAddProduct} className="bg-amber-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-amber-100 flex items-center gap-2 hover:bg-amber-700 active:scale-95 transition-all">
                  <i className="fa-solid fa-plus"></i> Novo Produto
                </button>
              )}
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                    <th className="p-6">Produto / Categoria</th>
                    <th className="p-6">Estoque Atual</th>
                    <th className="p-6">P. Custo</th>
                    <th className="p-6">P. Venda</th>
                    <th className="p-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-100" />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                            <div className="text-[9px] font-black uppercase text-amber-600 tracking-wider">{p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase ${p.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {p.stock} UNIDADES
                        </span>
                      </td>
                      <td className="p-6 text-sm text-slate-500 font-medium">{formatKz(p.costPrice)}</td>
                      <td className="p-6 text-sm text-slate-900 font-black">{formatKz(p.price)}</td>
                      <td className="p-6 text-right">
                        <div className="flex gap-2 justify-end">
                          {isAdmin && (
                            <>
                              <button onClick={() => onEditProduct(p)} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-amber-600 hover:border-amber-200 rounded-xl transition-all shadow-sm">
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button onClick={() => onDeleteProduct(p.id)} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-xl transition-all shadow-sm">
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'rh' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Recursos Humanos (RH)</h2>
              <button onClick={onAddEmployee} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-slate-200 flex items-center gap-2 hover:bg-amber-600 active:scale-95 transition-all">
                <i className="fa-solid fa-user-plus"></i> Novo Funcionário
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {employees.map(e => (
                <div key={e.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between items-center group hover:border-amber-200 transition-all">
                  <div className="flex items-center gap-6 mb-4 lg:mb-0 w-full lg:w-auto">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-inner">
                      {e.photo ? <img src={e.photo} className="w-full h-full object-cover" /> : <i className="fa-solid fa-user text-slate-300 text-xl"></i>}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{e.name}</h3>
                      <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest">{e.role} • {e.category}</p>
                      <div className="flex gap-2 mt-1">
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Salário: {formatKz(e.salary)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                    <button 
                      onClick={() => onPaySalary(e.id)} 
                      disabled={e.paymentStatus === 'PAGO'}
                      className={`flex-1 lg:flex-none px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg ${e.paymentStatus === 'PAGO' ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-100 active:scale-95'}`}
                    >
                      {e.paymentStatus === 'PAGO' ? 'SALÁRIO EM DIA' : 'PAGAR SALÁRIO'}
                    </button>
                    <button onClick={() => onEditEmployee(e)} className="p-3 bg-slate-50 text-slate-400 hover:text-amber-600 rounded-xl hover:bg-amber-50 transition-all">
                      <i className="fa-solid fa-user-pen"></i>
                    </button>
                    <button onClick={() => onDeleteEmployee(e.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all">
                      <i className="fa-solid fa-user-minus"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Usuários do Sistema</h2>
              <button onClick={onAddUser} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all">
                <i className="fa-solid fa-user-shield"></i> Novo Usuário
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(u => (
                <div key={u.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                      <i className="fa-solid fa-user-circle text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{u.displayName}</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">@{u.username}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                        {u.role === 'admin' ? 'Administrador' : 'Staff'}
                      </span>
                      {u.category && (
                        <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-sm">
                          {u.category}
                        </span>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl flex flex-wrap gap-2">
                       {MENU_DEFS.map(m => u.permissions?.includes(m.id) && (
                         <div key={m.id} className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[8px] shadow-sm text-indigo-500" title={m.label}>
                           <i className={`fa-solid ${m.icon}`}></i>
                         </div>
                       ))}
                    </div>
                    
                    <div className="flex gap-2 justify-end pt-2 border-t border-slate-50">
                      <button onClick={() => onEditUser(u)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
                        <i className="fa-solid fa-user-pen"></i>
                      </button>
                      <button onClick={() => onDeleteUser(u.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <i className="fa-solid fa-user-xmark"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'accounts' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Contas Correntes</h2>
              <button onClick={onAddAccount} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all">
                <i className="fa-solid fa-building-columns"></i> Nova Conta
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {currentAccounts.map(acc => (
                <div key={acc.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center relative overflow-hidden group">
                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${acc.type === 'CLIENTE' ? 'bg-indigo-500' : 'bg-amber-500'}`}></div>
                  <div className="flex items-center gap-6 mb-4 sm:mb-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm ${acc.type === 'CLIENTE' ? 'bg-indigo-50 text-indigo-500' : 'bg-amber-50 text-amber-500'}`}>
                      <i className={`fa-solid ${acc.type === 'CLIENTE' ? 'fa-user-tag' : 'fa-truck-field'}`}></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{acc.entityName}</h3>
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-right">
                    <div className={`text-2xl font-black tracking-tighter ${acc.balance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {formatKz(acc.balance)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'finance' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Fluxo Financeiro</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem]">
                 <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1 block">Receitas</span>
                 <div className="text-2xl font-black text-indigo-700">{formatKz(totalRevenue)}</div>
               </div>
               <div className="bg-slate-50 border border-slate-200 p-6 rounded-[2rem]">
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Despesas</span>
                 <div className="text-2xl font-black text-slate-600">{formatKz(totalExpenses)}</div>
               </div>
            </div>
          </div>
        )}

        {tab === 'categories' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Gerir Categorias</h2>
            <form onSubmit={handleAddCatSubmit} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Tipo de Categoria</label>
                <select 
                  value={catType} 
                  onChange={(e) => setCatType(e.target.value as 'PRODUCT' | 'EMPLOYEE' | 'ADMIN')} 
                  className="w-full bg-slate-50 p-4 rounded-2xl outline-none"
                >
                  <option value="PRODUCT">Produtos</option>
                  <option value="EMPLOYEE">Funcionários (Staff)</option>
                  <option value="ADMIN">Administradores (Gestão)</option>
                </select>
              </div>
              <div className="flex-[2] space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome da Categoria</label>
                <input 
                  type="text" 
                  value={newCatName} 
                  onChange={(e) => setNewCatName(e.target.value)} 
                  placeholder="Ex: Novos Equipamentos"
                  className="w-full bg-slate-50 p-4 rounded-2xl outline-none" 
                />
              </div>
              <button type="submit" className="bg-amber-600 text-white px-8 py-4 rounded-2xl font-black uppercase shadow-lg hover:bg-amber-700 transition-all">Adicionar</button>
            </form>

            {/* Listas de Categorias */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Categorias de Produtos */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-boxes-stacked text-amber-500"></i> Produtos
                </h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl group hover:bg-amber-50 transition-all">
                      <span className="text-sm font-bold text-slate-700">{cat}</span>
                      <button 
                        onClick={() => onRemoveCategory('PRODUCT', cat)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <i className="fa-solid fa-circle-xmark"></i>
                      </button>
                    </div>
                  ))}
                  {categories.length === 0 && <p className="text-xs text-slate-400 italic">Nenhuma categoria definida</p>}
                </div>
              </div>

              {/* Categorias de Funcionários */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-users text-slate-800"></i> Funcionários
                </h3>
                <div className="space-y-2">
                  {employeeCategories.map(cat => (
                    <div key={cat} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl group hover:bg-emerald-50 transition-all">
                      <span className="text-sm font-bold text-slate-700">{cat}</span>
                      <button 
                        onClick={() => onRemoveCategory('EMPLOYEE', cat)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <i className="fa-solid fa-circle-xmark"></i>
                      </button>
                    </div>
                  ))}
                  {employeeCategories.length === 0 && <p className="text-xs text-slate-400 italic">Nenhuma categoria definida</p>}
                </div>
              </div>

              {/* Categorias de Administradores */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-user-shield text-indigo-600"></i> Administradores
                </h3>
                <div className="space-y-2">
                  {adminCategories.map(cat => (
                    <div key={cat} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl group hover:bg-indigo-50 transition-all">
                      <span className="text-sm font-bold text-slate-700">{cat}</span>
                      <button 
                        onClick={() => onRemoveCategory('ADMIN', cat)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <i className="fa-solid fa-circle-xmark"></i>
                      </button>
                    </div>
                  ))}
                  {adminCategories.length === 0 && <p className="text-xs text-slate-400 italic">Nenhuma categoria definida</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
