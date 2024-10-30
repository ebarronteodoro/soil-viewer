import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

function CameraController({ zoom, resetPosition, isAnimationTriggered }) {
  const { camera } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [targetPosition, setTargetPosition] = useState({
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z
  });
  const [initialZ] = useState(camera.position.z); // Posición inicial del eje Z
  const moveSpeed = 0.02;
  const dragSmoothness = 0.3;
  const returnSpeed = 0.1;
  const inclineFactor = Math.tan(Math.PI / 4); // Factor de inclinación para el eje y

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
        const deltaX = event.clientX - startX;
        const deltaY = startY - event.clientY;

        // Permitir movimiento en el eje x siempre
        const newX = camera.position.x - deltaX * moveSpeed;

        if (isAnimationTriggered) {
          // Si la animación está activa, solo mueve el eje z (adelante y atrás)
          const newZ = camera.position.z - deltaY * moveSpeed;
          setTargetPosition((prev) => ({ ...prev, x: newX, z: newZ }));
        } else {
          // Si la animación no está activa, mueve en el eje y (arriba y abajo)
          const newY = camera.position.y - deltaY * moveSpeed;
          setTargetPosition((prev) => ({ ...prev, x: newX, y: newY }));
        }

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
  }, [isDragging, startX, startY, camera, isAnimationTriggered]);

  useEffect(() => {
    const handleWheel = (event) => {
      // Cada vez que cambia el zoom, centramos en x e y
      const newZ = camera.position.z + event.deltaY * 0.01;
      setTargetPosition({ x: 0, y: 0, z: newZ }); // Centra la cámara en x e y
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [camera]);

  useEffect(() => {
    if (resetPosition) {
      setTargetPosition({ x: 0, y: 0, z: initialZ }); // Resetear al centro
    }
  }, [resetPosition, initialZ]);

  useFrame(() => {
    // Interpolación para mover la cámara al objetivo de manera suave en el eje x
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetPosition.x, dragSmoothness);

    if (!isAnimationTriggered) {
      // Movimiento en el eje y y z cuando la animación no está activada
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetPosition.y, dragSmoothness);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetPosition.z, dragSmoothness);
    } else {
      // Solo permite movimiento en el eje z cuando la animación está activa
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetPosition.z, dragSmoothness);
    }

    if (!isDragging) {
      // Limita la posición en los ejes cuando no hay arrastre
      const clampedX = camera.position.x;
      const clampedY = isAnimationTriggered ? camera.position.y : targetPosition.y;
      const clampedZ = camera.position.z;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, clampedX, returnSpeed);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, clampedY, returnSpeed);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, clampedZ, returnSpeed);
    }
  });

  return null;
}

export default CameraController;
