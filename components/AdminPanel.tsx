
import React, { useState } from 'react';
import { Product, User } from '../types';

interface AdminPanelProps {
  products: Product[];
  users: User[];
  categories: string[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: number) => void;
  onAddUser: (username: string, role: 'admin' | 'staff') => void;
  onDeleteUser: (id: number) => void;
  onLogout: () => void;
  onAddCategory: (name: string) => void;
  onUpdateCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, 
  users, 
  categories,
  onAdd, 
  onUpdate, 
  onDelete, 
  onAddUser, 
  onDeleteUser,
  onLogout,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'categories'>('products');
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'staff'>('staff');
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: categories[0] || 'Geral',
    image: 'https://picsum.photos/seed/new/400/400',
    rating: 5.0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      onUpdate({ ...isEditing, ...formData } as Product);
      setIsEditing(null);
    } else {
      onAdd(formData as Omit<Product, 'id'>);
      setIsAdding(false);
    }
    setFormData({ name: '', description: '', price: 0, category: categories[0] || 'Geral', image: 'https://picsum.photos/seed/new/400/400', rating: 5.0 });
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername.trim()) {
      onAddUser(newUsername.trim(), newUserRole);
      setNewUsername('');
      setNewUserRole('staff');
      setIsAddingUser(false);
    }
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    if (isEditingCategory) {
      onUpdateCategory(isEditingCategory, newCategoryName.trim());
      setIsEditingCategory(null);
    } else {
      onAddCategory(newCategoryName.trim());
    }
    setNewCategoryName('');
  };

  const startEdit = (product: Product) => {
    setIsEditing(product);
    setFormData(product);
    setIsAdding(false);
    setActiveTab('products');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Admin Header with Tabs */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 gap-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('products')}
            className={`text-sm font-bold transition-all pb-3 border-b-2 ${activeTab === 'products' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            <i className="fa-solid fa-boxes-stacked mr-2"></i>
            Produtos
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`text-sm font-bold transition-all pb-3 border-b-2 ${activeTab === 'categories' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            <i className="fa-solid fa-tags mr-2"></i>
            Categorias
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`text-sm font-bold transition-all pb-3 border-b-2 ${activeTab === 'users' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            <i className="fa-solid fa-users-gear mr-2"></i>
            Usuários
          </button>
        </div>
        
        <button 
          onClick={onLogout}
          className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors flex items-center gap-2 mb-2 sm:mb-0"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Sair do Admin
        </button>
      </div>

      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'products' ? 'Gerenciamento de Estoque' : activeTab === 'categories' ? 'Gestão de Categorias' : 'Gestão de Usuários'}
          </h2>
          <p className="text-slate-500 text-sm">
            {activeTab === 'products' 
              ? 'Adicione e organize os produtos da sua loja.' 
              : activeTab === 'categories' 
              ? 'Defina as categorias para organizar seu catálogo.' 
              : 'Cadastre e gerencie as permissões de acesso da sua equipe.'}
          </p>
        </div>
        {activeTab === 'products' ? (
          <button 
            onClick={() => { setIsAdding(true); setIsEditing(null); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 w-full sm:w-auto justify-center"
          >
            <i className="fa-solid fa-plus"></i>
            Novo Produto
          </button>
        ) : activeTab === 'categories' ? (
          <div className="flex gap-2 w-full sm:w-auto">
             <form onSubmit={handleCategorySubmit} className="flex gap-2 w-full sm:w-auto">
                <input 
                  type="text"
                  placeholder="Nome da categoria..."
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-48"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 shrink-0"
                >
                  <i className={`fa-solid ${isEditingCategory ? 'fa-check' : 'fa-plus'}`}></i>
                  <span className="hidden sm:inline">{isEditingCategory ? 'Salvar' : 'Adicionar'}</span>
                </button>
                {isEditingCategory && (
                  <button 
                    type="button"
                    onClick={() => { setIsEditingCategory(null); setNewCategoryName(''); }}
                    className="p-2 text-slate-400 hover:text-slate-600"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
             </form>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingUser(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 w-full sm:w-auto justify-center"
          >
            <i className="fa-solid fa-user-plus"></i>
            Cadastrar Usuário
          </button>
        )}
      </div>

      {activeTab === 'products' ? (
        <>
          {(isAdding || isEditing) && (
            <div className="p-6 bg-indigo-50/30 border-b border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome do Produto</label>
                  <input 
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Preço (R$)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    {categories.length === 0 && <option value="Geral">Geral</option>}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
                  <input 
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">URL da Imagem</label>
                  <input 
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                  />
                </div>
                <div className="lg:col-span-3 flex justify-end gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => { setIsAdding(false); setIsEditing(null); }}
                    className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                  >
                    {isEditing ? 'Salvar Alterações' : 'Criar Produto'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                        <div>
                          <div className="font-semibold text-slate-800">{product.name}</div>
                          <div className="text-xs text-slate-400 truncate max-w-[200px]">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEdit(product)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button 
                          onClick={() => onDelete(product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : activeTab === 'categories' ? (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                <span className="font-medium text-slate-700">{cat}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setIsEditingCategory(cat); setNewCategoryName(cat); }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button 
                    onClick={() => onDeleteCategory(cat)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {isAddingUser && (
            <div className="p-6 bg-indigo-50/30 border-b border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <form onSubmit={handleAddUserSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome de Usuário</label>
                  <input 
                    autoFocus
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Ex: joao_silva"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nível de Acesso</label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as 'admin' | 'staff')}
                  >
                    <option value="staff">Staff (Equipe)</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="lg:col-span-1 flex items-end gap-2 pb-0.5">
                  <button 
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors text-sm w-full md:w-auto"
                  >
                    Confirmar Cadastro
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAddingUser(false)}
                    className="px-4 py-2 text-slate-500 font-medium text-sm hover:text-slate-700"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Usuário</th>
                  <th className="px-6 py-4">Nível</th>
                  <th className="px-6 py-4">Data de Criação</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                          <i className={`fa-solid ${user.role === 'admin' ? 'fa-user-shield' : 'fa-user'}`}></i>
                        </div>
                        <div className="font-semibold text-slate-800">{user.username}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.username !== 'admin' ? (
                        <button 
                          onClick={() => onDeleteUser(user.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Remover Usuário"
                        >
                          <i className="fa-solid fa-user-minus"></i>
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs italic pr-2">Sistema</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
