import { useFrame } from '@react-three/fiber'
import React, { useState } from 'react'
import * as THREE from 'three'

const BuildingModel = ({ targetRotation, targetScale, activeMeshIndex, handleClick, object }) => {
  const [currentRotation, setCurrentRotation] = useState(targetRotation)
  const [currentScale, setCurrentScale] = useState(targetScale)

  const floorPositions = [
    [1.3, 2.8, 1.4],
    [1.3, 3.6, 1.4],
    [1.3, 4.4, 1.4],
    [1.3, 5.2, 1.4],
    [1.3, 6, 1.4],
    [1.3, 6.9, 1.4],
    [1.3, 7.7, 1.4],
    [1.3, 8.5, 1.4],
    [1.3, 9.3, 1.4],
    [1.3, 10.1, 1.4],
    [1.3, 10.9, 1.4],
    [1.3, 11.7, 1.4],
    [1.3, 12.5, 1.4],
    [1.3, 13.3, 1.4],
    [1.3, 14.1, 1.4],
    [1.3, 14.9, 1.4],
    [1.3, 15.7, 1.4],
    [1.3, 16.5, 1.4]
  ]

  useFrame(() => {
    if (object) {
      setCurrentRotation(
        THREE.MathUtils.lerp(currentRotation, targetRotation, 0.1)
      )
      object.rotation.y = currentRotation

      setCurrentScale(THREE.MathUtils.lerp(currentScale, targetScale, 0.1))
      object.scale.set(currentScale, currentScale, currentScale)
    }
  })

  return object
    ? (
      <>
        <primitive object={object} position={[-1, -8, 0]} scale={[1, 1, 1]}>
          <group>
            {floorPositions.map((position, index) => (
              <mesh
                key={index}
                position={position}
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick(index)
                }}
              >
                <boxGeometry args={[11.5, 0.8, 4.8]} />
                <meshStandardMaterial
                  color={activeMeshIndex === index ? '#ACACAC' : null}
                  transparent
                  opacity={activeMeshIndex === index ? 0.5 : null}
                />
              </mesh>
            ))}
          </group>
        </primitive>
      </>
      )
    : null
}

export default BuildingModel
