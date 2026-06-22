import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { useBossStatus, useAtacarBoss } from "../api/bossGuilda";
import useColecaoOrdenada from "../hooks/useColecaoOrdenada";
import { useAuth } from "../context/AuthContext";
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
} from "../styles/components";
import {
  IconBoss,
  IconPoder,
  IconGuildas,
  IconSucesso,
  IconErro,
  IconFechar,
  IconCheck,
  IconStar,
  IconClock,
  IconAlerta,
  elementoIcon as elIconMap,
  classeIcon as clIconMap,
} from "../utils/icones";

function CountdownReset({ resetEm }) {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    const calcular = () => {
      const diff = new Date(resetEm) - Date.now();
      if (diff <= 0) return "Resetando...";
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      return `${h}h ${m}m ${s}s`;
    };

    setTexto(calcular());
    const timer = setInterval(() => setTexto(calcular()), 1000);
    return () => clearInterval(timer);
  }, [resetEm]);

  return (
    <div
      className={`${cardBase} p-3 mb-6 flex items-center justify-center gap-2`}
    >
      <IconClock size={14} className="text-slate-500" />
      <span className={`${textSecondary} text-sm`}>Recompensas em</span>
      <span className="font-mono text-cyan-400 font-bold">{texto}</span>
    </div>
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
  const raridade =
    {
      COMUM: "bg-slate-500/20 text-slate-400 border-slate-500/30",
      INCOMUM: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      RARA: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      EPICA: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      LENDARIA: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    }[carta.raridade] || "bg-slate-500/20 text-slate-400 border-slate-500/30";

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
        <span className={`${badgeBase} ${raridade} text-[8px]`}>
          {carta.raridade}
        </span>
      </div>
    </button>
  );
}

function ModalConfirmacaoReset({ onConfirm, onCancel, isPending }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className={`${cardBase} p-5 w-full max-w-xs text-center`}
        onClick={(e) => e.stopPropagation()}
      >
        <IconAlerta size={40} className="text-red-400 mx-auto mb-3" />
        <h3 className={`${fontSemibold} text-slate-200 mb-1`}>
          Simular Reset?
        </h3>
        <p className={`${textSecondary} text-sm mb-4`}>
          Vai distribuir recompensas e resetar o boss como se fosse 21h
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className={`${btnGhost} ${btnSm} flex-1`}>
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
          >
            {isPending ? "Processando..." : "Confirmar"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BossGuilda() {
  const { data: status, isLoading } = useBossStatus();
  const { data: colecao } = useColecaoOrdenada();
  const { usuario } = useAuth();
  const atacar = useAtacarBoss();
  const [cartasSel, setCartasSel] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [confirmandoReset, setConfirmandoReset] = useState(false);
  const [resetando, setResetando] = useState(false);

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

  const handleAtacar = () => {
    if (cartasSel.length === 0) return;
    atacar.mutate(cartasSel, {
      onSuccess: (data) => {
        setResultado(data);
        setCartasSel([]);
      },
    });
  };

  const handleTestarReset = async () => {
    setResetando(true);
    try {
      const guildaRes = await fetch("/api/guildas/minha", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      const guilda = await guildaRes.json();
      if (!guilda?.id) return;

      const res = await fetch("/api/boss-guilda/testar-reset/" + guilda.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      console.log("[TESTE] Reset:", data);
      window.location.reload();
    } catch (err) {
      console.error("[TESTE] Erro:", err);
    } finally {
      setResetando(false);
      setConfirmandoReset(false);
    }
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

  if (!status) {
    return <Navigate to="/guildas" replace />;
  }

  const el = elementoCores[status.boss?.elemento] || {};
  const ElIcon = elIconMap[status.boss?.elemento];
  const hpPercent = status.boss
    ? (status.boss.hpAtual / status.boss.hpMaximo) * 100
    : 0;

  return (
    <AnimatedPage>
      <div
        className={`${pageHeader} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}
      >
        <h1 className={pageTitle}>Boss da Guilda</h1>
        <div className="flex gap-2 items-center flex-wrap">
          {/* somente para teste não pode ser considerado feature */}
          {usuario?.papel === "ADMIN" && (
            <button
              onClick={() => setConfirmandoReset(true)}
              className="text-[10px] text-red-400 border border-red-500/30 px-2 py-1 rounded hover:bg-red-500/10"
            >
              [TESTE] Reset 21h
            </button>
          )}
          {/* fim somente para teste */}
          <Link
            to="/guildas"
            className={`${btnGhost} ${btnSm} flex items-center gap-1`}
          >
            <IconGuildas size={12} /> Voltar a Guilda
          </Link>
        </div>
      </div>

      {status.resetEm && <CountdownReset resetEm={status.resetEm} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`${cardBase} p-6`}>
          <div className="text-center mb-4">
            {ElIcon && (
              <ElIcon size={48} className={`mx-auto mb-2 ${el.text}`} />
            )}
            <h2 className={`${fontSemibold} text-xl text-slate-200`}>
              Boss Nivel {status.boss?.nivel}
            </h2>
            <span className={`${badgeBase} ${el.badge} mt-1`}>
              {status.boss?.elemento}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className={textSecondary}>HP</span>
              <span className="text-slate-200 font-bold">
                {status.boss?.hpAtual}/{status.boss?.hpMaximo}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    hpPercent > 50
                      ? "#f59e0b"
                      : hpPercent > 20
                        ? "#f97316"
                        : "#ef4444",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${hpPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            {status.possoAtacar ? (
              <IconSucesso size={16} className="text-emerald-400" />
            ) : (
              <IconErro size={16} className="text-red-400" />
            )}
            <span
              className={`text-sm ${status.possoAtacar ? "text-emerald-400" : "text-red-400"}`}
            >
              {status.possoAtacar
                ? "Voce pode atacar hoje"
                : "Voce ja atacou hoje"}
            </span>
          </div>

          {status.ranking?.length > 0 && (
            <div>
              <h3 className={`${fontSemibold} text-sm text-slate-300 mb-2`}>
                Ranking de Ataques
              </h3>
              <div className="space-y-1">
                {status.ranking.map((r) => (
                  <div
                    key={r.posicao}
                    className="flex justify-between text-xs py-1.5 border-b border-slate-800 last:border-0"
                  >
                    <span className={textSecondary}>
                      <span
                        className={`font-bold ${r.posicao === 1 ? "text-amber-400" : r.posicao === 2 ? "text-slate-300" : "text-slate-500"}`}
                      >
                        #{r.posicao}
                      </span>{" "}
                      {r.usuario}
                    </span>
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <IconPoder size={10} /> {r.poder}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {status.possoAtacar && (
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
                  className={`font-bold flex items-center gap-1 ${poderTotalSel >= (status.boss?.poderBase || 0) ? "text-emerald-400" : "text-amber-400"}`}
                >
                  <IconPoder size={12} /> {poderTotalSel}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className={`${textSecondary} text-xs`}>
                  Poder base do boss
                </span>
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <IconPoder size={12} /> {status.boss?.poderBase || "?"}
                </span>
              </div>
              {poderTotalSel > 0 && (
                <BarraPoder
                  valor={poderTotalSel}
                  max={(status.boss?.poderBase || 100) * 1.5}
                  cor={
                    poderTotalSel >= (status.boss?.poderBase || 0)
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
                  inimigo={status.boss?.elemento}
                />
              ))}
            </div>

            <button
              onClick={handleAtacar}
              disabled={cartasSel.length === 0 || atacar.isPending}
              className={`${btnPrimary} w-full flex items-center justify-center gap-2`}
            >
              <IconPoder size={16} />{" "}
              {atacar.isPending ? "Atacando..." : "Atacar Boss!"}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${cardBase} p-5 mb-6 ${resultado.derrotou ? "border-emerald-500/40" : "border-cyan-500/40"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {resultado.derrotou ? (
                  <IconSucesso size={24} className="text-emerald-400" />
                ) : (
                  <IconPoder size={24} className="text-cyan-400" />
                )}
                <div>
                  <h3
                    className={`${fontSemibold} text-lg ${resultado.derrotou ? "text-emerald-400" : "text-slate-200"}`}
                  >
                    {resultado.derrotou
                      ? "Boss Derrotado!"
                      : "Ataque Registrado"}
                  </h3>
                  <p className={`${textSecondary} text-xs`}>
                    {resultado.derrotou
                      ? "Seu ataque foi decisivo! Boss evoluiu!"
                      : "Continue atacando para derrotar o boss"}
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

            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="text-center">
                <div className="text-cyan-400 font-bold text-lg">
                  {resultado.poderJogador}
                </div>
                <div className={`${textSecondary} text-xs`}>Seu poder</div>
              </div>
              <div className="text-center">
                <div className="text-amber-400 font-bold text-lg">
                  {resultado.danoCausado}
                </div>
                <div className={`${textSecondary} text-xs`}>Dano causado</div>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-bold text-lg">
                  {resultado.hpRestante}
                </div>
                <div className={`${textSecondary} text-xs`}>HP restante</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className={textSecondary}>HP do Boss</span>
                <span className="text-slate-200">
                  {resultado.hpRestante}/{status.boss?.hpMaximo}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                  initial={{ width: `${hpPercent}%` }}
                  animate={{
                    width: `${(resultado.hpRestante / (status.boss?.hpMaximo || 1)) * 100}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmandoReset && (
          <ModalConfirmacaoReset
            onConfirm={handleTestarReset}
            onCancel={() => setConfirmandoReset(false)}
            isPending={resetando}
          />
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
