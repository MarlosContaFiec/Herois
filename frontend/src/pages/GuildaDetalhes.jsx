import { useParams, Link } from "react-router-dom";
import { useGuilda, useSairGuilda } from "../api/guilda";
import { useAuth } from "../context/AuthContext";
import AnimatedPage from "../components/AnimatedPage";
import {
  cardBase,
  cardHover,
  pageTitle,
  pageHeader,
  btnPrimary,
  btnSecondary,
  btnDanger,
  btnSm,
  textSecondary,
  fontSemibold,
  badgeBase,
} from "../styles/components";
import {
  IconBoss,
  IconTroca,
  IconSair,
  IconUser,
  IconGuildas,
  IconMoedas,
} from "../utils/icones";

const papelBadges = {
  LIDER: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  VICE: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  MEMBRO: "bg-slate-600/20 text-slate-400 border border-slate-600/30",
};

const papelOrdem = { LIDER: 0, VICE: 1, MEMBRO: 2 };

export default function GuildaDetalhes() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const { data: guilda, isLoading } = useGuilda(id);
  const sair = useSairGuilda();

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AnimatedPage>
    );
  }

  if (!guilda) {
    return (
      <AnimatedPage>
        <div className="flex flex-col items-center justify-center py-16">
          <IconGuildas size={48} className="text-slate-600 mb-4" />
          <p className="text-red-400 font-semibold">Guilda nao encontrada</p>
          <Link
            to="/guildas"
            className="text-cyan-400 text-sm mt-2 hover:underline"
          >
            Voltar para lista de guildas
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  const meuPapel = guilda.membros?.find(
    (m) => m.usuario?.id === usuario.id,
  )?.papel;
  const isLiderOuVice = meuPapel === "LIDER" || meuPapel === "VICE";

  const membrosOrdenados = [...(guilda.membros || [])].sort(
    (a, b) => (papelOrdem[a.papel] ?? 99) - (papelOrdem[b.papel] ?? 99),
  );

  return (
    <AnimatedPage>
      <div
        className={`${pageHeader} flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4`}
      >
        <div>
          <h1 className={pageTitle}>{guilda.nome}</h1>
          {guilda.descricao && (
            <p className={`${textSecondary} text-sm mt-1`}>
              {guilda.descricao}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className={`${badgeBase} ${papelBadges[meuPapel]}`}>
              {meuPapel}
            </span>
            <span className={`${textSecondary} text-xs`}>
              Lider: {guilda.criador?.nomeUsuario}
            </span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            to="/boss-guilda"
            className={`${btnPrimary} ${btnSm} flex items-center gap-1`}
          >
            <IconBoss size={12} /> Boss
          </Link>
          <Link
            to={`/sessao-troca/${guilda.id}`}
            className={`${btnSecondary} ${btnSm} flex items-center gap-1`}
          >
            <IconTroca size={12} /> Sessao de Troca
          </Link>
          <button
            onClick={() => sair.mutate()}
            disabled={sair.isPending}
            className={`${btnDanger} ${btnSm} flex items-center gap-1`}
          >
            <IconSair size={12} />{" "}
            {sair.isPending ? "Saindo..." : "Sair da Guilda"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={`${cardBase} p-4 text-center`}>
          <IconUser size={24} className="text-slate-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-cyan-400">
            {guilda.membros?.length || 0}
          </div>
          <div className={`${textSecondary} text-xs`}>Membros</div>
        </div>
        <div className={`${cardBase} p-4 text-center`}>
          <IconMoedas size={24} className="text-slate-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-amber-400">
            {guilda.custoCriacao}
          </div>
          <div className={`${textSecondary} text-xs`}>Custo criacao</div>
        </div>
        <div className={`${cardBase} p-4 text-center`}>
          <IconGuildas size={24} className="text-slate-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-pink-400">
            {guilda.tipoEntrada}
          </div>
          <div className={`${textSecondary} text-xs`}>Tipo entrada</div>
        </div>
        <div className={`${cardBase} p-4 text-center`}>
          <IconBoss size={24} className="text-slate-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-emerald-400">
            {guilda.bosses?.length || 0}
          </div>
          <div className={`${textSecondary} text-xs`}>Bosses derrotados</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-slate-200">
          Membros ({membrosOrdenados.length})
        </h2>
      </div>

      <div className="space-y-2">
        {membrosOrdenados.map((m, i) => {
          const isEu = m.usuario?.id === usuario.id;
          return (
            <div
              key={m.id}
              className={`${cardBase} ${cardHover} p-3 flex items-center justify-between ${isEu ? "border-cyan-500/30" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${m.papel === "LIDER" ? "bg-amber-500/20 text-amber-400" : m.papel === "VICE" ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-700 text-slate-400"}`}
                >
                  {m.papel === "LIDER"
                    ? "👑"
                    : m.papel === "VICE"
                      ? "⭐"
                      : i + 1}
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-200">
                    {m.usuario?.nomeUsuario}
                  </span>
                  {isEu && (
                    <span className="text-cyan-400 text-xs ml-1">(Voce)</span>
                  )}
                  <span className={`${textSecondary} text-xs ml-2`}>
                    Nv.{m.usuario?.nivel}
                  </span>
                </div>
              </div>
              <span className={`${badgeBase} ${papelBadges[m.papel]}`}>
                {m.papel}
              </span>
            </div>
          );
        })}
      </div>
    </AnimatedPage>
  );
}
