import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIniciarMissao, useResolverBatalha } from "../api/missoes";
import useColecaoOrdenada from "../hooks/useColecaoOrdenada";
import {
  cardBase,
  btnPrimary,
  btnGhost,
  btnSm,
  textSecondary,
  fontSemibold,
  badgeBase,
  raridadeCores,
  elementoCores,
} from "../styles/components";
import {
  IconFechar,
  IconPoder,
  IconMoedas,
  IconXP as IconXPIcon,
  IconSucesso,
  IconErro,
  IconCheck,
  IconStar,
  elementoIcon as elIconMap,
  classeIcon as clIconMap,
} from "../utils/icones";

function formatarTempo(segundos) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function CartaMini({ carta, selecionada, onClick, inimigo }) {
  const raridade = raridadeCores[carta.raridade] || raridadeCores.COMUM;
  const ElIcon = elIconMap[carta.elemento];
  const ClIcon = clIconMap[carta.classe];
  const elemento = elementoCores[carta.elemento] || {};

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
        {ElIcon && <ElIcon size={10} className={elemento.text} />}
        {ClIcon && <ClIcon size={10} className="text-slate-500" />}
      </div>
      <div className="flex items-center gap-1 mt-0.5">
        <IconPoder size={10} className="text-amber-400" />
        <span className="text-slate-300 font-bold">{carta.poder}</span>
      </div>
      <span className={`${badgeBase} ${raridade.badge} text-[8px] mt-1`}>
        {carta.raridade}
      </span>
    </button>
  );
}

function BarraPoder({ valor, max, cor }) {
  const pct = Math.min(100, (valor / max) * 100);
  return (
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: cor }}
      />
    </div>
  );
}

export default function BatalhaModal({ missao, tentativaPendente, onClose }) {
  const { data: colecao } = useColecaoOrdenada();
  const iniciar = useIniciarMissao();
  const resolver = useResolverBatalha();

  const [fase, setFase] = useState("selecionando");
  const [cartasSel, setCartasSel] = useState([]);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [dadosBatalha, setDadosBatalha] = useState(null);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    if (tentativaPendente) {
      const dados = JSON.parse(tentativaPendente.cartasUsadas);
      const completaEm = new Date(tentativaPendente.completadoEm);
      const restante = Math.max(0, Math.ceil((completaEm - Date.now()) / 1000));

      setDadosBatalha({
        tentativaId: tentativaPendente.id,
        missao: {
          nome: tentativaPendente.missao.nome,
          nomeInimigo: tentativaPendente.missao.nomeInimigo,
          poderInimigo: tentativaPendente.missao.poderInimigo,
          elemento: tentativaPendente.missao.elemento,
        },
        poderJogador: dados.poderFinal,
        chance: dados.chance,
        trinco: dados.trinco,
        cartasSelecionadas: dados.cartas,
      });

      if (restante <= 0) {
        setFase("resolver");
      } else {
        setTempoRestante(restante);
        setFase("batalhando");
      }
    }
  }, [tentativaPendente]);

  useEffect(() => {
    if (fase !== "batalhando" || tempoRestante <= 0) return;
    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFase("resolver");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [fase, tempoRestante]);

  useEffect(() => {
    if (fase !== "resolver" || !dadosBatalha) return;
    resolver.mutate(dadosBatalha.tentativaId, {
      onSuccess: (data) => {
        if (data.status === "EM_ANDAMENTO") {
          setTempoRestante(data.tempoRestante);
          setFase("batalhando");
        } else {
          setResultado(data);
          setFase("resultado");
          localStorage.removeItem("batalhaPendente");
        }
      },
    });
  }, [fase]);

  const toggleCarta = (id) => {
    setCartasSel((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );
  };

  const handleIniciar = () => {
    if (!missao || cartasSel.length === 0) return;
    iniciar.mutate(
      { missaoId: missao.id, cartasUsuarioIds: cartasSel },
      {
        onSuccess: (data) => {
          localStorage.setItem(
            "batalhaPendente",
            JSON.stringify({
              tentativaId: data.tentativaId,
              completaEm: data.completaEm,
            }),
          );
          setDadosBatalha(data);
          setTempoRestante(data.tempoSegundos);
          setFase("batalhando");
        },
      },
    );
  };

  const poderTotalSel = cartasSel.reduce((sum, id) => {
    const cu = colecao?.find((c) => c.id === id);
    return sum + (cu?.carta?.poder || 0);
  }, 0);

  const alvo = missao || dadosBatalha?.missao;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`${cardBase} w-full max-w-lg max-h-[90vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {fase === "selecionando" && alvo && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-200">
                    {alvo.nome}
                  </h2>
                  <p className={`${textSecondary} text-xs`}>
                    {alvo.nomeInimigo}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <IconFechar size={20} />
                </button>
              </div>

              <div className="bg-slate-800 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`${textSecondary} text-xs`}>
                    Poder do inimigo
                  </span>
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <IconPoder size={12} /> {alvo.poderInimigo}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${textSecondary} text-xs`}>
                    Seu poder total
                  </span>
                  <span
                    className={`font-bold flex items-center gap-1 ${poderTotalSel >= alvo.poderInimigo ? "text-emerald-400" : "text-amber-400"}`}
                  >
                    <IconPoder size={12} /> {poderTotalSel}
                  </span>
                </div>
                {poderTotalSel > 0 && (
                  <BarraPoder
                    valor={poderTotalSel}
                    max={alvo.poderInimigo * 1.5}
                    cor={
                      poderTotalSel >= alvo.poderInimigo ? "#10b981" : "#f59e0b"
                    }
                  />
                )}
              </div>

              <p className={`${textSecondary} text-xs mb-3`}>
                Selecione ate 3 cartas ({cartasSel.length}/3):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 max-h-60 overflow-y-auto">
                {colecao?.map((cu) => (
                  <CartaMini
                    key={cu.id}
                    carta={{ ...cu.carta, id: cu.id, favorito: cu.favorito }}
                    selecionada={cartasSel.includes(cu.id)}
                    onClick={() => toggleCarta(cu.id)}
                    inimigo={alvo.elemento}
                  />
                ))}
              </div>

              <button
                onClick={handleIniciar}
                disabled={cartasSel.length === 0 || iniciar.isPending}
                className={`${btnPrimary} w-full flex items-center justify-center gap-2`}
              >
                <IconPoder size={16} />{" "}
                {iniciar.isPending ? "Iniciando..." : "Enfrentar!"}
              </button>
            </div>
          )}

          {fase === "batalhando" && dadosBatalha && (
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-slate-200 mb-1">
                  Batalha em andamento
                </h2>
                <p className={`${textSecondary} text-xs`}>
                  {dadosBatalha.missao.nomeInimigo}
                </p>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="text-center flex-1">
                  <div className="text-xs text-slate-500 mb-2">Suas cartas</div>
                  <div className="flex gap-1 justify-center">
                    {dadosBatalha.cartasSelecionadas.map((c, i) => {
                      const El = elIconMap[c.elemento];
                      return (
                        <motion.div
                          key={i}
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.2 }}
                          className="bg-slate-800 rounded-lg p-2 text-center w-16"
                        >
                          {El && (
                            <El
                              size={16}
                              className={`${(elementoCores[c.elemento] || {}).text || "text-slate-400"} mx-auto`}
                            />
                          )}
                          <div className="text-[10px] text-slate-300 font-bold mt-1">
                            {c.poder}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="text-cyan-400 font-bold text-lg mt-2">
                    {dadosBatalha.poderJogador}
                  </div>
                </div>

                <div className="px-4">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-2xl"
                  >
                    ⚔
                  </motion.div>
                </div>

                <div className="text-center flex-1">
                  <div className="text-xs text-slate-500 mb-2">Inimigo</div>
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-slate-800 rounded-lg p-2 text-center w-16 mx-auto"
                  >
                    {(() => {
                      const EI = elIconMap[dadosBatalha.missao.elemento];
                      return EI ? (
                        <EI
                          size={16}
                          className={`${(elementoCores[dadosBatalha.missao.elemento] || {}).text || "text-slate-400"} mx-auto`}
                        />
                      ) : null;
                    })()}
                    <div className="text-[10px] text-red-400 font-bold mt-1">
                      {dadosBatalha.missao.poderInimigo}
                    </div>
                  </motion.div>
                  <div className="text-red-400 font-bold text-lg mt-2">
                    {dadosBatalha.missao.poderInimigo}
                  </div>
                </div>
              </div>

              {dadosBatalha.trinco && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mb-4"
                >
                  <span
                    className={`${badgeBase} bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs`}
                  >
                    Trinco de {dadosBatalha.trinco} ativado!
                  </span>
                </motion.div>
              )}

              <div className="text-center mb-4">
                <div className="text-3xl font-mono font-bold text-slate-200 tracking-widest">
                  {formatarTempo(tempoRestante)}
                </div>
                <p className={`${textSecondary} text-xs mt-1`}>
                  Chance de vitoria: {dadosBatalha.chance}%
                </p>
              </div>

              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: tempoRestante, ease: "linear" }}
                />
              </div>

              <p className={`${textSecondary} text-xs text-center mt-3`}>
                Volte quando o tempo acabar para ver o resultado
              </p>
            </div>
          )}

          {fase === "resolver" && (
            <div className="p-8 text-center">
              <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className={`${textSecondary} text-sm mt-3`}>
                Resolvendo batalha...
              </p>
            </div>
          )}

          {fase === "resultado" && resultado && (
            <div className="p-5">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 200 }}
                className="text-center mb-6"
              >
                {resultado.resultado === "VITORIA" ? (
                  <>
                    <IconSucesso
                      size={56}
                      className="text-emerald-400 mx-auto mb-2"
                    />
                    <h2 className="text-2xl font-bold text-emerald-400">
                      Vitoria!
                    </h2>
                  </>
                ) : (
                  <>
                    <IconErro size={56} className="text-red-400 mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-red-400">Derrota</h2>
                  </>
                )}
              </motion.div>

              <div className="bg-slate-800 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Seu poder</span>
                  <span className="text-cyan-400 font-bold">
                    {resultado.poderJogador}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Poder inimigo</span>
                  <span className="text-red-400 font-bold">
                    {resultado.poderInimigo}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Chance</span>
                  <span className="text-amber-400 font-bold">
                    {resultado.chance}%
                  </span>
                </div>
                {resultado.trinco && (
                  <div className="flex justify-between text-sm">
                    <span className={textSecondary}>Trinco</span>
                    <span className="text-pink-400 font-bold">
                      {resultado.trinco}
                    </span>
                  </div>
                )}
              </div>

              {resultado.resultado === "VITORIA" && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-4"
                >
                  <h3
                    className={`${fontSemibold} text-sm text-emerald-400 mb-2`}
                  >
                    Recompensas
                  </h3>
                  <div className="flex justify-around text-sm">
                    <div className="text-center">
                      <IconMoedas
                        size={20}
                        className="text-amber-400 mx-auto"
                      />
                      <div className="text-amber-400 font-bold">
                        +{resultado.moedasGanhas}
                      </div>
                      <div className={`${textSecondary} text-xs`}>Moedas</div>
                    </div>
                    <div className="text-center">
                      <IconXPIcon size={20} className="text-cyan-400 mx-auto" />
                      <div className="text-cyan-400 font-bold">
                        +{resultado.expGanha}
                      </div>
                      <div className={`${textSecondary} text-xs`}>XP</div>
                    </div>
                  </div>
                  {resultado.recompensaEspecial && (
                    <div className="mt-3 text-center text-pink-400 text-sm font-medium">
                      {resultado.recompensaEspecial.mensagem}
                    </div>
                  )}
                </motion.div>
              )}

              <button onClick={onClose} className={`${btnPrimary} w-full`}>
                Fechar
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
