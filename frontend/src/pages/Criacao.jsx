import { useState } from 'react';
import { useCriarCartaCatalogo, useTaxasCriacao } from '../api/criacao';
import AnimatedPage from '../components/AnimatedPage';
import { cardBase, pageTitle, pageHeader, btnPrimary, inputBase, selectBase, labelBase, textSecondary, statCard, statValue, statLabel, raridadeCores, badgeBase } from '../styles/components';
import { IconCriar, IconMoedas } from '../utils/icones';

const ELEMENTOS = ['FOGO', 'AGUA', 'TERRA', 'VENTO', 'LUZ', 'TREVAS'];
const CLASSES = ['GUERREIRO', 'MAGO', 'PATRULHEIRO', 'CURANDEIRO', 'LADINO'];
const RARIDADES = ['COMUM', 'INCOMUM', 'RARA', 'EPICA', 'LENDARIA'];

export default function Criacao() {
  const { data: taxas } = useTaxasCriacao();
  const criar = useCriarCartaCatalogo();
  const [form, setForm] = useState({ nome: '', descricao: '', imagem: '', elemento: 'FOGO', classe: 'GUERREIRO', raridade: 'COMUM' });
  const handleSubmit = (e) => { e.preventDefault(); criar.mutate(form); };

  return (
    <AnimatedPage>
      <div className={pageHeader}>
        <h1 className={pageTitle}>Criar Carta</h1>
        <p className={`${textSecondary} text-sm mt-1`}>Crie cartas para o catálogo global. O poder é gerado automaticamente.</p>
      </div>
      {taxas && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {taxas.taxas.map((t) => {
            const cores = raridadeCores[t.raridade] || {};
            return (
              <div key={t.raridade} className={`${statCard} border ${cores.border || 'border-slate-700'}`}>
                <div className={`${badgeBase} ${cores.badge} mb-1`}>{t.raridade}</div>
                <div className="flex items-center justify-center gap-1"><IconMoedas size={12} className="text-amber-400" /><div className={`${statValue} text-lg`}>{t.custo}</div></div>
                <div className={statLabel}>moedas</div>
              </div>
            );
          })}
        </div>
      )}
      <div className="text-sm text-amber-400 mb-4 flex items-center gap-1">
        <IconCriar size={14} /> Cartas criadas hoje: {taxas?.criacoesHoje || 0} — Taxa aumenta a cada criação
      </div>
      <form onSubmit={handleSubmit} className={`${cardBase} p-5 max-w-xl`}>
        <div className="space-y-4">
          <div><label className={labelBase}>Nome</label><input className={inputBase} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome da carta" required /></div>
          <div><label className={labelBase}>Descrição (opcional)</label><input className={inputBase} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></div>
          <div><label className={labelBase}>URL da Imagem (opcional)</label><input className={inputBase} value={form.imagem} onChange={(e) => setForm({ ...form, imagem: e.target.value })} placeholder="https://..." /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelBase}>Elemento</label><select className={selectBase} value={form.elemento} onChange={(e) => setForm({ ...form, elemento: e.target.value })}>{ELEMENTOS.map((el) => <option key={el} value={el}>{el}</option>)}</select></div>
            <div><label className={labelBase}>Classe</label><select className={selectBase} value={form.classe} onChange={(e) => setForm({ ...form, classe: e.target.value })}>{CLASSES.map((cl) => <option key={cl} value={cl}>{cl}</option>)}</select></div>
            <div><label className={labelBase}>Raridade</label><select className={selectBase} value={form.raridade} onChange={(e) => setForm({ ...form, raridade: e.target.value })}>{RARIDADES.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
          </div>
          <button type="submit" disabled={criar.isPending} className={`${btnPrimary} w-full flex items-center justify-center gap-2`}>
            <IconCriar size={16} /> {criar.isPending ? 'Criando...' : 'Criar Carta'}
          </button>
        </div>
      </form>
    </AnimatedPage>
  );
}