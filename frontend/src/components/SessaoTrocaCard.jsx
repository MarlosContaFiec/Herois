import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFazerOferta, useResponderOferta } from "../api/sessaoTroca";
import useColecaoOrdenada from "../hooks/useColecaoOrdenada";
import {
  cardBase,
  cardHover,
  btnPrimary,
  btnDanger,
  btnSm,
  inputBase,
  textSecondary,
  fontSemibold,
  badgeBase,
  raridadeCores,
  elementoCores,
} from "../styles/components";
import {
  IconPoder,
  IconMoedas,
  IconCheck,
  IconErro,
  IconFechar,
  IconUser,
  IconClock,
  IconCartas,
  IconPacotes,
  IconTitulos,
  IconHeart,
  IconMais,
  IconDeletar,
  IconStar,
  elementoIcon as elIconMap,
  classeIcon as clIconMap,
} from "../utils/icones";
function ContadorTempo({ expiraEm }) {
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

  return (
    <span
      className={`flex items-center gap-1 text-xs font-mono ${texto === "Expirada" ? "text-red-400" : "text-cyan-400"}`}
    >
      <IconClock size={12} /> {texto}
    </span>
  );
}

function ModalOferta({ listagem, sessaoId, onClose }) {
  const { data: colecao } = useColecaoOrdenada();
  const fazerOferta = useFazerOferta();
  const [tipo, setTipo] = useState("MOEDAS");
  const [valor, setValor] = useState("");
  const [cartasSel, setCartasSel] = useState([]);

  const toggleCarta = (id) => {
    setCartasSel((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : prev.length < 5
          ? [...prev, id]
          : prev,
    );
  };

  const handleSubmit = () => {
    if (tipo === "MOEDAS" && !valor) return;
    if (tipo === "CARTA" && cartasSel.length === 0) return;

    const payload = {
      sessaoId,
      listagemId: listagem.id,
      tipoOferta: tipo,
    };

    if (tipo === "MOEDAS") payload.ofertaMoedas = +valor;
    if (tipo === "CARTA") payload.cartasOfertadas = cartasSel;

    fazerOferta.mutate(payload, { onSuccess: onClose });
  };

  const raridade =
    raridadeCores[listagem.cartaUsuario?.carta?.raridade] ||
    raridadeCores.COMUM;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={`${cardBase} p-5 w-full max-w-md max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${fontSemibold} text-slate-200`}>Fazer Oferta</h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300"
          >
            <IconFechar size={18} />
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-200 font-semibold">
              {listagem.cartaUsuario?.carta?.nome}
            </span>
            <span className={`${badgeBase} ${raridade.badge} text-[10px]`}>
              {listagem.cartaUsuario?.carta?.raridade}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`${textSecondary} text-xs flex items-center gap-1`}
            >
              <IconPoder size={10} className="text-amber-400" />{" "}
              {listagem.cartaUsuario?.carta?.poder}
            </span>
            {listagem.precoPedido && (
              <span className="text-amber-400 text-xs flex items-center gap-1">
                <IconMoedas size={10} /> {listagem.precoPedido} pedido
              </span>
            )}
          </div>
        </div>

        <div className="flex bg-slate-800 rounded-lg p-1 gap-1 mb-4">
          <button
            onClick={() => setTipo("MOEDAS")}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${tipo === "MOEDAS" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-slate-300"}`}
          >
            <IconMoedas size={12} /> Moedas
          </button>
          <button
            onClick={() => setTipo("CARTA")}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 ${tipo === "CARTA" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-slate-300"}`}
          >
            <IconCartas size={12} /> Cartas
          </button>
        </div>

        {tipo === "MOEDAS" && (
          <div className="mb-4">
            <label className={`${textSecondary} text-xs mb-1 block`}>
              Valor em moedas
            </label>
            <input
              type="number"
              className={inputBase}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Ex: 500"
              min={1}
            />
          </div>
        )}

        {tipo === "CARTA" && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className={`${textSecondary} text-xs`}>
                Selecione ate 5 cartas ({cartasSel.length}/5)
              </label>
              {cartasSel.length > 0 && (
                <button
                  onClick={() => setCartasSel([])}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Limpar
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {colecao
                ?.filter((cu) => cu.id !== listagem.cartaUsuarioId)
                .map((cu) => {
                  const sel = cartasSel.includes(cu.id);
                  const r =
                    raridadeCores[cu.carta.raridade] || raridadeCores.COMUM;
                  const ElIcon = elIconMap[cu.carta.elemento];
                  return (
                    <button
                      key={cu.id}
                      onClick={() => toggleCarta(cu.id)}
                      className={`p-2 rounded-lg text-xs text-left transition-all relative ${
                        sel
                          ? "bg-cyan-500/20 border border-cyan-500/50"
                          : "bg-slate-800 border border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      {sel && (
                        <div className="absolute top-1 left-1">
                          <IconCheck size={10} className="text-cyan-400" />
                        </div>
                      )}
                      {cu.favorito && (
                        <div className="absolute bottom-1 right-1">
                          <IconStar size={8} className="text-amber-400" />
                        </div>
                      )}
                      <div className="font-semibold text-slate-200 truncate pr-3">
                        {cu.carta.nome}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {ElIcon && (
                          <ElIcon
                            size={10}
                            className={
                              (elementoCores[cu.carta.elemento] || {}).text
                            }
                          />
                        )}
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <IconPoder size={8} /> {cu.carta.poder}
                        </span>
                      </div>
                      <span
                        className={`${badgeBase} ${r.badge} text-[8px] mt-0.5`}
                      >
                        {cu.carta.raridade}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={fazerOferta.isPending}
          className={`${btnPrimary} w-full flex items-center justify-center gap-2`}
        >
          {fazerOferta.isPending ? "Enviando..." : "Enviar Oferta"}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function SessaoTrocaCard({ listagem, sessaoId, meuId }) {
  const [modalAberto, setModalAberto] = useState(false);
  const responder = useResponderOferta();

  const carta = listagem.cartaUsuario?.carta;
  const raridade = raridadeCores[carta?.raridade] || raridadeCores.COMUM;
  const elemento = elementoCores[carta?.elemento] || {};
  const ElIcon = elIconMap[carta?.elemento];
  const ClIcon = clIconMap[carta?.classe];
  const ehMinha = listagem.usuarioId === meuId;

  const statusBadge = {
    ATIVO: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    VENDIDO: "bg-slate-600/20 text-slate-400 border border-slate-600/30",
    CANCELADO: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${cardBase} ${cardHover} ${ehMinha ? "border-cyan-500/30" : ""} p-4`}
      >
        <div
          className={`h-1.5 bg-gradient-to-r ${raridade.gradiente} rounded-full mb-3`}
        />

        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className={`${fontSemibold} text-sm text-slate-200`}>
              {carta?.nome}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              {ElIcon && <ElIcon size={12} className={elemento.text} />}
              <span className={`${textSecondary} text-xs`}>
                {carta?.elemento}
              </span>
              <span className="text-slate-600">·</span>
              {ClIcon && <ClIcon size={12} className="text-slate-500" />}
            </div>
          </div>
          <span className={`${badgeBase} ${raridade.badge} text-[10px]`}>
            {carta?.raridade}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className={`${textSecondary} text-xs flex items-center gap-1`}>
            <IconPoder size={10} className="text-amber-400" /> {carta?.poder}
          </span>
          {ehMinha && (
            <span
              className={`${badgeBase} ${statusBadge[listagem.status]} text-[10px]`}
            >
              {listagem.status}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-3 bg-slate-800 rounded-lg p-2">
          <div className="flex items-center gap-1">
            <IconUser size={12} className="text-slate-500" />
            <span className={`${textSecondary} text-xs`}>
              {listagem.usuario?.nomeUsuario}
            </span>
          </div>
          {listagem.precoPedido ? (
            <span className="text-amber-400 text-sm font-bold flex items-center gap-1">
              <IconMoedas size={12} /> {listagem.precoPedido}
            </span>
          ) : (
            <span className={`${textSecondary} text-xs`}>Sem preco</span>
          )}
        </div>

        {listagem.ofertas?.length > 0 && (
          <div className="space-y-1 mb-3">
            {listagem.ofertas.map((oferta) => {
              const statusCor = {
                PENDENTE: "border-amber-500/30 bg-amber-500/5",
                ACEITA: "border-emerald-500/30 bg-emerald-500/5",
                REJEITADA: "border-red-500/30 bg-red-500/5",
              };
              const statusTexto = {
                PENDENTE: "text-amber-400",
                ACEITA: "text-emerald-400",
                REJEITADA: "text-red-400",
              };
              const StatusIcone = {
                PENDENTE: IconClock,
                ACEITA: IconCheck,
                REJEITADA: IconErro,
              };
              const IC = StatusIcone[oferta.status] || IconClock;

              return (
                <div
                  key={oferta.id}
                  className={`rounded-lg p-2 border text-xs ${statusCor[oferta.status] || "border-slate-700"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <IC size={10} className={statusTexto[oferta.status]} />
                      <span className="text-slate-300 font-medium">
                        {oferta.ofertante?.nomeUsuario}
                      </span>
                    </div>
                    <span className={`font-bold ${statusTexto[oferta.status]}`}>
                      {oferta.tipoOferta === "MOEDAS" && (
                        <span className="flex items-center gap-1">
                          <IconMoedas size={10} /> {oferta.ofertaMoedas}
                        </span>
                      )}
                      {oferta.tipoOferta === "CARTA" && (
                        <span className="flex items-center gap-1">
                          <IconCartas size={10} />{" "}
                          {oferta.cartasOfertadas?.length || 0} carta(s)
                        </span>
                      )}
                      {oferta.tipoOferta === "PACOTE" && (
                        <span className="flex items-center gap-1">
                          <IconPacotes size={10} /> Pacote
                        </span>
                      )}
                      {oferta.tipoOferta === "TITULO" && (
                        <span className="flex items-center gap-1">
                          <IconTitulos size={10} /> Titulo
                        </span>
                      )}
                    </span>
                  </div>

                  {oferta.tipoOferta === "CARTA" &&
                    oferta.cartasOfertadas?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {oferta.cartasOfertadas.map((oc) => (
                          <span
                            key={oc.id}
                            className={`${badgeBase} ${(raridadeCores[oc.cartaUsuario?.carta?.raridade] || raridadeCores.COMUM).badge} text-[8px]`}
                          >
                            {oc.cartaUsuario?.carta?.nome} (
                            {oc.cartaUsuario?.carta?.poder})
                          </span>
                        ))}
                      </div>
                    )}

                  {oferta.status === "PENDENTE" && ehMinha && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          responder.mutate({
                            sessaoId,
                            ofertaId: oferta.id,
                            aceitar: true,
                          })
                        }
                        disabled={responder.isPending}
                        className={`${btnPrimary} ${btnSm} flex-1 flex items-center justify-center gap-1`}
                      >
                        <IconCheck size={10} /> Aceitar
                      </button>
                      <button
                        onClick={() =>
                          responder.mutate({
                            sessaoId,
                            ofertaId: oferta.id,
                            aceitar: false,
                          })
                        }
                        disabled={responder.isPending}
                        className={`${btnDanger} ${btnSm} flex-1 flex items-center justify-center gap-1`}
                      >
                        <IconErro size={10} /> Rejeitar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {listagem.status === "ATIVO" && !ehMinha && (
          <button
            onClick={() => setModalAberto(true)}
            className={`${btnPrimary} ${btnSm} w-full flex items-center justify-center gap-1`}
          >
            <IconMoedas size={12} /> Fazer Oferta
          </button>
        )}
      </motion.div>

      {modalAberto && (
        <ModalOferta
          listagem={listagem}
          sessaoId={sessaoId}
          onClose={() => setModalAberto(false)}
        />
      )}
    </>
  );
}
