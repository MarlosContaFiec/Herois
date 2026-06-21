export const ORDEM_RARIDADE = ['COMUM', 'INCOMUM', 'RARA', 'EPICA', 'LENDARIA', 'UNICA'];

export const FAIXA_PODER = {
  COMUM:    { min: 10,  max: 50 },
  INCOMUM:  { min: 51,  max: 120 },
  RARA:     { min: 121, max: 250 },
  EPICA:    { min: 251, max: 400 },
  LENDARIA: { min: 401, max: 500 },
  UNICA:    { min: 500, max: 600 },
};

export const CUSTO_CRIACAO = {
  COMUM:    100,
  INCOMUM:  500,
  RARA:     2000,
  EPICA:    8000,
  LENDARIA: 25000,
  UNICA:    50000,
};

export const CUSTO_EVOLUCAO = {
  COMUM:    200,
  INCOMUM:  1000,
  RARA:     5000,
  EPICA:    20000,
  LENDARIA: 100000,
};

export const XP_POR_NIVEL = [100, 150, 225, 325, 450, 600, 775, 900, 1000];

export const MULTIPLICADOR_EVOLUCAO = 1.10;

export const VANTAGEM = {
  FOGO:   'VENTO',
  VENTO:  'TERRA',
  TERRA:  'AGUA',
  AGUA:   'FOGO',
  LUZ:    'TREVAS',
  TREVAS: 'LUZ',
};

export const TRINCO_CLASSE = {
  GUERREIRO:   { tipo: 'PODER',   descricao: '+15% poder',           valor: 0.15 },
  MAGO:        { tipo: 'MOEDAS',  descricao: '+100% moedas',        valor: 1.00 },
  PATRULHEIRO: { tipo: 'TEMPO',   descricao: '-20% tempo',          valor: 0.20 },
  CURANDEIRO:  { tipo: 'DROP',    descricao: '25% recompensa especial', valor: 0.25 },
  LADINO:      { tipo: 'HIBRIDO', descricao: '+50% moedas, -10% tempo', valorMoedas: 0.50, valorTempo: 0.10 },
};

export function multiplicadorElemental(elementoAtacante, elementoDefensor) {
  if (VANTAGEM[elementoAtacante] === elementoDefensor) return 1.3;
  if (VANTAGEM[elementoDefensor] === elementoAtacante) return 0.5;
  return 1.0;
}

export function raridadeEfetiva(raridadeBase, contagemEvoluida) {
  const idx = ORDEM_RARIDADE.indexOf(raridadeBase);
  const novoIdx = Math.min(idx + contagemEvoluida, ORDEM_RARIDADE.length - 1);
  return ORDEM_RARIDADE[novoIdx];
}

export function sufixoEvolucao(contagemEvoluida) {
  if (contagemEvoluida === 0) return '';
  if (contagemEvoluida === 1) return ' +';
  if (contagemEvoluida === 2) return ' ++';
  if (contagemEvoluida === 3) return ' +++';
  return ' #';
}

export function nomeEfetivo(nomeCarta, contagemEvoluida) {
  return nomeCarta + sufixoEvolucao(contagemEvoluida);
}

export function xpParaNivel(nivel, contagemEvoluida) {
  const idx = nivel - 1;
  if (idx < 0 || idx >= XP_POR_NIVEL.length) return Infinity;
  const base = XP_POR_NIVEL[idx];
  const multiplicador = Math.pow(MULTIPLICADOR_EVOLUCAO, contagemEvoluida);
  return Math.ceil(base * multiplicador);
}

export function poderEfetivo(poderBase, nivel, contagemEvoluida, raridadeBase) {
  const raridade = raridadeEfetiva(raridadeBase, contagemEvoluida);
  const faixa = FAIXA_PODER[raridade];
  if (!faixa) return poderBase;
  const bonusNivel = (nivel - 1) * ((faixa.max - faixa.min) / 9);
  return Math.floor(faixa.min + bonusNivel);
}

export function multiplicadorTaxaDiaria(criacoesHoje) {
  if (criacoesHoje === 0) return 1.0;
  if (criacoesHoje === 1) return 1.5;
  if (criacoesHoje === 2) return 2.0;
  if (criacoesHoje === 3) return 3.0;
  return 5.0;
}

export function custoCriacaoCarta(raridade, criacoesHoje) {
  const base = CUSTO_CRIACAO[raridade];
  if (!base) throw new Error('Raridade inválida');
  return Math.ceil(base * multiplicadorTaxaDiaria(criacoesHoje));
}

export function custoBooster(qtdCartas, pComum, pIncomum, pRara, pEpica, pLendaria) {
  const multiplicador = (
    pComum    * 1 +
    pIncomum  * 2 +
    pRara     * 5 +
    pEpica    * 12 +
    pLendaria * 30
  ) / 100;
  return Math.ceil(qtdCartas * 50 * multiplicador);
}