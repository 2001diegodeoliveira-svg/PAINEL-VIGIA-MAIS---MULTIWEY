import { useState, useEffect, useRef } from 'react';
import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';
import { formatRelativeTime, getStatusColor, getStatusLabel } from '../utils/formatters';
import { Camera as CameraIcon, Lock, Play, Pause, RefreshCw } from 'lucide-react';

interface CameraGroup {
  municipality: string;
  municipalityCode: string;
  cameras: CameraType[];
  onlineCount: number;
  offlineCount: number;
  maintenanceCount: number;
}

type CameraType = {
  id: string;
  name: string;
  municipality: string;
  municipalityCode: string;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline' | 'maintenance';
  streamUrl?: string;
  thumbnailUrl?: string;
  lastSeen: string;
  uptime: number;
  type: 'fixa' | 'movel' | 'lpr';
  address: string;
  region: string;
};

export function CameraLayersPanel() {
  const { cameras } = useDataStore();
  const { setSelectedMunicipality } = useAppStore();
  const [activeLayer, setActiveLayer] = useState<'all' | 'online'>('all');
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const rotationRef = useRef<number | null>(null);

  // Agrupar câmeras por município
  const groups: CameraGroup[] = cameras.reduce((acc: CameraGroup[], cam) => {
    let group = acc.find((g) => g.municipalityCode === cam.municipalityCode);
    if (!group) {
      group = {
        municipality: cam.municipality,
        municipalityCode: cam.municipalityCode,
        cameras: [],
        onlineCount: 0,
        offlineCount: 0,
        maintenanceCount: 0,
      };
      acc.push(group);
    }
    group.cameras.push(cam);
    if (cam.status === 'online') group.onlineCount++;
    else if (cam.status === 'offline') group.offlineCount++;
    else group.maintenanceCount++;
    return acc;
  }, []);

  // Filtrar por camada ativa
  const filteredGroups = groups.map((g) => ({
    ...g,
    cameras:
      activeLayer === 'online'
        ? g.cameras.filter((c) => c.status === 'online')
        : g.cameras,
  }));

  const currentGroup = filteredGroups[currentGroupIndex] ?? filteredGroups[0] ?? null;
  const currentCameras = currentGroup?.cameras ?? [];

  // Rotação automática entre municípios
  useEffect(() => {
    if (!isAutoRotating || filteredGroups.length <= 1) return;

    rotationRef.current = setInterval(() => {
      setCurrentGroupIndex((prev) =>
        prev + 1 >= filteredGroups.length ? 0 : prev + 1,
      );
    }, 10000); // Troca a cada 10 segundos

    return () => {
      if (rotationRef.current) clearInterval(rotationRef.current);
    };
  }, [isAutoRotating, filteredGroups.length]);

  // Reiniciar índice se mudou a camada e o índice está fora do range
  useEffect(() => {
    if (currentGroupIndex >= filteredGroups.length) {
      setCurrentGroupIndex(0);
    }
  }, [activeLayer, filteredGroups.length, currentGroupIndex]);

  const handleRotate = () => {
    setCurrentGroupIndex((prev) =>
      prev + 1 >= filteredGroups.length ? 0 : prev + 1,
    );
  };

  const handleSelectGroup = (index: number) => {
    setCurrentGroupIndex(index);
    setIsAutoRotating(false);
    if (rotationRef.current) clearInterval(rotationRef.current);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col">
      {/* Cabeçalho com camadas */}
      <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <CameraIcon className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Câmeras por Município</h2>
            <p className="text-[10px] text-gray-500">
              {filteredGroups.length} município(s) • {currentCameras.length} câmera(s)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Seletor de camada */}
          <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                activeLayer === 'all'
                  ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setActiveLayer('online')}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                activeLayer === 'online'
                  ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Online
            </button>
          </div>

          {/* Controles de rotação */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRotate}
              className="p-2 bg-white border rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              aria-label="Próximo município"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="p-2 bg-white border rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              aria-label={isAutoRotating ? 'Pausar rotação' : 'Iniciar rotação'}
            >
              {isAutoRotating ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de municípios com indicador do ativo */}
      <div className="border-b border-gray-100 bg-white/50">
        <div className="flex overflow-x-auto scrollbar-hide pb-2 px-2 gap-1">
          {filteredGroups.map((group, index) => {
            const isActive = currentGroupIndex === index;
            const hasCameras = group.cameras.length > 0;
            return (
              <button
                key={group.municipalityCode}
                onClick={() => handleSelectGroup(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
                } ${!hasCameras ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={!hasCameras}
              >
                <div className={`w-2 h-2 rounded-full ${getStatusColor(group.cameras[0]?.status || 'offline').replace('text-', 'bg-').replace('bg-opacity', 'bg-opacity-20')}`} />
                <span className={`text-xs font-medium truncate max-w-[120px] ${isActive ? 'font-bold text-blue-700' : 'text-gray-600'}`}>
                  {group.municipality}
                </span>
                <span className="text-[10px] font-bold text-gray-400">
                  {group.onlineCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo do município selecionado */}
      <div className="flex-1 overflow-y-auto p-4 relative">
        {!currentGroup || currentCameras.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Lock className="w-16 h-16 text-gray-300 mb-4 opacity-50" />
            <p className="font-medium text-gray-700">
              {activeLayer === 'online'
                ? 'Nenhuma câmera online neste município'
                : 'Nenhuma câmera disponível neste município'}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              Selecione outro município na lista acima
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Resumo do município */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {currentGroup.municipality}
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                    Código: {currentGroup.municipalityCode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {currentGroup.onlineCount} Online
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {currentGroup.offlineCount} Offline
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {currentGroup.maintenanceCount} Manutenção
                  </div>
                </div>
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{
                    width:
                      currentGroup.cameras.length > 0
                        ? ((currentGroup.onlineCount / currentGroup.cameras.length) * 100).toFixed(1) + '%'
                        : '0%',
                  }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1 text-right">
                Disponibilidade: {currentGroup.cameras.length > 0 ? ((currentGroup.onlineCount / currentGroup.cameras.length) * 100).toFixed(1) : 0}%
              </p>
            </div>

            {/* Grid de câmeras */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentCameras.map((camera) => (
                <div
                  key={camera.id}
                  className={`relative group overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-md ${
                    getStatusColor(camera.status).replace('text-', 'border-').replace('bg-', 'bg-opacity-5')
                  }`}
                  onClick={() => setSelectedMunicipality(camera.municipalityCode)}
                >
                  <div className="aspect-video relative bg-gray-900 overflow-hidden">
                    {camera.streamUrl ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <span className="text-5xl opacity-40">📺</span>
                        <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-[10px] text-center">
                          Link: {camera.streamUrl.split('/').pop()}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <CameraIcon className="w-16 h-16 text-gray-600" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(camera.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${camera.status === 'online' ? 'bg-green-500 animate-pulse' : camera.status === 'maintenance' ? 'bg-amber-500' : 'bg-red-500'}`} />
                        {getStatusLabel(camera.status)}
                      </span>
                      {camera.type === 'lpr' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          📋 LPR
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-white border-t border-gray-100">
                    <p className="font-semibold text-gray-900 truncate">
                      {camera.name}
                    </p>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                      <span className="text-[12px]">📍</span> {camera.address}
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                      <span className="text-[12px]">🕐</span> {formatRelativeTime(camera.lastSeen)}
                    </p>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                      <span className="text-[12px]">📊</span> Uptime: {camera.uptime.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Indicador de rotação automática */}
      {isAutoRotating && filteredGroups.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 bg-blue-900/90 backdrop-blur text-white px-3 py-2 rounded-lg text-[10px] shadow-lg">
          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
          Próximo município em 10s
        </div>
      )}
    </div>
  );
}

