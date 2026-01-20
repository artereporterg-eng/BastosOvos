
import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: string, pass: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onLogin(username, password);
      setErrorMessage('');
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao entrar');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold">Acesso Restrito</h2>
          <p className="text-indigo-100 text-sm mt-1">Entre com suas credenciais de acesso</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Usuário</label>
            <div className="relative">
              <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Nome de usuário"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Senha</label>
            <div className="relative">
              <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="password"
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded-lg text-center animate-bounce">
              {errorMessage}
            </p>
          )}

          <div className="pt-2 flex flex-col gap-3">
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              Entrar no Sistema
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="w-full py-2 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
