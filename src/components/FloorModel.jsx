import React, { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function FloorModel({ targetRotation, targetScale, stateView, object, setSelectedObjectName, resetSelection }) {
  const meshRef = useRef()
  const { gl, camera } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const [selectedObject, setSelectedObject] = useState(null)

  useEffect(() => {
    gl.toneMappingExposure = 1
  }, [gl])

  useFrame(() => {
    if (meshRef.current) {
      const rotationSpeed = 0.08
      const scaleSpeed = 0.25

      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        rotationSpeed
      )
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        stateView[0],
        rotationSpeed
      )

      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        scaleSpeed
      )
    }
  })

  const handleClick = (event) => {
    const { clientX, clientY } = event
    const { width, height } = gl.domElement

    mouse.current.x = (clientX / width) * 2 - 1
    mouse.current.y = -(clientY / height) * 2 + 1

    raycaster.current.setFromCamera(mouse.current, camera)
    const intersects = raycaster.current.intersectObjects(meshRef.current.children, true)

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object
      console.log('Objeto seleccionado:', intersectedObject.name)

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
  }, [gl, selectedObject])

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
