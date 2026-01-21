
import React, { useState } from 'react';
import { CurrentAccount } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (acc: Partial<CurrentAccount>) => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<CurrentAccount>>({
    entityName: '', type: 'CLIENTE', balance: 0, status: 'LIMPO', lastActivity: new Date().toLocaleDateString('pt-AO')
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-black uppercase">Nova Conta Corrente</h2>
          <button onClick={onClose}><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>
        <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Entidade (Nome)</label>
            <input required value={formData.entityName} onChange={e => setFormData({...formData, entityName: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipo de Conta</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4">
              <option value="CLIENTE">Cliente</option>
              <option value="FORNECEDOR">Fornecedor</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Saldo Inicial (Kz)</label>
            <input type="number" required value={formData.balance} onChange={e => setFormData({...formData, balance: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase shadow-xl transition-all active:scale-95">Criar Conta</button>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;
