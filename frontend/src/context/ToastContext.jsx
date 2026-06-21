import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toastSucesso, toastErro, toastInfo } from '../styles/components';
import { IconSucesso, IconErro, IconInfo } from '../utils/icones';

const ToastContext = createContext(null);
let toastId = 0;
const variantes = { sucesso: toastSucesso, erro: toastErro, info: toastInfo };
const icones = { sucesso: IconSucesso, erro: IconErro, info: IconInfo };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const adicionarToast = useCallback((tipo, mensagem) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, tipo, mensagem }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const sucesso = useCallback((msg) => adicionarToast('sucesso', msg), [adicionarToast]);
  const erro = useCallback((msg) => adicionarToast('erro', msg), [adicionarToast]);
  const info = useCallback((msg) => adicionarToast('info', msg), [adicionarToast]);

  return (
    <ToastContext.Provider value={{ sucesso, erro, info }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icone = icones[t.tipo];
            return (
              <motion.div key={t.id} initial={{ opacity: 0, x: 100, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 100, scale: 0.9 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }} className={variantes[t.tipo]}>
                <Icone size={18} />
                <span className="text-sm font-medium">{t.mensagem}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return ctx;
}