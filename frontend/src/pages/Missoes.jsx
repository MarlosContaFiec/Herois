import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMissoes, useTentativaPendente } from "../api/missoes";
import AnimatedPage from "../components/AnimatedPage";
import BatalhaModal from "../components/BatalhaModal";
import { SkeletonLista } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import {
  cardBase,
  cardHover,
  pageTitle,
  pageHeader,
  btnPrimary,
  selectBase,
  gridCols3,
  textSecondary,
  fontSemibold,
  elementoCores,
  badgeBase,
} from "../styles/components";
import {
  IconMissoes,
  IconPoder,
  IconMoedas,
  IconXP as IconXPIcon,
  elementoIcon as elIconMap,
} from "../utils/icones";

export default function Missoes() {
  const [elemento, setElemento] = useState("");
  const [missaoSel, setMissaoSel] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const { data: missoes, isLoading } = useMissoes(elemento || undefined);
  const { data: pendente } = useTentativaPendente();

  useEffect(() => {
    const salvo = localStorage.getItem("batalhaPendente");
    if (salvo && pendente) {
      setModalAberto(true);
    }
  }, [pendente]);

  const abrirBatalha = (missao) => {
    setMissaoSel(missao);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setMissaoSel(null);
  };

  return (
    <AnimatedPage>
      <div className={pageHeader}>
        <h1 className={pageTitle}>Missoes</h1>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <select
          className={selectBase}
          style={{ maxWidth: "200px" }}
          value={elemento}
          onChange={(e) => setElemento(e.target.value)}
        >
          <option value="">Todos Elementos</option>
          {["FOGO", "AGUA", "TERRA", "VENTO", "LUZ", "TREVAS"].map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>

        {pendente && (
          <button
            onClick={() => setModalAberto(true)}
            className={`${btnPrimary} text-sm flex items-center gap-2`}
          >
            <IconPoder size={14} /> Batalha em andamento —{" "}
            {pendente.missao.nome}
          </button>
        )}
      </div>

      {isLoading ? (
        <SkeletonLista count={6} />
      ) : !missoes?.length ? (
        <EmptyState icone={IconMissoes} titulo="Nenhuma missao disponivel" />
      ) : (
        <div className={gridCols3}>
          {missoes.map((m, i) => {
            const el = elementoCores[m.elemento] || {};
            const ElIcon = elIconMap[m.elemento];
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`${cardBase} ${cardHover} p-5`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`${fontSemibold} text-slate-200`}>{m.nome}</h3>
                  <span
                    className={`${badgeBase} ${el.badge} flex items-center gap-1`}
                  >
                    {ElIcon && <ElIcon size={10} />} {m.elemento}
                  </span>
                </div>
                <p className={`${textSecondary} text-xs mb-3`}>{m.descricao}</p>
                <div className="text-sm space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span className={textSecondary}>Inimigo</span>
                    <span className="text-slate-200">{m.nomeInimigo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={textSecondary}>Poder</span>
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <IconPoder size={10} /> {m.poderInimigo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={textSecondary}>Recompensa</span>
                    <span className="text-amber-400 flex items-center gap-1">
                      <IconMoedas size={10} /> {m.recompensaMoedas} ·{" "}
                      <IconXPIcon size={10} /> {m.recompensaExp} XP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={textSecondary}>Tempo</span>
                    <span className="text-slate-300">{m.tempoMinutos}min</span>
                  </div>
                </div>
                <button
                  onClick={() => abrirBatalha(m)}
                  disabled={!!pendente}
                  className={`${btnPrimary} w-full text-sm`}
                >
                  {pendente ? "Batalha em andamento" : "Enfrentar"}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {modalAberto && (
        <BatalhaModal
          missao={missaoSel}
          tentativaPendente={pendente && !missaoSel ? pendente : null}
          onClose={fecharModal}
        />
      )}
    </AnimatedPage>
  );
}
