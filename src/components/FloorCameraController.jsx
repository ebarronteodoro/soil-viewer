import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

function FloorCameraController({ zoom, resetPosition }) {
  const { camera } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [targetPosition, setTargetPosition] = useState({
    x: camera.position.x,
    y: camera.position.y,
  });
  const moveSpeed = 0.02; // Velocidad base del arrastre
  const dragSmoothness = 0.15; // Suavidad del arrastre ajustada para mayor suavidad

  // Límites de arrastre
  const minZoom = 0.15;
  const maxZoom = 0.7;
  const minDragLimit = 0.2; // Límite de arrastre mínimo cuando el zoom es 0.1
  const maxDragLimit = 4; // Límite de arrastre máximo cuando el zoom es 0.5

  // Calcular el límite de arrastre basado en el nivel de zoom
  const [dragLimit, setDragLimit] = useState(minDragLimit);

  // Almacena el valor anterior de `zoom`
  const previousZoom = useRef(zoom);

  useEffect(() => {
    // Interpolación lineal para obtener el `dragLimit` en función del `zoom`
    const newDragLimit =
      minDragLimit + ((zoom - minZoom) / (maxZoom - minZoom)) * (maxDragLimit - minDragLimit);
    setDragLimit(newDragLimit);
    console.log(`Nuevo límite de arrastre para zoom ${zoom}: ${newDragLimit}`);

    // Centrar la cámara solo si se ha hecho zoom out (cuando `zoom` disminuye)
    if (zoom < previousZoom.current) {
      setTargetPosition({ x: 0, y: 0 });
    }

    // Actualizar el valor anterior de `zoom`
    previousZoom.current = zoom;
  }, [zoom]);

  useEffect(() => {
    const handleMouseDown = (event) => {
      setIsDragging(true);
      setStartX(event.clientX);
      setStartY(event.clientY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        const deltaX = (event.clientX - startX) * moveSpeed;
        const deltaY = (startY - event.clientY) * moveSpeed;

        // Limita la posición de arrastre según el `dragLimit` calculado
        const newX = THREE.MathUtils.clamp(camera.position.x - deltaX, -dragLimit, dragLimit);
        const newY = THREE.MathUtils.clamp(camera.position.y - deltaY, -dragLimit, dragLimit);

        setTargetPosition({ x: newX, y: newY });

        setStartX(event.clientX);
        setStartY(event.clientY);
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
  }, [isDragging, startX, startY, camera, dragLimit]);

  useEffect(() => {
    if (resetPosition) {
      // Si se presiona el botón para resetear, regresa al centro
      setTargetPosition({ x: 0, y: 0 });
    }
  }, [resetPosition]);

  useFrame(() => {
    // Interpolación para mover la cámara al objetivo de manera suave en el eje x y y
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetPosition.x, dragSmoothness);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetPosition.y, dragSmoothness);
  });

  return null;
}

export default FloorCameraController;
