import { useState } from "react";
import { useColecao } from "../api/colecao";
import AnimatedPage from "../components/AnimatedPage";
import CatalogoTab from "../components/CatalogoTab";
import ColecaoTab from "../components/ColecaoTab";
import { pageTitle, pageHeader } from "../styles/components";
import { IconCartas, IconColecao } from "../utils/icones";

export default function Cartas() {
  const [aba, setAba] = useState("catalogo");
  const { data: colecao } = useColecao();

  return (
    <AnimatedPage>
      <div
        className={`${pageHeader} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}
      >
        <h1 className={pageTitle}>Cartas</h1>
        <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
          <button
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${aba === "catalogo" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-slate-300"}`}
            onClick={() => setAba("catalogo")}
          >
            <IconCartas size={16} /> Catalogo Pessoal
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${aba === "colecao" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-slate-300"}`}
            onClick={() => setAba("colecao")}
          >
            <IconColecao size={16} /> Minha Colecao ({colecao?.length || 0})
          </button>
        </div>
      </div>

      {aba === "catalogo" ? <CatalogoTab /> : <ColecaoTab />}
    </AnimatedPage>
  );
}
