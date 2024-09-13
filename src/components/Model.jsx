import React, { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Environment } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

function Model ({
  targetRotation,
  targetScale,
  setLoading,
  playAnimation,
  reverseAnimation,
  stateView,
  modelPath,
  environmentPath
}) {
  const meshRef = useRef()
  const mixerRef = useRef()
  const actionRef = useRef()
  const [model, setModel] = useState(null)
  const { gl } = useThree()

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(modelPath, (gltf) => {
      const scene = gltf.scene
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.material.metalness = 0.8
          child.material.roughness = 0.2
        }
      })

      if (gltf.animations.length > 0) {
        mixerRef.current = new THREE.AnimationMixer(gltf.scene)
        actionRef.current = mixerRef.current.clipAction(gltf.animations[0])
        actionRef.current.loop = THREE.LoopOnce
        actionRef.current.clampWhenFinished = true
      }

      setModel(scene)
      if (setLoading) setLoading(false)
    })
  }, [modelPath, setLoading]) // El useEffect depende ahora de modelPath

  useEffect(() => {
    if (actionRef.current) {
      if (playAnimation) {
        actionRef.current.reset()
        actionRef.current.timeScale = 1
        actionRef.current.play()
      } else if (reverseAnimation) {
        actionRef.current.time = actionRef.current.getClip().duration
        actionRef.current.timeScale = -1
        actionRef.current.play()
      } else {
        actionRef.current.stop()
      }
    }
  }, [playAnimation, reverseAnimation])

  useEffect(() => {
    gl.toneMappingExposure = 0.6
  }, [gl])

  useFrame(() => {
    if (meshRef.current) {
      const delta = 0.02
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        delta
      )
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.25
      )
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        stateView[0],
        0.2
      )
    }

    if (mixerRef.current && (playAnimation || reverseAnimation)) {
      mixerRef.current.update(0.02)
    }
  })

  return (
    <>
      {model && (
        <group ref={meshRef} position={[0, 0, 0]}>
          <primitive
            object={model}
            scale={[0.6, 0.6, 0.6]}
            position={[0, 0, 0]}
            castShadow
          />
        </group>
      )}

      <ambientLight intensity={0.2} />

      <directionalLight
        color='#fade85'
        position={[-3, 40, 5]}
        intensity={0.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-near={2}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-radius={3}
      />

      <pointLight
        color='#808080'
        position={[0, 0, 0]}
        intensity={0.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-near={0.5}
      />

      <Environment files={environmentPath} background blur={0} />
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.05} intensity={0.05} />
      </EffectComposer>
    </>
  )
}

export default Model
