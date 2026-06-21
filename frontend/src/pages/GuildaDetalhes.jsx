import { useParams, Link } from 'react-router-dom';
import { useGuilda, useSairGuilda } from '../api/guilda';
import AnimatedPage from '../components/AnimatedPage';
import { cardBase, pageTitle, pageHeader, btnPrimary, btnSecondary, btnDanger, btnSm, textSecondary, fontSemibold, badgeBase } from '../styles/components';
import { IconBoss, IconTroca, IconSair, IconUser } from '../utils/icones';

const papelBadges = { LIDER: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', VICE: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30', MEMBRO: 'bg-slate-600/20 text-slate-400 border border-slate-600/30' };

export default function GuildaDetalhes() {
  const { id } = useParams();
  const { data: guilda, isLoading } = useGuilda(id);
  const sair = useSairGuilda();
  if (isLoading) return <AnimatedPage><div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div></AnimatedPage>;
  if (!guilda) return <AnimatedPage><p className="text-red-400">Guilda não encontrada</p></AnimatedPage>;

  return (
    <AnimatedPage>
      <div className={`${pageHeader} flex items-center justify-between`}>
        <div>
          <h1 className={pageTitle}>{guilda.nome}</h1>
          {guilda.descricao && <p className={`${textSecondary} text-sm mt-1`}>{guilda.descricao}</p>}
        </div>
        <div className="flex gap-2">
          <Link to="/boss-guilda" className={`${btnPrimary} ${btnSm} flex items-center gap-1`}><IconBoss size={12} /> Boss</Link>
          <Link to={`/sessao-troca/${guilda.id}`} className={`${btnSecondary} ${btnSm} flex items-center gap-1`}><IconTroca size={12} /> Troca</Link>
          <button onClick={() => sair.mutate()} disabled={sair.isPending} className={`${btnDanger} ${btnSm} flex items-center gap-1`}><IconSair size={12} /> Sair</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`${cardBase} p-4 text-center`}><div className="text-2xl font-bold text-cyan-400">{guilda.membros?.length || 0}</div><div className={`${textSecondary} text-xs`}>Membros</div></div>
        <div className={`${cardBase} p-4 text-center`}><div className="text-lg font-bold text-amber-400">{guilda.custoCriacao} moedas</div><div className={`${textSecondary} text-xs`}>Custo criação</div></div>
        <div className={`${cardBase} p-4 text-center`}><div className="text-lg font-bold text-pink-400">{guilda.tipoEntrada}</div><div className={`${textSecondary} text-xs`}>Tipo entrada</div></div>
      </div>
      <h2 className="text-lg font-semibold text-slate-200 mb-3">Membros</h2>
      <div className="space-y-2">
        {guilda.membros?.map((m) => (
          <div key={m.id} className={`${cardBase} p-3 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <IconUser size={20} className="text-slate-500" />
              <div>
                <span className="text-sm font-semibold text-slate-200">{m.usuario?.nomeUsuario}</span>
                <span className={`${textSecondary} text-xs ml-2`}>Nv.{m.usuario?.nivel}</span>
              </div>
            </div>
            <span className={`${badgeBase} ${papelBadges[m.papel]}`}>{m.papel}</span>
          </div>
        ))}
      </div>
    </AnimatedPage>
  );
}