import { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import heroisJson from "./data/herois.json";
import Formulario from "./components/Formulario";
import arqueira from "./assets/avatar/arqueira.png";
import guerreiro from "./assets/avatar/guerreiro.png";
import mage from "./assets/avatar/mage.png";
import "./App.css";

const calcularMaxExp = (tipo) => {
  switch (tipo) {
    case "longo_alcance": return 80;
    case "corpo_a_corpo": return 100;
    case "dano_explosivo": return 120;
    default: return 80;
  }
};

const calcularLevel = (exp, maxExp) =>
  Math.floor(exp / maxExp) + 1;

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

  useEffect(() => {
    const salvo = localStorage.getItem("herois");
    const base = salvo ? JSON.parse(salvo) : heroisJson;

    const normalizado = base.map(h => {
      const maxExp = h.maxExp ?? calcularMaxExp(h.tipo_dano);
      const curretexp = h.curretexp ?? 0;

      return {
        ...h,
        ativo: h.ativo ?? true,
        curretexp,
        maxExp,
        level: calcularLevel(curretexp, maxExp),
      };
    });

    setTodosHerois(normalizado);
    setHerois(normalizado);
  }, []);

  useEffect(() => {
    setTodosHerois(prev =>
      prev.map(h => ({
        ...h,
        level: calcularLevel(h.curretexp, h.maxExp),
      }))
    );
  }, [todosHerois.map(h => h.curretexp).join()]);

  useEffect(() => {
    if (todosHerois.length > 0) {
      localStorage.setItem("herois", JSON.stringify(todosHerois));
    }
  }, [todosHerois]);

  useEffect(() => {
    let lista = [...todosHerois];

    if (classe) {
      lista = lista.filter(h => h.classe === classe);
    }

    if (busca) {
      const termo = busca.toLowerCase();
      lista = lista.filter(h =>
        h.nome.toLowerCase().includes(termo) ||
        h.classe.toLowerCase().includes(termo) ||
        h.tipo_dano.toLowerCase().includes(termo)
      );
    }

    setHerois(lista);
  }, [classe, busca, todosHerois]);

  const evoluirHeroi = (id) => {
    setTodosHerois(prev =>
      prev.map(h =>
        h.id === id
          ? { ...h, curretexp: h.curretexp + 10 }
          : h
      )
    );
  };

  const excluirHeroi = (id) => {
    setTodosHerois(prev =>
      prev.map(h =>
        h.id === id ? { ...h, ativo: false } : h
      )
    );
  };

  const criarHeroi = (novo) => {
    setTodosHerois(prev => [...prev, novo]);
  };

  const classes = [...new Set(todosHerois.map(h => h.classe))];

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Seleção de Heróis</h1>

      <div style={{ textAlign: "center" }}>
        <select value={classe} onChange={e => setClasse(e.target.value)}>
          <option value="">Todos</option>
          {classes.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          placeholder="Buscar por nome, classe ou dano..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      <HeroSection
        titulo="🛡 Corpo a corpo"
        lista={herois.filter(h => h.tipo_dano === "corpo_a_corpo" && h.ativo)}
        onEvoluir={evoluirHeroi}
        onExcluir={excluirHeroi}
        imagens={imagens}
      />

      <HeroSection
        titulo="✨ Dano Explosivo"
        lista={herois.filter(h => h.tipo_dano === "dano_explosivo" && h.ativo)}
        onEvoluir={evoluirHeroi}
        onExcluir={excluirHeroi}
        imagens={imagens}
      />

      <HeroSection
        titulo="🏹 Longo alcance"
        lista={herois.filter(h => h.tipo_dano === "longo_alcance" && h.ativo)}
        onEvoluir={evoluirHeroi}
        onExcluir={excluirHeroi}
        imagens={imagens}
      />
    </>
  );
}

export default App;