import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import * as THREE from 'three'

function TerrazaCameraController ({
  zoom,
  zoom2,
  resetPosition,
  modelLimits,
  rotateFront = true
}) {
  const { camera } = useThree()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startZ, setStartZ] = useState(0)
  const [targetPosition, setTargetPosition] = useState({ x: 0, z: 0 })
  const dragSmoothness = 0.03
  const zoomSmoothness = 0.1
  const moveSpeed = 0.05

  const minZoom = 15
  const maxZoom = 85

  useEffect(() => {
    camera.position.set(0, 10, 0)
    if (!rotateFront) {
      camera.lookAt(0, 0, 0)
    }
  }, [camera, rotateFront])

  useEffect(() => {
    if (zoom >= maxZoom) {
      setTargetPosition({ x: 0, z: 0 })
    }
  }, [zoom, maxZoom])

  useEffect(() => {
    rotateFront === false && setTargetPosition({ x: 0, z: 0 })
  }, [rotateFront])

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
        13,
        4,
        (zoom - minZoom) / (maxZoom - minZoom)
      )
      const dragLimitZ = dragLimitX * 0.5

      setTargetPosition(prev =>
        rotateFront
          ? {
              x: THREE.MathUtils.clamp(
                prev.x - deltaX,
                -dragLimitX,
                dragLimitX
              ),
              z: THREE.MathUtils.clamp(prev.z - deltaZ, 20, 30)
            }
          : {
              x: THREE.MathUtils.clamp(
                prev.x - deltaX,
                -dragLimitX,
                dragLimitX
              ),
              z: THREE.MathUtils.clamp(prev.z - deltaZ, -dragLimitZ, dragLimitZ)
            }
      )

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
  }, [isDragging, startX, startZ, zoom, minZoom, maxZoom, rotateFront])

  useEffect(() => {
    if (resetPosition) {
      setTargetPosition({ x: 0, z: 0 })
    }
  }, [resetPosition])

  useFrame(() => {
    const clampedZoom2 = THREE.MathUtils.clamp(zoom2, 0.3, 1.2)

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetPosition.x,
      dragSmoothness
    )

    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      zoom,
      zoomSmoothness // Aplicamos suavizado al zoom
    )

    camera.zoom = THREE.MathUtils.lerp(
      camera.zoom,
      clampedZoom2,
      zoomSmoothness
    )
    camera.updateProjectionMatrix()

    if (rotateFront) {
      const targetRotationX = -Math.PI / 4
      camera.rotation.x = THREE.MathUtils.lerp(
        camera.rotation.x,
        targetRotationX,
        dragSmoothness
      )
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        THREE.MathUtils.clamp(targetPosition.z, 20, 30),
        dragSmoothness
      )
      camera.position.set(camera.position.x, 25, camera.position.z)
    } else {
      const originalRotationX = 0
      camera.rotation.x = THREE.MathUtils.lerp(
        camera.rotation.x,
        originalRotationX,
        dragSmoothness
      )
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        targetPosition.z,
        dragSmoothness
      )

      camera.position.set(camera.position.x, zoom, camera.position.z) // Usamos zoom aquí
      camera.lookAt(camera.position.x, 0, camera.position.z)
      camera.zoom = 1
      camera.updateProjectionMatrix()
    }
  })

  return null
}

export default TerrazaCameraController
