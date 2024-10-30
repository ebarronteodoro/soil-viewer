import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Environment } from '@react-three/drei'

function Model ({
  targetRotation,
  targetScale,
  playAnimation,
  reverseAnimation,
  stateView,
  environmentPath,
  object,
  animations
}) {
  const meshRef = useRef()
  const mixerRef = useRef(null) // Referencia para el AnimationMixer
  const actionRef = useRef(null) // Referencia para la acción de animación

  useEffect(() => {
    if (animations && animations.length > 0) {
      // Crear el mixer de animaciones si hay animaciones disponibles
      mixerRef.current = new THREE.AnimationMixer(object)

      // Crear la acción de animación (ejecutaremos la primera animación por defecto)
      actionRef.current = mixerRef.current.clipAction(animations[0])

      // Configuración para que la animación solo se ejecute una vez y se quede al final
      actionRef.current.setLoop(THREE.LoopOnce)
      actionRef.current.clampWhenFinished = true // Mantiene el último frame al finalizar

      // Reproducir la animación si playAnimation es true
      if (playAnimation) {
        actionRef.current.reset().play()
        actionRef.current.setEffectiveTimeScale(1) // Normal playback
      }

      // Si reverseAnimation es true, reproducirla en reversa suavemente
      if (reverseAnimation) {
        // Setear el tiempo de la animación al final
        actionRef.current.reset().play()
        actionRef.current.time = actionRef.current.getClip().duration // Iniciar desde el final
        actionRef.current.setEffectiveTimeScale(-1) // Reverso progresivo
        actionRef.current.setEffectiveWeight(1)
      }

      // Cleanup al desmontar el componente
      return () => {
        mixerRef.current.stopAllAction()
      }
    }
  }, [animations, playAnimation, reverseAnimation, object])

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta) // Actualiza el mixer en cada frame
    }

    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        0.02
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
  })

  return (
    <>
      {object && (
        <group ref={meshRef} position={[0, 0, 0]}>
          <primitive
            object={object}
            scale={[0.6, 0.6, 0.6]}
            position={[0, 0, 0]}
            castShadow
          />
        </group>
      )}
      <Environment files={'/models/hdri/TypoB.jpg'} background blur={0} />
    </>
  )
}

export default Model
