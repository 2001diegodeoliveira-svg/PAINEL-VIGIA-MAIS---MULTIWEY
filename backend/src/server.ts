import { createApp } from './app';

const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const app = createApp();

app.listen(PORT, HOST, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  🚀 Painel Vigia Mais MT - Backend API                       ║
║                                                              ║
║  Servidor rodando em http://${HOST}:${PORT}                              ║
║  API prefix: ${process.env.API_PREFIX || '/api'}                                   ║
║  Ambiente: ${process.env.NODE_ENV || 'development'}                           ║
║                                                              ║
║  Endpoints disponíveis:                                      ║
║    GET ${process.env.API_PREFIX || '/api'}/dashboard                         ║
║    GET ${process.env.API_PREFIX || '/api'}/cameras                           ║
║    GET ${process.env.API_PREFIX || '/api'}/municipalities                    ║
║    GET ${process.env.API_PREFIX || '/api'}/kpis                              ║
║    GET ${process.env.API_PREFIX || '/api'}/actions                           ║
║    GET ${process.env.API_PREFIX || '/api'}/actions/stats                     ║
║    GET ${process.env.API_PREFIX || '/api'}/network/health                    ║
║    GET ${process.env.API_PREFIX || '/api'}/lpr/alerts                        ║
║    GET ${process.env.API_PREFIX || '/api'}/analytics/before-after            ║
║    GET ${process.env.API_PREFIX || '/api'}/analytics/coverage-suggestions    ║
║    GET ${process.env.API_PREFIX || '/api'}/geojson/municipalities            ║
║                                                              ║
║  Health check: GET /health                                   ║
╚══════════════════════════════════════════════════════════════╝
  `);
});
