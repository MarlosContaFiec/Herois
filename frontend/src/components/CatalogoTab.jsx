import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartas } from "../api/cartas";
import { useColecao, useAdicionarColecao } from "../api/colecao";
import { usePacotes } from "../api/pacotes";
import { useAuth } from "../context/AuthContext";
import { SkeletonLista } from "./Skeleton";
import EmptyState from "./EmptyState";
import {
  cardBase,
  cardHover,
  btnPrimary,
  btnSm,
  inputBase,
  selectBase,
  gridCols4,
  textSecondary,
  fontSemibold,
  badgeBase,
  raridadeCores,
  elementoCores,
} from "../styles/components";
import {
  IconCartas,
  IconMais,
  IconBuscar,
  IconPoder,
  IconMoedas,
  IconFechar,
  IconCheck,
  elementoIcon as elIconMap,
  classeIcon as clIconMap,
} from "../utils/icones";

const ELEMENTOS = ["", "FOGO", "AGUA", "TERRA", "VENTO", "LUZ", "TREVAS"];
const CLASSES = [
  "",
  "GUERREIRO",
  "MAGO",
  "PATRULHEIRO",
  "CURANDEIRO",
  "LADINO",
];
const RARIDADES = ["", "COMUM", "INCOMUM", "RARA", "EPICA", "LENDARIA"];

const CUSTO_IMPORTAR = {
  COMUM: 50,
  INCOMUM: 100,
  RARA: 250,
  EPICA: 500,
  LENDARIA: 1500,
};
const CUSTO_PACOTE_EXTRA = 100;

export default function CatalogoTab() {
  const { usuario } = useAuth();
  const [filtros, setFiltros] = useState({});
  const [modalImportar, setModalImportar] = useState(null);
  const [pacoteEscolhido, setPacoteEscolhido] = useState("");
  const [escolherPacote, setEscolherPacote] = useState(false);
  const [catalogoPessoal, setCatalogoPessoal] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("catalogoPessoal")) || [];
    } catch {
      return [];
    }
  });

  const { data: cartas, isLoading } = useCartas(filtros);
  const { data: colecao } = useColecao();
  const { data: pacotes } = usePacotes();
  const adicionar = useAdicionarColecao();

  const colecaoMap = useMemo(() => {
    if (!colecao) return {};
    return colecao.reduce((acc, cu) => {
      acc[cu.cartaId] = cu;
      return acc;
    }, {});
  }, [colecao]);

  const togglePessoal = (cartaId) => {
    const novo = catalogoPessoal.includes(cartaId)
      ? catalogoPessoal.filter((id) => id !== cartaId)
      : [...catalogoPessoal, cartaId];
    setCatalogoPessoal(novo);
    localStorage.setItem("catalogoPessoal", JSON.stringify(novo));
  };

  const handleImportar = () => {
    if (!modalImportar) return;
    const pacoteId = escolherPacote ? pacoteEscolhido || undefined : undefined;
    adicionar.mutate(
      { cartaId: modalImportar.id, pacoteId },
      {
        onSuccess: () => {
          setModalImportar(null);
          setEscolherPacote(false);
          setPacoteEscolhido("");
        },
      },
    );
  };

  const custoAtual = modalImportar
    ? (CUSTO_IMPORTAR[modalImportar.raridade] || 100) +
      (escolherPacote ? CUSTO_PACOTE_EXTRA : 0)
    : 0;

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className={selectBase}
          value={filtros.elemento || ""}
          onChange={(e) =>
            setFiltros({ ...filtros, elemento: e.target.value || undefined })
          }
        >
          <option value="">Todos Elementos</option>
          {ELEMENTOS.filter(Boolean).map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
        <select
          className={selectBase}
          value={filtros.classe || ""}
          onChange={(e) =>
            setFiltros({ ...filtros, classe: e.target.value || undefined })
          }
        >
          <option value="">Todas Classes</option>
          {CLASSES.filter(Boolean).map((cl) => (
            <option key={cl} value={cl}>
              {cl}
            </option>
          ))}
        </select>
        <select
          className={selectBase}
          value={filtros.raridade || ""}
          onChange={(e) =>
            setFiltros({ ...filtros, raridade: e.target.value || undefined })
          }
        >
          <option value="">Todas Raridades</option>
          {RARIDADES.filter(Boolean).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <div className="relative">
          <IconBuscar
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Buscar por nome..."
            className={`${inputBase} pl-9`}
            style={{ maxWidth: "200px" }}
            value={filtros.nome || ""}
            onChange={(e) =>
              setFiltros({ ...filtros, nome: e.target.value || undefined })
            }
          />
        </div>
      </div>

      {isLoading ? (
        <SkeletonLista count={8} />
      ) : !cartas?.length ? (
        <EmptyState
          icone={IconCartas}
          titulo="Nenhuma carta encontrada"
          descricao="Tente ajustar os filtros"
        />
      ) : (
        <div className={gridCols4}>
          {cartas
            .filter((c) => c.raridade !== "UNICA")
            .map((carta, i) => {
              const raridade =
                raridadeCores[carta.raridade] || raridadeCores.COMUM;
              const elemento = elementoCores[carta.elemento] || {};
              const ElIcon = elIconMap[carta.elemento];
              const ClIcon = clIconMap[carta.classe];
              const jaTem = !!colecaoMap[carta.id];
              const ehMinha = carta.criadorId === usuario.id;
              const pessoal = catalogoPessoal.includes(carta.id);

              return (
                <motion.div
                  key={carta.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`${cardBase} ${cardHover}`}
                >
                  <div
                    className={`h-2 bg-gradient-to-r ${raridade.gradiente}`}
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3
                          className={`${fontSemibold} text-slate-100 text-sm leading-tight`}
                        >
                          {carta.nome}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          {ElIcon && (
                            <ElIcon size={12} className={elemento.text} />
                          )}
                          <span className={`${textSecondary} text-xs`}>
                            {carta.elemento}
                          </span>
                          <span className="text-slate-600">·</span>
                          {ClIcon && (
                            <ClIcon size={12} className="text-slate-500" />
                          )}
                        </div>
                      </div>
                      <span
                        className={`${badgeBase} ${raridade.badge} text-[10px]`}
                      >
                        {carta.raridade}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <IconPoder size={12} className="text-amber-400" />
                        <span className="text-slate-200 text-sm font-bold">
                          {carta.poder}
                        </span>
                      </div>
                      <span className="text-amber-400 text-xs flex items-center gap-1">
                        <IconMoedas size={10} />{" "}
                        {CUSTO_IMPORTAR[carta.raridade] || 100}
                      </span>
                    </div>

                    {carta.pacotesCarta?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {carta.pacotesCarta.map((pc) => (
                          <span
                            key={pc.id}
                            className={`${badgeBase} bg-slate-600/30 text-slate-400 text-[10px]`}
                          >
                            {pc.pacote.nome}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {jaTem ? (
                        <span
                          className={`${badgeBase} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] flex items-center gap-1`}
                        >
                          <IconCheck size={10} /> Na sua coleção
                        </span>
                      ) : ehMinha ? (
                        <button
                          onClick={() => {
                            setModalImportar(carta);
                            setEscolherPacote(false);
                            setPacoteEscolhido("");
                          }}
                          className={`${btnPrimary} ${btnSm} flex items-center gap-1`}
                        >
                          <IconMais size={12} /> Importar
                        </button>
                      ) : (
                        <span
                          className={`${badgeBase} bg-slate-600/30 text-slate-500 text-[10px]`}
                        >
                          Catalogo global
                        </span>
                      )}
                      <button
                        onClick={() => togglePessoal(carta.id)}
                        className={`${btnSm} ${pessoal ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-500 border border-slate-700"} flex items-center gap-1`}
                      >
                        <IconCheck size={10} /> {pessoal ? "Obtida" : "Marcar"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      )}

      <AnimatePresence>
        {modalImportar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalImportar(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`${cardBase} p-6 w-full max-w-sm`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-200">
                  Importar Carta
                </h2>
                <button
                  onClick={() => setModalImportar(null)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <IconFechar size={20} />
                </button>
              </div>

              <div className="mb-4">
                <h3 className={`${fontSemibold} text-slate-200`}>
                  {modalImportar.nome}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`${badgeBase} ${(raridadeCores[modalImportar.raridade] || raridadeCores.COMUM).badge} text-[10px]`}
                  >
                    {modalImportar.raridade}
                  </span>
                  <span
                    className={`${textSecondary} text-xs flex items-center gap-1`}
                  >
                    <IconPoder size={10} /> {modalImportar.poder}
                  </span>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-3 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>
                    Custo base ({modalImportar.raridade})
                  </span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <IconMoedas size={12} />{" "}
                    {CUSTO_IMPORTAR[modalImportar.raridade] || 100}
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={escolherPacote}
                    onChange={(e) => setEscolherPacote(e.target.checked)}
                    className="rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className={`${textSecondary} text-sm`}>
                    Escolher pacote destino
                  </span>
                  <span className="text-amber-400 text-xs ml-auto flex items-center gap-1">
                    +<IconMoedas size={10} /> {CUSTO_PACOTE_EXTRA}
                  </span>
                </label>
                {escolherPacote && (
                  <select
                    className={selectBase}
                    value={pacoteEscolhido}
                    onChange={(e) => setPacoteEscolhido(e.target.value)}
                  >
                    <option value="">Aleatório</option>
                    {pacotes?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                )}
                <div className="border-t border-slate-700 pt-2 flex justify-between text-sm">
                  <span className="text-slate-200 font-semibold">Total</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <IconMoedas size={14} /> {custoAtual}
                  </span>
                </div>
              </div>

              <button
                onClick={handleImportar}
                disabled={adicionar.isPending}
                className={`${btnPrimary} w-full flex items-center justify-center gap-2`}
              >
                <IconMoedas size={16} />{" "}
                {adicionar.isPending
                  ? "Importando..."
                  : `Importar por ${custoAtual} moedas`}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
