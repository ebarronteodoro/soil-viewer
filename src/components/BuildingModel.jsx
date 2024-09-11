import { useFrame } from '@react-three/fiber'
import React, { useEffect, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

const BuildingModel = ({ targetRotation, targetScale, onLoadingComplete, activeMeshIndex, handleClick }) => {
  const [scene, setScene] = useState(null)
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

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load('/models/Edificio optimizado.glb', (gltf) => {
      const loadedScene = gltf.scene
      loadedScene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.material.metalness = 0.5
          child.material.roughness = 0.2
        }
      })
      setScene(loadedScene)
      if (typeof onLoadingComplete === 'function') {
        onLoadingComplete(false)
      }
    })
  }, [onLoadingComplete])

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.material.needsUpdate = true
        }
      })
    }
  }, [activeMeshIndex, scene])

  useFrame(() => {
    if (scene) {
      setCurrentRotation(
        THREE.MathUtils.lerp(currentRotation, targetRotation, 0.1)
      )
      scene.rotation.y = currentRotation

      setCurrentScale(THREE.MathUtils.lerp(currentScale, targetScale, 0.1))
      scene.scale.set(currentScale, currentScale, currentScale)
    }
  })

  return scene
    ? (
      <>
        <primitive object={scene} position={[-1, -8, 0]} scale={[1, 1, 1]}>
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
                  color={activeMeshIndex === index ? '#0000ff' : null}
                  transparent
                  opacity={activeMeshIndex === index ? 0.5 : null}
                />
              </mesh>
            ))}
          </group>
        </primitive>
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.05} intensity={0.05} />
        </EffectComposer>
      </>
      )
    : null
}

export default BuildingModel
