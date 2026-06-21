import { useColecao, useRemoverColecao } from '../api/colecao';
import { useEvoluir } from '../api/evolucao';
import AnimatedPage from '../components/AnimatedPage';
import CartaCard from '../components/CartaCard';
import { SkeletonLista } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { pageTitle, pageHeader, gridCols4, btnDanger, btnAmber, btnSm, textSecondary, raridadeCores, badgeBase } from '../styles/components';
import { IconColecao, IconEvoluir, IconDeletar } from '../utils/icones';

export default function Colecao() {
  const { data: colecao, isLoading } = useColecao();
  const remover = useRemoverColecao();
  const evoluir = useEvoluir();
  const sufixo = (cont) => ['', ' +', ' ++', ' +++', ' #'][Math.min(cont, 4)] || ' #';

  return (
    <AnimatedPage>
      <div className={pageHeader}>
        <h1 className={pageTitle}>Minha Coleção</h1>
        <p className={`${textSecondary} text-sm mt-1`}>{colecao?.length || 0} cartas</p>
      </div>
      {isLoading ? <SkeletonLista count={6} /> : !colecao?.length ? <EmptyState icone={IconColecao} titulo="Coleção vazia" descricao="Adicione cartas do catálogo ou abra pacotes" /> : (
        <div className={gridCols4}>
          {colecao.map((cu, i) => (
            <CartaCard key={cu.id} carta={{ ...cu.carta, nome: cu.carta.nome + sufixo(cu.contagemEvoluida) }} index={i}>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className={textSecondary}>Nv.{cu.nivel} · XP: {cu.xp}</span>
                {cu.serieEvolucao && <span className={`${badgeBase} ${raridadeCores[cu.carta.raridade]?.badge}`}>series-{cu.serieEvolucao}</span>}
              </div>
              <div className="flex gap-2">
                {cu.nivel >= 10 && (
                  <button onClick={() => evoluir.mutate(cu.id)} disabled={evoluir.isPending} className={`${btnAmber} ${btnSm} flex-1 flex items-center justify-center gap-1`}>
                    <IconEvoluir size={12} /> Evoluir
                  </button>
                )}
                <button onClick={() => remover.mutate(cu.cartaId)} disabled={remover.isPending} className={`${btnDanger} ${btnSm} flex-1 flex items-center justify-center gap-1`}>
                  <IconDeletar size={12} /> Remover
                </button>
              </div>
            </CartaCard>
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}