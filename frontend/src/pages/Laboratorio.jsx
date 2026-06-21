import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLaboratorio, useCriarCartaLab, useDeletarCartaLab, useTransferirLab } from '../api/laboratorio';
import AnimatedPage from '../components/AnimatedPage';
import { SkeletonLista } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import CartaCard from '../components/CartaCard';
import { cardBase, pageTitle, pageHeader, btnPrimary, btnDanger, btnAmber, btnSm, inputBase, selectBase, labelBase, gridCols4, textSecondary } from '../styles/components';
import { IconLaboratorio, IconMais, IconEvoluir, IconDeletar } from '../utils/icones';

const ELEMENTOS = ['FOGO', 'AGUA', 'TERRA', 'VENTO', 'LUZ', 'TREVAS'];
const CLASSES = ['GUERREIRO', 'MAGO', 'PATRULHEIRO', 'CURANDEIRO', 'LADINO'];
const RARIDADES = ['COMUM', 'INCOMUM', 'RARA', 'EPICA', 'LENDARIA', 'UNICA'];

export default function Laboratorio() {
  const { data: cartas, isLoading } = useLaboratorio();
  const criar = useCriarCartaLab();
  const deletar = useDeletarCartaLab();
  const transferir = useTransferirLab();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ nome: '', descricao: '', imagem: '', elemento: 'FOGO', classe: 'GUERREIRO', raridade: 'COMUM', poder: 30 });

  const handleSubmit = (e) => { e.preventDefault(); criar.mutate(form, { onSuccess: () => setMostrarForm(false) }); };

  return (
    <AnimatedPage>
      <div className={`${pageHeader} flex items-center justify-between`}>
        <div>
          <h1 className={pageTitle}>Laboratório</h1>
          <p className={`${textSecondary} text-sm mt-1`}>Crie e gerencie cartas do seu laboratório pessoal (sandbox)</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} className={btnPrimary}>
          {mostrarForm ? 'Cancelar' : <><IconMais size={14} /> Criar Carta</>}
        </button>
      </div>
      {mostrarForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`${cardBase} p-5 mb-6`}>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2"><label className={labelBase}>Nome</label><input className={inputBase} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required /></div>
            <div className="col-span-2"><label className={labelBase}>Imagem URL</label><input className={inputBase} value={form.imagem} onChange={(e) => setForm({ ...form, imagem: e.target.value })} placeholder="https://..." /></div>
            <div><label className={labelBase}>Elemento</label><select className={selectBase} value={form.elemento} onChange={(e) => setForm({ ...form, elemento: e.target.value })}>{ELEMENTOS.map((el) => <option key={el} value={el}>{el}</option>)}</select></div>
            <div><label className={labelBase}>Classe</label><select className={selectBase} value={form.classe} onChange={(e) => setForm({ ...form, classe: e.target.value })}>{CLASSES.map((cl) => <option key={cl} value={cl}>{cl}</option>)}</select></div>
            <div><label className={labelBase}>Raridade</label><select className={selectBase} value={form.raridade} onChange={(e) => setForm({ ...form, raridade: e.target.value })}>{RARIDADES.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
            <div><label className={labelBase}>Poder</label><input type="number" className={inputBase} value={form.poder} onChange={(e) => setForm({ ...form, poder: +e.target.value })} min={10} max={600} /></div>
            <div className="col-span-2 md:col-span-4"><button type="submit" disabled={criar.isPending} className={btnPrimary}>{criar.isPending ? 'Criando...' : 'Criar no Laboratório'}</button></div>
          </form>
        </motion.div>
      )}
      {isLoading ? <SkeletonLista count={6} /> : !cartas?.length ? <EmptyState icone={IconLaboratorio} titulo="Laboratório vazio" descricao="Crie cartas no seu laboratório pessoal" /> : (
        <div className={gridCols4}>
          {cartas.map((carta, i) => (
            <CartaCard key={carta.id} carta={carta} index={i}>
              <div className="flex gap-2">
                <button onClick={() => transferir.mutate(carta.id)} disabled={transferir.isPending} className={`${btnAmber} ${btnSm} flex-1 flex items-center justify-center gap-1`}>
                  <IconEvoluir size={12} /> Transferir
                </button>
                <button onClick={() => deletar.mutate(carta.id)} disabled={deletar.isPending} className={`${btnDanger} ${btnSm} flex items-center justify-center`}>
                  <IconDeletar size={12} />
                </button>
              </div>
            </CartaCard>
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}