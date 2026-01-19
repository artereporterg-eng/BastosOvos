
import React, { useState, useRef } from 'react';
import { Product, User, Employee } from '../types';

interface AdminPanelProps {
  products: Product[];
  users: User[];
  employees: Employee[];
  categories: string[];
  employeeCategories: string[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: number) => void;
  onAddEmployee: (emp: Omit<Employee, 'id'>) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: number) => void;
  onPaySalary: (id: number) => void;
  onLogout: () => void;
  onAddCategory: (name: string) => void;
  onUpdateCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
  onAddEmployeeCategory: (name: string) => void;
  onUpdateEmployeeCategory: (oldName: string, newName: string) => void;
  onDeleteEmployeeCategory: (name: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, 
  users, 
  employees,
  categories,
  employeeCategories,
  onAdd, 
  onUpdate, 
  onDelete, 
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onPaySalary,
  onLogout,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddEmployeeCategory,
  onUpdateEmployeeCategory,
  onDeleteEmployeeCategory
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'rh'>('products');
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const [isEditingEmployee, setIsEditingEmployee] = useState<Employee | null>(null);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);

  // Estados de preview para o formulário de RH
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [cvPreview, setCvPreview] = useState<string | null>(null);

  // Refs para inputs escondidos
  const photoInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'idCard' | 'cv') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (type === 'photo') setPhotoPreview(base64);
      if (type === 'idCard') setIdCardPreview(base64);
      if (type === 'cv') setCvPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const [isEditingCategory, setIsEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [isEditingEmpCategory, setIsEditingEmpCategory] = useState<string | null>(null);
  const [newEmpCategoryName, setNewEmpCategoryName] = useState('');

  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', description: '', price: 0, category: categories[0] || 'Geral', image: '', stock: 10
  });

  const [employeeForm, setEmployeeForm] = useState<Partial<Employee>>({
    name: '', role: '', category: employeeCategories[0] || 'Produção', salary: 0, admissionDate: '', contact: ''
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingProduct) {
      onUpdate({ ...isEditingProduct, ...productForm } as Product);
      setIsEditingProduct(null);
    } else {
      onAdd(productForm as Omit<Product, 'id'>);
      setIsAddingProduct(false);
    }
  };

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
        ...employeeForm,
        photo: photoPreview || undefined,
        idCardDoc: idCardPreview || undefined,
        cvDoc: cvPreview || undefined
    };
    if (isEditingEmployee) {
      onUpdateEmployee({ ...isEditingEmployee, ...finalData } as Employee);
      setIsEditingEmployee(null);
    } else {
      onAddEmployee(finalData as Omit<Employee, 'id'>);
      setIsAddingEmployee(false);
    }
    setEmployeeForm({ name: '', role: '', category: employeeCategories[0] || 'Produção', salary: 0, admissionDate: '', contact: '' });
    setPhotoPreview(null);
    setIdCardPreview(null);
    setCvPreview(null);
  };

  const resetEmployeeForm = () => {
    setIsAddingEmployee(false);
    setIsEditingEmployee(null);
    setPhotoPreview(null);
    setIdCardPreview(null);
    setCvPreview(null);
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

  const handleEmpCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpCategoryName.trim()) return;
    if (isEditingEmpCategory) {
      onUpdateEmployeeCategory(isEditingEmpCategory, newEmpCategoryName.trim());
      setIsEditingEmpCategory(null);
    } else {
      onAddEmployeeCategory(newEmpCategoryName.trim());
    }
    setNewEmpCategoryName('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Admin Tabs */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
        <div className="flex gap-6">
          {[
            { id: 'products', icon: 'fa-boxes-stacked', label: 'Estoque' },
            { id: 'categories', icon: 'fa-tags', label: 'Categorias' },
            { id: 'rh', icon: 'fa-users-gear', label: 'RH' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-sm font-bold pb-3 border-b-2 transition-all ${activeTab === tab.id ? 'text-amber-600 border-amber-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              <i className={`fa-solid ${tab.icon} mr-2`}></i>{tab.label}
            </button>
          ))}
        </div>
        <button onClick={onLogout} className="text-red-500 text-sm font-bold hover:bg-red-50 px-3 py-1 rounded-lg">
          <i className="fa-solid fa-right-from-bracket mr-2"></i>Sair
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tighter">Gestão de Estoque</h2>
              <button 
                onClick={() => { setIsAddingProduct(true); setIsEditingProduct(null); setProductForm({ name: '', description: '', price: 0, category: categories[0] || 'Geral', image: '', stock: 10 }); }}
                className="bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-amber-100"
              >
                <i className="fa-solid fa-plus mr-2"></i>Novo Produto
              </button>
            </div>

            {(isAddingProduct || isEditingProduct) && (
              <form onSubmit={handleProductSubmit} className="p-6 bg-amber-50 rounded-2xl border border-amber-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                <input type="text" placeholder="Nome" className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
                <input type="number" step="0.01" placeholder="Preço" className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})} required />
                <select className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" placeholder="Estoque" className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value)})} required />
                <input type="text" placeholder="URL da Imagem" className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} required />
                <input type="text" placeholder="Descrição" className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500 lg:col-span-2" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required />
                <div className="lg:col-span-3 flex justify-end gap-2">
                  <button type="button" onClick={() => { setIsAddingProduct(false); setIsEditingProduct(null); }} className="px-4 py-2 text-slate-500">Cancelar</button>
                  <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg">{isEditingProduct ? 'Atualizar' : 'Cadastrar'}</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase text-slate-400 font-black tracking-widest border-b">
                  <tr>
                    <th className="p-4">Produto</th>
                    <th className="p-4">Preço</th>
                    <th className="p-4">Estoque</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-slate-800">{p.name}</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">{p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold">Kz {p.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>{p.stock} UN</span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => { setIsEditingProduct(p); setProductForm(p); }} className="text-amber-600 p-2"><i className="fa-solid fa-pen"></i></button>
                        <button onClick={() => onDelete(p.id)} className="text-red-500 p-2"><i className="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tighter">Categorias de Produtos</h2>
              <form onSubmit={handleCategorySubmit} className="flex gap-2">
                <input type="text" placeholder="Nova categoria de produto..." className="flex-1 bg-slate-100 p-3 rounded-xl outline-none" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} required />
                <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg">{isEditingCategory ? 'Salvar' : 'Adicionar'}</button>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map(cat => (
                  <div key={cat} className="p-4 bg-white border border-slate-100 rounded-2xl flex justify-between items-center group">
                    <span className="font-bold text-slate-700">{cat}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setIsEditingCategory(cat); setNewCategoryName(cat); }} className="text-amber-600 p-2"><i className="fa-solid fa-pen"></i></button>
                      <button onClick={() => onDeleteCategory(cat)} className="text-red-500 p-2"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tighter">Categorias de Funcionários (RH)</h2>
              <form onSubmit={handleEmpCategorySubmit} className="flex gap-2">
                <input type="text" placeholder="Nova categoria de funcionário..." className="flex-1 bg-slate-100 p-3 rounded-xl outline-none" value={newEmpCategoryName} onChange={e => setNewEmpCategoryName(e.target.value)} required />
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg">{isEditingEmpCategory ? 'Salvar' : 'Adicionar'}</button>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {employeeCategories.map(cat => (
                  <div key={cat} className="p-4 bg-white border border-slate-100 rounded-2xl flex justify-between items-center group">
                    <span className="font-bold text-slate-700">{cat}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setIsEditingEmpCategory(cat); setNewEmpCategoryName(cat); }} className="text-indigo-600 p-2"><i className="fa-solid fa-pen"></i></button>
                      <button onClick={() => onDeleteEmployeeCategory(cat)} className="text-red-500 p-2"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rh' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tighter">Recursos Humanos</h2>
              <button 
                onClick={() => { setIsAddingEmployee(true); setIsEditingEmployee(null); setEmployeeForm({ name: '', role: '', category: employeeCategories[0] || 'Produção', salary: 0, admissionDate: '', contact: '' }); }}
                className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg"
              >
                <i className="fa-solid fa-user-plus mr-2"></i>Novo Funcionário
              </button>
            </div>

            {(isAddingEmployee || isEditingEmployee) && (
              <form onSubmit={handleEmployeeSubmit} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-fade-in flex flex-col lg:flex-row gap-8">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Nome Completo" className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" value={employeeForm.name} onChange={e => setEmployeeForm({...employeeForm, name: e.target.value})} required />
                  <input type="text" placeholder="Cargo" className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" value={employeeForm.role} onChange={e => setEmployeeForm({...employeeForm, role: e.target.value})} required />
                  <select className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" value={employeeForm.category} onChange={e => setEmployeeForm({...employeeForm, category: e.target.value})}>
                    {employeeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <input type="number" placeholder="Salário (Kz)" className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" value={employeeForm.salary} onChange={e => setEmployeeForm({...employeeForm, salary: parseFloat(e.target.value)})} required />
                  <input type="text" placeholder="Contato" className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" value={employeeForm.contact} onChange={e => setEmployeeForm({...employeeForm, contact: e.target.value})} required />
                  <input type="date" className="p-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-amber-500" value={employeeForm.admissionDate} onChange={e => setEmployeeForm({...employeeForm, admissionDate: e.target.value})} required />
                </div>
                
                <div className="w-full lg:w-72 space-y-4 border-l border-slate-200 pl-8">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b pb-2">Documentação</h3>
                  
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase text-slate-400 block tracking-widest">Foto Perfil</label>
                    <div 
                      onClick={() => photoInputRef.current?.click()}
                      className="w-24 h-24 mx-auto bg-white rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all group"
                    >
                      {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <i className="fa-solid fa-camera text-slate-300 group-hover:text-amber-500"></i>}
                      <input ref={photoInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} className="hidden" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase text-slate-400 block tracking-widest">Imagem do BI</label>
                    <div 
                      onClick={() => idInputRef.current?.click()}
                      className="w-full aspect-video bg-white rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                    >
                      {idCardPreview ? <img src={idCardPreview} className="w-full h-full object-cover" /> : <i className="fa-solid fa-id-card text-slate-300 group-hover:text-emerald-500"></i>}
                      <input ref={idInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'idCard')} className="hidden" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={resetEmployeeForm} className="px-4 py-2 text-slate-500 text-xs font-bold">Cancelar</button>
                    <button type="submit" className="bg-slate-800 text-white px-6 py-2 rounded-xl font-bold shadow-lg text-xs">{isEditingEmployee ? 'Atualizar' : 'Efetivar'}</button>
                  </div>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase text-slate-400 font-black tracking-widest border-b">
                  <tr>
                    <th className="p-4">Funcionário</th>
                    <th className="p-4">Cargo / Cat</th>
                    <th className="p-4">Salário</th>
                    <th className="p-4 text-right">Gestão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            {emp.photo ? <img src={emp.photo} className="w-full h-full object-cover" /> : <i className="fa-solid fa-user text-slate-300 w-full h-full flex items-center justify-center"></i>}
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">{emp.name}</div>
                            <div className="text-[10px] text-slate-400">{emp.contact}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-600">{emp.role}</div>
                        <span className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 bg-slate-100 rounded">{emp.category}</span>
                      </td>
                      <td className="p-4 font-black text-slate-900 text-sm">{emp.salary.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz')}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => onPaySalary(emp.id)} className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-black hover:bg-emerald-600 hover:text-white transition-all">PAGAR</button>
                        <button onClick={() => { 
                            setIsEditingEmployee(emp); 
                            setEmployeeForm(emp);
                            setPhotoPreview(emp.photo || null);
                            setIdCardPreview(emp.idCardDoc || null);
                            setCvPreview(emp.cvDoc || null);
                        }} className="text-amber-600 p-2"><i className="fa-solid fa-pen"></i></button>
                        <button onClick={() => onDeleteEmployee(emp.id)} className="text-red-500 p-2"><i className="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
