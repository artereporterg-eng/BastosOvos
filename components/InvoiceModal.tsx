
import React from 'react';
import { Invoice } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-10 overflow-y-auto flex-1 bg-white print:p-0">
          <div className="flex justify-between items-start mb-10 border-b-4 border-amber-600 pb-6">
            <div>
              <h1 className="text-4xl font-black text-amber-600 tracking-tighter">FATURA</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Quinta dos Ovos • Angola</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">Fatura Nº {invoice.id}</p>
              <p className="text-xs text-slate-500 font-medium">{invoice.date}</p>
            </div>
          </div>

          <div className="mb-10">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                <tr>
                  <th className="p-4">Descrição dos Produtos</th>
                  <th className="p-4 text-center">Unitário</th>
                  <th className="p-4 text-center">Qtd</th>
                  <th className="p-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="text-sm">
                    <td className="p-4 font-bold text-slate-800">{item.name}</td>
                    <td className="p-4 text-center text-slate-600 font-medium">{formatCurrency(item.price)}</td>
                    <td className="p-4 text-center text-slate-600 font-medium">{item.quantity}</td>
                    <td className="p-4 text-right font-black text-slate-900">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-end pt-8 border-t-2 border-slate-100">
            <div className="flex justify-between w-full max-w-xs mb-2">
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Soma dos Itens</span>
              <span className="text-slate-800 font-black">{formatCurrency(invoice.total)}</span>
            </div>
            <div className="flex justify-between w-full max-w-xs pt-4 mt-4 border-t border-slate-100">
              <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">Total a Pagar</span>
              <span className="text-2xl font-black text-amber-600">{formatCurrency(invoice.total)}</span>
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-1">Tecnologia Quinta dos Ovos ERP</p>
            <p className="text-[9px] text-slate-300 italic">Documento gerado eletronicamente para fins informativos e de controle.</p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 flex gap-4 no-print border-t">
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
          >
            <i className="fa-solid fa-print"></i> Imprimir Fatura
          </button>
          <button 
            onClick={onClose}
            className="px-8 py-4 text-slate-500 font-bold hover:bg-slate-200 rounded-2xl transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
