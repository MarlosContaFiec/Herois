import { motion } from 'framer-motion';
import { cardBase, cardHover, raridadeCores, elementoCores, badgeBase, textSecondary, fontSemibold } from '../styles/components';
import { elementoIcon, classeIcon, IconPoder } from '../utils/icones';

export default function CartaCard({ carta, index = 0, onClick, children }) {
  const raridade = raridadeCores[carta.raridade] || raridadeCores.COMUM;
  const elemento = elementoCores[carta.elemento] || {};
  const ElIcon = elementoIcon[carta.elemento];
  const ClIcon = classeIcon[carta.classe];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} whileHover={{ scale: 1.02 }} className={`${cardBase} ${cardHover} cursor-pointer group`} onClick={onClick}>
      <div className={`h-2 bg-gradient-to-r ${raridade.gradiente}`} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className={`${fontSemibold} text-slate-100 text-sm leading-tight`}>{carta.nome}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              {ElIcon && <ElIcon size={12} className={elemento.text} />}
              <span className={`${textSecondary} text-xs`}>{carta.elemento}</span>
              <span className="text-slate-600">·</span>
              {ClIcon && <ClIcon size={12} className="text-slate-500" />}
            </div>
          </div>
          <span className={`${badgeBase} ${raridade.badge} text-[10px]`}>{carta.raridade}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <IconPoder size={12} className="text-amber-400" />
            <span className="text-slate-200 text-sm font-bold">{carta.poder}</span>
          </div>
          {carta.criador && <span className="text-slate-600 text-[10px]">por {carta.criador.nomeUsuario}</span>}
        </div>
        {children && <div className="mt-3 pt-3 border-t border-slate-800">{children}</div>}
      </div>
    </motion.div>
  );
}