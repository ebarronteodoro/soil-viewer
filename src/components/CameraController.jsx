import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

function CameraController({ zoom, resetPosition, isAnimationTriggered }) {
  const { camera } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [targetPosition, setTargetPosition] = useState({
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  });
  const [initialZ] = useState(camera.position.z); // Posición inicial del eje Z
  const moveSpeed = 0.02;
  const dragSmoothness = 0.1; // Reducido para mayor suavidad en arrastre
  const returnSpeed = 0.05; // Reducido para mayor suavidad en el retorno
  const zoomSpeed = 0.05; // Ajuste para hacer el zoom más gradual

  // Limites de zoom
  const minZoom = 1; // Ajusta al valor mínimo deseado
  const maxZoom = 7; // Ajusta al valor máximo deseado

  useEffect(() => {
    const handleMouseDown = (event) => {
      setIsDragging(true);
      setStartX(event.clientX);
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (event) => {
      if (isDragging) {
        const deltaX = event.clientX - startX;
        const newX = camera.position.x - deltaX * moveSpeed;

        setTargetPosition((prev) => ({ ...prev, x: newX }));
        setStartX(event.clientX);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, startX, camera]);

  useEffect(() => {
    const handleWheel = (event) => {
      let newZ = camera.position.z + event.deltaY * zoomSpeed;
      newZ = Math.max(minZoom, Math.min(maxZoom, newZ)); // Aplicación de los límites de zoom
      setTargetPosition((prev) => ({ ...prev, z: newZ }));
    };

    window.addEventListener('wheel', handleWheel);

    return () => window.removeEventListener('wheel', handleWheel);
  }, [camera]);

  useEffect(() => {
    if (resetPosition) {
      setTargetPosition({ x: 0, y: 0, z: initialZ });
    }
  }, [resetPosition, initialZ]);

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetPosition.x, isDragging ? dragSmoothness : returnSpeed);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetPosition.z, isDragging ? dragSmoothness : returnSpeed);
  });

  return null;
}

export default CameraController;
