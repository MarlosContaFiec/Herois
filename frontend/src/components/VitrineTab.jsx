import { useState } from "react";
import { motion } from "framer-motion";
import { useColocarVitrine } from "../api/sessaoTroca";
import { useColecao } from "../api/colecao";
import { useAuth } from "../context/AuthContext";
import SessaoTrocaCard from "./SessaoTrocaCard";
import EmptyState from "./EmptyState";
import {
  cardBase,
  btnPrimary,
  btnSm,
  inputBase,
  selectBase,
  textSecondary,
  fontSemibold,
} from "../styles/components";
import { IconMais, IconTroca } from "../utils/icones";

export default function VitrineTab({ sessao }) {
  const { usuario } = useAuth();
  const { data: colecao } = useColecao();
  const colocar = useColocarVitrine();
  const [cartaSel, setCartaSel] = useState("");
  const [preco, setPreco] = useState("");

  const handleColocar = () => {
    if (!cartaSel) return;
    colocar.mutate(
      {
        sessaoId: sessao.id,
        cartaUsuarioId: cartaSel,
        precoPedido: preco ? +preco : undefined,
      },
      {
        onSuccess: () => {
          setCartaSel("");
          setPreco("");
        },
      },
    );
  };

  const minhasListagens =
    sessao.listagens?.filter((l) => l.usuarioId === usuario.id) || [];
  const outrasListagens =
    sessao.listagens?.filter((l) => l.usuarioId !== usuario.id) || [];

  const cartasDisponiveis =
    colecao?.filter((cu) => {
      const jaNaVitrine = sessao.listagens?.some(
        (l) => l.cartaUsuarioId === cu.id,
      );
      return !jaNaVitrine;
    }) || [];

  return (
    <div>
      <div className={`${cardBase} p-4 mb-6`}>
        <h3
          className={`${fontSemibold} text-sm text-slate-300 mb-3 flex items-center gap-1`}
        >
          <IconMais size={14} /> Colocar carta na vitrine
        </h3>
        <div className="flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <select
              className={`${selectBase} w-full`}
              value={cartaSel}
              onChange={(e) => setCartaSel(e.target.value)}
            >
              <option value="">Selecionar carta...</option>
              {cartasDisponiveis.map((cu) => (
                <option key={cu.id} value={cu.id}>
                  {cu.carta.nome} ({cu.carta.poder} poder)
                </option>
              ))}
            </select>
          </div>
          <div style={{ maxWidth: "140px" }}>
            <input
              type="number"
              className={inputBase}
              placeholder="Preco (opcional)"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </div>
          <button
            onClick={handleColocar}
            disabled={!cartaSel || colocar.isPending}
            className={`${btnPrimary} ${btnSm} flex items-center gap-1`}
          >
            <IconMais size={12} />{" "}
            {colocar.isPending ? "Colocando..." : "Colocar"}
          </button>
        </div>
      </div>

      {minhasListagens.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <IconTroca size={16} className="text-cyan-400" /> Minhas Listagens (
            {minhasListagens.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {minhasListagens.map((l, i) => (
              <SessaoTrocaCard
                key={l.id}
                listagem={l}
                sessaoId={sessao.id}
                meuId={usuario.id}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <IconTroca size={16} className="text-amber-400" /> Vitrine da Guilda (
          {outrasListagens.length})
        </h2>
        {outrasListagens.length === 0 ? (
          <EmptyState
            icone={IconTroca}
            titulo="Vitrine vazia"
            descricao="Nenhuma carta de outros membros ainda"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {outrasListagens.map((l, i) => (
              <SessaoTrocaCard
                key={l.id}
                listagem={l}
                sessaoId={sessao.id}
                meuId={usuario.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
