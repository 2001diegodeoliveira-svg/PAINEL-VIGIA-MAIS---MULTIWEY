# Painel Vigia Mais MT - Sala de Situação

Sistema de exibição (dashboard) para sala de situação do programa **Vigia Mais MT**, desenvolvido para TVs/videowalls em modo kiosk 24/7 e também acessível em desktop/mobile.

## 🎯 Visão Geral

Painel único com:
- **Faixa superior**: KPIs em números grandes (câmeras, municípios, ações, offline)
- **Área central**: Mapa interativo dos 141 municípios de MT com status e clusters de câmeras
- **Lateral**: Mosaico de 6 câmeras ao vivo com rotação automática (25s)
- **Rodapé**: Timeline rolante de ações recentes com caso em destaque

## 🛠 Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Estilização | Tailwind CSS |
| Mapas | MapLibre GL JS |
| Gráficos | ECharts + echarts-for-react |
| Estado | Zustand |
| Dados Geo | @turf/turf |
| Datas | date-fns |

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build produção
npm run build

# Preview build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes React
│   ├── DashboardLayout.tsx    # Layout principal
│   ├── KPIBar.tsx             # KPIs topo
│   ├── MapView.tsx            # Mapa MapLibre GL
│   ├── CameraMosaic.tsx       # Mosaico câmeras
│   ├── TimelineFooter.tsx     # Timeline rodapé
│   └── ActionsPanel.tsx       # Painel ações/resultados
├── hooks/             # Custom hooks
│   ├── useAutoRefresh.ts
│   ├── useCameraRotation.ts
│   ├── usePresentationMode.ts
│   └── useKeyboardNavigation.ts
├── services/          # Serviços de API
│   └── dashboardApi.ts        # Mock + adapter para API real
├── stores/            # Estado global (Zustand)
│   ├── appStore.ts            # UI state
│   └── dataStore.ts           # Dados do dashboard
├── types/             # TypeScript types
├── utils/             # Utilitários
└── App.tsx            # Entry point
```

## ⌨️ Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `F11` | Toggle fullscreen |
| `Esc` | Limpar seleção / Sair apresentação |
| `Ctrl+P` | Toggle modo apresentação |
| `Alt+1` | Tela Dashboard |
| `Alt+2` | Tela Mapa |
| `Alt+3` | Tela Ações |
| `Alt+4` | Tela Ranking |
| `Alt+V` | Toggle público/interno |
| `Ctrl+R` | Refresh manual |

## 🖥 Modo Apresentação (TV/Kiosk)

Alterna automaticamente entre telas a cada 30s:
1. **Dashboard** - Visão completa
2. **Mapa** - Mapa em tela cheia
3. **Ações** - Painel de resultados
4. **Ranking** - Ranking de municípios

Ativar: Botão "Modo Apresentação" no header ou `Ctrl+P`

## 🔌 Integração com API Real

O serviço `dashboardApi.ts` já possui **adapter** para a API do `mapas.sinfra.mt.gov.br`. 

Quando a API estiver disponível:

```typescript
// Em dashboardApi.ts
constructor(baseUrl = 'https://mapas.sinfra.mt.gov.br/api', useMock = false) {
  this.baseUrl = baseUrl;
  this.useMock = useMock;
}
```

**Endpoints esperados:**
- `GET /api/dashboard` - Dados completos
- `GET /api/cameras` - Lista de câmeras
- `GET /api/municipalities` - Municípios com geometria
- `GET /api/kpis` - Indicadores
- `GET /api/actions` - Ações recentes
- `GET /api/actions/stats` - Estatísticas
- `GET /api/network/health` - Saúde da rede
- `GET /api/lpr/alerts` - Alertas LPR
- `GET /api/analytics/before-after` - Comparativo antes/depois
- `GET /api/analytics/coverage-suggestions` - Sugestões de cobertura
- `GET /api/geojson/municipalities` - GeoJSON dos municípios

**Formato de resposta esperado** - Ver `src/types/index.ts`

## 🗺 Dados Geoespaciais

O mapa usa **GeoJSON dos 141 municípios de MT**. Para produção:

1. Obter shapefile/GeoJSON oficial (IBGE/SEPLAN-MT)
2. Simplificar geometria (TopoJSON/Mapshaper) para < 500KB
3. Colocar em `public/data/municipios-mt.geojson`
4. Atualizar `fetchMunicipalityGeoJSON()` no `dashboardApi.ts`

## 🔒 LGPD e Privacidade

- **Modo Público**: Sem streams de câmera, sem rostos/placas
- **Modo Interno**: Streams autorizadas, logs de acesso
- **Borrar rostos/placas**: Configurar no media server (FFmpeg/GPU)
- **Dados pessoais**: Nunca exibidos - apenas agregados

## ♿ Acessibilidade

- Navegação 100% por teclado
- Contraste WCAG AA
- Textos alternativos em gráficos
- Tabelas equivalentes para gráficos
- ARIA labels em componentes interativos
- Suporte a `prefers-reduced-motion`

## 🎨 Identidade Visual

Cores baseadas no Governo de MT / Vigia Mais:

| Cor | Uso | Hex |
|-----|-----|-----|
| MT Blue | Primária, KPIs | `#1e3a8a` |
| MT Green | Sucesso, Online | `#166534` |
| Vigia Red | Alerta, Offline | `#991b1b` |
| Vigia Amber | Atenção, Manutenção | `#92400e` |

## 📦 Deploy Produção

```bash
# Build otimizado
npm run build

# Output em dist/
# Servir com Nginx + gzip + cache headers
# Configurar CSP para maplibre/echarts
```

**Nginx exemplo:**
```nginx
location / {
    root /var/www/vigiamais;
    try_files $uri $uri/ /index.html;
    
    # Cache assets
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔧 Configuração de Ambiente

Copie `.env.example` para `.env` e ajuste:

```env
VITE_API_BASE_URL=https://mapas.sinfra.mt.gov.br/api
VITE_USE_MOCK_DATA=false
VITE_REFRESH_INTERVAL=30000
```

## 📊 Métricas de Performance (Targets)

| Métrica | Target |
|---------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Bundle Size (gzipped) | < 200KB |
| Map Load | < 2s |
| 60fps animations | ✅ |

## 🧪 Testes

```bash
# Lint
npm run lint

# Type check
npm run typecheck

# Testes (quando configurados)
npm run test
```

## 📝 Licença

Governo do Estado de Mato Grosso - Uso interno oficial.