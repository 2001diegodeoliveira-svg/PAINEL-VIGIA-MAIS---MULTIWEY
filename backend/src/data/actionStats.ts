import type { ActionStats, Action } from '../types';
import { MOCK_ACTIONS } from './actions';

export const MOCK_ACTION_STATS: ActionStats = {
  byType: {
    veiculo_recuperado: 1240,
    prisao_flagrante: 890,
    pessoa_localizada: 340,
    mandado_cumprido: 210,
    ocorrencia_elucidada: 560,
  },
  monthlyEvolution: [
    { month: 'Jan', count: 280 },
    { month: 'Fev', count: 310 },
    { month: 'Mar', count: 295 },
    { month: 'Abr', count: 340 },
    { month: 'Mai', count: 380 },
    { month: 'Jun', count: 420 },
    { month: 'Jul', count: 450 },
    { month: 'Ago', count: 480 },
    { month: 'Set', count: 510 },
    { month: 'Out', count: 324 },
  ],
  municipalityRanking: [
    { municipality: 'Cuiabá', code: '5103403', count: 1240 },
    { municipality: 'Várzea Grande', code: '5108402', count: 890 },
    { municipality: 'Rondonópolis', code: '5106208', count: 720 },
    { municipality: 'Sinop', code: '5107008', count: 670 },
    { municipality: 'Sorriso', code: '5107107', count: 540 },
    { municipality: 'Lucas do Rio Verde', code: '5105507', count: 480 },
    { municipality: 'Tangará da Serra', code: '5105101', count: 340 },
    { municipality: 'Primavera do Leste', code: '5105309', count: 280 },
    { municipality: 'Cáceres', code: '5102702', count: 120 },
    { municipality: 'Barra do Garças', code: '5101209', count: 90 },
  ],
  highlightedCase: MOCK_ACTIONS[0],
  avgResponseTime: 12.5,
};
