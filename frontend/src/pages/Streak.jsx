import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  useStreakStatus,
  useResgatarStreak,
  useComprarEscudo,
} from "../api/streak";
import AnimatedPage from "../components/AnimatedPage";
import {
  cardBase,
  cardHover,
  pageTitle,
  pageHeader,
  btnPrimary,
  btnAmber,
  btnGhost,
  btnSm,
  statCard,
  statValue,
  statLabel,
  fontSemibold,
  textSecondary,
  badgeBase,
} from "../styles/components";
import {
  IconStreak,
  IconEscudo,
  IconMoedas,
  IconPacotes,
  IconCartas,
  IconCheck,
  IconClock,
} from "../utils/icones";

const SEMANA_1 = [
  { dia: 1, tipo: "MOEDAS", desc: "10 moedas" },
  { dia: 2, tipo: "MOEDAS", desc: "15 moedas" },
  { dia: 3, tipo: "MOEDAS", desc: "20 moedas" },
  { dia: 4, tipo: "MOEDAS", desc: "30 moedas" },
  { dia: 5, tipo: "MOEDAS", desc: "50 moedas" },
  { dia: 6, tipo: "CARTA", desc: "Carta Rara" },
  { dia: 7, tipo: "PACOTE", desc: "1 Pack" },
];

const CICLO = [
  { dia: 8, tipo: "MOEDAS", desc: "150 moedas" },
  { dia: 9, tipo: "MOEDAS", desc: "175 moedas" },
  { dia: 10, tipo: "MOEDAS", desc: "200 moedas" },
  { dia: 11, tipo: "MOEDAS", desc: "225 moedas" },
  { dia: 12, tipo: "MOEDAS", desc: "250 moedas" },
  { dia: 13, tipo: "CARTA", desc: "Carta Epica" },
  { dia: 14, tipo: "PACOTE", desc: "2 Packs" },
];

const tipoIcon = { MOEDAS: IconMoedas, CARTA: IconCartas, PACOTE: IconPacotes };
const tipoCor = {
  MOEDAS: "text-amber-400",
  CARTA: "text-cyan-400",
  PACOTE: "text-purple-400",
};
const tipoBg = {
  MOEDAS: "bg-amber-500/10 border-amber-500/20",
  CARTA: "bg-cyan-500/10 border-cyan-500/20",
  PACOTE: "bg-purple-500/10 border-purple-500/20",
};

function CountdownProximo() {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    const calcular = () => {
      const agora = new Date();
      const amanha = new Date(agora);
      amanha.setDate(amanha.getDate() + 1);
      amanha.setHours(0, 0, 0, 0);
      const diff = amanha - agora;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    setTexto(calcular());
    const timer = setInterval(() => setTexto(calcular()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <IconClock size={14} className="text-slate-500" />
      <span className={`${textSecondary} text-sm`}>Proxima recompensa em</span>
      <span className="font-mono text-cyan-400 font-bold text-lg tracking-wider">
        {texto}
      </span>
    </div>
  );
}

function DiaStreak({ dia, ativo, concluido, ehHoje }) {
  const Icone = tipoIcon[dia.tipo] || IconMoedas;
  const cor = tipoCor[dia.tipo] || "text-slate-400";
  const bg = tipoBg[dia.tipo] || "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: dia.dia * 0.03 }}
      className={`${cardBase} ${cardHover} p-3 text-center relative overflow-hidden ${
        ehHoje
          ? "border-cyan-500/50 bg-cyan-500/5 ring-1 ring-cyan-500/20"
          : concluido
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-slate-700/50"
      }`}
    >
      {concluido && (
        <div className="absolute top-1 right-1">
          <IconCheck size={12} className="text-emerald-400" />
        </div>
      )}
      {ehHoje && !concluido && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          animate={{
            boxShadow: [
              "0 0 10px rgba(6,182,212,0)",
              "0 0 15px rgba(6,182,212,0.3)",
              "0 0 10px rgba(6,182,212,0)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
      <div className="text-slate-500 text-[10px] font-medium">
        Dia {dia.dia}
      </div>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mt-1.5 ${bg} border`}
      >
        <Icone
          size={18}
          className={
            ehHoje ? cor : concluido ? "text-emerald-400" : "text-slate-500"
          }
        />
      </div>
      <div
        className={`text-xs mt-1.5 font-medium ${ehHoje ? "text-slate-200" : concluido ? "text-emerald-400" : "text-slate-500"}`}
      >
        {dia.desc}
      </div>
    </motion.div>
  );
}

export default function Streak() {
  const { data: status, isLoading } = useStreakStatus();
  const resgatar = useResgatarStreak();
  const escudo = useComprarEscudo();

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AnimatedPage>
    );
  }

  const diaEfetivo = status?.diaEfetivo || 0;
  const jaReclamou = status?.jaReclamouHoje;

  return (
    <AnimatedPage>
      <div className={pageHeader}>
        <h1 className={pageTitle}>Login Streak</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          className={`${cardBase} p-5 flex flex-col items-center justify-center`}
        >
          <IconStreak size={32} className="text-orange-400 mb-2" />
          <div className="text-3xl font-bold text-orange-400">
            {status?.sequenciaLogin || 0}
          </div>
          <div className={`${textSecondary} text-sm`}>Dias seguidos</div>
        </div>

        <div
          className={`${cardBase} p-5 flex flex-col items-center justify-center`}
        >
          {jaReclamou ? (
            <>
              <IconCheck size={32} className="text-emerald-400 mb-2" />
              <div className="text-lg font-bold text-emerald-400">
                Recompensa resgatada!
              </div>
              <div className="mt-3">
                <CountdownProximo />
              </div>
            </>
          ) : (
            <>
              <div className="text-lg font-bold text-slate-200 mb-1">
                Recompensa disponivel
              </div>
              <div className={`${textSecondary} text-sm mb-3`}>
                {status?.recompensaAtual?.desc || "-"}
              </div>
              <button
                onClick={() => resgatar.mutate()}
                disabled={resgatar.isPending}
                className={`${btnPrimary} flex items-center gap-2`}
              >
                <IconStreak size={16} />{" "}
                {resgatar.isPending ? "Resgatando..." : "Resgatar Agora"}
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className={`${cardBase} p-4 mb-6 flex items-center justify-between flex-wrap gap-3`}
      >
        <div className="flex items-center gap-3">
          <IconEscudo size={20} className="text-cyan-400" />
          <div>
            <div className={`${fontSemibold} text-sm text-slate-200`}>
              {status?.escudos || 0} Escudos
            </div>
            <div className={`${textSecondary} text-xs`}>
              Protege seu streak se esquecer de logar
            </div>
          </div>
        </div>
        <button
          onClick={() => escudo.mutate()}
          disabled={escudo.isPending}
          className={`${btnAmber} ${btnSm} flex items-center gap-1`}
        >
          <IconEscudo size={12} />{" "}
          {escudo.isPending ? "Comprando..." : "Comprar (500 moedas)"}
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <span className="text-cyan-400">Semana 1</span>
          <span
            className={`${badgeBase} bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px]`}
          >
            Unica
          </span>
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {SEMANA_1.map((d) => (
            <DiaStreak
              key={d.dia}
              dia={d}
              ativo={diaEfetivo === d.dia}
              concluido={diaEfetivo > d.dia}
              ehHoje={diaEfetivo === d.dia && !jaReclamou}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <span className="text-amber-400">Ciclo</span>
          <span
            className={`${badgeBase} bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]`}
          >
            8 → 14 → 8...
          </span>
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {CICLO.map((d) => (
            <DiaStreak
              key={d.dia}
              dia={d}
              ativo={diaEfetivo === d.dia}
              concluido={diaEfetivo > d.dia}
              ehHoje={diaEfetivo === d.dia && !jaReclamou}
            />
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
}
