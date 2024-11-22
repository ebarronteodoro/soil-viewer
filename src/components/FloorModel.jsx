import React, { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function FloorModel ({
  targetRotation = 0,
  targetScale = 1,
  stateView = [0, 0, 0],
  object,
  setSelectedObjectName,
  resetSelection
}) {
  const meshRef = useRef()
  const { gl, camera, size } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const [selectedObject, setSelectedObject] = useState(null)

  useEffect(() => {
    gl.toneMappingExposure = 1

    if (object) {
      const box = new THREE.Box3().setFromObject(object)
      const size = box.getSize(new THREE.Vector3())
      console.log(
        `Tamaño del modelo: X=${size.x.toFixed(2)}, Y=${size.y.toFixed(
          2
        )}, Z=${size.z.toFixed(2)}`
      )
    }
  }, [gl, object])

  useFrame(() => {
    if (meshRef.current) {
      const scaleSpeed = 0.25

      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        scaleSpeed
      )
    }
  })

  const handleClick = event => {
    const { clientX, clientY } = event
    const { width, height } = size

    // Convertir la posición del mouse a coordenadas de dispositivo normalizadas (NDC)
    mouse.current.x = (clientX / width) * 2 - 1
    mouse.current.y = -(clientY / height) * 2 + 1

    raycaster.current.setFromCamera(mouse.current, camera)
    const intersects = raycaster.current.intersectObjects(
      meshRef.current.children,
      true
    )

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object
      const intersectionPoint = intersects[0].point // Punto de intersección en el modelo
      console.log('Objeto seleccionado:', intersectedObject.name)
      console.log(
        `Posición del mouse en el modelo: X=${intersectionPoint.x.toFixed(
          2
        )}, Y=${intersectionPoint.y.toFixed(
          2
        )}, Z=${intersectionPoint.z.toFixed(2)}`
      )

      if (intersectedObject.name.startsWith('tipo')) {
        if (selectedObject) {
          selectedObject.material.color.set('white')
          selectedObject.material.opacity = 1
        }

        intersectedObject.material.color.set('#c3ff91')
        intersectedObject.material.transparent = true
        intersectedObject.material.opacity = 0.8

        setSelectedObject(intersectedObject)
        setSelectedObjectName(intersectedObject.name)
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
  }, [gl, selectedObject, size])

  return (
    <>
      {object && (
        <group ref={meshRef}>
          <primitive
            object={object}
            position={[0, 0, 0]}
            scale={[0.5, 0.5, 0.5]}
            castShadow
          />
        </group>
      )}
    </>
  )
}

export default FloorModel
