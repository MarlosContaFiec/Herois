import { useState } from "react";
import { motion } from "framer-motion";
import {
  useBoosters,
  useCriarBooster,
  useComprarBooster,
} from "../api/boosters";
import AnimatedPage from "../components/AnimatedPage";
import { SkeletonLista } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import {
  cardBase,
  cardHover,
  pageTitle,
  pageHeader,
  btnPrimary,
  btnSecondary,
  btnAmber,
  inputBase,
  labelBase,
  gridCols3,
  textSecondary,
  fontSemibold,
  badgeBase,
} from "../styles/components";
import { IconBoosters, IconMais } from "../utils/icones";

export default function Boosters() {
  const { data: boosters, isLoading } = useBoosters();
  const criar = useCriarBooster();
  const comprar = useComprarBooster();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    qtdCartas: 3,
    pesoComum: 40,
    pesoIncomum: 30,
    pesoRara: 20,
    pesoEpica: 8,
    pesoLendaria: 2,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    criar.mutate(form, { onSuccess: () => setMostrarForm(false) });
  };

  return (
    <AnimatedPage>
      <div className={`${pageHeader} flex items-center justify-between`}>
        <h1 className={pageTitle}>Boosters</h1>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className={btnSecondary}
        >
          {mostrarForm ? (
            "Cancelar"
          ) : (
            <>
              <IconMais size={14} /> Criar Booster
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
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="col-span-2 md:col-span-4">
              <label className={labelBase}>Nome</label>
              <input
                className={inputBase}
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={labelBase}>Qtd Cartas</label>
              <input
                type="number"
                className={inputBase}
                value={form.qtdCartas}
                onChange={(e) =>
                  setForm({ ...form, qtdCartas: +e.target.value })
                }
                min={1}
                max={20}
              />
            </div>
            <div>
              <label className={labelBase}>% Comum</label>
              <input
                type="number"
                className={inputBase}
                value={form.pesoComum}
                onChange={(e) =>
                  setForm({ ...form, pesoComum: +e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelBase}>% Incomum</label>
              <input
                type="number"
                className={inputBase}
                value={form.pesoIncomum}
                onChange={(e) =>
                  setForm({ ...form, pesoIncomum: +e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelBase}>% Rara</label>
              <input
                type="number"
                className={inputBase}
                value={form.pesoRara}
                onChange={(e) =>
                  setForm({ ...form, pesoRara: +e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelBase}>% Épica</label>
              <input
                type="number"
                className={inputBase}
                value={form.pesoEpica}
                onChange={(e) =>
                  setForm({ ...form, pesoEpica: +e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelBase}>% Lendária</label>
              <input
                type="number"
                className={inputBase}
                value={form.pesoLendaria}
                onChange={(e) =>
                  setForm({ ...form, pesoLendaria: +e.target.value })
                }
              />
            </div>
            <div className="col-span-2 md:col-span-4">
              <button
                type="submit"
                disabled={criar.isPending}
                className={btnPrimary}
              >
                {criar.isPending ? "Criando..." : "Criar Booster"}
              </button>
            </div>
          </form>
        </motion.div>
      )}
      {isLoading ? (
        <SkeletonLista count={6} />
      ) : !boosters?.length ? (
        <EmptyState
          icone={IconBoosters}
          titulo="Nenhum booster criado"
          descricao="Crie seu próprio booster personalizado"
        />
      ) : (
        <div className={gridCols3}>
          {boosters.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`${cardBase} ${cardHover} p-5`}
            >
              <h3 className={`${fontSemibold} text-slate-200 mb-1`}>
                {b.nome}
              </h3>
              <p className={`${textSecondary} text-xs mb-2`}>
                por {b.criador.nomeUsuario}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                <span
                  className={`${badgeBase} bg-slate-600/30 text-slate-400 text-[10px]`}
                >
                  C:{b.pesoComum}%
                </span>
                <span
                  className={`${badgeBase} bg-emerald-600/30 text-emerald-400 text-[10px]`}
                >
                  U:{b.pesoIncomum}%
                </span>
                <span
                  className={`${badgeBase} bg-cyan-600/30 text-cyan-400 text-[10px]`}
                >
                  R:{b.pesoRara}%
                </span>
                <span
                  className={`${badgeBase} bg-purple-600/30 text-purple-400 text-[10px]`}
                >
                  E:{b.pesoEpica}%
                </span>
                <span
                  className={`${badgeBase} bg-amber-600/30 text-amber-400 text-[10px]`}
                >
                  L:{b.pesoLendaria}%
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-amber-400 font-bold">
                  {b.custo} moedas
                </span>
                <span className={`${textSecondary} text-xs`}>
                  {b.qtdCartas} cartas
                </span>
              </div>
              <button
                onClick={() => comprar.mutate(b.id)}
                disabled={comprar.isPending}
                className={`${btnAmber} w-full text-sm`}
              >
                {comprar.isPending ? "Abrindo..." : "Comprar"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}
