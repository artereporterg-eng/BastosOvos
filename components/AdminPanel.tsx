
import React, { useState, useMemo } from 'react';
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
  const [tab, setTab] = useState<string>(() => currentUser.permissions[0] || 'dashboard');
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [posSearch, setPosSearch] = useState('');
  
  // States locais para categoria
  const [newProdCat, setNewProdCat] = useState('');
  const [newEmpCat, setNewEmpCat] = useState('');
  const [newAdminCat, setNewAdminCat] = useState('');

  const formatKz = (v: number) => v.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz');
  
  const totalIn = useMemo(() => transactions.filter(t => t.type === 'ENTRADA').reduce((a, b) => a + b.amount, 0), [transactions]);
  const totalOut = useMemo(() => transactions.filter(t => t.type === 'SAIDA').reduce((a, b) => a + b.amount, 0), [transactions]);

  const filteredPosProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(posSearch.toLowerCase()) || p.category.toLowerCase().includes(posSearch.toLowerCase()));
  }, [posSearch, products]);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[700px] flex flex-col md:flex-row animate-fade-in">
      <aside className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2 no-print">
        <div className="mb-4 px-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acesso Restrito</h2>
          <p className="text-sm font-bold text-slate-800 truncate">{currentUser.displayName}</p>
        </div>
        <nav className="space-y-1">
          {MENU_DEFS.map(menu => currentUser.permissions.includes(menu.id) && (
            <button key={menu.id} onClick={() => setTab(menu.id)} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${tab === menu.id ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-white hover:text-amber-600'}`}>
              <i className={`fa-solid ${menu.icon}`}></i> {menu.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-auto flex items-center gap-3 p-4 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-50">
          <i className="fa-solid fa-right-from-bracket"></i> Encerrar Sessão
        </button>
      </aside>

      <section className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
        {tab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Painel de Controle</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                <span className="text-[10px] font-black uppercase text-emerald-600">Total Receitas</span>
                <div className="text-3xl font-black text-emerald-700 mt-2">{formatKz(totalIn)}</div>
              </div>
              <div className="p-8 bg-red-50 rounded-[2.5rem] border border-red-100">
                <span className="text-[10px] font-black uppercase text-red-600">Total Despesas</span>
                <div className="text-3xl font-black text-red-700 mt-2">{formatKz(totalOut)}</div>
              </div>
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                <span className="text-[10px] font-black uppercase text-slate-400">Saldo Geral</span>
                <div className="text-3xl font-black mt-2 text-amber-500">{formatKz(totalIn - totalOut)}</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'caixa' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-fade-in">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase">Ponto de Venda (POS)</h2>
                <input type="text" placeholder="Pesquisar..." value={posSearch} onChange={(e)=>setPosSearch(e.target.value)} className="bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-[55vh] overflow-y-auto scrollbar-hide pb-4">
                {filteredPosProducts.map(p => (
                  <button key={p.id} onClick={()=>{
                    setPosCart(prev => {
                      const ex = prev.find(i=>i.id===p.id);
                      if(ex) return prev.map(i=>i.id===p.id?{...i, quantity: i.quantity+1}:i);
                      return [...prev, {...p, quantity: 1}];
                    });
                  }} className="bg-white p-4 rounded-[2rem] border hover:border-amber-400 text-left space-y-2 transition-all group shadow-sm hover:shadow-md">
                    <img src={p.image} className="w-full aspect-square object-cover rounded-xl mb-2 group-hover:scale-105 transition-all" />
                    <div className="text-xs font-bold truncate">{p.name}</div>
                    <div className="text-xs font-black text-amber-600">{formatKz(p.price)}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col">
              <h3 className="font-black uppercase mb-8">Venda em Curso</h3>
              <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
                {posCart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div className="flex-1 truncate pr-2">{item.name}</div>
                    <div className="font-black text-amber-500">x{item.quantity}</div>
                    <button onClick={()=>setPosCart(p=>p.filter(x=>x.id!==item.id))} className="ml-2 text-slate-500 hover:text-red-400"><i className="fa-solid fa-trash"></i></button>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
                <div className="flex justify-between font-black text-xl"><span>Total</span><span className="text-amber-500">{formatKz(posCart.reduce((a,b)=>a+(b.price*b.quantity),0))}</span></div>
                <button onClick={()=>{onLocalCheckout(posCart); setPosCart([]);}} disabled={posCart.length===0} className="w-full bg-amber-600 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-amber-900/20 active:scale-95 transition-all">Fechar Venda</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'stock' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">Inventário & Estoque</h2>
              <button onClick={onAddProduct} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all">
                <i className="fa-solid fa-plus mr-2"></i> Adicionar Artigo
              </button>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                  <tr>
                    <th className="p-6">Imagem</th>
                    <th className="p-6">Produto</th>
                    <th className="p-6">Stock</th>
                    <th className="p-6">Venda</th>
                    <th className="p-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                          <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                        </div>
                      </td>
                      <td className="p-6 font-bold text-sm">{p.name}</td>
                      <td className="p-6"><span className={`px-3 py-1 rounded-lg text-[10px] font-black ${p.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'}`}>{p.stock} UN</span></td>
                      <td className="p-6 font-black text-amber-600">{formatKz(p.price)}</td>
                      <td className="p-6 text-right">
                        <button onClick={()=>onEditProduct(p)} className="p-2 text-slate-400 hover:text-amber-600 transition-all"><i className="fa-solid fa-pen"></i></button>
                        <button onClick={()=>onDeleteProduct(p.id)} className="p-2 text-slate-400 hover:text-red-500 ml-2 transition-all"><i className="fa-solid fa-trash"></i></button>
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
              <h2 className="text-2xl font-black uppercase">Recursos Humanos</h2>
              <button onClick={onAddEmployee} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase shadow-xl hover:bg-amber-600 transition-all">
                <i className="fa-solid fa-user-plus mr-2"></i> Novo Funcionário
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {employees.map(e => (
                <div key={e.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden shadow-inner">
                      {e.photo ? <img src={e.photo} className="w-full h-full object-cover" /> : <i className="fa-solid fa-user text-xl"></i>}
                    </div>
                    <div>
                      <div className="font-black text-slate-800 leading-tight">{e.name}</div>
                      <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">{e.role}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm font-black text-slate-900">{formatKz(e.salary)}</div>
                    <div className="flex gap-2">
                      <button onClick={()=>onPaySalary(e.id)} disabled={e.paymentStatus === 'PAGO'} className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${e.paymentStatus === 'PAGO' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100'}`}>
                        {e.paymentStatus === 'PAGO' ? 'Pago' : 'Pagar'}
                      </button>
                      <button onClick={()=>onEditEmployee(e)} className="p-2 text-slate-300 hover:text-indigo-600 transition-all"><i className="fa-solid fa-user-pen"></i></button>
                      <button onClick={()=>onDeleteEmployee(e.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><i className="fa-solid fa-user-minus"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">Usuários do Sistema</h2>
              <button onClick={onAddUser} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase shadow-xl hover:bg-indigo-700 transition-all">
                <i className="fa-solid fa-user-shield mr-2"></i> Novo Utilizador
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(u => (
                <div key={u.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner"><i className="fa-solid fa-shield-halved text-xl"></i></div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm leading-none mb-1">{u.displayName}</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">@{u.username}</p>
                      {u.category && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[8px] font-black uppercase tracking-widest border border-indigo-200">
                          {u.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>onEditUser(u)} className="flex-1 bg-slate-50 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-amber-50 hover:text-amber-600 transition-all shadow-sm">Editar</button>
                    <button onClick={()=>onDeleteUser(u.id)} className="flex-1 bg-slate-50 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-red-50 text-red-400 transition-all shadow-sm">Remover</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'finance' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-black uppercase">Fluxo Financeiro</h2>
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                  <tr><th className="p-6">Data</th><th className="p-6">Descrição</th><th className="p-6">Tipo</th><th className="p-6 text-right">Valor</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.slice().reverse().map(t => (
                    <tr key={t.id} className="text-xs hover:bg-slate-50 transition-colors">
                      <td className="p-6 text-slate-500">{t.date}</td>
                      <td className="p-6 font-bold">{t.description}</td>
                      <td className="p-6"><span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${t.type === 'ENTRADA' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{t.type}</span></td>
                      <td className={`p-6 text-right font-black ${t.type === 'ENTRADA' ? 'text-emerald-600' : 'text-red-600'}`}>{formatKz(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'accounts' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">Contas Correntes</h2>
              <button onClick={onAddAccount} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase shadow-xl hover:bg-indigo-700 transition-all">
                <i className="fa-solid fa-plus mr-2"></i> Nova Conta Corrente
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentAccounts.map(acc => (
                <div key={acc.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                  <div>
                    <h3 className="font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">{acc.entityName}</h3>
                    <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{acc.type}</span>
                  </div>
                  <div className={`text-xl font-black ${acc.balance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{formatKz(acc.balance)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'categories' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-black uppercase">Gerir Categorias</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Categorias de Produtos */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-6 text-amber-600">
                  <i className="fa-solid fa-boxes-stacked"></i>
                  <h3 className="font-black uppercase text-xs tracking-widest">Produtos</h3>
                </div>
                <div className="flex gap-2 mb-6">
                  <input type="text" value={newProdCat} onChange={(e)=>setNewProdCat(e.target.value)} placeholder="Nova categoria..." className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-500" />
                  <button onClick={()=>{onAddCategory('PRODUCT', newProdCat); setNewProdCat('');}} className="bg-amber-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-amber-100 transition-all active:scale-90"><i className="fa-solid fa-plus text-xs"></i></button>
                </div>
                <div className="space-y-2 flex-1">
                  {categories.map(c => (
                    <div key={c} className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl font-bold group hover:bg-amber-50 hover:text-amber-700 transition-all">
                      {c} <button onClick={()=>onRemoveCategory('PRODUCT', c)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:scale-125 transition-all"><i className="fa-solid fa-circle-xmark"></i></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorias de Funcionários */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-6 text-emerald-600">
                  <i className="fa-solid fa-users-gear"></i>
                  <h3 className="font-black uppercase text-xs tracking-widest">Funcionários</h3>
                </div>
                <div className="flex gap-2 mb-6">
                  <input type="text" value={newEmpCat} onChange={(e)=>setNewEmpCat(e.target.value)} placeholder="Nova categoria..." className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
                  <button onClick={()=>{onAddCategory('EMPLOYEE', newEmpCat); setNewEmpCat('');}} className="bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 transition-all active:scale-90"><i className="fa-solid fa-plus text-xs"></i></button>
                </div>
                <div className="space-y-2 flex-1">
                  {employeeCategories.map(c => (
                    <div key={c} className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl font-bold group hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                      {c} <button onClick={()=>onRemoveCategory('EMPLOYEE', c)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:scale-125 transition-all"><i className="fa-solid fa-circle-xmark"></i></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorias de Administração */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                  <i className="fa-solid fa-user-lock"></i>
                  <h3 className="font-black uppercase text-xs tracking-widest">Administração</h3>
                </div>
                <div className="flex gap-2 mb-6">
                  <input type="text" value={newAdminCat} onChange={(e)=>setNewAdminCat(e.target.value)} placeholder="Nova categoria..." className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button onClick={()=>{onAddCategory('ADMIN', newAdminCat); setNewAdminCat('');}} className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 transition-all active:scale-90"><i className="fa-solid fa-plus text-xs"></i></button>
                </div>
                <div className="space-y-2 flex-1">
                  {adminCategories.map(c => (
                    <div key={c} className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl font-bold group hover:bg-indigo-50 hover:text-indigo-700 transition-all">
                      {c} <button onClick={()=>onRemoveCategory('ADMIN', c)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:scale-125 transition-all"><i className="fa-solid fa-circle-xmark"></i></button>
                    </div>
                  ))}
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
