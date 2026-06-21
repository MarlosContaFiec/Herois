import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBossStatus, useAtacarBoss } from '../api/bossGuilda';
import { useColecao } from '../api/colecao';
import AnimatedPage from '../components/AnimatedPage';
import { cardBase, pageTitle, pageHeader, btnPrimary, textSecondary, fontSemibold, elementoCores, badgeBase, progressTrack, progressBarAmber } from '../styles/components';
import { IconBoss, IconPoder, IconGuildas, IconSucesso, IconErro, elementoIcon } from '../utils/icones';

export default function BossGuilda() {
  const { data: status, isLoading } = useBossStatus();
  const { data: colecao } = useColecao();
  const atacar = useAtacarBoss();
  const [cartasSel, setCartasSel] = useState([]);
  const toggleCarta = (id) => setCartasSel((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 3 ? [...prev, id] : prev);

  if (isLoading) return <AnimatedPage><div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div></AnimatedPage>;
  if (!status) return <AnimatedPage><p className="text-red-400 flex items-center gap-2"><IconGuildas size={16} /> Você não pertence a uma guilda</p></AnimatedPage>;

  const el = elementoCores[status.boss?.elemento] || {};
  const ElIcon = elementoIcon[status.boss?.elemento];
  const hpPercent = status.boss ? (status.boss.hpAtual / status.boss.hpMaximo) * 100 : 0;

  return (
    <AnimatedPage>
      <div className={pageHeader}><h1 className={pageTitle}>Boss da Guilda</h1></div>
      <div className={`${cardBase} p-6 max-w-xl mb-6`}>
        <div className="text-center mb-4">
          {ElIcon && <ElIcon size={48} className={`mx-auto mb-2 ${el.text}`} />}
          <h2 className={`${fontSemibold} text-xl text-slate-200`}>Boss Nível {status.boss?.nivel}</h2>
          <span className={`${badgeBase} ${el.badge} mt-1`}>{status.boss?.elemento}</span>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1"><span className={textSecondary}>HP</span><span className="text-slate-200 font-bold">{status.boss?.hpAtual}/{status.boss?.hpMaximo}</span></div>
          <div className={progressTrack}><div className={progressBarAmber} style={{ width: `${hpPercent}%` }} /></div>
        </div>
        <div className="text-center mb-4 flex items-center justify-center gap-2">
          {status.possoAtacar ? <IconSucesso size={16} className="text-emerald-400" /> : <IconErro size={16} className="text-red-400" />}
          <span className={`text-sm ${status.possoAtacar ? 'text-emerald-400' : 'text-red-400'}`}>{status.possoAtacar ? 'Você pode atacar' : 'Você já perdeu hoje'}</span>
        </div>
        {status.ranking?.length > 0 && (
          <div className="mb-4">
            <h3 className={`${fontSemibold} text-sm text-slate-300 mb-2`}>Ranking</h3>
            {status.ranking.map((r) => (
              <div key={r.posicao} className="flex justify-between text-xs py-1 border-b border-slate-800">
                <span className={textSecondary}>#{r.posicao} {r.usuario}</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1"><IconPoder size={10} /> {r.poder}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {status.possoAtacar && (
        <div className={`${cardBase} p-5 mb-6`}>
          <h3 className={`${fontSemibold} text-sm text-slate-300 mb-3`}>Selecione até 3 cartas ({cartasSel.length}/3)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4 max-h-48 overflow-y-auto">
            {colecao?.map((cu) => (
              <button key={cu.id} onClick={() => toggleCarta(cu.id)} className={`p-2 rounded-lg text-xs text-left transition-all ${cartasSel.includes(cu.id) ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-slate-800 border border-slate-700 hover:border-slate-600'}`}>
                <div className="font-semibold text-slate-200 truncate">{cu.carta.nome}</div>
                <div className="text-slate-500 flex items-center gap-1"><IconPoder size={10} /> {cu.carta.poder}</div>
              </button>
            ))}
          </div>
          <button onClick={() => atacar.mutate(cartasSel)} disabled={cartasSel.length === 0 || atacar.isPending} className={`${btnPrimary} w-full`}>{atacar.isPending ? 'Atacando...' : 'Atacar Boss!'}</button>
        </div>
      )}
      {atacar.data && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${cardBase} p-5 ${atacar.data.derrotou ? 'border-emerald-500/40' : 'border-red-500/40'}`}>
          <div className="flex items-center gap-2 mb-2">
            {atacar.data.derrotou ? <IconSucesso size={20} className="text-emerald-400" /> : <IconErro size={20} className="text-red-400" />}
            <h3 className={`${fontSemibold} ${atacar.data.derrotou ? 'text-emerald-400' : 'text-red-400'}`}>{atacar.data.derrotou ? 'Boss Derrotado!' : 'Ataque'}</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
            <div><span className={textSecondary}>Seu poder: </span><span className="text-cyan-400 font-bold">{atacar.data.poderJogador}</span></div>
            <div><span className={textSecondary}>Dano: </span><span className="text-amber-400 font-bold">{atacar.data.danoCausado}</span></div>
            <div><span className={textSecondary}>HP restante: </span><span className="text-red-400 font-bold">{atacar.data.hpRestante}</span></div>
          </div>
        </motion.div>
      )}
    </AnimatedPage>
  );
}