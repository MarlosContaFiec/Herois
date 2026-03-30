import { useState, useEffect, useRef } from "react";
import StatusBadge from "./StatusBadge";
import "./Card.css"
import user from "../assets/avatar/user.png";
import arqueira from "../assets/avatar/arqueira.png";
import guerreiro from "../assets/avatar/guerreiro.png";
import mage from "../assets/avatar/mage.png";

const imagens = {
  arqueira,
  guerreiro,
  maga: mage,
};

function Card({ heroi, onExcluir, onEvoluir }) {

  const getLevelClass = (level) => {
    if (level >= 100) return "lv-carmine";
    if (level >= 50) return "lv-amethyst";
    if (level >= 25) return "lv-diamond";
    if (level >= 10) return "lv-gold";
    if (level >= 5) return "lv-silver";
    if (level >= 2) return "lv-gray";
    return "";
  };

  const calcularLevel = (heroi) => {
    const level = Math.floor(heroi.curretexp / heroi.maxExp) + 1;
    const xpAtual = heroi.curretexp % heroi.maxExp;
    const xpPercent = (xpAtual / heroi.maxExp) * 100;
    return { level, xpPercent };
  };

  const { level, xpPercent } = calcularLevel(heroi);

  const [levelUp, setLevelUp] = useState(false);
  const prevLevel = useRef(level);

  useEffect(() => {
    if (level > prevLevel.current) {
      setLevelUp(true);
      setTimeout(() => setLevelUp(false), 800);
      prevLevel.current = level;
    }
  }, [level]);

  const handleRecrutar = () => {
    alert(`Herói ${heroi.nome} foi recrutado com sucesso!`);
  };

  const handleExcluir = () => {
    onExcluir(heroi.id);
    alert(`Herói ${heroi.nome} foi excluído com sucesso!`);
  };

  return (
    <div
      className={`card ${getLevelClass(level)} ${levelUp ? "level-up" : ""}`}
      style={{
        borderRadius: "12px",
        padding: "16px",
        margin: "10px",
        textAlign: "center",
        width: "200px",
      }}
    >
      <StatusBadge tipo={heroi.status} />

      <img
        src={imagens[heroi.imagem] || user}
        alt={heroi.nome}
        onError={(e) => (e.currentTarget.src = user)}
        style={{ width: "100%", borderRadius: "8px" }}
      />

      <h2>{heroi.nome} — Lv {level}</h2>
      <p>Classe: {heroi.classe}</p>

      <progress value={xpPercent} max="100" />

      <button onClick={handleRecrutar} className="btn btn-recrutar">Recrutar ⚔️</button>
      <button onClick={() => onEvoluir(heroi.id)} className="btn btn-ex">Ganhar XP ⚡</button>
      <button onClick={handleExcluir} className="btn btn-excluir">Excluir ☠️</button>
    </div>
  );
}

export default Card;