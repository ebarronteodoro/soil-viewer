import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function TerrazaModel ({ targetRotation, targetScale, stateView, object }) {
  const meshRef = useRef()
  const { gl } = useThree()

  useEffect(() => {
    gl.toneMappingExposure = 0.8
  }, [gl])

  // useFrame(() => {
  //   if (meshRef.current) {
  //     const rotationSpeed = 0.08
  //     const scaleSpeed = 0.25

  //     meshRef.current.rotation.y = THREE.MathUtils.lerp(
  //       meshRef.current.rotation.y,
  //       targetRotation,
  //       rotationSpeed
  //     )
  //     meshRef.current.rotation.x = THREE.MathUtils.lerp(
  //       meshRef.current.rotation.x,
  //       stateView[0],
  //       rotationSpeed
  //     )

  //     meshRef.current.scale.lerp(
  //       new THREE.Vector3(targetScale, targetScale, targetScale),
  //       scaleSpeed
  //     )
  //   }
  // })

  return (
    object && (
      <group ref={meshRef}>
        <primitive object={object} position={[0, -3, 0]} scale={[1, 1, 1]} />
      </group>
    )
  )
}

export default TerrazaModel
