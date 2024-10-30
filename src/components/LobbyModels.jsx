import React, { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function LobbyModels ({
  targetRotation,
  targetScale,
  stateView,
  objects,
  currentFloor,
  setSelectedObjectName,
  resetSelection
}) {
  const meshesRef = useRef([]) // Array de referencias para múltiples modelos
  const { gl, camera } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const [selectedObject, setSelectedObject] = useState(null)
  const [opacity, setOpacity] = useState([1, 0]) // Opacidad para transiciones suaves entre plantas

  useEffect(() => {
    gl.toneMappingExposure = 1
  }, [gl])

  // Cambiar opacidades suavemente al cambiar de planta
  useEffect(() => {
    setOpacity(currentFloor === 0 ? [1, 0] : [0, 1])
  }, [currentFloor])

  useFrame(() => {
    meshesRef.current.forEach((mesh, index) => {
      if (mesh) {
        const rotationSpeed = 0.08
        const scaleSpeed = 0.25

        mesh.rotation.y = THREE.MathUtils.lerp(
          mesh.rotation.y,
          targetRotation,
          rotationSpeed
        )
        mesh.rotation.x = THREE.MathUtils.lerp(
          mesh.rotation.x,
          stateView[0],
          rotationSpeed
        )

        mesh.scale.lerp(
          new THREE.Vector3(targetScale, targetScale, targetScale),
          scaleSpeed
        )

        // Aplicar transición suave de opacidad
        mesh.traverse(child => {
          if (child.isMesh) {
            child.material.opacity = THREE.MathUtils.lerp(
              child.material.opacity,
              opacity[index],
              0.1
            )
            child.material.transparent = true
          }
        })
      }
    })
  })

  const handleClick = event => {
    const { clientX, clientY } = event
    const { width, height } = gl.domElement

    mouse.current.x = (clientX / width) * 2 - 1
    mouse.current.y = -(clientY / height) * 2 + 1

    raycaster.current.setFromCamera(mouse.current, camera)

    // Solo intersecta con el modelo de la planta actual (usando `currentFloor`)
    const intersects = raycaster.current.intersectObjects(
      meshesRef.current[currentFloor]?.children || [], // Solo busca en la planta activa
      true
    )

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object
      console.log('Objeto seleccionado:', intersectedObject.name)

      if (intersectedObject.name.startsWith('tipo')) {
        if (selectedObject) {
          selectedObject.material.color.set('white')
          selectedObject.material.opacity = 1
        }

        intersectedObject.material.color.set('#9bff46')
        intersectedObject.material.transparent = true
        intersectedObject.material.opacity = 0.5

        // Remover "-parent" del nombre antes de actualizar `selectedObjectName`
        const cleanedName = intersectedObject.name.replace('-parent', '')
        setSelectedObject(intersectedObject)
        setSelectedObjectName(cleanedName)
      }
    } else {
      if (selectedObject) {
        selectedObject.material.color.set('white')
        selectedObject.material.opacity = 1
        setSelectedObject(null)
        setSelectedObjectName('')
      }
    }
  }

  // Efecto para resetear la selección cuando `resetSelection` es `true`
  useEffect(() => {
    if (resetSelection && selectedObject) {
      selectedObject.material.color.set('white')
      selectedObject.material.opacity = 1
      setSelectedObject(null)
      setSelectedObjectName('')
    }
  }, [resetSelection, selectedObject, setSelectedObjectName])

  useEffect(() => {
    gl.domElement.addEventListener('click', handleClick)
    gl.domElement.addEventListener('touchstart', handleClick)
    return () => {
      gl.domElement.removeEventListener('click', handleClick)
      gl.domElement.removeEventListener('touchstart', handleClick)
    }
  }, [gl, selectedObject, currentFloor])

  return (
    <>
      {objects &&
        objects.map((object, index) => (
          <group ref={el => (meshesRef.current[index] = el)} key={index}>
            <primitive
              object={object}
              position={[0, 0, 0]}
              scale={[0.5, 0.5, 0.5]}
              castShadow
            />
          </group>
        ))}
    </>
  )
}

export default LobbyModels
