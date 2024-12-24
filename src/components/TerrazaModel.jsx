import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function TerrazaModel ({ object, targetRotation }) {
  const meshRef = useRef()
  const { gl } = useThree()
  const currentRotation = useRef(targetRotation) // Guardamos la rotación actual

  useEffect(() => {
    gl.toneMappingExposure = 0.8
  }, [gl])

  // Interpolamos la rotación con cada fotograma
  useFrame(() => {
    currentRotation.current = THREE.MathUtils.lerp(
      currentRotation.current,
      targetRotation,
      0.1
    ) // Ajustamos la suavidad con 0.1
    if (meshRef.current) {
      meshRef.current.rotation.y = currentRotation.current
    }
  })

  return (
    object && (
      <group ref={meshRef} position={[0, -3, 0]} scale={[1, 1, 1]}>
        <primitive object={object} />
      </group>
    )
  )
}

export default TerrazaModel
