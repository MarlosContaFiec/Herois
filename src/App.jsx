import { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import heroisJson from "./data/herois.json";
import Formulario from "./components/Formulario";
import arqueira from "./assets/avatar/arqueira.png";
import guerreiro from "./assets/avatar/guerreiro.png";
import mage from "./assets/avatar/mage.png";
import "./App.css";

function App() {
  const [classe, setClasse] = useState("");
  const [todosHerois, setTodosHerois] = useState([]);
  const [herois, setHerois] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busca, setBusca] = useState("");

  const imagens = {
    arqueira,
    guerreiro,
    maga: mage,
  };

  const calcularMaxExp = (tipo) => {
    switch (tipo) {
      case "longo_alcance": return 80;
      case "corpo_a_corpo": return 100;
      case "dano_explosivo": return 120;
      default: return 80;
    }
  };

  // 🔹 carregar heróis (json ou localStorage)
  useEffect(() => {
    const salvo = localStorage.getItem("herois");

    const listaBase = salvo ? JSON.parse(salvo) : heroisJson;

    const listaNormalizada = listaBase.map(h => ({
      ...h,
      ativo: h.ativo ?? true,
      curretexp: h.curretexp ?? 0,
      maxExp: h.maxExp ?? calcularMaxExp(h.tipo_dano),
    }));

    setTodosHerois(listaNormalizada);
    setHerois(listaNormalizada);
  }, []);

  // 🔹 salvar no localStorage
  useEffect(() => {
    if (todosHerois.length > 0) {
      localStorage.setItem("herois", JSON.stringify(todosHerois));
    }
  }, [todosHerois]);

  // 🔹 bloquear scroll quando modal abre
  useEffect(() => {
    document.body.style.overflow = mostrarForm ? "hidden" : "auto";
  }, [mostrarForm]);

  // 🔹 filtro automático (classe + busca)
  useEffect(() => {
    filtrar(classe, busca);
  }, [classe, busca, todosHerois]);

  const filtrar = (classeSelecionada = "", texto = "") => {
    let lista = [...todosHerois];

    if (classeSelecionada) {
      lista = lista.filter(h => h.classe === classeSelecionada);
    }

    if (texto) {
      const termo = texto.toLowerCase();
      lista = lista.filter(h =>
        h.nome.toLowerCase().includes(termo) ||
        h.classe.toLowerCase().includes(termo) ||
        h.tipo_dano.toLowerCase().includes(termo)
      );
    }

    setHerois(lista);
  };

  const excluirHeroi = (id) => {
    setTodosHerois(prev =>
      prev.map(h => h.id === id ? { ...h, ativo: false } : h)
    );
  };

  const criarHeroi = (novoHeroi) => {
    setTodosHerois(prev => [...prev, novoHeroi]);
  };

  const evoluirHeroi = (id) => {
    setTodosHerois(prev =>
      prev.map(h =>
        h.id === id
          ? { ...h, curretexp: Math.min(h.curretexp + 10, h.maxExp) }
          : h
      )
    );
  };

  const classes = [...new Set(todosHerois.map(h => h.classe))];

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Seleção de Heróis</h1>

      <div style={{ textAlign: "center" }}>
        <label>Filtrar </label>
        <select
          value={classe}
          onChange={(e) => {
            const valor = e.target.value;
            setClasse(valor);
            filtrar(valor);
          }}
        >
          
          <option value="">Todos</option>
          {classes.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
          <input
            placeholder="Buscar por nome, classe ou tipo de dano..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{
              display: "block",
              margin: "12px auto",
              padding: "8px 12px",
              width: 280,
              borderRadius: 8,
              border: "1px solid #ccc"
            }}
         />
      </div>
            <button
        onClick={() => setMostrarForm(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          fontSize: 32,
          background: "#6366f1",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(99,102,241,.4)",
        }}
      >
        +
      </button>
      {mostrarForm && (
        <div className="modal-overlay" onClick={() => setMostrarForm(false)}>
          <div
            className="modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <Formulario
            heroisBase={todosHerois}
              onCriar={(heroi) => {
                criarHeroi(heroi);
                setMostrarForm(false);
              }}
            />
          </div>
        </div>
      )}
      <HeroSection
        titulo="🛡 Corpo a corpo"
        lista={herois.filter(h => h.tipo_dano === "corpo_a_corpo" && h.ativo)}
        onExcluir={excluirHeroi}
        onEvoluir={evoluirHeroi}
        imagens={imagens}
      />

      <HeroSection
        titulo="✨ Dano Explosivo"
        lista={herois.filter(h => h.tipo_dano === "dano_explosivo" && h.ativo)}
        onExcluir={excluirHeroi}
        onEvoluir={evoluirHeroi}
        imagens={imagens}
      />

      <HeroSection
        titulo="🏹 Longo alcance"
        lista={herois.filter(h => h.tipo_dano === "longo_alcance" && h.ativo)}
        onExcluir={excluirHeroi}
        onEvoluir={evoluirHeroi}
        imagens={imagens}
      />
    </>
  );
}

export default App;