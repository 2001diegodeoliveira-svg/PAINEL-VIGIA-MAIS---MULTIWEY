import { useEffect, useState, useCallback } from 'react';
import type { Camera } from '../types';

interface UseCameraRotationOptions {
  cameras: Camera[];
  rotationInterval?: number;
  gridSize?: number;
  enabled?: boolean;
}

export function useCameraRotation({
  cameras,
  rotationInterval = 25000,
  gridSize = 6,
  enabled = true,
}: UseCameraRotationOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayCameras, setDisplayCameras] = useState<Camera[]>([]);

  const onlineCameras = cameras.filter(c => c.status === 'online' && c.streamUrl);

  const rotate = useCallback(() => {
    if (onlineCameras.length <= gridSize) {
      setDisplayCameras(onlineCameras);
      return;
    }

    const nextIndex = (currentIndex + gridSize) % onlineCameras.length;
    setCurrentIndex(nextIndex);
    setDisplayCameras(onlineCameras.slice(nextIndex, nextIndex + gridSize));
  }, [onlineCameras, currentIndex, gridSize]);

  useEffect(() => {
    if (onlineCameras.length <= gridSize) {
      setDisplayCameras(onlineCameras);
      setCurrentIndex(0);
      return;
    }

    setDisplayCameras(onlineCameras.slice(0, gridSize));
    setCurrentIndex(0);
  }, [onlineCameras, gridSize]);

  useEffect(() => {
    if (!enabled || onlineCameras.length <= gridSize) return;

    const interval = setInterval(rotate, rotationInterval);
    return () => clearInterval(interval);
  }, [enabled, onlineCameras.length, gridSize, rotationInterval, rotate]);

  return { displayCameras, rotate, currentIndex };
}