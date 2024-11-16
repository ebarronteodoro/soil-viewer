import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';

function LobbyModels({
  targetScale,
  stateView,
  objects,
  currentFloor,
  setSelectedObjectName,
  resetSelection,
}) {
  const meshesRef = useRef([]); // Array de referencias para múltiples modelos
  const { gl, camera, size } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const [selectedObject, setSelectedObject] = useState(null);
  const [opacity, setOpacity] = useState([1, 0]); // Opacidad para transiciones suaves entre plantas

  useEffect(() => {
    gl.toneMappingExposure = 1;
  }, [gl]);

  // Cambiar opacidades suavemente al cambiar de planta
  useEffect(() => {
    if (currentFloor === 0) {
      setOpacity([1, 0]);
    } else if (currentFloor === 1) {
      setOpacity([0, 1]);
    }
  }, [currentFloor]);

  useFrame(() => {
    meshesRef.current.forEach((mesh, index) => {
      // Verificar que el mesh y la opacidad existen antes de usarlos
      if (mesh && opacity[index] !== undefined) {
        const scaleSpeed = 0.25;

        // Aplicar escala suave
        mesh.scale.lerp(
          new THREE.Vector3(targetScale, targetScale, targetScale),
          scaleSpeed
        );

        // Aplicar transición suave de opacidad
        mesh.traverse((child) => {
          if (child.isMesh) {
            child.material.opacity = THREE.MathUtils.lerp(
              child.material.opacity,
              opacity[index],
              0.1
            );
            child.material.transparent = true;
          }
        });
      }
    });
  });

  const handleClick = (event) => {
    const { clientX, clientY } = event;
    const { width, height } = size;

    // Convertir posición del ratón a coordenadas de dispositivo normalizadas (NDC)
    mouse.current.x = (clientX / width) * 2 - 1;
    mouse.current.y = -(clientY / height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);

    // Solo intersecta con el modelo de la planta actual (usando `currentFloor`)
    const intersects = raycaster.current.intersectObjects(
      meshesRef.current[currentFloor]?.children || [], // Solo busca en la planta activa
      true
    );

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      console.log('Objeto seleccionado:', intersectedObject.name);

      if (intersectedObject.name.startsWith('tipo')) {
        // Restablecer selección anterior
        if (selectedObject) {
          selectedObject.material.color.set('white');
          selectedObject.material.opacity = 1;
        }

        // Aplicar color y opacidad al objeto seleccionado
        intersectedObject.material.color.set('#9bff46');
        intersectedObject.material.transparent = true;
        intersectedObject.material.opacity = 0.5;

        // Remover "-parent" del nombre antes de actualizar `selectedObjectName`
        const cleanedName = intersectedObject.name.replace('-parent', '');
        setSelectedObject(intersectedObject);
        setSelectedObjectName(cleanedName);
      }
    } else {
      // Si no hay intersecciones, reiniciar selección
      if (selectedObject) {
        selectedObject.material.color.set('white');
        selectedObject.material.opacity = 1;
        setSelectedObject(null);
        setSelectedObjectName('');
      }
    }
  };

  // Efecto para resetear la selección cuando `resetSelection` es `true`
  useEffect(() => {
    if (resetSelection && selectedObject) {
      selectedObject.material.color.set('white');
      selectedObject.material.opacity = 1;
      setSelectedObject(null);
      setSelectedObjectName('');
    }
  }, [resetSelection, selectedObject, setSelectedObjectName]);

  // Manejo de eventos de clic y toque
  useEffect(() => {
    gl.domElement.addEventListener('click', handleClick);
    gl.domElement.addEventListener('touchstart', handleClick);
    return () => {
      gl.domElement.removeEventListener('click', handleClick);
      gl.domElement.removeEventListener('touchstart', handleClick);
    };
  }, [gl, selectedObject, currentFloor, size]);

  return (
    <>
      {objects &&
        objects.map((object, index) => (
          <group ref={(el) => (meshesRef.current[index] = el)} key={index}>
            <primitive
              object={object}
              position={[0, 0, 0]}
              scale={[0.5, 0.5, 0.5]}
              castShadow
            />
          </group>
        ))}
      <Environment files="/models/hdri/TypoB.jpg" />
    </>
  );
}

export default LobbyModels;