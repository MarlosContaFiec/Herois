import StatusBadge from "./StatusBadge";
import user from "../assets/avatar/user.png"
import arqueira from "../assets/avatar/arqueira.png";
import guerreiro from "../assets/avatar/guerreiro.png";
import mage from "../assets/avatar/mage.png";

const imagens = {
  arqueira,
  guerreiro,
  maga: mage
};

function Card({ heroi, onExcluir, onEvoluir, calcularLevel}) {

  const handleRecrutar = () => {
    alert(`Herói ${heroi.nome} foi recrutado com sucesso!`);
  };

  const handleExcluir = () => {
    onExcluir(heroi.id);
    alert(`Herói ${heroi.nome} foi Excluido com sucesso!`);
  };

  const handleEvoluir = () => {
    onEvoluir(heroi.id);
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '16px',
    margin: '10px',
    boxShadow: '0 4px 8px rgba(0, 0 , 0.1)',
    textAlign: 'center',
    width: '200px'
  };

  return (
    <div style={cardStyle}>
      <div className="flex justify-center mb-4">
        <StatusBadge tipo={heroi.status} />
      </div>

      <img
        src={imagens[heroi.imagem] || user}
        alt={heroi.nome}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = user;
        }}
        style={{ width: "100%", borderRadius: "8px" }}
      />

      <h2>{heroi.nome} LV {calcularLevel(heroi)}</h2>
      <p>Classe: {heroi.classe}</p>

      <button
        type="button"
        onClick={handleRecrutar}
        className="
          relative inline-flex items-center justify-center
          px-5 py-2.5 text-sm font-semibold text-white
          rounded-xl
          bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600
          shadow-lg shadow-emerald-500/30
          hover:scale-[1.03] hover:shadow-emerald-500/50
          active:scale-[0.97]
          transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-emerald-300
        "
      >
        Recrutar ⚔️
      </button>

      <button
        type="button"
        onClick={handleExcluir}
        className="
          relative inline-flex items-center justify-center
          mt-2 px-5 py-2.5 text-sm font-semibold text-white
          rounded-xl
          bg-gradient-to-r from-red-400 to-red-600
          shadow-md shadow-red-500/30
          hover:scale-[1.03] hover:shadow-red-500/50
          active:scale-[0.97]
          transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-red-300
        "
      >
        Excluir ☠️
      </button>

      {/* Barra de EXP */}
      <div className="h-4 bg-gray-200 rounded-full w-full mt-2">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all"
          style={{ width: `${xpPercent}%` }}
        />
      </div>

      <button
        className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded"
        onClick={handleEvoluir}
      >
        LVL UP ⬆️
      </button>
    </div>
  );
}

export default Card;