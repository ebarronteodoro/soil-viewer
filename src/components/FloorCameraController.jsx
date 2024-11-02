import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import * as THREE from 'three'

function FloorCameraController ({ zoom, resetPosition, modelLimits }) {
  const { camera } = useThree()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startZ, setStartZ] = useState(0)
  const [targetPosition, setTargetPosition] = useState({ x: 0, z: 0 })
  const dragSmoothness = 0.03
  const zoomSmoothness = 0.1
  const moveSpeed = 0.05

  // Valores mínimos y máximos de zoom para calcular el límite de arrastre
  const minZoom = 15
  const maxZoom = 50

  useEffect(() => {
    camera.position.set(0, 10, 0) // Posición inicial de la cámara en el centro en x y z
    camera.lookAt(0, 0, 0)
  }, [camera])

  useEffect(() => {
    // Centrar la cámara cuando el zoom alcance el máximo
    if (zoom >= maxZoom) {
      setTargetPosition({ x: 0, z: 0 })
    }
  }, [zoom, maxZoom])

  const handleMouseDown = event => {
    setIsDragging(true)
    setStartX(event.clientX)
    setStartZ(event.clientY)
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = event => {
    if (isDragging) {
      const deltaX = (event.clientX - startX) * moveSpeed
      const deltaZ = (event.clientY - startZ) * moveSpeed

      const dragLimitX = THREE.MathUtils.lerp(
        6,
        3,
        (zoom - minZoom) / (maxZoom - minZoom)
      )
      const dragLimitZ = dragLimitX * 0.5 // Límite en `z` menor que en `x`

      setTargetPosition(prev => ({
        x: THREE.MathUtils.clamp(prev.x - deltaX, -dragLimitX, dragLimitX),
        z: THREE.MathUtils.clamp(prev.z - deltaZ, -dragLimitZ, dragLimitZ)
      }))

      setStartX(event.clientX)
      setStartZ(event.clientY)
    }
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isDragging, startX, startZ, zoom, minZoom, maxZoom])

  useEffect(() => {
    if (resetPosition) {
      setTargetPosition({ x: 0, z: 0 })
    }
  }, [resetPosition])

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetPosition.x,
      dragSmoothness
    )
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetPosition.z,
      dragSmoothness
    )

    // Simulación de zoom usando la posición `y` de la cámara
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      zoom,
      zoomSmoothness
    )

    // Mantener la orientación `lookAt` de la cámara en el eje `x` y `z`
    camera.lookAt(camera.position.x, 0, camera.position.z)
  })

  return null
}

export default FloorCameraController
