
import React, { useState, useMemo } from 'react';
import { Product, Employee, User, FinancialTransaction, CurrentAccount } from '../types';

interface AdminPanelProps {
  currentUser: User;
  products: Product[];
  employees: Employee[];
  users: User[];
  categories: string[];
  employeeCategories: string[];
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
  onAddCategory: (type: 'PRODUCT' | 'EMPLOYEE', name: string) => void;
  onRemoveCategory: (type: 'PRODUCT' | 'EMPLOYEE', name: string) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  currentUser, products, employees, users, categories, employeeCategories, transactions, currentAccounts,
  onAddProduct, onEditProduct, onDeleteProduct,
  onAddEmployee, onEditEmployee, onDeleteEmployee, onPaySalary,
  onAddUser, onEditUser, onDeleteUser,
  onAddAccount, onAddCategory, onRemoveCategory, onLogout 
}) => {
  const [tab, setTab] = useState<'dashboard' | 'stock' | 'rh' | 'users' | 'finance' | 'accounts' | 'categories'>('dashboard');
  const [newCatName, setNewCatName] = useState('');
  const [catType, setCatType] = useState<'PRODUCT' | 'EMPLOYEE'>('PRODUCT');
  
  const formatKz = (v: number) => v.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz');

  const isAdmin = currentUser.role === 'admin';

  const stockValuationCost = useMemo(() => products.reduce((acc, p) => acc + (p.costPrice * p.stock), 0), [products]);
  const totalRevenue = useMemo(() => transactions.filter(t => t.type === 'ENTRADA').reduce((acc, t) => acc + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === 'SAIDA').reduce((acc, t) => acc + t.amount, 0), [transactions]);

  // Cálculos para o Relatório Financeiro (Lucro Bruto)
  const salesTransactions = useMemo(() => transactions.filter(t => t.category === 'Vendas'), [transactions]);
  const totalSalesRevenue = useMemo(() => salesTransactions.reduce((acc, t) => acc + t.amount, 0), [salesTransactions]);
  const totalSalesCost = useMemo(() => salesTransactions.reduce((acc, t) => acc + (t.cost || 0), 0), [salesTransactions]);
  const grossProfitFromSales = totalSalesRevenue - totalSalesCost;

  const handleAddCatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(catType, newCatName.trim());
    setNewCatName('');
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[700px] flex flex-col md:flex-row animate-fade-in">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2 no-print">
        <div className="mb-4 px-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Acesso: {currentUser.role === 'admin' ? 'Admin' : 'Funcionário'}</h2>
          <p className="text-sm font-bold text-slate-800 truncate">{currentUser.displayName}</p>
        </div>
        
        <div className="mb-4 px-4 border-t pt-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menu de Gestão</h2>
        </div>
        
        <button onClick={() => setTab('dashboard')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${tab === 'dashboard' ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-white hover:text-amber-600'}`}>
          <i className="fa-solid fa-gauge-high"></i> Painel de Controle
        </button>

        <button onClick={() => setTab('stock')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${tab === 'stock' ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-white hover:text-amber-600'}`}>
          <i className="fa-solid fa-boxes-stacked"></i> Inventário & Estoque
        </button>

        {/* Abas restritas ao Administrador */}
        {isAdmin && (
          <>
            <button onClick={() => setTab('rh')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${tab === 'rh' ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-white hover:text-amber-600'}`}>
              <i className="fa-solid fa-users-gear"></i> Recursos Humanos
            </button>

            <button onClick={() => setTab('users')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${tab === 'users' ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-white hover:text-amber-600'}`}>
              <i className="fa-solid fa-user-lock"></i> Usuários do Sistema
            </button>
          </>
        )}

        <button onClick={() => setTab('finance')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${tab === 'finance' ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-white hover:text-amber-600'}`}>
          <i className="fa-solid fa-wallet"></i> Fluxo Financeiro
        </button>

        {isAdmin && (
          <>
            <button onClick={() => setTab('accounts')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${tab === 'accounts' ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-white hover:text-amber-600'}`}>
              <i className="fa-solid fa-scale-balanced"></i> Contas Correntes
            </button>

            <button onClick={() => setTab('categories')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-all ${tab === 'categories' ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:bg-white hover:text-amber-600'}`}>
              <i className="fa-solid fa-tags"></i> Gerir Categorias
            </button>
          </>
        )}

        <div className="mt-auto pt-6 border-t border-slate-200">
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-50">
            <i className="fa-solid fa-right-from-bracket"></i> Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <section className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
        {tab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Visão Geral do Negócio</h2>
              <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-xs font-bold border border-amber-100 uppercase tracking-widest">Quinta dos Ovos • Angola</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-4">Faturamento Bruto</span>
                <div className="text-2xl font-black text-emerald-700">{formatKz(totalRevenue)}</div>
              </div>
              <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-red-600 tracking-widest mb-4">Saídas Totais</span>
                <div className="text-2xl font-black text-red-700">{formatKz(totalExpenses)}</div>
              </div>
              <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex flex-col justify-between shadow-xl shadow-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Saldo Líquido</span>
                <div className="text-2xl font-black text-white">{formatKz(totalRevenue - totalExpenses)}</div>
              </div>
              <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-4">Patrimônio (Custo)</span>
                <div className="text-2xl font-black text-amber-700">{formatKz(stockValuationCost)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6">Últimas Transações</h3>
                <div className="space-y-4">
                  {transactions.slice(0, 5).reverse().map(t => (
                    <div key={t.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                      <div>
                        <div className="text-sm font-bold text-slate-800">{t.description}</div>
                        <div className="text-[10px] font-black uppercase text-slate-400">{t.date}</div>
                      </div>
                      <div className={`font-black ${t.type === 'ENTRADA' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {t.type === 'ENTRADA' ? '+' : '-'}{formatKz(t.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6">Estado do Estoque</h3>
                <div className="space-y-4">
                  {products.slice(0, 5).sort((a,b) => a.stock - b.stock).map(p => (
                    <div key={p.id} className="flex justify-between items-center">
                      <div className="text-sm font-bold text-slate-700">{p.name}</div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                        {p.stock} UNIDADES
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'stock' && (
          <div className="space-y-8">
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
                          {!isAdmin && (
                            <span className="text-[10px] text-slate-300 font-black uppercase">Apenas Visualização</span>
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

        {tab === 'rh' && isAdmin && (
          <div className="space-y-8">
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
                        <div className="flex gap-1">
                          {e.idCardDoc && <i className="fa-solid fa-address-card text-[9px] text-indigo-400" title="BI Anexado"></i>}
                          {e.cvDoc && <i className="fa-solid fa-file-invoice text-[9px] text-indigo-400" title="CV Anexado"></i>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center lg:items-end gap-2 mb-4 lg:mb-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${e.paymentStatus === 'PAGO' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {e.paymentStatus || 'PENDENTE'}
                      </span>
                    </div>
                    {e.lastPaymentDate && (
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Último Pagamento: {new Date(e.lastPaymentDate).toLocaleDateString('pt-AO')}
                      </div>
                    )}
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

        {tab === 'users' && isAdmin && (
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
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                      {u.role === 'admin' ? 'Administrador' : 'Funcionário'}
                    </span>
                    <div className="flex gap-2">
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

        {tab === 'accounts' && isAdmin && (
          <div className="space-y-8">
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
                      <div className="flex gap-2 mt-1">
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded text-slate-500">{acc.type}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Atividade: {acc.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-right">
                    <div className={`text-2xl font-black tracking-tighter ${acc.balance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {formatKz(acc.balance)}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${acc.status === 'DEVEDOR' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {acc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'finance' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Relatório Financeiro Detalhado</h2>
            
            {/* Resumo Financeiro - Lucro Bruto apenas para Admins */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem]">
                 <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1 block">Receita de Vendas</span>
                 <div className="text-2xl font-black text-indigo-700">{formatKz(totalSalesRevenue)}</div>
               </div>
               
               {isAdmin ? (
                 <>
                   <div className="bg-slate-50 border border-slate-200 p-6 rounded-[2rem]">
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Custo de Mercadoria</span>
                     <div className="text-2xl font-black text-slate-600">{formatKz(totalSalesCost)}</div>
                   </div>
                   <div className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-xl shadow-emerald-100">
                     <span className="text-[10px] font-black uppercase text-emerald-200 tracking-widest mb-1 block">Lucro Bruto (Vendas)</span>
                     <div className="text-2xl font-black">{formatKz(grossProfitFromSales)}</div>
                     <div className="text-[10px] font-bold mt-2 opacity-80">Margem: {totalSalesRevenue > 0 ? ((grossProfitFromSales / totalSalesRevenue) * 100).toFixed(1) : 0}%</div>
                   </div>
                 </>
               ) : (
                 <div className="md:col-span-2 bg-slate-50 border border-dashed border-slate-200 p-6 rounded-[2rem] flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                   Métricas de Lucro Reservadas ao Administrador
                 </div>
               )}
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Histórico Completo</h3>
                <button onClick={() => window.print()} className="text-[10px] font-black text-amber-600 uppercase border border-amber-100 px-3 py-1 rounded-lg hover:bg-amber-50">
                  <i className="fa-solid fa-print mr-1"></i> Imprimir Extrato
                </button>
              </div>
              <div className="space-y-2">
                {transactions.slice().reverse().map(t => (
                  <div key={t.id} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl transition-all border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${t.type === 'ENTRADA' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        <i className={`fa-solid ${t.type === 'ENTRADA' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{t.description}</div>
                        <div className="text-[10px] font-black uppercase text-slate-400">{t.date} • <span className="text-slate-900">{t.category}</span></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-black text-lg tracking-tighter ${t.type === 'ENTRADA' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {t.type === 'ENTRADA' ? '+' : '-'}{formatKz(t.amount)}
                      </div>
                      {isAdmin && t.cost && t.category === 'Vendas' && (
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Custo: {formatKz(t.cost)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'categories' && isAdmin && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Gestão de Categorias</h2>
            
            <form onSubmit={handleAddCatSubmit} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Tipo de Categoria</label>
                <select 
                  value={catType} 
                  onChange={(e) => setCatType(e.target.value as 'PRODUCT' | 'EMPLOYEE')}
                  className="w-full bg-slate-50 p-4 rounded-2xl outline-none"
                >
                  <option value="PRODUCT">Produtos</option>
                  <option value="EMPLOYEE">Funcionários</option>
                </select>
              </div>
              <div className="flex-[2] space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome da Categoria</label>
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Ex: Frangos de Corte"
                  className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button type="submit" className="bg-amber-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-amber-700 active:scale-95 transition-all">
                Adicionar
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Categories */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-boxes-stacked text-amber-500"></i> Categorias de Produtos
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
                </div>
              </div>

              {/* Employee Categories */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-users text-slate-800"></i> Categorias de Funcionários
                </h3>
                <div className="space-y-2">
                  {employeeCategories.map(cat => (
                    <div key={cat} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-all">
                      <span className="text-sm font-bold text-slate-700">{cat}</span>
                      <button 
                        onClick={() => onRemoveCategory('EMPLOYEE', cat)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <i className="fa-solid fa-circle-xmark"></i>
                      </button>
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
