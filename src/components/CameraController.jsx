import React, { useRef, useState, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CameraController = ({
  zoom = 5,
  resetPosition = false,
  isToggleActive = false,
  cameraPosition = [0, 0, 5]
}) => {
  const { camera, gl } = useThree()
  const cameraRef = useRef()
  const [dragging, setDragging] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 })
  const [cameraTarget, setCameraTarget] = useState(
    new THREE.Vector3(...cameraPosition)
  )
  const [currentZoom, setCurrentZoom] = useState(zoom) // Estado para el zoom
  const dragSpeed = 0.005 // Velocidad de arrastre
  const fovSpeed = 1 // Velocidad de cambio del FOV
  const minFov = 1 // Límite mínimo del FOV
  const maxFov = 7 // Límite máximo del FOV

  // Actualiza la posición inicial de la cámara y su proyección
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(...cameraPosition)
      cameraRef.current.updateProjectionMatrix()
    }
  }, [cameraPosition])

  // Resetea la posición de la cámara
  useEffect(() => {
    if (resetPosition) {
      camera.position.set(0, 0, currentZoom)
      setCameraTarget(new THREE.Vector3(0, 0, currentZoom))
    }
  }, [resetPosition, currentZoom, camera])

  // Movimiento suave de la cámara
  useFrame(() => {
    camera.position.lerp(cameraTarget, 0.1) // Transición suave hacia la posición objetivo
    camera.lookAt(0, 0, 0) // Siempre mirando al centro
  })

  // Alterna entre las vistas activas
  useEffect(() => {
    if (isToggleActive) {
      const targetPosition = new THREE.Vector3(0, -5, currentZoom)
      setCameraTarget(targetPosition)
    } else {
      const targetPosition = new THREE.Vector3(0, 0, currentZoom)
      setCameraTarget(targetPosition)
    }
  }, [isToggleActive, currentZoom])

  // Control de arrastre del mouse
  const handleMouseDown = event => {
    setDragging(true)
    setLastMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  const handleMouseMove = event => {
    if (dragging) {
      const deltaX = (event.clientX - lastMousePosition.x) * dragSpeed
      const deltaY = (event.clientY - lastMousePosition.y) * dragSpeed

      // Mueve la cámara de forma horizontal y vertical
      cameraTarget.x -= deltaX
      cameraTarget.y += deltaY

      setLastMousePosition({ x: event.clientX, y: event.clientY })
    }
  }

  // Función para el zoom suave
  const smoothZoom = targetZoom => {
    const deltaZoom = targetZoom - currentZoom
    if (Math.abs(deltaZoom) < 0.01) {
      setCurrentZoom(targetZoom) // Actualiza el estado del zoom
    } else {
      const newZoom = currentZoom + deltaZoom * 0.1
      setCurrentZoom(newZoom) // Actualiza el estado del zoom
      requestAnimationFrame(() => smoothZoom(targetZoom))
    }
  }

  // Función para manejar el evento de la rueda del mouse (zoom)
  const handleWheel = event => {
    event.preventDefault()
    if (event.deltaY < 0) {
      // Zoom in
      smoothZoom(Math.max(currentZoom - fovSpeed, minFov))
    } else {
      // Zoom out
      smoothZoom(Math.min(currentZoom + fovSpeed, maxFov))
    }
  }

  // Añade y elimina listeners de eventos del DOM
  useEffect(() => {
    gl.domElement.addEventListener('mousedown', handleMouseDown)
    gl.domElement.addEventListener('mousemove', handleMouseMove)
    gl.domElement.addEventListener('mouseup', handleMouseUp)
    gl.domElement.addEventListener('wheel', handleWheel)

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown)
      gl.domElement.removeEventListener('mousemove', handleMouseMove)
      gl.domElement.removeEventListener('mouseup', handleMouseUp)
      gl.domElement.removeEventListener('wheel', handleWheel)
    }
  }, [dragging, lastMousePosition, currentZoom])

  return <perspectiveCamera ref={cameraRef} />
}

export default CameraController
