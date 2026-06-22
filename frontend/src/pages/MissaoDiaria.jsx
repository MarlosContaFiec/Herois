import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissaoDiaria, useEnfrentarDiaria } from "../api/missaoDiaria";
import useColecaoOrdenada from "../hooks/useColecaoOrdenada";
import AnimatedPage from "../components/AnimatedPage";
import {
  cardBase,
  pageTitle,
  pageHeader,
  btnPrimary,
  btnGhost,
  btnSm,
  textSecondary,
  fontSemibold,
  elementoCores,
  badgeBase,
  raridadeCores,
} from "../styles/components";
import {
  IconDiaria,
  IconPoder,
  IconPacotes,
  IconSucesso,
  IconErro,
  IconFechar,
  IconCheck,
  IconStar,
  IconClock,
  IconMoedas,
  IconXP as IconXPIcon,
  elementoIcon as elIconMap,
  classeIcon as clIconMap,
} from "../utils/icones";

function CountdownReset() {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    const calcular = () => {
      const agora = new Date();
      const amanha = new Date(agora);
      amanha.setDate(amanha.getDate() + 1);
      amanha.setHours(0, 0, 0, 0);
      const diff = amanha - agora;
      if (diff <= 0) return "00:00:00";
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      return `${h}h ${m}m ${s}s`;
    };

    setTexto(calcular());
    const timer = setInterval(() => setTexto(calcular()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="font-mono text-cyan-400 font-bold text-sm">{texto}</span>
  );
}

function BarraPoder({ valor, max, cor }) {
  const pct = Math.min(100, (valor / Math.max(max, 1)) * 100);
  return (
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: cor }}
      />
    </div>
  );
}

function CartaMini({ carta, selecionada, onClick, inimigo }) {
  const raridade = raridadeCores[carta.raridade] || raridadeCores.COMUM;
  const ElIcon = elIconMap[carta.elemento];
  const ClIcon = clIconMap[carta.classe];
  const el = elementoCores[carta.elemento] || {};

  let vantagem = null;
  if (inimigo) {
    const mapa = {
      FOGO: "VENTO",
      VENTO: "TERRA",
      TERRA: "AGUA",
      AGUA: "FOGO",
      LUZ: "TREVAS",
      TREVAS: "LUZ",
    };
    if (mapa[carta.elemento] === inimigo) vantagem = "forte";
    if (mapa[inimigo] === carta.elemento) vantagem = "fraco";
  }

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg text-xs text-left transition-all relative ${
        selecionada
          ? "bg-cyan-500/20 border border-cyan-500/50 shadow-lg shadow-cyan-500/10"
          : "bg-slate-800 border border-slate-700 hover:border-slate-600"
      }`}
    >
      {selecionada && (
        <div className="absolute top-1 left-1">
          <IconCheck size={12} className="text-cyan-400" />
        </div>
      )}
      {vantagem && (
        <div
          className={`absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${vantagem === "forte" ? "bg-emerald-500/30 text-emerald-400" : "bg-red-500/30 text-red-400"}`}
        >
          {vantagem === "forte" ? "+" : "-"}
        </div>
      )}
      {carta.favorito && (
        <div className="absolute bottom-1 right-1">
          <IconStar size={10} className="text-amber-400" />
        </div>
      )}
      <div className="font-semibold text-slate-200 truncate pr-4">
        {carta.nome}
      </div>
      <div className="flex items-center gap-1 mt-0.5">
        {ElIcon && <ElIcon size={10} className={el.text} />}
        {ClIcon && <ClIcon size={10} className="text-slate-500" />}
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-amber-400 font-bold flex items-center gap-1">
          <IconPoder size={10} /> {carta.poder}
        </span>
        <span className={`${badgeBase} ${raridade.badge} text-[8px]`}>
          {carta.raridade}
        </span>
      </div>
    </button>
  );
}

export default function MissaoDiaria() {
  const { data: status, isLoading } = useMissaoDiaria();
  const { data: colecao } = useColecaoOrdenada();
  const enfrentar = useEnfrentarDiaria();
  const [cartasSel, setCartasSel] = useState([]);
  const [resultado, setResultado] = useState(null);

  const toggleCarta = (id) => {
    setCartasSel((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );
  };

  const poderTotalSel = useMemo(() => {
    if (!colecao) return 0;
    return cartasSel.reduce((sum, id) => {
      const cu = colecao.find((c) => c.id === id);
      return sum + (cu?.carta?.poder || 0);
    }, 0);
  }, [cartasSel, colecao]);

  const handleEnfrentar = () => {
    if (cartasSel.length === 0) return;
    enfrentar.mutate(cartasSel, {
      onSuccess: (data) => {
        setResultado(data);
        setCartasSel([]);
      },
    });
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AnimatedPage>
    );
  }

  const el = elementoCores[status?.elemento] || {};
  const ElIcon = elIconMap[status?.elemento];

  return (
    <AnimatedPage>
      <div className={pageHeader}>
        <h1 className={pageTitle}>Missao Diaria</h1>
      </div>

      {status && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${cardBase} p-6`}>
            <div className="text-center mb-4">
              {ElIcon && (
                <ElIcon size={48} className={`mx-auto mb-2 ${el.text}`} />
              )}
              <h2 className={`${fontSemibold} text-xl text-slate-200`}>
                {status.nomeInimigo}
              </h2>
              <span className={`${badgeBase} ${el.badge} mt-1`}>
                {status.elemento}
              </span>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className={textSecondary}>Poder do inimigo</span>
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <IconPoder size={14} /> {status.poderInimigo}
                </span>
              </div>
              {status.pacoteRecompensa && (
                <div className="flex items-center justify-between">
                  <span className={textSecondary}>Recompensa</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <IconPacotes size={14} /> {status.pacoteRecompensa.nome}
                  </span>
                </div>
              )}
            </div>

            {status.jaTentou && (
              <div
                className={`${cardBase} p-4 ${status.tentativa?.resultado === "VITORIA" ? "border-emerald-500/30" : "border-red-500/30"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {status.tentativa?.resultado === "VITORIA" ? (
                    <IconSucesso size={20} className="text-emerald-400" />
                  ) : (
                    <IconErro size={20} className="text-red-400" />
                  )}
                  <span
                    className={`font-bold ${status.tentativa?.resultado === "VITORIA" ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {status.tentativa?.resultado === "VITORIA"
                      ? "Vitoria hoje!"
                      : "Derrota hoje"}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3 bg-slate-800 rounded-lg p-3">
                  <IconClock size={14} className="text-slate-500" />
                  <span className={textSecondary}>Proxima tentativa em</span>
                  <CountdownReset />
                </div>
              </div>
            )}
          </div>

          {!status.jaTentou && (
            <div className={`${cardBase} p-6`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`${fontSemibold} text-sm text-slate-300`}>
                  Selecione ate 3 cartas
                </h3>
                <span className={`${textSecondary} text-xs`}>
                  {cartasSel.length}/3
                </span>
              </div>

              <div className="bg-slate-800 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`${textSecondary} text-xs`}>Seu poder</span>
                  <span
                    className={`font-bold flex items-center gap-1 ${poderTotalSel >= (status?.poderInimigo || 0) ? "text-emerald-400" : "text-amber-400"}`}
                  >
                    <IconPoder size={12} /> {poderTotalSel}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`${textSecondary} text-xs`}>
                    Poder inimigo
                  </span>
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <IconPoder size={12} /> {status?.poderInimigo}
                  </span>
                </div>
                {poderTotalSel > 0 && (
                  <BarraPoder
                    valor={poderTotalSel}
                    max={(status?.poderInimigo || 100) * 1.5}
                    cor={
                      poderTotalSel >= (status?.poderInimigo || 0)
                        ? "#10b981"
                        : "#f59e0b"
                    }
                  />
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 max-h-60 overflow-y-auto">
                {colecao?.map((cu) => (
                  <CartaMini
                    key={cu.id}
                    carta={{ ...cu.carta, id: cu.id, favorito: cu.favorito }}
                    selecionada={cartasSel.includes(cu.id)}
                    onClick={() => toggleCarta(cu.id)}
                    inimigo={status?.elemento}
                  />
                ))}
              </div>

              <button
                onClick={handleEnfrentar}
                disabled={cartasSel.length === 0 || enfrentar.isPending}
                className={`${btnPrimary} w-full flex items-center justify-center gap-2`}
              >
                <IconPoder size={16} />{" "}
                {enfrentar.isPending
                  ? "Enfrentando..."
                  : "Enfrentar Missao Diaria!"}
              </button>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${cardBase} p-5 mt-6 ${resultado.resultado === "VITORIA" ? "border-emerald-500/40" : "border-red-500/40"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {resultado.resultado === "VITORIA" ? (
                  <IconSucesso size={28} className="text-emerald-400" />
                ) : (
                  <IconErro size={28} className="text-red-400" />
                )}
                <div>
                  <h3
                    className={`${fontSemibold} text-xl ${resultado.resultado === "VITORIA" ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {resultado.resultado === "VITORIA" ? "Vitoria!" : "Derrota"}
                  </h3>
                  <p className={`${textSecondary} text-xs`}>
                    {resultado.nomeInimigo} ({resultado.elemento})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResultado(null)}
                className="text-slate-500 hover:text-slate-300"
              >
                <IconFechar size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-cyan-400 font-bold text-lg">
                  {resultado.poderJogador}
                </div>
                <div className={`${textSecondary} text-xs`}>Seu poder</div>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-bold text-lg">
                  {resultado.poderInimigo}
                </div>
                <div className={`${textSecondary} text-xs`}>Poder inimigo</div>
              </div>
              <div className="text-center">
                <div className="text-amber-400 font-bold text-lg">
                  {resultado.chance}%
                </div>
                <div className={`${textSecondary} text-xs`}>Chance</div>
              </div>
            </div>

            {resultado.resultado === "VITORIA" && resultado.recompensas && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4"
              >
                <h4 className={`${fontSemibold} text-sm text-emerald-400 mb-3`}>
                  Recompensas
                </h4>
                <div className="flex justify-around text-sm">
                  <div className="text-center">
                    <IconMoedas size={20} className="text-amber-400 mx-auto" />
                    <div className="text-amber-400 font-bold">
                      +{resultado.recompensas.moedas}
                    </div>
                    <div className={`${textSecondary} text-xs`}>Moedas</div>
                  </div>
                  <div className="text-center">
                    <IconXPIcon size={20} className="text-cyan-400 mx-auto" />
                    <div className="text-cyan-400 font-bold">
                      +{resultado.recompensas.experiencia}
                    </div>
                    <div className={`${textSecondary} text-xs`}>XP</div>
                  </div>
                  {resultado.recompensas.pacote && (
                    <div className="text-center">
                      <IconPacotes
                        size={20}
                        className="text-purple-400 mx-auto"
                      />
                      <div className="text-purple-400 font-bold">
                        {resultado.recompensas.pacote.nome}
                      </div>
                      <div className={`${textSecondary} text-xs`}>Pacote</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {resultado.resultado === "DERROTA" && (
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className={`${textSecondary} text-sm`}>
                  Tente novamente amanhã com cartas mais fortes
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <IconClock size={14} className="text-slate-500" />
                  <CountdownReset />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
