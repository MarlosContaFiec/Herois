import { useState } from "react";
import { motion } from "framer-motion";
import { useCriarCartaCatalogo, useTaxasCriacao } from "../api/criacao";
import { useAdicionarColecao } from "../api/colecao";
import AnimatedPage from "../components/AnimatedPage";
import {
  cardBase,
  pageTitle,
  pageHeader,
  btnPrimary,
  btnAmber,
  inputBase,
  selectBase,
  labelBase,
  textSecondary,
  statCard,
  statValue,
  statLabel,
  raridadeCores,
  badgeBase,
  fontSemibold,
} from "../styles/components";
import { IconCriar, IconMoedas, IconMais, IconCheck } from "../utils/icones";

const ELEMENTOS = ["FOGO", "AGUA", "TERRA", "VENTO", "LUZ", "TREVAS"];
const CLASSES = ["GUERREIRO", "MAGO", "PATRULHEIRO", "CURANDEIRO", "LADINO"];
const RARIDADES = ["COMUM", "INCOMUM", "RARA", "EPICA", "LENDARIA"];

const CUSTO_IMPORTAR = {
  COMUM: 50,
  INCOMUM: 100,
  RARA: 250,
  EPICA: 500,
  LENDARIA: 1500,
};

export default function Criacao() {
  const { data: taxas } = useTaxasCriacao();
  const criar = useCriarCartaCatalogo();
  const importar = useAdicionarColecao();
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    imagem: "",
    elemento: "FOGO",
    classe: "GUERREIRO",
    raridade: "COMUM",
  });
  const [cartaCriada, setCartaCriada] = useState(null);
  const [importada, setImportada] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    criar.mutate(form, {
      onSuccess: (data) => {
        setCartaCriada(data);
        setImportada(false);
      },
    });
  };

  const handleImportar = () => {
    if (!cartaCriada) return;
    importar.mutate(
      { cartaId: cartaCriada.id },
      { onSuccess: () => setImportada(true) },
    );
  };

  const resetar = () => {
    setCartaCriada(null);
    setImportada(false);
    setForm({
      nome: "",
      descricao: "",
      imagem: "",
      elemento: "FOGO",
      classe: "GUERREIRO",
      raridade: "COMUM",
    });
  };

  return (
    <AnimatedPage>
      <div className={pageHeader}>
        <h1 className={pageTitle}>Criar Carta</h1>
        <p className={`${textSecondary} text-sm mt-1`}>
          Crie cartas para o catálogo global. O poder é gerado automaticamente.
        </p>
      </div>

      {taxas && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {taxas.taxas.map((t) => {
            const cores = raridadeCores[t.raridade] || {};
            return (
              <div
                key={t.raridade}
                className={`${statCard} border ${cores.border || "border-slate-700"}`}
              >
                <div className={`${badgeBase} ${cores.badge} mb-1`}>
                  {t.raridade}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <IconMoedas size={12} className="text-amber-400" />
                  <div className={`${statValue} text-lg`}>{t.custo}</div>
                </div>
                <div className={statLabel}>moedas</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-sm text-amber-400 mb-4 flex items-center gap-1">
        <IconCriar size={14} /> Cartas criadas hoje: {taxas?.criacoesHoje || 0}{" "}
        — Taxa aumenta a cada criacao
      </div>

      {cartaCriada ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardBase} p-6 max-w-xl`}
        >
          <div className="text-center mb-4">
            <IconCheck size={40} className="text-emerald-400 mx-auto mb-2" />
            <h2 className="text-lg font-bold text-slate-200">Carta Criada!</h2>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 mb-4">
            <h3 className={`${fontSemibold || "font-semibold"} text-slate-200`}>
              {cartaCriada.nome}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`${badgeBase} ${(raridadeCores[cartaCriada.raridade] || raridadeCores.COMUM).badge}`}
              >
                {cartaCriada.raridade}
              </span>
              <span className={`${textSecondary} text-xs`}>
                {cartaCriada.elemento} · {cartaCriada.classe}
              </span>
              <span className="text-amber-400 text-xs font-bold">
                Poder: {cartaCriada.poder}
              </span>
            </div>
          </div>

          {!importada ? (
            <div className="space-y-3">
              <button
                onClick={handleImportar}
                disabled={importar.isPending}
                className={`${btnAmber} w-full flex items-center justify-center gap-2`}
              >
                <IconMais size={16} />{" "}
                {importar.isPending
                  ? "Importando..."
                  : `Importar para Coleção (${CUSTO_IMPORTAR[cartaCriada.raridade] || 100} moedas)`}
              </button>
              <button onClick={resetar} className={`${btnPrimary} w-full`}>
                Criar Outra Carta
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center text-emerald-400 text-sm font-medium flex items-center justify-center gap-2">
                <IconCheck size={16} /> Carta importada para sua coleção!
              </div>
              <button onClick={resetar} className={`${btnPrimary} w-full`}>
                Criar Outra Carta
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className={`${cardBase} p-5 max-w-xl`}>
          <div className="space-y-4">
            <div>
              <label className={labelBase}>Nome</label>
              <input
                className={inputBase}
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Nome da carta"
                required
              />
            </div>
            <div>
              <label className={labelBase}>Descricao (opcional)</label>
              <input
                className={inputBase}
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelBase}>URL da Imagem (opcional)</label>
              <input
                className={inputBase}
                value={form.imagem}
                onChange={(e) => setForm({ ...form, imagem: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelBase}>Elemento</label>
                <select
                  className={selectBase}
                  value={form.elemento}
                  onChange={(e) =>
                    setForm({ ...form, elemento: e.target.value })
                  }
                >
                  {ELEMENTOS.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelBase}>Classe</label>
                <select
                  className={selectBase}
                  value={form.classe}
                  onChange={(e) => setForm({ ...form, classe: e.target.value })}
                >
                  {CLASSES.map((cl) => (
                    <option key={cl} value={cl}>
                      {cl}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelBase}>Raridade</label>
                <select
                  className={selectBase}
                  value={form.raridade}
                  onChange={(e) =>
                    setForm({ ...form, raridade: e.target.value })
                  }
                >
                  {RARIDADES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={criar.isPending}
              className={`${btnPrimary} w-full flex items-center justify-center gap-2`}
            >
              <IconCriar size={16} />{" "}
              {criar.isPending ? "Criando..." : "Criar Carta"}
            </button>
          </div>
        </form>
      )}
    </AnimatedPage>
  );
}
