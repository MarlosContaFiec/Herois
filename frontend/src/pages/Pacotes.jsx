import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  usePacotes,
  useComprarPacote,
  usePity,
  useResgatarPity,
} from "../api/pacotes";
import { useAuth } from "../context/AuthContext";
import AnimatedPage from "../components/AnimatedPage";
import { SkeletonLista } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import {
  cardBase,
  cardHover,
  pageTitle,
  pageHeader,
  btnPrimary,
  btnAmber,
  btnGhost,
  btnSm,
  gridCols3,
  textSecondary,
  fontSemibold,
  raridadeCores,
  elementoCores,
  badgeBase,
} from "../styles/components";
import {
  IconPacotes,
  IconMoedas,
  IconStar,
  IconCheck,
  IconSucesso,
  IconFechar,
  IconPoder,
  elementoIcon as elIconMap,
} from "../utils/icones";

const REVEAL_ANIM = {
  COMUM: {
    initial: { opacity: 0, y: 30, rotateY: 180, scale: 0.9 },
    animate: { opacity: 1, y: 0, rotateY: 0, scale: 1 },
    transition: { type: "spring", damping: 25, stiffness: 200 },
    delay: 0.1,
    glow: "none",
    cor: "#94a3b8",
    qtd: 0,
  },
  INCOMUM: {
    initial: { opacity: 0, y: 40, rotateY: 180, scale: 0.85 },
    animate: { opacity: 1, y: 0, rotateY: 0, scale: 1 },
    transition: { type: "spring", damping: 20, stiffness: 180 },
    delay: 0.15,
    glow: "0 0 15px rgba(16,185,129,0.3)",
    cor: "#10b981",
    qtd: 5,
  },
  RARA: {
    initial: { opacity: 0, y: 50, rotateY: 180, scale: 0.8 },
    animate: { opacity: 1, y: 0, rotateY: 0, scale: 1.02 },
    transition: { type: "spring", damping: 15, stiffness: 160 },
    delay: 0.2,
    glow: "0 0 20px rgba(6,182,212,0.4)",
    cor: "#06b6d4",
    qtd: 10,
  },
  EPICA: {
    initial: { opacity: 0, y: 60, rotateY: 180, scale: 0.7 },
    animate: { opacity: 1, y: 0, rotateY: 0, scale: 1.05 },
    transition: { type: "spring", damping: 12, stiffness: 140 },
    delay: 0.25,
    glow: "0 0 30px rgba(168,85,247,0.5)",
    cor: "#a855f7",
    qtd: 15,
  },
  LENDARIA: {
    initial: { opacity: 0, y: 80, rotateY: 180, scale: 0.5 },
    animate: { opacity: 1, y: 0, rotateY: 0, scale: 1.08 },
    transition: { type: "spring", damping: 8, stiffness: 120 },
    delay: 0.35,
    glow: "0 0 40px rgba(251,191,36,0.6)",
    cor: "#fbbf24",
    qtd: 25,
  },
  UNICA: {
    initial: { opacity: 0, y: 100, rotateY: 180, scale: 0.3 },
    animate: { opacity: 1, y: 0, rotateY: 0, scale: 1.1 },
    transition: { type: "spring", damping: 6, stiffness: 100 },
    delay: 0.5,
    glow: "0 0 60px rgba(251,191,36,0.8)",
    cor: "#fbbf24",
    qtd: 40,
  },
};

function Particulas({ cor, quantidade }) {
  if (!quantidade) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: quantidade }).map((_, i) => {
        const angulo = (i / quantidade) * 360;
        const distancia = 60 + Math.random() * 100;
        const x = Math.cos((angulo * Math.PI) / 180) * distancia;
        const y = Math.sin((angulo * Math.PI) / 180) * distancia;
        const tamanho = 2 + Math.random() * 4;
        const duracao = 0.5 + Math.random() * 0.8;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full left-1/2 top-1/2"
            style={{
              width: tamanho,
              height: tamanho,
              backgroundColor: cor,
              boxShadow: `0 0 ${tamanho * 2}px ${cor}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x, y, opacity: 0, scale: 0 }}
            transition={{ duration: duracao, delay: 0.3, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

function DistribuicaoRaridade({ pacote }) {
  const total =
    pacote.pesoComum +
    pacote.pesoIncomum +
    pacote.pesoRara +
    pacote.pesoEpica +
    pacote.pesoLendaria;
  const segs = [
    { p: pacote.pesoComum, c: "bg-slate-500", l: "C" },
    { p: pacote.pesoIncomum, c: "bg-emerald-500", l: "U" },
    { p: pacote.pesoRara, c: "bg-cyan-500", l: "R" },
    { p: pacote.pesoEpica, c: "bg-purple-500", l: "E" },
    { p: pacote.pesoLendaria, c: "bg-amber-500", l: "L" },
  ];

  return (
    <div>
      <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5 mb-1.5">
        {segs.map(
          (s, i) =>
            s.p > 0 && (
              <div
                key={i}
                className={`${s.c} h-full rounded-full`}
                style={{ width: `${(s.p / total) * 100}%` }}
              />
            ),
        )}
      </div>
      <div className="flex justify-between text-[10px]">
        {segs.map((s, i) => (
          <span key={i} className="text-slate-500">
            {s.l}:{Math.round(s.p)}%
          </span>
        ))}
      </div>
    </div>
  );
}

function CartaRevelada({ carta, index, tipo }) {
  const raridade = raridadeCores[carta.raridade] || raridadeCores.COMUM;
  const anim = REVEAL_ANIM[carta.raridade] || REVEAL_ANIM.COMUM;
  const ElIcon = elIconMap[carta.elemento];
  const el = elementoCores[carta.elemento] || {};

  return (
    <motion.div
      initial={anim.initial}
      animate={anim.animate}
      transition={{ ...anim.transition, delay: index * anim.delay + 0.3 }}
      className={`${cardBase} p-4 text-center relative overflow-hidden`}
      style={{ boxShadow: anim.glow }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-b ${raridade.gradiente} opacity-10`}
      />
      <div className="relative">
        <div className="flex items-center justify-center gap-1 mb-1">
          {ElIcon && <ElIcon size={12} className={el.text} />}
          <span className={`${badgeBase} ${raridade.badge} text-[10px]`}>
            {carta.raridade}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-slate-200 truncate">
          {carta.nome}
        </h4>
        <p className="text-amber-400 text-xs mt-1 font-bold">
          {carta.poder} poder
        </p>
        {tipo === "NOVA" ? (
          <p className="text-emerald-400 text-[10px] mt-1 flex items-center justify-center gap-1">
            <IconSucesso size={10} /> Nova!
          </p>
        ) : (
          <p className="text-cyan-400 text-[10px] mt-1 flex items-center justify-center gap-1">
            <IconCheck size={10} /> Duplicata
          </p>
        )}
      </div>
      <Particulas cor={anim.cor} quantidade={anim.qtd} />
    </motion.div>
  );
}

function RevelacaoModal({ cartas, onClose }) {
  const ordem = {
    COMUM: 0,
    INCOMUM: 1,
    RARA: 2,
    EPICA: 3,
    LENDARIA: 4,
    UNICA: 5,
  };
  const ordenadas = [...cartas].sort(
    (a, b) => (ordem[a.carta.raridade] || 0) - (ordem[b.carta.raridade] || 0),
  );
  const maior = ordenadas[ordenadas.length - 1]?.carta?.raridade;
  const bgGrad =
    {
      LENDARIA: "from-amber-500/10",
      EPICA: "from-purple-500/10",
      RARA: "from-cyan-500/10",
    }[maior] || "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      {maior === "LENDARIA" && (
        <motion.div
          className="fixed inset-0 bg-amber-500 pointer-events-none z-40"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${bgGrad} to-transparent pointer-events-none`}
      />
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {ordenadas.map((carta, i) => (
          <CartaRevelada
            key={i}
            carta={carta.carta}
            index={i}
            tipo={carta.tipo}
          />
        ))}
      </motion.div>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ordenadas.length * 0.2 + 0.5 }}
        onClick={onClose}
        className={`${btnPrimary} mt-6 z-10`}
      >
        Fechar
      </motion.button>
    </motion.div>
  );
}

function RevelacaoUnica({ carta, tipo, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[60] flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(251,191,36,0.15) 0%, transparent 70%)",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        initial={{ width: 0, height: 0, opacity: 0.5 }}
        animate={{ width: 800, height: 800, opacity: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)",
        }}
      />
      <Particulas cor="#fbbf24" quantidade={50} />

      <motion.div
        initial={{ opacity: 0, y: -200, rotateZ: -15, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, rotateZ: 0, scale: 1 }}
        transition={{ type: "spring", damping: 10, stiffness: 80 }}
        className="relative z-10"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 30px rgba(251,191,36,0.3)",
              "0 0 80px rgba(251,191,36,0.6)",
              "0 0 30px rgba(251,191,36,0.3)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`${cardBase} p-8 text-center min-w-[280px] border-amber-500/30`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", damping: 10 }}
          >
            <span
              className={`${badgeBase} bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs tracking-widest`}
            >
              ÚNICA
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-2xl font-bold mt-3"
            style={{
              background: "linear-gradient(90deg, #fbbf24, #fff, #fbbf24)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 2s linear infinite",
            }}
          >
            {carta.nome}
          </motion.h2>
          {carta.descricao && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-slate-400 text-sm mt-2"
            >
              {carta.descricao}
            </motion.p>
          )}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-amber-400 text-lg mt-3 font-bold"
          >
            {carta.poder} poder
          </motion.p>
          {tipo === "NOVA" && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, type: "spring" }}
              className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg py-2 px-4"
            >
              <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                <IconSucesso size={16} /> Nova carta!
              </span>
            </motion.div>
          )}
          {tipo === "DUPLICATA" && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, type: "spring" }}
              className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg py-2 px-4"
            >
              <span className="text-cyan-400 font-bold flex items-center justify-center gap-1">
                <IconCheck size={16} /> Duplicata — +XP
              </span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        onClick={onClose}
        className={`${btnPrimary} absolute bottom-8 z-20`}
      >
        Incrível!
      </motion.button>
      <style>{`@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}`}</style>
    </motion.div>
  );
}

function PityEscolhaModal({ pacoteId, cartas, onClose }) {
  const resgatar = useResgatarPity();
  const [cartaSel, setCartaSel] = useState(null);
  const [resultado, setResultado] = useState(null);

  const handleResgatar = () => {
    if (!cartaSel) return;
    resgatar.mutate(
      { pacoteId, cartaId: cartaSel },
      { onSuccess: (data) => setResultado(data) },
    );
  };

  if (resultado) {
    const rar = resultado.carta.raridade;
    if (rar === "UNICA")
      return (
        <RevelacaoUnica
          carta={resultado.carta}
          tipo={resultado.tipo}
          onClose={onClose}
        />
      );
    return <RevelacaoModal cartas={[resultado]} onClose={onClose} />;
  }

  return (
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
        className={`${cardBase} p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${fontSemibold} text-lg text-slate-200`}>
            Escolha sua carta
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300"
          >
            <IconFechar size={20} />
          </button>
        </div>
        <p className={`${textSecondary} text-sm mb-4`}>
          Selecione 1 carta para resgatar gratuitamente
        </p>

        {cartas.length === 0 ? (
          <EmptyState icone={IconPacotes} titulo="Nenhuma carta disponivel" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {cartas.map((carta) => {
              const sel = cartaSel === carta.id;
              const raridade =
                raridadeCores[carta.raridade] || raridadeCores.COMUM;
              const ElIcon = elIconMap[carta.elemento];
              const el = elementoCores[carta.elemento] || {};

              return (
                <button
                  key={carta.id}
                  onClick={() => setCartaSel(carta.id)}
                  className={`p-3 rounded-lg text-left transition-all relative ${sel ? "bg-amber-500/10 border-2 border-amber-500/50" : "bg-slate-800 border border-slate-700 hover:border-slate-600"}`}
                >
                  {sel && (
                    <div className="absolute top-1 right-1">
                      <IconCheck size={14} className="text-amber-400" />
                    </div>
                  )}
                  <div
                    className={`h-1 bg-gradient-to-r ${raridade.gradiente} rounded-full mb-2`}
                  />
                  <div className="font-semibold text-slate-200 text-sm truncate">
                    {carta.nome}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {ElIcon && <ElIcon size={10} className={el.text} />}
                    <span className={`${textSecondary} text-xs`}>
                      {carta.elemento}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-amber-400 text-xs font-bold flex items-center gap-0.5">
                      <IconPoder size={8} /> {carta.poder}
                    </span>
                    <span
                      className={`${badgeBase} ${raridade.badge} text-[8px]`}
                    >
                      {carta.raridade}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={handleResgatar}
          disabled={!cartaSel || resgatar.isPending}
          className={`${btnAmber} w-full flex items-center justify-center gap-2`}
        >
          <IconStar size={16} />{" "}
          {resgatar.isPending ? "Resgatando..." : "Resgatar Carta"}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Pacotes() {
  const { data: pacotes, isLoading } = usePacotes();
  const { usuario } = useAuth();
  const comprar = useComprarPacote();
  const [cartasReveladas, setCartasReveladas] = useState(null);
  const [pitySel, setPitySel] = useState(null);
  const [pityModal, setPityModal] = useState(null);
  const { data: pity } = usePity(pitySel);

  const handleComprar = (pacoteId) => {
    comprar.mutate(pacoteId, {
      onSuccess: (data) => setCartasReveladas(data.cartasRecebidas),
    });
  };

  return (
    <AnimatedPage>
      <div className={`${pageHeader} flex items-center justify-between`}>
        <h1 className={pageTitle}>Pacotes</h1>
        <span className="text-amber-400 font-bold flex items-center gap-1">
          <IconMoedas size={16} /> {usuario?.moedas || 0}
        </span>
      </div>

      {isLoading ? (
        <SkeletonLista count={4} />
      ) : !pacotes?.length ? (
        <EmptyState icone={IconPacotes} titulo="Nenhum pacote disponivel" />
      ) : (
        <div className={gridCols3}>
          {pacotes.map((pacote, i) => {
            const podeComprar = (usuario?.moedas || 0) >= pacote.custo;
            const pityAtivo = pitySel === pacote.id && pity;

            return (
              <motion.div
                key={pacote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`${cardBase} ${cardHover} p-5 flex flex-col`}
              >
                <h3 className={`${fontSemibold} text-slate-200 mb-1`}>
                  {pacote.nome}
                </h3>
                <p className={`${textSecondary} text-xs mb-3`}>
                  {pacote.descricao}
                </p>
                <DistribuicaoRaridade pacote={pacote} />
                <div className="flex items-center justify-between mt-3 mb-1">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <IconMoedas size={14} /> {pacote.custo}
                  </span>
                  <span className={`${textSecondary} text-xs`}>
                    {pacote.qtdCartas} cartas
                  </span>
                </div>

                {pityAtivo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 mb-2"
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className={textSecondary}>Pity</span>
                      <span className="text-cyan-400 font-bold">
                        {pity.aberturas}/100
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: pity.resgatavel
                            ? "#fbbf24"
                            : "#06b6d4",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pity.aberturas}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    {pity.resgatavel && (
                      <button
                        onClick={() =>
                          setPityModal({
                            pacoteId: pacote.id,
                            cartas: pity.cartasDisponiveis,
                          })
                        }
                        className={`${btnAmber} ${btnSm} w-full mt-2 flex items-center justify-center gap-1`}
                      >
                        <IconStar size={12} /> Resgatar carta grátis!
                      </button>
                    )}
                  </motion.div>
                )}

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleComprar(pacote.id)}
                    disabled={!podeComprar || comprar.isPending}
                    className={`flex-1 text-sm py-2 rounded-lg transition-all ${podeComprar ? btnPrimary : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}
                  >
                    {comprar.isPending
                      ? "Abrindo..."
                      : podeComprar
                        ? "Comprar"
                        : "Moedas insuficientes"}
                  </button>
                  <button
                    onClick={() =>
                      setPitySel(pitySel === pacote.id ? null : pacote.id)
                    }
                    className={`${btnGhost} text-xs px-3`}
                  >
                    Pity
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {cartasReveladas && (
          <RevelacaoModal
            cartas={cartasReveladas}
            onClose={() => setCartasReveladas(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pityModal && (
          <PityEscolhaModal
            pacoteId={pityModal.pacoteId}
            cartas={pityModal.cartas || []}
            onClose={() => setPityModal(null)}
          />
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
}
