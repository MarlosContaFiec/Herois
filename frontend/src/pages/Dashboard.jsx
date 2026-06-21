import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useColecao } from '../api/colecao';
import { useMinhasEstatisticas } from '../api/ranking';
import AnimatedPage from '../components/AnimatedPage';
import { cardBase, cardHover, pageTitle, pageSubtitle, pageHeader, statCard, statValue, statLabel, gridCols3, textSecondary, fontSemibold } from '../styles/components';
import { IconMoedas, IconStreak, IconMissoes, IconPoder, IconFechar, IconPacotes, IconDiaria, IconColecao, IconGuildas, IconBoss, IconRanking, IconCriar } from '../utils/icones';

const ELEMENTOS = ['FOGO', 'AGUA', 'TERRA', 'VENTO', 'LUZ', 'TREVAS'];
const CLASSES = ['GUERREIRO', 'MAGO', 'PATRULHEIRO', 'CURANDEIRO', 'LADINO'];
const EL_CORES = { FOGO: '#f87171', AGUA: '#60a5fa', TERRA: '#f59e0b', VENTO: '#34d399', LUZ: '#fde047', TREVAS: '#a78bfa' };
const CL_CORES = { GUERREIRO: '#f87171', MAGO: '#818cf8', PATRULHEIRO: '#34d399', CURANDEIRO: '#fb923c', LADINO: '#94a3b8' };

function RadarGrafico({ chaves, dados, cores, labels }) {
  const n = chaves.length;
  const cx = 150;
  const cy = 150;
  const raio = 100;
  const maxVal = Math.max(...dados, 1);
  const temDados = dados.some((v) => v > 0);
  const angulo = (i) => -Math.PI / 2 + (2 * Math.PI * i) / n;

  if (!temDados) {
    return <div className="flex items-center justify-center h-48 text-slate-500 text-sm">Nenhuma carta na coleção</div>;
  }

  const pontosGrade = (nivel) =>
    Array.from({ length: n }, (_, i) => {
      const a = angulo(i);
      return `${cx + raio * nivel * Math.cos(a)},${cy + raio * nivel * Math.sin(a)}`;
    }).join(' ');

  const pontosDados = dados
    .map((v, i) => {
      const a = angulo(i);
      const norm = v / maxVal;
      return `${cx + raio * norm * Math.cos(a)},${cy + raio * norm * Math.sin(a)}`;
    })
    .join(' ');

  return (
    <div>
      <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((nivel) => (
          <polygon key={nivel} points={pontosGrade(nivel)} fill="none" stroke="#1e293b" strokeWidth="1" />
        ))}
        {Array.from({ length: n }, (_, i) => {
          const a = angulo(i);
          return <line key={i} x1={cx} y1={cy} x2={cx + raio * Math.cos(a)} y2={cy + raio * Math.sin(a)} stroke="#1e293b" strokeWidth="1" />;
        })}
        <polygon points={pontosGrade(1.0)} fill="none" stroke="#334155" strokeWidth="1.5" />
        <polygon points={pontosDados} fill="rgba(6, 182, 212, 0.1)" stroke="#06b6d4" strokeWidth="2" filter="url(#glow)" />
        {dados.map((v, i) => {
          const a = angulo(i);
          const norm = v / maxVal;
          const x = cx + raio * norm * Math.cos(a);
          const y = cy + raio * norm * Math.sin(a);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="7" fill={cores[i]} opacity="0.2" />
              <circle cx={x} cy={y} r="4" fill={cores[i]} stroke="#0f172a" strokeWidth="2" />
            </g>
          );
        })}
        {labels.map((label, i) => {
          const a = angulo(i);
          const lr = raio + 22;
          const x = cx + lr * Math.cos(a);
          const y = cy + lr * Math.sin(a);
          const anchor = Math.abs(Math.cos(a)) < 0.15 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
          return (
            <text key={i} x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fill={cores[i]} fontSize="10" fontWeight="700">
              {label.charAt(0) + label.slice(1).toLowerCase()}
            </text>
          );
        })}
      </svg>
      <div className="grid grid-cols-2 gap-2 mt-4 max-w-xs mx-auto">
        {chaves.map((chave, i) => (
          <div key={chave} className="flex items-center gap-2 text-xs bg-slate-800/50 rounded-lg px-3 py-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cores[i] }} />
            <span className="text-slate-400 capitalize">{chave.toLowerCase()}</span>
            <span className="text-slate-200 font-bold ml-auto">{dados[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const atalhos = [
  { path: '/pacotes', label: 'Abrir Pacotes', icone: IconPacotes, desc: 'Compre e abra pacotes' },
  { path: '/missoes', label: 'Missoes', icone: IconMissoes, desc: 'Enfrente inimigos' },
  { path: '/missao-diaria', label: 'Missao Diaria', icone: IconDiaria, desc: 'Desafio do dia' },
  { path: '/colecao', label: 'Colecao', icone: IconColecao, desc: 'Suas cartas' },
  { path: '/guildas', label: 'Guildas', icone: IconGuildas, desc: 'Comunidade' },
  { path: '/boss-guilda', label: 'Boss Guilda', icone: IconBoss, desc: 'Ataque coletivo' },
  { path: '/ranking', label: 'Ranking', icone: IconRanking, desc: 'Classificacao semanal' },
  { path: '/streak', label: 'Login Streak', icone: IconStreak, desc: 'Recompensas diarias' },
  { path: '/criacao', label: 'Criar Carta', icone: IconCriar, desc: 'Crie cartas novas' },
];

export default function Dashboard() {
  const { usuario } = useAuth();
  const { data: colecao } = useColecao();
  const { data: minhas } = useMinhasEstatisticas();
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoRadar, setTipoRadar] = useState('elemento');

  if (!usuario) return null;

  const poderTotal = useMemo(() => {
    if (!colecao) return 0;
    return colecao.reduce((soma, cu) => soma + cu.carta.poder, 0);
  }, [colecao]);

  const poderPorElemento = useMemo(() => {
    if (!colecao) return {};
    return colecao.reduce((acc, cu) => {
      acc[cu.carta.elemento] = (acc[cu.carta.elemento] || 0) + cu.carta.poder;
      return acc;
    }, {});
  }, [colecao]);

  const poderPorClasse = useMemo(() => {
    if (!colecao) return {};
    return colecao.reduce((acc, cu) => {
      acc[cu.carta.classe] = (acc[cu.carta.classe] || 0) + cu.carta.poder;
      return acc;
    }, {});
  }, [colecao]);

  const radarDados =
    tipoRadar === 'elemento'
      ? { chaves: ELEMENTOS, dados: ELEMENTOS.map((e) => poderPorElemento[e] || 0), cores: ELEMENTOS.map((e) => EL_CORES[e]), labels: ELEMENTOS }
      : { chaves: CLASSES, dados: CLASSES.map((c) => poderPorClasse[c] || 0), cores: CLASSES.map((c) => CL_CORES[c]), labels: CLASSES };

  const stats = [
    { valor: usuario.moedas, label: 'Moedas', icone: IconMoedas },
    { valor: usuario.sequenciaLogin, label: 'Streak', icone: IconStreak },
    { valor: minhas?.missoesCompletadas || 0, label: 'Missoes', icone: IconMissoes },
    { valor: poderTotal, label: 'Poder Total', icone: IconPoder, clicavel: true },
  ];

  return (
    <AnimatedPage>
      <div className={pageHeader}>
        <h1 className={pageTitle}>Ola, {usuario.nomeUsuario}!</h1>
        <p className={pageSubtitle}>O que deseja fazer hoje?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${statCard} ${stat.clicavel ? 'cursor-pointer hover:border-cyan-500/40 transition-all' : ''}`}
            onClick={stat.clicavel ? () => setModalAberto(true) : undefined}
          >
            <stat.icone size={28} className="text-slate-500 mx-auto" />
            <div className={statValue}>{stat.valor}</div>
            <div className={statLabel}>{stat.label}</div>
            {stat.clicavel && <div className="text-[10px] text-slate-600 mt-1">Ver distribuicao</div>}
          </motion.div>
        ))}
      </div>

      <div className={gridCols3}>
        {atalhos.map((atalho, i) => (
          <motion.div key={atalho.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
            <Link to={atalho.path} className={`${cardBase} ${cardHover} block p-5 group`}>
              <atalho.icone size={32} className="text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
              <h3 className={`${fontSemibold} text-slate-200`}>{atalho.label}</h3>
              <p className={`${textSecondary} text-xs mt-1`}>{atalho.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modalAberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalAberto(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={`${cardBase} p-6 w-full max-w-md max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-200">Distribuicao de Poder</h2>
                <button onClick={() => setModalAberto(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                  <IconFechar size={20} />
                </button>
              </div>

              <div className="flex bg-slate-800 rounded-lg p-1 gap-1 mb-5">
                <button
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${tipoRadar === 'elemento' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-300'}`}
                  onClick={() => setTipoRadar('elemento')}
                >
                  Elemento
                </button>
                <button
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${tipoRadar === 'classe' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-300'}`}
                  onClick={() => setTipoRadar('classe')}
                >
                  Classe
                </button>
              </div>

              <motion.div key={tipoRadar} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
                <RadarGrafico {...radarDados} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}