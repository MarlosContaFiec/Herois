import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// base de dados inicial para desenvolvimento e base

const ELEMENTOS = ["FOGO", "AGUA", "TERRA", "VENTO", "LUZ", "TREVAS"];
const CLASSES = ["GUERREIRO", "MAGO", "PATRULHEIRO", "CURANDEIRO", "LADINO"];

const ADJ_ELEMENTO = {
  FOGO: ["Flamejante", "Infernal", "Ígneo", "Vulcânico", "Incandescente"],
  AGUA: ["Glacial", "Oceânico", "Abissal", "Tsunâmico", "Leviatã"],
  TERRA: ["Pétreo", "Rochoso", "Telúrico", "Montanhoso", "Titânico"],
  VENTO: ["Tempestuoso", "Ciclônico", "Ventoso", "Zéfiro", "Soberano"],
  LUZ: ["Radiante", "Solar", "Celestial", "Luminoso", "Divino"],
  TREVAS: ["Sombrio", "Noturno", "Abissal", "Tenebroso", "Eclipsado"],
};

const SUBST_CLASSE = {
  GUERREIRO: ["Cavaleiro", "Guardião", "Cruzado", "Paladino", "Senhor"],
  MAGO: ["Feiticeiro", "Arcanista", "Bruxo", "Arquimago", "Oráculo"],
  PATRULHEIRO: ["Arqueiro", "Batedor", "Caçador", "Atirador", "Rastreador"],
  CURANDEIRO: ["Sacerdote", "Clérigo", "Druida", "Mestre", "Sábio"],
  LADINO: ["Ladrão", "Assassino", "Sombra", "Perseguidor", "Fantasma"],
};

const RARIDADE_IDX = { COMUM: 0, INCOMUM: 1, RARA: 2, EPICA: 3, LENDARIA: 4 };

const FAIXA_PODER = {
  COMUM: { min: 10, max: 50 },
  INCOMUM: { min: 51, max: 120 },
  RARA: { min: 121, max: 250 },
  EPICA: { min: 251, max: 400 },
  LENDARIA: { min: 401, max: 500 },
  UNICA: { min: 500, max: 600 },
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nomeCarta(elemento, classe, raridade) {
  const idx = RARIDADE_IDX[raridade];
  return `${ADJ_ELEMENTO[elemento][idx]} ${SUBST_CLASSE[classe][idx]}`;
}

const COMBOS_INCOMUM = [
  ["FOGO", "GUERREIRO"],
  ["FOGO", "MAGO"],
  ["FOGO", "PATRULHEIRO"],
  ["AGUA", "GUERREIRO"],
  ["AGUA", "MAGO"],
  ["AGUA", "CURANDEIRO"],
  ["AGUA", "LADINO"],
  ["TERRA", "GUERREIRO"],
  ["TERRA", "MAGO"],
  ["TERRA", "PATRULHEIRO"],
  ["VENTO", "GUERREIRO"],
  ["VENTO", "MAGO"],
  ["VENTO", "PATRULHEIRO"],
  ["VENTO", "LADINO"],
  ["LUZ", "GUERREIRO"],
  ["LUZ", "MAGO"],
  ["LUZ", "CURANDEIRO"],
  ["TREVAS", "GUERREIRO"],
  ["TREVAS", "MAGO"],
  ["TREVAS", "LADINO"],
];

const COMBOS_RARA = [
  ["FOGO", "GUERREIRO"],
  ["FOGO", "MAGO"],
  ["AGUA", "MAGO"],
  ["AGUA", "PATRULHEIRO"],
  ["TERRA", "GUERREIRO"],
  ["TERRA", "MAGO"],
  ["TERRA", "CURANDEIRO"],
  ["VENTO", "MAGO"],
  ["VENTO", "LADINO"],
  ["LUZ", "GUERREIRO"],
  ["LUZ", "MAGO"],
  ["LUZ", "PATRULHEIRO"],
  ["LUZ", "CURANDEIRO"],
  ["TREVAS", "GUERREIRO"],
  ["TREVAS", "MAGO"],
];

const COMBOS_EPICA = [
  ["FOGO", "GUERREIRO"],
  ["FOGO", "MAGO"],
  ["AGUA", "GUERREIRO"],
  ["AGUA", "MAGO"],
  ["TERRA", "GUERREIRO"],
  ["TERRA", "MAGO"],
  ["VENTO", "GUERREIRO"],
  ["VENTO", "MAGO"],
  ["LUZ", "GUERREIRO"],
  ["TREVAS", "MAGO"],
];

const COMBOS_LENDARIA = [
  ["FOGO", "GUERREIRO"],
  ["AGUA", "MAGO"],
  ["TERRA", "GUERREIRO"],
  ["VENTO", "MAGO"],
  ["TREVAS", "LADINO"],
];

const CARTAS_UNICAS = [
  {
    nome: "Deus do Inferno",
    elemento: "FOGO",
    classe: "GUERREIRO",
    poder: 550,
    pacoteIndex: 0,
  },
  {
    nome: "Imperador Leviatã",
    elemento: "AGUA",
    classe: "MAGO",
    poder: 540,
    pacoteIndex: 1,
  },
  {
    nome: "Titã de Gaia",
    elemento: "TERRA",
    classe: "GUERREIRO",
    poder: 560,
    pacoteIndex: 2,
  },
  {
    nome: "Soberano da Tempestade",
    elemento: "VENTO",
    classe: "MAGO",
    poder: 530,
    pacoteIndex: 3,
  },
  {
    nome: "Ceifador Eclipse",
    elemento: "TREVAS",
    classe: "LADINO",
    poder: 580,
    pacoteIndex: 4,
  },
];

const PACOTES = [
  {
    nome: "Pacote Iniciante",
    descricao: "Pacote básico para iniciantes",
    custo: 50,
    qtdCartas: 5,
    pesoComum: 60,
    pesoIncomum: 25,
    pesoRara: 12,
    pesoEpica: 2.5,
    pesoLendaria: 0.5,
  },
  {
    nome: "Pacote Padrão",
    descricao: "Pacote padrão com distribuição equilibrada",
    custo: 150,
    qtdCartas: 5,
    pesoComum: 45,
    pesoIncomum: 30,
    pesoRara: 18,
    pesoEpica: 5,
    pesoLendaria: 2,
  },
  {
    nome: "Pacote Premium",
    descricao: "Maiores chances de cartas raras",
    custo: 500,
    qtdCartas: 5,
    pesoComum: 25,
    pesoIncomum: 30,
    pesoRara: 25,
    pesoEpica: 15,
    pesoLendaria: 5,
  },
  {
    nome: "Pacote Elemental",
    descricao: "Pacote com foco em variedade elemental",
    custo: 300,
    qtdCartas: 5,
    pesoComum: 35,
    pesoIncomum: 35,
    pesoRara: 20,
    pesoEpica: 8,
    pesoLendaria: 2,
  },
  {
    nome: "Mega Pacote",
    descricao: "Pacote premium com 10 cartas",
    custo: 1000,
    qtdCartas: 10,
    pesoComum: 20,
    pesoIncomum: 25,
    pesoRara: 30,
    pesoEpica: 18,
    pesoLendaria: 7,
  },
];

const MISSOES = [
  {
    nome: "Boneco de Treino",
    descricao: "Um inimigo fraco para praticar",
    elemento: "TERRA",
    nomeInimigo: "Golem de Madeira",
    poderInimigo: 100,
    qtdCartasInimigo: 1,
    recompensaMoedas: 30,
    recompensaExp: 15,
    tempoMinutos: 5,
  },
  {
    nome: "Patrulha da Floresta",
    descricao: "Criaturas da floresta",
    elemento: "VENTO",
    nomeInimigo: "Sapo Venenoso",
    poderInimigo: 250,
    qtdCartasInimigo: 2,
    recompensaMoedas: 60,
    recompensaExp: 30,
    tempoMinutos: 10,
  },
  {
    nome: "Caverna de Fogo",
    descricao: "O calor é insuportável",
    elemento: "FOGO",
    nomeInimigo: "Salamandra",
    poderInimigo: 500,
    qtdCartasInimigo: 2,
    recompensaMoedas: 120,
    recompensaExp: 50,
    tempoMinutos: 15,
  },
  {
    nome: "Masmorra Sombria",
    descricao: "Escuridão total",
    elemento: "TREVAS",
    nomeInimigo: "Cavaleiro Negro",
    poderInimigo: 800,
    qtdCartasInimigo: 3,
    recompensaMoedas: 200,
    recompensaExp: 80,
    tempoMinutos: 20,
  },
  {
    nome: "Templo da Luz",
    descricao: "Teste de fé",
    elemento: "LUZ",
    nomeInimigo: "Anjo Caído",
    poderInimigo: 1200,
    qtdCartasInimigo: 3,
    recompensaMoedas: 350,
    recompensaExp: 120,
    tempoMinutos: 30,
  },
  {
    nome: "Núcleo do Vulcão",
    descricao: "Lava por todos os lados",
    elemento: "FOGO",
    nomeInimigo: "Dragão de Magma",
    poderInimigo: 1000,
    qtdCartasInimigo: 3,
    recompensaMoedas: 280,
    recompensaExp: 100,
    tempoMinutos: 25,
  },
  {
    nome: "Pico da Tempestade",
    descricao: "Ventos cortantes",
    elemento: "VENTO",
    nomeInimigo: "Hidra dos Ventos",
    poderInimigo: 1500,
    qtdCartasInimigo: 4,
    recompensaMoedas: 450,
    recompensaExp: 150,
    tempoMinutos: 35,
  },
  {
    nome: "Portão do Abismo",
    descricao: "O inimigo final",
    elemento: "TREVAS",
    nomeInimigo: "Senhor do Vazio",
    poderInimigo: 2000,
    qtdCartasInimigo: 5,
    recompensaMoedas: 600,
    recompensaExp: 200,
    tempoMinutos: 45,
  },
];

const TITULOS = [
  {
    nome: "Amuleto da Sorte",
    descricao: "+10% sorte em pacotes",
    tipoBonus: "SORTE",
    valorBonus: 0.1,
    trocavel: false,
  },
  {
    nome: "Corredor Veloz",
    descricao: "-15% tempo de missões",
    tipoBonus: "TEMPO",
    valorBonus: 0.15,
    trocavel: false,
  },
  {
    nome: "Caçador de Ouro",
    descricao: "+10% moedas ganhas",
    tipoBonus: "MOEDAS",
    valorBonus: 0.1,
    trocavel: false,
  },
  {
    nome: "Veterano",
    descricao: "+20% moedas ganhas",
    tipoBonus: "MOEDAS",
    valorBonus: 0.2,
    trocavel: false,
  },
  {
    nome: "Mestre da Sorte",
    descricao: "+25% sorte em pacotes",
    tipoBonus: "SORTE",
    valorBonus: 0.25,
    trocavel: false,
  },
  {
    nome: "Herói de Páscoa",
    descricao: "+30% sorte (Evento Páscoa)",
    tipoBonus: "SORTE",
    valorBonus: 0.3,
    trocavel: true,
  },
];

async function main() {
  console.log("Limpando banco...");
  await prisma.ofertaTroca.deleteMany();
  await prisma.listagemTroca.deleteMany();
  await prisma.sessaoTroca.deleteMany();
  await prisma.ataqueBossGuilda.deleteMany();
  await prisma.bossGuilda.deleteMany();
  await prisma.missaoGuilda.deleteMany();
  await prisma.pedidoGuilda.deleteMany();
  await prisma.membroGuilda.deleteMany();
  await prisma.guilda.deleteMany();
  await prisma.tentativaDiaria.deleteMany();
  await prisma.tentativaMissao.deleteMany();
  await prisma.missao.deleteMany();
  await prisma.criacaoCartaDiaria.deleteMany();
  await prisma.booster.deleteMany();
  await prisma.pacoteUsuario.deleteMany();
  await prisma.compraPacote.deleteMany();
  await prisma.pacote.deleteMany();
  await prisma.tituloUsuario.deleteMany();
  await prisma.titulo.deleteMany();
  await prisma.cartaLaboratorio.deleteMany();
  await prisma.cartaUsuario.deleteMany();
  await prisma.estatisticaSemanal.deleteMany();
  await prisma.carta.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("Criando admin...");
  const admin = await prisma.usuario.create({
    data: {
      nomeUsuario: "admin",
      email: "dev@dev.com",
      senhaHash: await bcrypt.hash("123456", 10),
      papel: "ADMIN",
      moedas: 999999,
    },
  });

  console.log("Criando cartas...");
  const todasCartas = [];

  for (const elemento of ELEMENTOS) {
    for (const classe of CLASSES) {
      const faixa = FAIXA_PODER.COMUM;
      todasCartas.push({
        nome: nomeCarta(elemento, classe, "COMUM"),
        elemento,
        classe,
        raridade: "COMUM",
        poder: randInt(faixa.min, faixa.max),
      });
    }
  }

  for (const [elemento, classe] of COMBOS_INCOMUM) {
    const faixa = FAIXA_PODER.INCOMUM;
    todasCartas.push({
      nome: nomeCarta(elemento, classe, "INCOMUM"),
      elemento,
      classe,
      raridade: "INCOMUM",
      poder: randInt(faixa.min, faixa.max),
    });
  }

  for (const [elemento, classe] of COMBOS_RARA) {
    const faixa = FAIXA_PODER.RARA;
    todasCartas.push({
      nome: nomeCarta(elemento, classe, "RARA"),
      elemento,
      classe,
      raridade: "RARA",
      poder: randInt(faixa.min, faixa.max),
    });
  }

  for (const [elemento, classe] of COMBOS_EPICA) {
    const faixa = FAIXA_PODER.EPICA;
    todasCartas.push({
      nome: nomeCarta(elemento, classe, "EPICA"),
      elemento,
      classe,
      raridade: "EPICA",
      poder: randInt(faixa.min, faixa.max),
    });
  }

  for (const [elemento, classe] of COMBOS_LENDARIA) {
    const faixa = FAIXA_PODER.LENDARIA;
    todasCartas.push({
      nome: nomeCarta(elemento, classe, "LENDARIA"),
      elemento,
      classe,
      raridade: "LENDARIA",
      poder: randInt(faixa.min, faixa.max),
    });
  }

  const cartasCriadas = [];
  for (const dados of todasCartas) {
    const carta = await prisma.carta.create({ data: dados });
    cartasCriadas.push(carta);
  }
  console.log(`${cartasCriadas.length} cartas base criadas.`);

  console.log("Criando pacotes...");
  const pacotesCriados = [];
  for (const dados of PACOTES) {
    const pacote = await prisma.pacote.create({ data: dados });
    pacotesCriados.push(pacote);
  }

  console.log("Criando cartas únicas...");
  for (const unica of CARTAS_UNICAS) {
    await prisma.carta.create({
      data: {
        nome: unica.nome,
        elemento: unica.elemento,
        classe: unica.classe,
        raridade: "UNICA",
        poder: unica.poder,
        pacoteUnicoId: pacotesCriados[unica.pacoteIndex].id,
      },
    });
  }
  console.log(`${CARTAS_UNICAS.length} cartas únicas criadas.`);

  console.log("Criando missões...");
  for (const dados of MISSOES) {
    await prisma.missao.create({ data: dados });
  }
  console.log(`${MISSOES.length} missões criadas.`);

  console.log("Criando títulos...");
  for (const dados of TITULOS) {
    await prisma.titulo.create({ data: dados });
  }
  console.log(`${TITULOS.length} títulos criados.`);

  console.log("Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
