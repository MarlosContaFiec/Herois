import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useGuildas, useCriarGuilda, useEntrarGuilda } from "../api/guilda";
import AnimatedPage from "../components/AnimatedPage";
import { SkeletonLista } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import {
  cardBase,
  cardHover,
  pageTitle,
  pageHeader,
  btnPrimary,
  btnGhost,
  btnSm,
  inputBase,
  selectBase,
  labelBase,
  gridCols3,
  textSecondary,
  fontSemibold,
  badgeBase,
  badgeCyan,
  badgeAmber,
  badgePink,
} from "../styles/components";
import { IconGuildas, IconMais, IconUser, IconOlho } from "../utils/icones";

export default function Guildas() {
  const { data: guildas, isLoading } = useGuildas();
  const criar = useCriarGuilda();
  const entrar = useEntrarGuilda();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    tipoEntrada: "AUTOMATICO",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    criar.mutate(form, { onSuccess: () => setMostrarForm(false) });
  };
  const tipoBadges = {
    AUTOMATICO: badgeCyan,
    PEDIDO: badgeAmber,
    SOMENTE_CONVITE: badgePink,
  };

  return (
    <AnimatedPage>
      <div className={`${pageHeader} flex items-center justify-between`}>
        <h1 className={pageTitle}>Guildas</h1>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className={btnPrimary}
        >
          {mostrarForm ? (
            "Cancelar"
          ) : (
            <>
              <IconMais size={14} /> Criar (1000 moedas)
            </>
          )}
        </button>
      </div>
      {mostrarForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className={`${cardBase} p-5 mb-6`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelBase}>Nome</label>
              <input
                className={inputBase}
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={labelBase}>Descrição</label>
              <input
                className={inputBase}
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelBase}>Tipo de Entrada</label>
              <select
                className={selectBase}
                value={form.tipoEntrada}
                onChange={(e) =>
                  setForm({ ...form, tipoEntrada: e.target.value })
                }
              >
                <option value="AUTOMATICO">Automático</option>
                <option value="PEDIDO">Por Pedido</option>
                <option value="SOMENTE_CONVITE">Somente Convite</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={criar.isPending}
              className={btnPrimary}
            >
              {criar.isPending ? "Criando..." : "Criar Guilda"}
            </button>
          </form>
        </motion.div>
      )}
      {isLoading ? (
        <SkeletonLista count={6} />
      ) : !guildas?.length ? (
        <EmptyState
          icone={IconGuildas}
          titulo="Nenhuma guilda existente"
          descricao="Seja o primeiro a criar uma!"
        />
      ) : (
        <div className={gridCols3}>
          {guildas.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`${cardBase} ${cardHover} p-5`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className={`${fontSemibold} text-slate-200`}>{g.nome}</h3>
                <span className={`${badgeBase} ${tipoBadges[g.tipoEntrada]}`}>
                  {g.tipoEntrada}
                </span>
              </div>
              {g.descricao && (
                <p className={`${textSecondary} text-xs mb-2`}>{g.descricao}</p>
              )}
              <p
                className={`${textSecondary} text-xs mb-3 flex items-center gap-1`}
              >
                <IconUser size={10} /> {g.membros?.length || 0} membros · Líder:{" "}
                {g.criador?.nomeUsuario}
              </p>
              <div className="flex gap-2">
                <Link
                  to={`/guildas/${g.id}`}
                  className={`${btnGhost} ${btnSm} flex-1 text-center flex items-center justify-center gap-1`}
                >
                  <IconOlho size={12} /> Ver
                </Link>
                <button
                  onClick={() => entrar.mutate(g.id)}
                  disabled={entrar.isPending}
                  className={`${btnPrimary} ${btnSm} flex-1`}
                >
                  Entrar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}
