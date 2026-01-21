
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  user: User | null;
  adminCategories: string[];
}

const PERMISSIONS_LIST = [
  { id: 'dashboard', label: 'Painel de Controle' },
  { id: 'caixa', label: 'Caixa (POS)' },
  { id: 'stock', label: 'Inventário' },
  { id: 'rh', label: 'Recursos Humanos' },
  { id: 'users', label: 'Usuários' },
  { id: 'finance', label: 'Financeiro' },
  { id: 'accounts', label: 'Contas Correntes' },
  { id: 'categories', label: 'Categorias' },
];

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user, adminCategories }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    username: '',
    password: '',
    displayName: '',
    role: 'staff',
    category: adminCategories[0],
    permissions: []
  });

  useEffect(() => {
    if (user) setFormData(user);
    else setFormData({ username: '', password: '', displayName: '', role: 'staff', category: adminCategories[0], permissions: [] });
  }, [user, isOpen]);

  if (!isOpen) return null;

  const togglePermission = (permId: string) => {
    const current = formData.permissions || [];
    if (current.includes(permId)) {
      setFormData({ ...formData, permissions: current.filter(p => p !== permId) });
    } else {
      setFormData({ ...formData, permissions: [...current, permId] });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-black uppercase tracking-tight">{user ? 'Editar Utilizador' : 'Novo Utilizador'}</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>
        <form className="p-8 space-y-6 overflow-y-auto flex-1" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome de Exibição</label>
              <input required value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: João Gestor" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Usuário (Login)</label>
              <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="ex: joao.pinto" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Senha</label>
              <input type="password" required={!user} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Categoria</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none">
                {adminCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Permissões de Acesso</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PERMISSIONS_LIST.map(perm => (
                <label key={perm.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.permissions?.includes(perm.id) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400'}`}>
                  <input type="checkbox" className="hidden" checked={formData.permissions?.includes(perm.id)} onChange={() => togglePermission(perm.id)} />
                  <i className={`fa-solid ${formData.permissions?.includes(perm.id) ? 'fa-circle-check' : 'fa-circle'} text-xs`}></i>
                  <span className="text-xs font-bold">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95">
            {user ? 'Salvar Alterações' : 'Criar Utilizador'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
