
import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  product: Product | null;
  categories: string[];
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product, categories }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', 
    description: '', 
    price: 0, 
    costPrice: 0, 
    category: categories[0], 
    stock: 0, 
    image: 'https://images.unsplash.com/photo-1590483736622-39da8caf3501?q=80&w=400'
  });

  useEffect(() => {
    if (product) setFormData(product);
    else setFormData({ 
      name: '', 
      description: '', 
      price: 0, 
      costPrice: 0, 
      category: categories[0], 
      stock: 0, 
      image: 'https://images.unsplash.com/photo-1590483736622-39da8caf3501?q=80&w=400' 
    });
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        <div className="bg-amber-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-box-open"></i>
            <h2 className="text-xl font-black uppercase tracking-tight">{product ? 'Editar Artigo' : 'Novo Artigo'}</h2>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>
        
        <form className="p-8 space-y-6 overflow-y-auto flex-1 scrollbar-hide" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload de Imagem */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Imagem do Produto</label>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center shrink-0 relative group">
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <i className="fa-solid fa-image text-slate-300 text-3xl"></i>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                    <i className="fa-solid fa-camera"></i>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Escolha uma imagem clara do produto para exibição na loja online. Formatos suportados: JPG, PNG.
                  </p>
                  <label className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all">
                    Selecionar Arquivo
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome do Produto</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none font-bold" placeholder="Ex: Ração Postura 20kg" />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descrição Curta</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none min-h-[80px]" placeholder="Breve descrição para o cliente..." />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Preço de Custo (Kz)</label>
              <input type="number" required value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none font-black text-slate-600" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Preço de Venda (Kz)</label>
              <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none font-black text-amber-600" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Categoria</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Stock Inicial (UN)</label>
              <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none font-bold" />
            </div>
          </div>

          <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-amber-100 transition-all active:scale-95">
            <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
            {product ? 'Salvar Alterações' : 'Adicionar ao Inventário'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
