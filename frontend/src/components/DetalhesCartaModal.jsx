import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDetalhesCarta,
  useRemoverColecao,
  useFavoritar,
} from "../api/colecao";
import {
  cardBase,
  btnDanger,
  btnGhost,
  btnPrimary,
  btnSm,
  badgeBase,
  raridadeCores,
  elementoCores,
  textSecondary,
  fontSemibold,
} from "../styles/components";
import {
  IconStarOutline,
  IconFechar,
  IconPoder,
  IconUser,
  IconDeletar,
  IconStar,
  IconAlerta,
  elementoIcon as elIconMap,
  classeIcon as clIconMap,
} from "../utils/icones";

function ModalConfirmacao({ nome, onConfirm, onCancel, isPending }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className={`${cardBase} p-5 w-full max-w-xs text-center`}
        onClick={(e) => e.stopPropagation()}
      >
        <IconAlerta size={40} className="text-red-400 mx-auto mb-3" />
        <h3 className={`${fontSemibold} text-slate-200 mb-1`}>
          Remover carta?
        </h3>
        <p className={`${textSecondary} text-sm mb-4`}>
          Tem certeza que deseja remover{" "}
          <span className="text-slate-200 font-semibold">{nome}</span> da sua
          coleção?
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className={`${btnGhost} ${btnSm} flex-1`}>
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`${btnDanger} ${btnSm} flex-1 flex items-center justify-center gap-1`}
          >
            <IconDeletar size={12} /> {isPending ? "Removendo..." : "Remover"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DetalhesCartaModal({ cartaId, onClose }) {
  const { data, isLoading } = useDetalhesCarta(cartaId);
  const remover = useRemoverColecao();
  const favoritar = useFavoritar();
  const [confirmando, setConfirmando] = useState(false);

  if (!cartaId) return null;

  const handleRemover = () => {
    remover.mutate(cartaId, { onSuccess: onClose });
  };

  return (
    <AnimatePresence>
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
          className={`${cardBase} w-full max-w-md max-h-[90vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            data && (
              <>
                {data.carta.imagem ? (
                  <div className="relative">
                    <img
                      src={data.carta.imagem}
                      alt={data.carta.nome}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  </div>
                ) : (
                  <div
                    className={`h-2 bg-gradient-to-r ${(raridadeCores[data.carta.raridade] || raridadeCores.COMUM).gradiente}`}
                  />
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-200">
                        {data.carta.nome}
                      </h2>
                      {data.carta.descricao && (
                        <p className={`${textSecondary} text-sm mt-1`}>
                          {data.carta.descricao}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => favoritar.mutate(cartaId)}
                        className="p-1.5 rounded-full transition-all hover:scale-110"
                        title={data.favorito ? "Desfavoritar" : "Favoritar"}
                      >
                        {data.favorito ? (
                          <IconStar size={18} className="text-amber-400" />
                        ) : (
                          <IconStarOutline
                            size={18}
                            className="text-slate-500 hover:text-amber-400"
                          />
                        )}
                      </button>
                      <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <IconFechar size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`${badgeBase} ${(raridadeCores[data.carta.raridade] || raridadeCores.COMUM).badge}`}
                    >
                      {data.carta.raridade}
                    </span>
                    <span
                      className={`${badgeBase} ${(elementoCores[data.carta.elemento] || {}).badge || "bg-slate-600/20 text-slate-400 border border-slate-600/30"}`}
                    >
                      {(() => {
                        const EI = elIconMap[data.carta.elemento];
                        return EI ? (
                          <span className="flex items-center gap-1">
                            <EI size={10} />
                            {data.carta.elemento}
                          </span>
                        ) : (
                          data.carta.elemento
                        );
                      })()}
                    </span>
                    <span
                      className={`${badgeBase} bg-slate-600/20 text-slate-400 border border-slate-600/30`}
                    >
                      {(() => {
                        const CI = clIconMap[data.carta.classe];
                        return CI ? (
                          <span className="flex items-center gap-1">
                            <CI size={10} />
                            {data.carta.classe}
                          </span>
                        ) : (
                          data.carta.classe
                        );
                      })()}
                    </span>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4 mb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={textSecondary}>Poder</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <IconPoder size={14} /> {data.carta.poder}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={textSecondary}>Criador</span>
                      <span className="text-slate-200 text-sm flex items-center gap-1">
                        <IconUser size={12} className="text-cyan-400" />{" "}
                        {data.carta.criador?.nomeUsuario || "Sistema"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={textSecondary}>Total de donos</span>
                      <span className="text-slate-200 font-bold">
                        {data.totalDonos}
                      </span>
                    </div>
                    {data.numeroSerie !== null && (
                      <div className="flex items-center justify-between">
                        <span className={textSecondary}>
                          Seu numero de serie
                        </span>
                        <span
                          className={`font-bold ${data.numeroSerie === 0 ? "text-amber-400" : "text-cyan-400"}`}
                        >
                          #{data.numeroSerie}
                          {data.numeroSerie === 0 && (
                            <span className="text-amber-400/70 text-xs ml-1">
                              (Criador)
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {data.carta.pacotesCarta?.length > 0 && (
                    <div className="mb-4">
                      <p className={`${textSecondary} text-xs mb-2`}>
                        Disponivel em:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {data.carta.pacotesCarta.map((pc) => (
                          <span
                            key={pc.id}
                            className={`${badgeBase} bg-slate-600/30 text-slate-400 text-[10px]`}
                          >
                            {pc.pacote.nome}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {data.favorito ? (
                      <p
                        className={`${textSecondary} text-xs text-center flex-1 py-2`}
                      >
                        Desfavorite a carta para poder remover
                      </p>
                    ) : (
                      <button
                        onClick={() => setConfirmando(true)}
                        className={`${btnDanger} ${btnSm} flex-1 flex items-center justify-center gap-1`}
                      >
                        <IconDeletar size={12} /> Remover da Coleção
                      </button>
                    )}
                  </div>
                </div>
              </>
            )
          )}
        </motion.div>

        {confirmando && (
          <ModalConfirmacao
            nome={data?.carta?.nome}
            onConfirm={handleRemover}
            onCancel={() => setConfirmando(false)}
            isPending={remover.isPending}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
