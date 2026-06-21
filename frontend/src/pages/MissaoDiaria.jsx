import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMissaoDiaria, useEnfrentarDiaria } from '../api/missaoDiaria';
import { useColecao } from '../api/colecao';
import AnimatedPage from '../components/AnimatedPage';
import { cardBase, pageTitle, pageHeader, btnPrimary, textSecondary, fontSemibold, elementoCores, badgeBase } from '../styles/components';
import { IconDiaria, IconPoder, IconPacotes, IconSucesso, IconErro, elementoIcon } from '../utils/icones';

export default function MissaoDiaria() {
  const { data: status, isLoading } = useMissaoDiaria();
  const { data: colecao } = useColecao();
  const enfrentar = useEnfrentarDiaria();
  const [cartasSel, setCartasSel] = useState([]);
  const toggleCarta = (id) => setCartasSel((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 3 ? [...prev, id] : prev);

  if (isLoading) return <AnimatedPage><div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div></AnimatedPage>;

  const el = elementoCores[status?.elemento] || {};
  const ElIcon = elementoIcon[status?.elemento];

  return (
    <AnimatedPage>
      <div className={pageHeader}><h1 className={pageTitle}>Missão Diária</h1></div>
      {status && (
        <div className={`${cardBase} p-6 max-w-xl`}>
          <div className="text-center mb-6">
            {ElIcon && <ElIcon size={48} className={`mx-auto mb-3 ${el.text}`} />}
            <h2 className={`${fontSemibold} text-xl text-slate-200`}>{status.nomeInimigo}</h2>
            <span className={`${badgeBase} ${el.badge} mt-2`}>{status.elemento}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 flex items-center justify-center gap-1"><IconPoder size={20} /> {status.poderInimigo}</div>
              <div className={`${textSecondary} text-xs`}>Poder do inimigo</div>
            </div>
            <div className="text-center">
              <IconPacotes size={28} className="text-amber-400 mx-auto" />
              <div className={`${textSecondary} text-xs`}>{status.pacoteRecompensa?.nome || 'Pacote'}</div>
            </div>
          </div>
          {status.jaTentou ? (
            <div className={`${cardBase} p-4 ${status.tentativa?.resultado === 'VITORIA' ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
              <div className="flex items-center gap-2">
                {status.tentativa?.resultado === 'VITORIA' ? <IconSucesso size={16} className="text-emerald-400" /> : <IconErro size={16} className="text-red-400" />}
                <p className={`font-semibold ${status.tentativa?.resultado === 'VITORIA' ? 'text-emerald-400' : 'text-red-400'}`}>{status.tentativa?.resultado === 'VITORIA' ? 'Vitória hoje!' : 'Derrota hoje'}</p>
              </div>
              <p className={`${textSecondary} text-xs mt-1`}>Volte amanhã para uma nova tentativa.</p>
            </div>
          ) : (
            <>
              <p className={`${textSecondary} text-xs mb-3`}>Selecione até 3 cartas ({cartasSel.length}/3):</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 max-h-48 overflow-y-auto">
                {colecao?.map((cu) => (
                  <button key={cu.id} onClick={() => toggleCarta(cu.id)} className={`p-2 rounded-lg text-xs text-left transition-all ${cartasSel.includes(cu.id) ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-slate-800 border border-slate-700 hover:border-slate-600'}`}>
                    <div className="font-semibold text-slate-200 truncate">{cu.carta.nome}</div>
                    <div className="text-slate-500 flex items-center gap-1"><IconPoder size={10} /> {cu.carta.poder}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => enfrentar.mutate(cartasSel)} disabled={cartasSel.length === 0 || enfrentar.isPending} className={`${btnPrimary} w-full`}>{enfrentar.isPending ? 'Enfrentando...' : 'Enfrentar Missão Diária!'}</button>
            </>
          )}
          {enfrentar.data && (
            <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${enfrentar.data.resultado === 'VITORIA' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              {enfrentar.data.resultado === 'VITORIA' ? <IconSucesso size={16} className="text-emerald-400" /> : <IconErro size={16} className="text-red-400" />}
              <div>
                <p className={`font-bold ${enfrentar.data.resultado === 'VITORIA' ? 'text-emerald-400' : 'text-red-400'}`}>{enfrentar.data.resultado === 'VITORIA' ? 'Vitória!' : 'Derrota!'}</p>
                {enfrentar.data.recompensas && <p className={`${textSecondary} text-sm`}>+{enfrentar.data.recompensas.moedas} moedas · +{enfrentar.data.recompensas.experiencia} XP</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </AnimatedPage>
  );
}