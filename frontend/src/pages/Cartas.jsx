import { useState } from 'react';
import { useCartas } from '../api/cartas';
import { useAdicionarColecao } from '../api/colecao';
import AnimatedPage from '../components/AnimatedPage';
import CartaCard from '../components/CartaCard';
import { SkeletonLista } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { inputBase, selectBase, pageTitle, pageHeader, gridCols4, btnPrimary, btnSm } from '../styles/components';
import { IconCartas, IconMais, IconBuscar } from '../utils/icones';

const ELEMENTOS = ['', 'FOGO', 'AGUA', 'TERRA', 'VENTO', 'LUZ', 'TREVAS'];
const CLASSES = ['', 'GUERREIRO', 'MAGO', 'PATRULHEIRO', 'CURANDEIRO', 'LADINO'];
const RARIDADES = ['', 'COMUM', 'INCOMUM', 'RARA', 'EPICA', 'LENDARIA', 'UNICA'];

export default function Cartas() {
  const [filtros, setFiltros] = useState({});
  const { data: cartas, isLoading } = useCartas(filtros);
  const adicionar = useAdicionarColecao();

  return (
    <AnimatedPage>
      <div className={pageHeader}><h1 className={pageTitle}>Catálogo de Cartas</h1></div>
      <div className="flex flex-wrap gap-3 mb-6">
        <select className={selectBase} value={filtros.elemento || ''} onChange={(e) => setFiltros({ ...filtros, elemento: e.target.value || undefined })}>
          <option value="">Todos Elementos</option>
          {ELEMENTOS.filter(Boolean).map((el) => <option key={el} value={el}>{el}</option>)}
        </select>
        <select className={selectBase} value={filtros.classe || ''} onChange={(e) => setFiltros({ ...filtros, classe: e.target.value || undefined })}>
          <option value="">Todas Classes</option>
          {CLASSES.filter(Boolean).map((cl) => <option key={cl} value={cl}>{cl}</option>)}
        </select>
        <select className={selectBase} value={filtros.raridade || ''} onChange={(e) => setFiltros({ ...filtros, raridade: e.target.value || undefined })}>
          <option value="">Todas Raridades</option>
          {RARIDADES.filter(Boolean).map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <div className="relative">
          <IconBuscar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Buscar por nome..." className={`${inputBase} pl-9`} style={{ maxWidth: '200px' }} value={filtros.nome || ''} onChange={(e) => setFiltros({ ...filtros, nome: e.target.value || undefined })} />
        </div>
      </div>
      {isLoading ? <SkeletonLista count={8} /> : !cartas?.length ? <EmptyState icone={IconCartas} titulo="Nenhuma carta encontrada" descricao="Tente ajustar os filtros" /> : (
        <div className={gridCols4}>
          {cartas.map((carta, i) => (
            <CartaCard key={carta.id} carta={carta} index={i}>
              <button onClick={() => adicionar.mutate(carta.id)} disabled={adicionar.isPending} className={`${btnPrimary} ${btnSm} w-full flex items-center justify-center gap-1`}>
                <IconMais size={12} /> Adicionar à Coleção
              </button>
            </CartaCard>
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}