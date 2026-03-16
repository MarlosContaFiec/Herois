function StatusBadge( { tipo } ) {
  const estilos = {
    online: "bg-green-500 shadow-green-200",
    offline: "bg-gray-500 shadow-gray-200",
    ausente: "bg-amber-500 shadow-amber-200"
  };

  return (
  <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg w-fit">
    <div className={`w-3 h-3 rounded-full shadow-sm ${estilos[tipo] || estilos.offline}`} > </div>
    <span className="text-xs font-bold uppercase text-slate-200">
      {tipo}
    </span>
  </div>
);
}

export default StatusBadge;