import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMissoes, useEnfrentarMissao } from '../api/missoes';
import { useColecao } from '../api/colecao';
import AnimatedPage from '../components/AnimatedPage';
import { SkeletonLista } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { cardBase, cardHover, pageTitle, pageHeader, btnPrimary, btnGhost, selectBase, gridCols3, textSecondary, fontSemibold, elementoCores, badgeBase } from '../styles/components';
import { IconMissoes, IconPoder, IconMoedas, IconXP as IconXPIcon, IconSucesso, IconErro, elementoIcon } from '../utils/icones';

export default function Missoes() {
  const [elemento, setElemento] = useState('');
  const [missaoSel, setMissaoSel] = useState(null);
  const [cartasSel, setCartasSel] = useState([]);
  const { data: missoes, isLoading } = useMissoes(elemento || undefined);
  const { data: colecao } = useColecao();
  const enfrentar = useEnfrentarMissao();

  const toggleCarta = (id) => setCartasSel((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 3 ? [...prev, id] : prev);

  const handleEnfrentar = () => {
    if (!missaoSel || cartasSel.length === 0) return;
    enfrentar.mutate({ missaoId: missaoSel.id, cartasUsuarioIds: cartasSel }, { onSuccess: () => { setMissaoSel(null); setCartasSel([]); } });
  };

  return (
    <AnimatedPage>
      <div className={pageHeader}><h1 className={pageTitle}>Missões</h1></div>
      <div className="mb-6">
        <select className={selectBase} style={{ maxWidth: '200px' }} value={elemento} onChange={(e) => setElemento(e.target.value)}>
          <option value="">Todos Elementos</option>
          {['FOGO', 'AGUA', 'TERRA', 'VENTO', 'LUZ', 'TREVAS'].map((el) => <option key={el} value={el}>{el}</option>)}
        </select>
      </div>
      {missaoSel && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`${cardBase} p-5 mb-6 border-cyan-500/30`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`${fontSemibold} text-slate-200`}>Enfrentar: {missaoSel.nome}</h3>
              <p className={`${textSecondary} text-xs`}>{missaoSel.nomeInimigo} — <IconPoder size={10} className="inline text-amber-400" /> {missaoSel.poderInimigo}</p>
            </div>
            <button onClick={() => { setMissaoSel(null); setCartasSel([]); }} className={`${btnGhost} text-xs`}>Cancelar</button>
          </div>
          <p className={`${textSecondary} text-xs mb-3`}>Selecione até 3 cartas ({cartasSel.length}/3):</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4 max-h-48 overflow-y-auto">
            {colecao?.map((cu) => (
              <button key={cu.id} onClick={() => toggleCarta(cu.id)} className={`p-2 rounded-lg text-xs text-left transition-all ${cartasSel.includes(cu.id) ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-slate-800 border border-slate-700 hover:border-slate-600'}`}>
                <div className="font-semibold text-slate-200 truncate">{cu.carta.nome}</div>
                <div className="text-slate-500 flex items-center gap-1"><IconPoder size={10} /> {cu.carta.poder}</div>
              </button>
            ))}
          </div>
          <button onClick={handleEnfrentar} disabled={cartasSel.length === 0 || enfrentar.isPending} className={`${btnPrimary} w-full`}>{enfrentar.isPending ? 'Enfrentando...' : 'Enfrentar!'}</button>
        </motion.div>
      )}
      {enfrentar.data && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`${cardBase} p-5 mb-6 ${enfrentar.data.resultado === 'VITORIA' ? 'border-emerald-500/40' : 'border-red-500/40'}`}>
          <div className="flex items-center gap-2 mb-2">
            {enfrentar.data.resultado === 'VITORIA' ? <IconSucesso size={20} className="text-emerald-400" /> : <IconErro size={20} className="text-red-400" />}
            <h3 className={`${fontSemibold} text-lg ${enfrentar.data.resultado === 'VITORIA' ? 'text-emerald-400' : 'text-red-400'}`}>{enfrentar.data.resultado === 'VITORIA' ? 'Vitória!' : 'Derrota'}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
            <div><span className={textSecondary}>Seu poder: </span><span className="text-cyan-400 font-bold">{enfrentar.data.poderJogador}</span></div>
            <div><span className={textSecondary}>Inimigo: </span><span className="text-red-400 font-bold">{enfrentar.data.poderInimigo}</span></div>
            <div><span className={textSecondary}>Chance: </span><span className="text-amber-400 font-bold">{enfrentar.data.chance}%</span></div>
            <div><span className={textSecondary}>Moedas: </span><span className="text-amber-400 font-bold">+{enfrentar.data.moedasGanhas}</span></div>
          </div>
          {enfrentar.data.trinco && <div className="mt-2 text-xs text-pink-400">Trinco de {enfrentar.data.trinco} ativado!</div>}
        </motion.div>
      )}
      {isLoading ? <SkeletonLista count={6} /> : !missoes?.length ? <EmptyState icone={IconMissoes} titulo="Nenhuma missão disponível" /> : (
        <div className={gridCols3}>
          {missoes.map((m, i) => {
            const el = elementoCores[m.elemento] || {};
            const ElIcon = elementoIcon[m.elemento];
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`${cardBase} ${cardHover} p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`${fontSemibold} text-slate-200`}>{m.nome}</h3>
                  <span className={`${badgeBase} ${el.badge} flex items-center gap-1`}>{ElIcon && <ElIcon size={10} />} {m.elemento}</span>
                </div>
                <p className={`${textSecondary} text-xs mb-3`}>{m.descricao}</p>
                <div className="text-sm space-y-1 mb-3">
                  <div className="flex justify-between"><span className={textSecondary}>Inimigo</span><span className="text-slate-200">{m.nomeInimigo}</span></div>
                  <div className="flex justify-between"><span className={textSecondary}>Poder</span><span className="text-red-400 font-bold flex items-center gap-1"><IconPoder size={10} /> {m.poderInimigo}</span></div>
                  <div className="flex justify-between"><span className={textSecondary}>Recompensa</span><span className="text-amber-400 flex items-center gap-1"><IconMoedas size={10} /> {m.recompensaMoedas} · <IconXPIcon size={10} /> {m.recompensaExp} XP</span></div>
                  <div className="flex justify-between"><span className={textSecondary}>Tempo</span><span className="text-slate-300">{m.tempoMinutos}min</span></div>
                </div>
                <button onClick={() => setMissaoSel(m)} className={`${btnPrimary} w-full text-sm`}>Enfrentar</button>
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatedPage>
  );
}