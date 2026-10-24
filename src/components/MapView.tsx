import { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useDataStore } from '../stores/dataStore';
import { useAppStore } from '../stores/appStore';

import { getStatusColor, getStatusLabel } from '../utils/formatters';

const MT_CENTER: [number, number] = [-56.0974, -15.5961];
const MT_ZOOM = 5.5;

const MUNICIPALITY_COLORS = {
  with_vigia: '#1e40af',
  implementing: '#d97706',
  no_coverage: '#991b1b',
};

const CAMERA_COLORS = {
  online: '#22c55e',
  offline: '#ef4444',
  maintenance: '#f59e0b',
};

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { municipalities, cameras } = useDataStore();
  const { selectedMunicipality, setSelectedMunicipality, selectedCamera, viewMode } = useAppStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredMunicipality, setHoveredMunicipality] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: MT_CENTER,
      zoom: MT_ZOOM,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.current.on('load', () => {
      addMunicipalityLayer();
      addCameraLayer();
      setIsLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  const addMunicipalityLayer = () => {
    if (!map.current) return;

    const features = municipalities.map(m => ({
      type: 'Feature' as const,
      properties: {
        code: m.code,
        name: m.name,
        status: m.status,
        camerasCount: m.camerasCount,
        camerasOnline: m.camerasOnline,
        camerasOffline: m.camerasOffline,
        actionsCount: m.actionsCount,
      },
      geometry: m.geometry,
    }));

    map.current.addSource('municipalities', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features },
    });

    map.current.addLayer({
      id: 'municipalities-fill',
      type: 'fill',
      source: 'municipalities',
      paint: {
        'fill-color': [
          'match',
          ['get', 'status'],
          'with_vigia', MUNICIPALITY_COLORS.with_vigia,
          'implementing', MUNICIPALITY_COLORS.implementing,
          'no_coverage', MUNICIPALITY_COLORS.no_coverage,
          '#6b7280',
        ],
        'fill-opacity': 0.6,
        'fill-outline-color': '#ffffff',
      },
    });

    map.current.addLayer({
      id: 'municipalities-border',
      type: 'line',
      source: 'municipalities',
      paint: {
        'line-color': '#ffffff',
        'line-width': 1.5,
        'line-opacity': 0.8,
      },
    });

    map.current.addLayer({
      id: 'municipalities-hover',
      type: 'fill',
      source: 'municipalities',
      filter: ['==', 'code', ''],
      paint: {
        'fill-color': '#ffffff',
        'fill-opacity': 0.3,
        'fill-outline-color': '#3b82f6',
      },
    });

    map.current.addLayer({
      id: 'municipalities-selected',
      type: 'fill',
      source: 'municipalities',
      filter: ['==', 'code', ''],
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0.4,
        'fill-outline-color': '#1d4ed8',
      },
    });
  };

  const addCameraLayer = () => {
    if (!map.current) return;

    const cameraFeatures = cameras
      .filter(c => c.status !== 'offline' || viewMode === 'internal')
      .map(c => ({
        type: 'Feature' as const,
        properties: {
          id: c.id,
          name: c.name,
          municipality: c.municipality,
          status: c.status,
          type: c.type,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [c.longitude, c.latitude],
        },
      }));

    map.current.addSource('cameras', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: cameraFeatures },
      cluster: true,
      clusterMaxZoom: 12,
      clusterRadius: 50,
    });

    map.current.addLayer({
      id: 'camera-clusters',
      type: 'circle',
      source: 'cameras',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#3b82f6', 0,
          '#f59e0b', 10,
          '#ef4444', 50,
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20, 0,
          30, 10,
          40, 50,
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    map.current.addLayer({
      id: 'camera-cluster-count',
      type: 'symbol',
      source: 'cameras',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    });

    map.current.addLayer({
      id: 'camera-points',
      type: 'circle',
      source: 'cameras',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'match',
          ['get', 'status'],
          'online', CAMERA_COLORS.online,
          'offline', CAMERA_COLORS.offline,
          'maintenance', CAMERA_COLORS.maintenance,
          '#6b7280',
        ],
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          5, 4,
          10, 8,
          15, 12,
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    map.current.addLayer({
      id: 'camera-selected',
      type: 'circle',
      source: 'cameras',
      filter: ['==', 'id', ''],
      paint: {
        'circle-color': '#3b82f6',
        'circle-radius': 16,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff',
      },
    });
  };

  const updateCameraLayer = useCallback(() => {
    if (!map.current) return;

    const cameraFeatures = cameras
      .filter(c => c.status !== 'offline' || viewMode === 'internal')
      .map(c => ({
        type: 'Feature' as const,
        properties: {
          id: c.id,
          name: c.name,
          municipality: c.municipality,
          status: c.status,
          type: c.type,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [c.longitude, c.latitude],
        },
      }));

    const source = map.current.getSource('cameras') as maplibregl.GeoJSONSource | undefined;
    source?.setData({
      type: 'FeatureCollection',
      features: cameraFeatures,
    });
  }, [cameras, viewMode]);

  useEffect(() => {
    if (!map.current || !isLoaded) return;
    updateCameraLayer();
  }, [cameras, viewMode, isLoaded, updateCameraLayer]);

  useEffect(() => {
    if (!map.current || !isLoaded) return;

    if (selectedMunicipality) {
      map.current.setFilter('municipalities-selected', ['==', 'code', selectedMunicipality]);
    } else {
      map.current.setFilter('municipalities-selected', ['==', 'code', '']);
    }
  }, [selectedMunicipality, isLoaded]);

  useEffect(() => {
    if (!map.current || !isLoaded) return;

    if (selectedCamera) {
      map.current.setFilter('camera-selected', ['==', 'id', selectedCamera]);
      const camera = cameras.find(c => c.id === selectedCamera);
      if (camera) {
        map.current.flyTo({ center: [camera.longitude, camera.latitude], zoom: 14 });
      }
    } else {
      map.current.setFilter('camera-selected', ['==', 'id', '']);
    }
  }, [selectedCamera, cameras, isLoaded]);

  const handleMapClick = useCallback((e: maplibregl.MapMouseEvent) => {
    const features = map.current?.queryRenderedFeatures(e.point, { layers: ['municipalities-fill'] });
    if (features?.length) {
      const code = features[0].properties?.code as string;
      setSelectedMunicipality(code === selectedMunicipality ? null : code);
    } else {
      setSelectedMunicipality(null);
    }
  }, [selectedMunicipality, setSelectedMunicipality]);

  const handleMapMouseMove = useCallback((e: maplibregl.MapMouseEvent) => {
    const features = map.current?.queryRenderedFeatures(e.point, { layers: ['municipalities-fill'] });
    if (features?.length) {
      const code = features[0].properties?.code as string;
      setHoveredMunicipality(code);
      map.current?.setFilter('municipalities-hover', ['==', 'code', code]);
      map.current!.getCanvas().style.cursor = 'pointer';
    } else {
      setHoveredMunicipality(null);
      map.current?.setFilter('municipalities-hover', ['==', 'code', '']);
      map.current!.getCanvas().style.cursor = '';
    }
  }, []);

  useEffect(() => {
    if (!map.current || !isLoaded) return;
    map.current.on('click', handleMapClick);
    map.current.on('mousemove', handleMapMouseMove);
    return () => {
      map.current?.off('click', handleMapClick);
      map.current?.off('mousemove', handleMapMouseMove);
    };
  }, [isLoaded, handleMapClick, handleMapMouseMove]);

  const displayMunicipality = hoveredMunicipality || selectedMunicipality;
  const municipality = municipalities.find(m => m.code === displayMunicipality);

  return (
    <div className="relative h-full w-full bg-gray-100">
      <div ref={mapContainer} className="absolute inset-0" aria-label="Mapa de Mato Grosso com municípios e câmeras" />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-mt-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      )}

      {municipality && (
        <div className="absolute top-4 right-4 z-20 max-w-sm md:max-w-md bg-white rounded-xl shadow-lg border p-4 animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{municipality.name}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(municipality.status)}`}>
                {getStatusLabel(municipality.status)}
              </span>
            </div>
            <button
              onClick={() => setSelectedMunicipality(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Fechar detalhes do município"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-mt-blue-600">{municipality.camerasCount}</p>
              <p className="text-xs text-gray-600">Total Câmeras</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-mt-green-600">{municipality.camerasOnline}</p>
              <p className="text-xs text-gray-600">Online</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-vigia-red-600">{municipality.camerasOffline}</p>
              <p className="text-xs text-gray-600">Offline</p>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Ações apoiadas:</span> {municipality.actionsCount}
            </p>
            {municipality.lastOccurrence && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Última ocorrência:</span>{' '}
                {new Date(municipality.lastOccurrence).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border p-3 text-xs text-gray-600 font-mono">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: MUNICIPALITY_COLORS.with_vigia }}></span>
          Com Vigia Mais
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: MUNICIPALITY_COLORS.implementing }}></span>
          Em Implantação
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: MUNICIPALITY_COLORS.no_coverage }}></span>
          Sem Cobertura
        </div>
        <div className="border-t pt-2 mt-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: CAMERA_COLORS.online }}></span>
          Online
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: CAMERA_COLORS.offline }}></span>
          Offline
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: CAMERA_COLORS.maintenance }}></span>
          Manutenção
        </div>
      </div>
    </div>
  );
}