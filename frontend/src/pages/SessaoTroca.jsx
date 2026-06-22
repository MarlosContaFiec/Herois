import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSessaoAtiva, useIniciarSessao } from "../api/sessaoTroca";
import AnimatedPage from "../components/AnimatedPage";
import VitrineTab from "../components/VitrineTab";
import EmptyState from "../components/EmptyState";
import {
  pageTitle,
  pageHeader,
  btnPrimary,
  btnGhost,
  btnSm,
  textSecondary,
} from "../styles/components";
import { IconTroca, IconFechar, IconClock } from "../utils/icones";

function ContadorSessao({ expiraEm }) {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    const calcular = () => {
      const diff = new Date(expiraEm) - Date.now();
      if (diff <= 0) return "Expirada";
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      return `${m}:${s.toString().padStart(2, "0")}`;
    };

    setTexto(calcular());
    const timer = setInterval(() => setTexto(calcular()), 1000);
    return () => clearInterval(timer);
  }, [expiraEm]);

  return <span className="font-mono text-cyan-400">{texto}</span>;
}

export default function SessaoTroca() {
  const { id } = useParams();
  const { data: sessao, isLoading, error } = useSessaoAtiva(id);
  const iniciar = useIniciarSessao();

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AnimatedPage>
    );
  }

  if (!sessao || error) {
    return (
      <AnimatedPage>
        <div className={pageHeader}>
          <h1 className={pageTitle}>Sessao de Troca</h1>
        </div>
        <EmptyState
          icone={IconTroca}
          titulo="Nenhuma sessao ativa"
          descricao="Peça ao lider ou vice para iniciar uma sessao"
        />
        <div className="flex justify-center mt-4">
          <button
            onClick={() => iniciar.mutate(id)}
            disabled={iniciar.isPending}
            className={`${btnPrimary} flex items-center gap-2`}
          >
            <IconTroca size={16} />{" "}
            {iniciar.isPending ? "Iniciando..." : "Iniciar Sessao (30min)"}
          </button>
        </div>
      </AnimatedPage>
    );
  }

  const expirada = new Date(sessao.expiraEm) < new Date();

  return (
    <AnimatedPage>
      <div
        className={`${pageHeader} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}
      >
        <div>
          <h1 className={pageTitle}>Sessao de Troca</h1>
          <p
            className={`${textSecondary} text-sm mt-1 flex items-center gap-2`}
          >
            <IconClock size={14} />
            {expirada ? (
              <span className="text-red-400">Sessao expirada</span>
            ) : (
              <>
                Expira em <ContadorSessao expiraEm={sessao.expiraEm} />
              </>
            )}
            <span className="text-slate-600">·</span>
            <span>{sessao.listagens?.length || 0} cartas na vitrine</span>
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          className={`${btnGhost} ${btnSm} flex items-center gap-1`}
        >
          <IconFechar size={14} /> Fechar
        </button>
      </div>
      <VitrineTab sessao={sessao} />
    </AnimatedPage>
  );
}
