import Card from "./Card";

function HeroSection({ titulo, lista, onExcluir, onEvoluir }) {
  
  
  return (
    <>
      <h2 style={{ textAlign: "center", marginTop: 20 }}>{titulo}</h2>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {lista.length === 0 && <p>Nenhum herói aqui</p>}
        {lista.map(heroi => (
          <Card
            key={heroi.id}
            heroi={heroi}
            onExcluir={onExcluir}
            onEvoluir={onEvoluir}
          />
        ))}
      </div>
    </>
  );
}

export default HeroSection;

