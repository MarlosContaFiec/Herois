import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useColecao, useFavoritar } from "../api/colecao";
import { SkeletonLista } from "./Skeleton";
import EmptyState from "./EmptyState";
import DetalhesCartaModal from "./DetalhesCartaModal";
import {
  cardBase,
  cardHover,
  btnAmber,
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
  IconStarOutline,
  IconColecao,
  IconBuscar,
  IconPoder,
  IconStar,
  IconCriar,
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

export default function ColecaoTab() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({});
  const [busca, setBusca] = useState("");
  const [cartaDetalhe, setCartaDetalhe] = useState(null);
  const { data: colecao, isLoading } = useColecao();
  const favoritar = useFavoritar();

  const colecaoFiltrada = useMemo(() => {
    if (!colecao) return [];
    let lista = [...colecao];
    if (filtros.elemento)
      lista = lista.filter((cu) => cu.carta.elemento === filtros.elemento);
    if (filtros.classe)
      lista = lista.filter((cu) => cu.carta.classe === filtros.classe);
    if (filtros.raridade)
      lista = lista.filter((cu) => cu.carta.raridade === filtros.raridade);
    if (busca)
      lista = lista.filter((cu) =>
        cu.carta.nome.toLowerCase().includes(busca.toLowerCase()),
      );
    lista.sort((a, b) => {
      if (a.favorito && !b.favorito) return -1;
      if (!a.favorito && b.favorito) return 1;
      return new Date(b.adquiridoEm) - new Date(a.adquiridoEm);
    });
    return lista;
  }, [colecao, filtros, busca]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-3">
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
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={() => navigate("/criacao")}
          className={`${btnAmber} flex items-center gap-1`}
        >
          <IconCriar size={14} /> Criar Carta
        </button>
      </div>

      {isLoading ? (
        <SkeletonLista count={6} />
      ) : !colecaoFiltrada.length ? (
        <EmptyState
          icone={IconColecao}
          titulo="Nenhuma carta encontrada"
          descricao="Importe cartas do catalogo ou abra pacotes"
        />
      ) : (
        <div className={gridCols4}>
          {colecaoFiltrada.map((cu, i) => {
            const raridade =
              raridadeCores[cu.carta.raridade] || raridadeCores.COMUM;
            const elemento = elementoCores[cu.carta.elemento] || {};
            const ElIcon = elIconMap[cu.carta.elemento];
            const ClIcon = clIconMap[cu.carta.classe];

            return (
              <motion.div
                key={cu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`${cardBase} ${cardHover} ${cu.favorito ? "border-amber-500/40" : ""} cursor-pointer`}
                onClick={() => setCartaDetalhe(cu.cartaId)}
              >
                <div className="relative">
                  <div
                    className={`h-2 bg-gradient-to-r ${raridade.gradiente}`}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      favoritar.mutate(cu.cartaId);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-full transition-all hover:scale-110"
                    title={cu.favorito ? "Desfavoritar" : "Favoritar"}
                  >
                    {cu.favorito ? (
                      <IconStar size={16} className="text-amber-400" />
                    ) : (
                      <IconStarOutline
                        size={16}
                        className="text-slate-500 hover:text-amber-400"
                      />
                    )}
                  </button>
                </div>
                <div className="p-4 pt-2">
                  <h3
                    className={`${fontSemibold} text-slate-100 text-sm leading-tight pr-6`}
                  >
                    {cu.carta.nome}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 mb-2">
                    {ElIcon && <ElIcon size={12} className={elemento.text} />}
                    <span className={`${textSecondary} text-xs`}>
                      {cu.carta.elemento}
                    </span>
                    <span className="text-slate-600">·</span>
                    {ClIcon && <ClIcon size={12} className="text-slate-500" />}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`${badgeBase} ${raridade.badge} text-[10px]`}
                    >
                      {cu.carta.raridade}
                    </span>
                    <span
                      className={`${textSecondary} text-xs flex items-center gap-1`}
                    >
                      <IconPoder size={10} className="text-amber-400" />{" "}
                      {cu.carta.poder}
                    </span>
                  </div>
                  <div className={`${textSecondary} text-xs`}>
                    Nv.{cu.nivel} · XP: {cu.xp}
                    {cu.contagemEvoluida > 0 && (
                      <span>
                        {" "}
                        · Evoluída {" +".repeat(cu.contagemEvoluida)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <DetalhesCartaModal
        cartaId={cartaDetalhe}
        onClose={() => setCartaDetalhe(null)}
      />
    </div>
  );
}
