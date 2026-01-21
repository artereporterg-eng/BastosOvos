
import React, { useState, useEffect } from 'react';
import { Employee } from '../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (emp: Partial<Employee>) => void;
  employee: Employee | null;
  categories: string[];
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSave, employee, categories }) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '', 
    role: '', 
    category: categories[0], 
    salary: 0, 
    admissionDate: new Date().toISOString().split('T')[0], 
    contact: '', 
    paymentStatus: 'PENDENTE',
    photo: '',
    idCardDoc: '',
    cvDoc: ''
  });

  // Estados locais para exibir os nomes dos arquivos
  const [idCardFileName, setIdCardFileName] = useState<string>('');
  const [cvFileName, setCvFileName] = useState<string>('');

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      setIdCardFileName(employee.idCardDoc ? 'Documento carregado' : '');
      setCvFileName(employee.cvDoc ? 'Currículo carregado' : '');
    } else {
      setFormData({ 
        name: '', 
        role: '', 
        category: categories[0], 
        salary: 0, 
        admissionDate: new Date().toISOString().split('T')[0], 
        contact: '', 
        paymentStatus: 'PENDENTE',
        photo: '',
        idCardDoc: '',
        cvDoc: ''
      });
      setIdCardFileName('');
      setCvFileName('');
    }
  }, [employee, isOpen, categories]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'idCardDoc' | 'cvDoc') => {
    const file = e.target.files?.[0];
    if (file) {
      if (field === 'idCardDoc') setIdCardFileName(file.name);
      if (field === 'cvDoc') setCvFileName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-user-tie text-amber-500"></i>
            <h2 className="text-xl font-black uppercase tracking-tight">
              {employee ? 'Editar Funcionário' : 'Novo Funcionário'}
            </h2>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form className="p-8 space-y-6 overflow-y-auto flex-1 scrollbar-hide" onSubmit={handleSubmit}>
          {/* Dados Pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome Completo</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none font-medium" placeholder="Ex: Manuel dos Santos" />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Cargo / Função</label>
              <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none font-medium" placeholder="Ex: Técnico Avícola" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Categoria RH</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-700">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Salário Base (Kz)</label>
              <input type="number" required value={formData.salary} onChange={e => setFormData({...formData, salary: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none font-black text-amber-600" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Telefone de Contacto</label>
              <input required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none font-medium" placeholder="+244 9..." />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Upload de Documentos */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Documentação e Mídia</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Foto de Perfil */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 block text-center md:text-left">Foto de Perfil</label>
                <div className="relative group mx-auto md:mx-0">
                  <div className="w-full aspect-square bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 group-hover:border-amber-400 transition-colors">
                    {formData.photo ? (
                      <img src={formData.photo} className="w-full h-full object-cover" alt="Perfil" />
                    ) : (
                      <i className="fa-solid fa-camera text-2xl text-slate-300"></i>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} className="absolute inset-0 opacity-0 cursor-pointer" title="Escolher foto de perfil" />
                  </div>
                </div>
              </div>

              {/* Bilhete de Identidade */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 block text-center md:text-left">Bilhete (BI)</label>
                <div className="relative group">
                  <div className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all ${formData.idCardDoc ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-300 hover:border-indigo-400'}`}>
                    <i className={`fa-solid ${formData.idCardDoc ? 'fa-id-card' : 'fa-file-arrow-up'} text-2xl mb-2`}></i>
                    <span className="text-[8px] font-black uppercase">{formData.idCardDoc ? 'Carregado' : 'Upload BI'}</span>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, 'idCardDoc')} className="absolute inset-0 opacity-0 cursor-pointer" title="Fazer upload do BI" />
                  </div>
                  {idCardFileName && (
                    <div className="text-[9px] text-center mt-2 font-bold text-slate-500 break-all px-1 leading-tight">
                      {idCardFileName}
                    </div>
                  )}
                </div>
              </div>

              {/* Curriculum Vitae */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 block text-center md:text-left">Curriculum (CV)</label>
                <div className="relative group">
                  <div className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all ${formData.cvDoc ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-300 hover:border-blue-400'}`}>
                    <i className={`fa-solid ${formData.cvDoc ? 'fa-file-pdf' : 'fa-file-circle-plus'} text-2xl mb-2`}></i>
                    <span className="text-[8px] font-black uppercase">{formData.cvDoc ? 'Carregado' : 'Upload CV'}</span>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'cvDoc')} className="absolute inset-0 opacity-0 cursor-pointer" title="Fazer upload do CV" />
                  </div>
                  {cvFileName && (
                    <div className="text-[9px] text-center mt-2 font-bold text-slate-500 break-all px-1 leading-tight">
                      {cvFileName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-slate-200 transition-all hover:bg-amber-600 active:scale-95">
            <i className="fa-solid fa-save mr-2"></i>
            {employee ? 'Salvar Alterações' : 'Contratar Funcionário'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
