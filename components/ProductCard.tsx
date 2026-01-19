
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md group">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-slate-600 shadow-sm">
          ★ {product.rating}
        </div>
      </div>
      
      <div className="p-5">
        <span className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-2 block">
          {product.category}
        </span>
        <h3 className="text-lg font-semibold text-slate-800 mb-1 leading-tight group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 h-10">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">
            {product.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }).replace('AOA', 'Kz')}
          </span>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-xl shadow-lg shadow-amber-200 transition-all active:scale-95"
          >
            <i className="fa-solid fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
