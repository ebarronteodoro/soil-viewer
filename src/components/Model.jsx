import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Environment } from '@react-three/drei'

function Model ({
  targetRotation,
  playAnimation,
  reverseAnimation,
  environmentPath,
  object,
  animations,
  selectedAnimationIndex = 0
}) {
  const meshRef = useRef()
  const { gl } = useThree()
  const currentRotation = useRef(targetRotation)
  const mixerRef = useRef(null)
  const actionRef = useRef(null)

  useEffect(() => {
    gl.toneMappingExposure = 0.8
  }, [gl])

  useEffect(() => {
    if (animations && animations.length > 0 && object) {
      if (!mixerRef.current) {
        mixerRef.current = new THREE.AnimationMixer(object)
      }

      // Detener cualquier acción previa
      if (actionRef.current) {
        actionRef.current.stop()
      }

      // Selección de la animación correcta por índice
      const selectedAnimation = animations[selectedAnimationIndex]
      actionRef.current = mixerRef.current.clipAction(selectedAnimation)

      // Configuración de la animación
      actionRef.current.setLoop(THREE.LoopOnce)
      actionRef.current.clampWhenFinished = true

      // Control de la animación en función de los props
      if (playAnimation) {
        actionRef.current.reset().play()
        actionRef.current.setEffectiveTimeScale(1) // Reproducir normalmente
      }

      if (reverseAnimation) {
        actionRef.current.reset().play()
        actionRef.current.time = actionRef.current.getClip().duration // Iniciar desde el final
        actionRef.current.setEffectiveTimeScale(-1) // Reversa la animación
      }

      // Limpiar el efecto al desmontar
      return () => {
        if (mixerRef.current) {
          mixerRef.current.stopAllAction()
        }
      }
    }
  }, [
    animations,
    playAnimation,
    reverseAnimation,
    object,
    selectedAnimationIndex
  ])

  // Actualización de la rotación del objeto
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta) // Esto asegura que el mixer actualice las animaciones
    }

    currentRotation.current = THREE.MathUtils.lerp(
      currentRotation.current,
      targetRotation,
      0.1
    )
    if (meshRef.current) {
      meshRef.current.rotation.y = currentRotation.current
    }
  })

  return (
    <>
      {object && (
        <group ref={meshRef} position={[0, -3, 0]}>
          <primitive object={object} />
        </group>
      )}
      <Environment
        files={environmentPath || '/models/hdri/typologie.hdr'}
        blur={0}
      />
    </>
  )
}

export default Model
