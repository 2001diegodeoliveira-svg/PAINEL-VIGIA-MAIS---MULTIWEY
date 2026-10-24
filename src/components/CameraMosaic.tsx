import { useCameraRotation } from '../hooks/useCameraRotation';
import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';
import { formatRelativeTime, getStatusColor, getStatusLabel } from '../utils/formatters';
import type { Camera } from '../types';

function CameraTile({ camera, isHighlighted, onClick }: { camera: Camera; isHighlighted?: boolean; onClick?: () => void }) {
  const { viewMode } = useAppStore();
  const isOnline = camera.status === 'online';
  const hasStream = isOnline && camera.streamUrl && viewMode === 'internal';

  return (
    <div
      className={`relative group overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
        isHighlighted ? 'ring-4 ring-mt-blue-500 scale-[1.02] z-10 shadow-xl' : 'border-gray-100 hover:border-mt-blue-200 hover:shadow-md'
      } ${getStatusColor(camera.status).replace('text-', 'border-').replace('bg-', 'bg-opacity-5 ')}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
      aria-label={`Câmera ${camera.name}, ${camera.municipality}, status ${getStatusLabel(camera.status)}`}
    >
      <div className="aspect-video relative bg-gray-900 overflow-hidden">
        {hasStream && camera.streamUrl ? (
          <video
            className="w-full h-full object-cover"
            src={camera.streamUrl}
            autoPlay
            muted
            playsInline
            poster={camera.thumbnailUrl}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : camera.thumbnailUrl ? (
          <img
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            src={camera.thumbnailUrl}
            alt=""
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-6xl opacity-40">📷</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(camera.status)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-mt-green-500 animate-pulse' : camera.status === 'maintenance' ? 'bg-vigia-amber-500' : 'bg-vigia-red-500'}`} />
            {getStatusLabel(camera.status)}
          </span>
          {camera.type === 'lpr' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              📋 LPR
            </span>
          )}
        </div>

        {isHighlighted && (
          <div className="absolute bottom-2 left-2 right-2 bg-mt-blue-600/95 text-white px-3 py-2 rounded-lg text-xs font-medium animate-pulse">
            ⚠ CÂMERA EM DESTAQUE
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-t border-gray-100">
        <p className="font-semibold text-gray-900 truncate">{camera.name}</p>
        <p className="text-[10px] text-gray-500 flex items-center gap-1">
          <span>📍</span> {camera.municipality}
        </p>
        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
          <span>🕐</span> {formatRelativeTime(camera.lastSeen)}
        </p>
        {camera.type === 'lpr' && (
          <p className="text-[10px] text-purple-600 flex items-center gap-1 mt-1 font-medium">
            <span>📋</span> Leitura de Placas Ativa
          </p>
        )}
      </div>
    </div>
  );
}

export function CameraMosaic() {
  const { cameras } = useDataStore();
  const { selectedCamera, setSelectedCamera, highlightedAction, selectedMunicipality, viewMode } = useAppStore();
  const { displayCameras } = useCameraRotation({ cameras, gridSize: 6, rotationInterval: 25000 });

  const filteredCameras = selectedMunicipality
    ? cameras.filter((c) => c.municipalityCode === selectedMunicipality)
    : cameras;

  const highlightedCameraId = highlightedAction?.cameraId;
  const highlightedCamera = filteredCameras.find((c) => c.id === highlightedCameraId);

  if (viewMode === 'public') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4 h-full overflow-y-auto shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <h2 className="text-lg font-bold text-gray-900">Câmeras (Modo Público)</h2>
          </div>
          <span className="text-[10px] text-gray-400">Transmissão restrita</span>
        </div>
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-3">🔒</div>
          <p className="font-medium text-gray-700">Acesso às câmeras ao vivo restrito a usuários internos</p>
          <p className="text-[10px] mt-1">Use o modo interno para visualizar o mosaico de câmeras</p>
        </div>
      </div>
    );
  }

  const onlineCount = filteredCameras.filter((c) => c.status === 'online').length;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900">Câmeras Ao Vivo</h2>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-mt-green-100 text-mt-green-700 border border-mt-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-mt-green-500 animate-pulse" />
            {displayCameras.length} de {onlineCount} online
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Rotação automática: 25s</span>
          <button
            onClick={() => setSelectedCamera(null)}
            className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded text-gray-600 hover:text-gray-900 transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {highlightedCamera && (
          <div className="mb-4 animate-slide-down">
            <CameraTile
              camera={highlightedCamera}
              isHighlighted={true}
              onClick={() => setSelectedCamera(highlightedCamera.id)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayCameras.map((camera) => (
            <CameraTile
              key={camera.id}
              camera={camera}
              isHighlighted={selectedCamera === camera.id}
              onClick={() => setSelectedCamera(selectedCamera === camera.id ? null : camera.id)}
            />
          ))}
        </div>

        {displayCameras.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <div className="text-6xl mb-3">📷</div>
            <p className="font-medium text-gray-700">Nenhuma câmera online no momento</p>
          </div>
        )}
      </div>
    </div>
  );
}
