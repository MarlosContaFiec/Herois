import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSessaoAtiva, useIniciarSessao, useColocarVitrine, useFazerOferta, useResponderOferta } from '../api/sessaoTroca';
import { useColecao } from '../api/colecao';
import AnimatedPage from '../components/AnimatedPage';
import EmptyState from '../components/EmptyState';
import { cardBase, cardHover, pageTitle, pageHeader, btnPrimary, btnDanger, btnSm, inputBase, selectBase, textSecondary, fontSemibold, badgeBase, raridadeCores, gridCols3 } from '../styles/components';
import { IconTroca, IconMais, IconCheck, IconErro, IconPoder, IconMoedas } from '../utils/icones';

export default function SessaoTroca() {
  const { id } = useParams();
  const { data: sessao, isLoading, error } = useSessaoAtiva(id);
  const { data: colecao } = useColecao();
  const iniciar = useIniciarSessao();
  const colocar = useColocarVitrine();
  const fazerOferta = useFazerOferta();
  const responder = useResponderOferta();
  const [cartaVitrine, setCartaVitrine] = useState('');
  const [preco, setPreco] = useState('');

  if (isLoading) return <AnimatedPage><div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div></AnimatedPage>;

  if (!sessao || error) {
    return (
      <AnimatedPage>
        <div className={pageHeader}><h1 className={pageTitle}>Sessão de Troca</h1></div>
        <EmptyState icone={IconTroca} titulo="Nenhuma sessão ativa" descricao="Peça ao líder ou vice para iniciar uma sessão" />
        <button onClick={() => iniciar.mutate(id)} disabled={iniciar.isPending} className={`${btnPrimary} mx-auto block mt-4 flex items-center gap-2`}>
          <IconTroca size={16} /> {iniciar.isPending ? 'Iniciando...' : 'Iniciar Sessão (30min)'}
        </button>
      </AnimatedPage>
    );
  }

  const handleColocar = () => {
    if (!cartaVitrine) return;
    colocar.mutate({ sessaoId: sessao.id, cartaUsuarioId: cartaVitrine, precoPedido: preco ? +preco : undefined });
    setCartaVitrine('');
    setPreco('');
  };

  return (
    <AnimatedPage>
      <div className={pageHeader}>
        <h1 className={pageTitle}>Sessão de Troca</h1>
        <p className={`${textSecondary} text-sm mt-1 flex items-center gap-1`}>
          <IconTroca size={12} /> Expira: {new Date(sessao.expiraEm).toLocaleTimeString()} · {sessao.listagens?.length || 0} cartas na vitrine
        </p>
      </div>
      <div className={`${cardBase} p-4 mb-6`}>
        <h3 className={`${fontSemibold} text-sm text-slate-300 mb-3 flex items-center gap-1`}><IconMais size={14} /> Colocar carta na vitrine (máx 3)</h3>
        <div className="flex gap-3 flex-wrap">
          <select className={selectBase} style={{ maxWidth: '250px' }} value={cartaVitrine} onChange={(e) => setCartaVitrine(e.target.value)}>
            <option value="">Selecionar carta...</option>
            {colecao?.map((cu) => <option key={cu.id} value={cu.id}>{cu.carta.nome} ({cu.carta.poder} poder)</option>)}
          </select>
          <input type="number" className={inputBase} style={{ maxWidth: '120px' }} placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} />
          <button onClick={handleColocar} disabled={!cartaVitrine || colocar.isPending} className={btnPrimary}>Colocar</button>
        </div>
      </div>
      {sessao.listagens?.length === 0 ? (
        <EmptyState icone={IconTroca} titulo="Vitrine vazia" descricao="Nenhuma carta colocada ainda" />
      ) : (
        <div className={gridCols3}>
          {sessao.listagens?.map((listagem, i) => {
            const raridade = raridadeCores[listagem.cartaUsuario?.carta?.raridade] || raridadeCores.COMUM;
            return (
              <motion.div key={listagem.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`${cardBase} ${cardHover} p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`${fontSemibold} text-sm text-slate-200`}>{listagem.cartaUsuario?.carta?.nome}</h4>
                  <span className={`${badgeBase} ${raridade.badge} text-[10px]`}>{listagem.cartaUsuario?.carta?.raridade}</span>
                </div>
                <p className={`${textSecondary} text-xs mb-1 flex items-center gap-1`}><IconPoder size={10} className="text-amber-400" /> {listagem.cartaUsuario?.carta?.poder} · {listagem.cartaUsuario?.carta?.elemento}</p>
                <p className={`${textSecondary} text-xs mb-3`}>Vendedor: {listagem.usuario?.nomeUsuario}</p>
                {listagem.precoPedido && <p className="text-amber-400 text-sm font-bold mb-2 flex items-center gap-1"><IconMoedas size={12} /> {listagem.precoPedido}</p>}
                {listagem.ofertas?.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {listagem.ofertas.map((oferta) => (
                      <div key={oferta.id} className="bg-slate-800 p-2 rounded text-xs flex items-center gap-1">
                        {oferta.status === 'ACEITA' ? <IconCheck size={10} className="text-emerald-400" /> : oferta.status === 'REJEITADA' ? <IconErro size={10} className="text-red-400" /> : null}
                        <span className={textSecondary}>{oferta.ofertante?.nomeUsuario}: </span>
                        <span className="text-amber-400">{oferta.tipoOferta === 'MOEDAS' ? `${oferta.ofertaMoedas} moedas` : oferta.tipoOferta}</span>
                        <span className={`${textSecondary} ml-1`}>({oferta.status})</span>
                      </div>
                    ))}
                  </div>
                )}
                {listagem.status === 'ATIVO' && (
                  <div className="flex gap-2">
                    <input type="number" className={`${inputBase} text-xs`} placeholder="Oferta $" style={{ maxWidth: '80px' }} id={`oferta-${listagem.id}`} />
                    <button onClick={() => {
                      const valor = document.getElementById(`oferta-${listagem.id}`).value;
                      if (valor) fazerOferta.mutate({ sessaoId: sessao.id, listagemId: listagem.id, tipoOferta: 'MOEDAS', ofertaMoedas: +valor });
                    }} className={`${btnPrimary} ${btnSm} flex-1`}>Ofertar</button>
                  </div>
                )}
                {listagem.status === 'ATIVO' && listagem.ofertas?.filter((o) => o.status === 'PENDENTE').map((oferta) => (
                  <div key={oferta.id} className="flex gap-2 mt-2">
                    <button onClick={() => responder.mutate({ sessaoId: sessao.id, ofertaId: oferta.id, aceitar: true })} className={`${btnPrimary} ${btnSm} flex-1 flex items-center gap-1`}><IconCheck size={10} /> Aceitar</button>
                    <button onClick={() => responder.mutate({ sessaoId: sessao.id, ofertaId: oferta.id, aceitar: false })} className={`${btnDanger} ${btnSm} flex-1 flex items-center gap-1`}><IconErro size={10} /> Rejeitar</button>
                  </div>
                ))}
              </motion.div>
            );
          })}
        </div>
      )}
    </AnimatedPage>
  );
}