import React, { useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const CustomOrbitControls = () => {
  const { camera, gl } = useThree() // Accedemos a la cámara y al renderizador (gl)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [theta, setTheta] = useState(0) // Ángulo horizontal
  const [phi, setPhi] = useState(Math.PI / 4) // Ángulo vertical (inclinación)
  const [radius, setRadius] = useState(10) // Distancia de la cámara al punto de enfoque
  const [target, setTarget] = useState(new THREE.Vector3(0, 0, 0)) // Punto de enfoque

  // Actualizar la posición de la cámara en cada frame usando coordenadas esféricas
  useFrame(() => {
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.cos(phi)
    const z = radius * Math.sin(phi) * Math.sin(theta)

    camera.position.set(x, y, z)
    camera.lookAt(target) // Siempre mira al punto de enfoque
  })

  // Control de rotación con el ratón
  const handleMouseDown = event => {
    setIsMouseDown(true)
    setStartX(event.clientX)
    setStartY(event.clientY)
  }

  const handleMouseMove = event => {
    if (isMouseDown) {
      const deltaX = event.clientX - startX
      const deltaY = event.clientY - startY

      setTheta(prev => prev + deltaX * 0.005) // Ajustar el ángulo horizontal
      setPhi(prev =>
        Math.max(0.1, Math.min(Math.PI - 0.1, prev - deltaY * 0.005))
      ) // Ajustar inclinación

      setStartX(event.clientX)
      setStartY(event.clientY)
    }
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
  }

  // Control de zoom con la rueda del ratón
  const handleWheel = event => {
    const zoomSpeed = 0.95
    setRadius(prev =>
      Math.max(2, prev * (event.deltaY > 0 ? zoomSpeed : 1 / zoomSpeed))
    )
  }

  // Control de pan (desplazamiento lateral)
  const handlePan = event => {
    if (event.buttons === 2) {
      // Si el botón derecho está presionado
      const panSpeed = 0.002
      const deltaX = event.movementX * panSpeed
      const deltaY = event.movementY * panSpeed

      const offset = new THREE.Vector3()
      const panLeft = new THREE.Vector3()
      const panUp = new THREE.Vector3()

      // Obtener el vector lateral y hacia arriba de la cámara
      panLeft.setFromMatrixColumn(camera.matrix, 0).multiplyScalar(-deltaX)
      panUp.setFromMatrixColumn(camera.matrix, 1).multiplyScalar(deltaY)

      offset.add(panLeft)
      offset.add(panUp)

      setTarget(prev => prev.add(offset))
    }
  }

  useEffect(() => {
    // Agregar eventos de ratón y rueda al canvas del renderizador
    const domElement = gl.domElement

    domElement.addEventListener('mousedown', handleMouseDown)
    domElement.addEventListener('mousemove', handleMouseMove)
    domElement.addEventListener('mouseup', handleMouseUp)
    domElement.addEventListener('wheel', handleWheel)
    domElement.addEventListener('mousemove', handlePan)

    return () => {
      // Remover eventos al desmontar el componente
      domElement.removeEventListener('mousedown', handleMouseDown)
      domElement.removeEventListener('mousemove', handleMouseMove)
      domElement.removeEventListener('mouseup', handleMouseUp)
      domElement.removeEventListener('wheel', handleWheel)
      domElement.removeEventListener('mousemove', handlePan)
    }
  }, [gl.domElement])

  return null // Este componente no necesita renderizar nada, solo controlar la cámara
}

export default CustomOrbitControls
