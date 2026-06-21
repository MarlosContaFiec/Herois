import { motion } from 'framer-motion';
import { useStreakStatus, useResgatarStreak, useComprarEscudo } from '../api/streak';
import AnimatedPage from '../components/AnimatedPage';
import { cardBase, pageTitle, pageHeader, btnPrimary, btnAmber, statCard, statValue, statLabel, fontSemibold } from '../styles/components';
import { IconStreak, IconEscudo, IconMoedas, IconPacotes, IconCartas, IconCheck } from '../utils/icones';

const SEMANA_1 = [
  { dia: 1, tipo: 'MOEDAS', desc: '10 moedas' }, { dia: 2, tipo: 'MOEDAS', desc: '15 moedas' },
  { dia: 3, tipo: 'MOEDAS', desc: '20 moedas' }, { dia: 4, tipo: 'MOEDAS', desc: '30 moedas' },
  { dia: 5, tipo: 'MOEDAS', desc: '50 moedas' }, { dia: 6, tipo: 'CARTA', desc: 'Carta Rara' },
  { dia: 7, tipo: 'PACOTE', desc: '1 Pack' },
];
const CICLO = [
  { dia: 8, tipo: 'MOEDAS', desc: '150 moedas' }, { dia: 9, tipo: 'MOEDAS', desc: '175 moedas' },
  { dia: 10, tipo: 'MOEDAS', desc: '200 moedas' }, { dia: 11, tipo: 'MOEDAS', desc: '225 moedas' },
  { dia: 12, tipo: 'MOEDAS', desc: '250 moedas' }, { dia: 13, tipo: 'CARTA', desc: 'Carta Épica' },
  { dia: 14, tipo: 'PACOTE', desc: '2 Packs' },
];

const tipoIcon = { MOEDAS: IconMoedas, CARTA: IconCartas, PACOTE: IconPacotes };

function DiaStreak({ dia, ativo }) {
  const Icone = tipoIcon[dia.tipo] || IconMoedas;
  return (
    <div className={`${cardBase} p-3 text-center ${ativo ? 'border-cyan-500/50 bg-cyan-500/5' : ''}`}>
      <div className="text-slate-500 text-[10px]">Dia {dia.dia}</div>
      <Icone size={20} className={`mx-auto mt-1 ${ativo ? 'text-cyan-400' : 'text-slate-500'}`} />
      <div className="text-xs text-slate-300 mt-1">{dia.desc}</div>
    </div>
  );
}

export default function Streak() {
  const { data: status, isLoading } = useStreakStatus();
  const resgatar = useResgatarStreak();
  const escudo = useComprarEscudo();

  if (isLoading) return <AnimatedPage><div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div></AnimatedPage>;

  return (
    <AnimatedPage>
      <div className={pageHeader}><h1 className={pageTitle}>Login Streak</h1></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={statCard}>
          <IconStreak size={28} className="text-orange-400 mx-auto" />
          <div className={statValue}>{status?.sequenciaLogin || 0}</div>
          <div className={statLabel}>Dias seguidos</div>
        </div>
        <div className={statCard}>
          <IconEscudo size={28} className="text-cyan-400 mx-auto" />
          <div className={statValue}>{status?.escudos || 0}</div>
          <div className={statLabel}>Escudos</div>
        </div>
        <div className={statCard}>
          <div className={`${fontSemibold} text-sm text-slate-200 mt-1`}>{status?.recompensaAtual?.desc || '-'}</div>
          <div className={statLabel}>Recompensa hoje</div>
        </div>
        <div className={statCard}>
          <div className="flex gap-2 justify-center">
            <button onClick={() => resgatar.mutate()} disabled={status?.jaReclamouHoje || resgatar.isPending} className={`${btnPrimary} text-xs`}>{status?.jaReclamouHoje ? <><IconCheck size={12} /> Resgatado</> : 'Resgatar'}</button>
            <button onClick={() => escudo.mutate()} disabled={escudo.isPending} className={`${btnAmber} text-xs`}><IconEscudo size={12} /> 500</button>
          </div>
          <div className={statLabel}>Ações</div>
        </div>
      </div>
      <h2 className="text-lg font-semibold text-slate-200 mb-3">Semana 1 (Única)</h2>
      <div className="grid grid-cols-7 gap-2 mb-6">{SEMANA_1.map((d) => <DiaStreak key={d.dia} dia={d} ativo={status?.diaEfetivo === d.dia} />)}</div>
      <h2 className="text-lg font-semibold text-slate-200 mb-3">Ciclo (8 → 14 → 8...)</h2>
      <div className="grid grid-cols-7 gap-2">{CICLO.map((d) => <DiaStreak key={d.dia} dia={d} ativo={status?.diaEfetivo === d.dia} />)}</div>
    </AnimatedPage>
  );
}