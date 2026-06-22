import {
  emptyState,
  emptyStateTitle,
  emptyStateDesc,
} from "../styles/components";

export default function EmptyState({ icone: Icone, titulo, descricao }) {
  return (
    <div className={emptyState}>
      {Icone && <Icone size={48} className="text-slate-600 mb-4" />}
      <div className={emptyStateTitle}>{titulo}</div>
      {descricao && <div className={emptyStateDesc}>{descricao}</div>}
    </div>
  );
}
