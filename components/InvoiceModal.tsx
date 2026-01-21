
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

  const handlePrint = () => {
    // Aciona o diálogo de impressão nativo da máquina local
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 print:static print:bg-white print:p-0 print:block">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] print:shadow-none print:max-h-none print:w-full print:rounded-none">
        
        {/* Conteúdo da Fatura */}
        <div className="p-10 overflow-y-auto flex-1 bg-white print:p-0 print:overflow-visible">
          
          {/* Cabeçalho Comercial */}
          <div className="flex justify-between items-start mb-10 border-b-2 border-slate-100 pb-8 print:border-slate-300">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white print:bg-amber-600 print:text-white">
                  <i className="fa-solid fa-egg text-xl"></i>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter print:text-black">QUINTA DOS OVOS</h1>
              </div>
              <div className="space-y-1 text-xs text-slate-500 font-medium print:text-black">
                <p>Huambo, Angola</p>
                <p>Contribuinte: 5001234567</p>
                <p>Tel: +244 923 000 000</p>
                <p>E-mail: comercial@quintadosovos.ao</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-slate-900 text-white px-4 py-2 rounded-lg inline-block mb-4 print:bg-white print:text-black print:border print:border-black">
                <h2 className="text-sm font-black uppercase tracking-widest">FATURA / RECIBO</h2>
              </div>
              <p className="text-sm font-black text-slate-800 uppercase print:text-black">Nº {invoice.id}</p>
              <p className="text-xs text-slate-500 font-medium mt-1 print:text-black">Data: {invoice.date}</p>
            </div>
          </div>

          {/* Dados do Cliente (Placeholder para POS) */}
          <div className="mb-10 p-6 bg-slate-50 rounded-2xl print:bg-white print:border print:border-slate-200">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Dados do Cliente</h3>
            <p className="text-sm font-bold text-slate-800 print:text-black">Consumidor Final</p>
          </div>

          {/* Listagem de Itens */}
          <div className="mb-10">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest print:bg-white print:border-b-2 print:border-black print:text-black">
                <tr>
                  <th className="p-4">Descrição do Artigo</th>
                  <th className="p-4 text-center">Preço Unit.</th>
                  <th className="p-4 text-center">Qtd</th>
                  <th className="p-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="text-sm">
                    <td className="p-4 font-bold text-slate-800 print:text-black">{item.name}</td>
                    <td className="p-4 text-center text-slate-600 font-medium print:text-black">{formatCurrency(item.price)}</td>
                    <td className="p-4 text-center text-slate-600 font-medium print:text-black">{item.quantity}</td>
                    <td className="p-4 text-right font-black text-slate-900 print:text-black">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totais e Resumo Financeiro */}
          <div className="flex flex-col items-end pt-8 border-t-2 border-slate-100 print:border-black">
            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between items-center text-slate-500 font-bold uppercase text-[10px] tracking-widest print:text-black">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-bold uppercase text-[10px] tracking-widest print:text-black">
                <span>Imposto (IVA 0%)</span>
                <span>Kz 0,00</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t-2 border-slate-100 print:border-black">
                <span className="text-lg font-black text-slate-900 uppercase tracking-tighter print:text-black">Total Pago</span>
                <span className="text-2xl font-black text-amber-600 print:text-black">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Rodapé e Certificação */}
          <div className="mt-16 pt-10 border-t border-slate-50 text-center print:mt-10 print:border-slate-200">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-2 print:text-black">Processado por Programa Certificado</p>
            <p className="text-[9px] text-slate-300 italic print:text-black">Obrigado pela sua preferência. Volte sempre à Quinta dos Ovos!</p>
          </div>
        </div>

        {/* Rodapé da Modal (Botões - Escondidos na Impressão) */}
        <div className="bg-slate-50 p-8 flex gap-4 no-print border-t border-slate-100">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-amber-200"
          >
            <i className="fa-solid fa-print text-xl"></i>
            Imprimir Fatura Local
          </button>
          <button 
            onClick={onClose}
            className="px-10 py-5 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-200 rounded-2xl transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
