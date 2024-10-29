import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function TerrazaModel ({ targetRotation, targetScale, stateView, object }) {
  const meshRef = useRef()
  const { gl } = useThree()

  useEffect(() => {
    gl.toneMappingExposure = 0.6
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

  return (
    <>
      {object && (
        <group ref={meshRef}>
          <primitive
            object={object}
            position={[0, 0, 0]}
            scale={[0.5, 0.5, 0.5]}
          />
        </group>
      )}

      <ambientLight intensity={0.5} />

      <directionalLight
        color='#fade85'
        position={[-3, 40, 5]}
        intensity={0.5}
        castShadow
      />

      {/* <pointLight
        color='#808080'
        position={[0, 0, 0]}
        intensity={0.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-near={0.5}
      /> */}
    </>
  )
}

export default TerrazaModel
