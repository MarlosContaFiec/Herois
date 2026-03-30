import { useState, useMemo } from "react";
import "./formulario.css";

function Formulario({ onCriar, heroisBase }) {
  const [nome, setNome] = useState("");
  const [classe, setClasse] = useState("");
  const [tipoDano, setTipoDano] = useState("");
  const [status, setStatus] = useState("offline");

  const classesDisponiveis = useMemo(
    () => [...new Set(heroisBase.map(h => h.classe))],
    [heroisBase]
  );

  const tiposDanoDisponiveis = useMemo(
    () => [...new Set(heroisBase.map(h => h.tipo_dano))],
    [heroisBase]
  );

  const statusDisponiveis = useMemo(
    () => [...new Set(heroisBase.map(h => h.status))],
    [heroisBase]
  );

  const calcularMaxExp = (tipo) => {
    switch (tipo) {
      case "longo_alcance": return 80;
      case "corpo_a_corpo": return 100;
      case "dano_explosivo": return 120;
      default: return 80;
    }
  };

  const criarHeroi = () => {
    if (!nome || !classe || !tipoDano) return;

    const novoHeroi = {
      id: Date.now(),
      nome,
      classe,
      imagem: classe.toLowerCase(),
      tipo_dano: tipoDano,
      status,
      ativo: true,
      curretexp: 0,
      maxExp: calcularMaxExp(tipoDano),
    };

    onCriar(novoHeroi);

    setNome("");
    setClasse("");
    setTipoDano("");
    setStatus("offline");
  };

  return (
    <div className="formulario">
      <h3>➕ Criar Herói</h3>

      <input
        placeholder="Nome do herói"
        value={nome}
        onChange={e => setNome(e.target.value)}
      />

      <select value={classe} onChange={e => setClasse(e.target.value)}>
        <option value="">Classe</option>
        {classesDisponiveis.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select value={tipoDano} onChange={e => setTipoDano(e.target.value)}>
        <option value="">Tipo de dano</option>
        {tiposDanoDisponiveis.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select value={status} onChange={e => setStatus(e.target.value)}>
        {statusDisponiveis.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {tipoDano && (
        <p className="preview-exp">
          EXP Máx: <strong>{calcularMaxExp(tipoDano)}</strong>
        </p>
      )}

      <button className="btn" onClick={criarHeroi}>
        Criar
      </button>

      <div className="preview">
        <p><strong>Nome:</strong> {nome || "-"}</p>
        <p><strong>Classe:</strong> {classe || "-"}</p>
        <p><strong>Dano:</strong> {tipoDano || "-"}</p>
      </div>
    </div>
  );
}

export default Formulario;