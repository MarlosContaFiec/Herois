import HeroSection from "./components/HeroSection";
import heroisJson from './data/herois.json'
import arqueira from "./assets/avatar/arqueira.png";
import guerreiro from "./assets/avatar/guerreiro.png";
import mage from "./assets/avatar/mage.png";
import { useState, useEffect } from "react";


function App() {

  const heroisBase = [
    { id: 1, nome: "Arthemis", classe: "Arqueira", imagem: "arqueira",tipo_dano:"longo_alcance" ,status: "online", ativo : true,curretexp: 0,maxExp : 80},
    { id: 2, nome: "Grog", classe: "Guerreiro", imagem: "guerreiro",tipo_dano:"corpo_a_corpo" , status: "ausente",ativo : true,curretexp: 0,maxExp : 100},
    { id: 3, nome: "Elora", classe: "Maga", imagem: "mage",tipo_dano:"dano_explosivo" , status: "offline",ativo : true,curretexp: 0,maxExp : 120 },

  ];
  const [classe, setClasse] = useState("");
  const [todosHerois, setTodosHerois] = useState(heroisBase);
  const [herois, setHerois] = useState(heroisBase);
  const imagens = {
    arqueira,
    guerreiro,
    maga: mage
  };
  useEffect(() => {
    const listaFinal = [
      ...heroisBase,
      ...heroisJson.map(h => ({
        ...h,
        ativo: h.ativo ?? true
      }))
    ];

    setTodosHerois(listaFinal);
    setHerois(listaFinal);
  }, []);
  const classes = [...new Set(todosHerois.map(h => h.classe))]
  const filtrar = (classeSelecionada) => {
    if (!classeSelecionada) {
      setHerois(todosHerois);
      return;
    }

    setHerois(
      todosHerois.filter(h => h.classe === classeSelecionada)
    );
  };
  const excluirHeroi = (id) => {
    setHerois(
      herois.map(h =>
        h.id === id ? { ...h, ativo: false } : h
      )
    );
  };
  // const calcularLevel = (heroi) => {
  //   const xpPercent = (heroi.curretexp % heroi.maxExp) / h.maxExp * 100;
  //   return (Math.floor(heroi.curretexp / heroi.maxExp) + 1, xpPercent);
  // };
  const calcularLevel = (id) => {
    setHerois(prev =>
      prev.map(h =>{
        const xpPercent = (h.curretexp % h.maxExp) / h.maxExp * 100;
        return { ...h (Math.floor(h.curretexp / h.maxExp) + 1, xpPercent)};
      })
    )
  };

  const evoluirHeroi = (id) => {
    setHerois(prev =>
      prev.map(h =>{
        if (h.id === id) {
          const novoEXP = h.curretexp + 10;
          return { ...h, curretexp: novoEXP };
        }
        return h;
      })
    );
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Seleção de Heróis</h1>

      <div style={{ textAlign: "center" }}>
        <label>Filtrar </label>

        <select
          value={classe}
          onChange={(e) => { const valor = e.target.value;
            setClasse(valor); 
            filtrar(valor)
          }}
        >
          <option value="">Todos</option>
          {classes.map((heroi) => (
            <option key={heroi} value={heroi}>{heroi}</option>))}
          

        </select>
      </div>

      <HeroSection
        titulo="🛡 Corpo a corpo"
        lista={herois.filter(h => h.tipo_dano === "corpo_a_corpo" && h.ativo)}
        onExcluir={excluirHeroi}
        onEvoluir={evoluirHeroi}
      />

      <HeroSection
        titulo="✨ Dano Explosivo"
        lista={herois.filter(h => h.tipo_dano === "dano_explosivo" && h.ativo)}
        onExcluir={excluirHeroi}
        onEvoluir={evoluirHeroi}
      />

      <HeroSection
        titulo="🏹 Longo alcance"
        lista={herois.filter(h => h.tipo_dano === "longo_alcance" && h.ativo)}
        onExcluir={excluirHeroi}
        onEvoluir={evoluirHeroi}
      />
    </>
  );
}
export default App;