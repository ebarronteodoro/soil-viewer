import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import BuildingModel from './BuildingModel'
import { Environment } from '@react-three/drei'

const Scene = forwardRef(({ activeMeshIndex, handleClick }, ref) => {
  const cameraRef = useRef()
  const zoomDistance = useRef(1.5) // Ajusta la distancia inicial del zoom
  const angleRef = useRef(Math.PI / 2)
  const targetAngleRef = useRef(Math.PI / 2)
  const targetZoomDistance = useRef(zoomDistance.current)
  const cameraHeight = useRef(5.5) // Asegura que la altura inicial sea 5.5
  const isAnimating = useRef(false)
  const isDragging = useRef(false)
  const previousMouseX = useRef(0)
  const previousMouseY = useRef(0)
  const zoomSpeed = 0.05 // Controla la velocidad de zoom
  const rotationSpeed = 0.0025 // Ajusta la velocidad de rotación
  const verticalSpeed = 0.005 // Controla la velocidad vertical

  useImperativeHandle(ref, () => ({
    rotateCameraLeft: () => {
      updateTargetAngle(0.2)
    },
    rotateCameraRight: () => {
      updateTargetAngle(-0.2)
    },
    zoomIn: () => {
      animateZoom(-0.25)
    },
    zoomOut: () => {
      animateZoom(0.25)
    },
  }))

  const updateTargetAngle = (deltaAngle) => {
    targetAngleRef.current += deltaAngle
    animateCameraRotation()
  }

  const animateCameraRotation = () => {
    if (isAnimating.current) return

    const animate = () => {
      angleRef.current += (targetAngleRef.current - angleRef.current) * 0.1
      const x = zoomDistance.current * Math.sin(angleRef.current)
      const z = zoomDistance.current * Math.cos(angleRef.current)

      cameraRef.current.position.set(x, cameraHeight.current, z)
      cameraRef.current.lookAt(0, 5.5, 0) // Enfoque ajustado en y=5.5

      if (Math.abs(targetAngleRef.current - angleRef.current) > 0.01) {
        requestAnimationFrame(animate)
      } else {
        isAnimating.current = false
      }
    }

    if (!isAnimating.current) {
      isAnimating.current = true
      animate()
    }
  }

  const animateZoom = (delta) => {
    targetZoomDistance.current = THREE.MathUtils.clamp(
      targetZoomDistance.current + delta,
      0.5,
      3
    )

    const zoomAnimate = () => {
      zoomDistance.current +=
        (targetZoomDistance.current - zoomDistance.current) * zoomSpeed

      const x = zoomDistance.current * Math.sin(angleRef.current)
      const z = zoomDistance.current * Math.cos(angleRef.current)

      cameraRef.current.position.set(x, cameraHeight.current, z)
      cameraRef.current.lookAt(0, 5.5, 0) // Asegura el mismo enfoque

      if (Math.abs(targetZoomDistance.current - zoomDistance.current) > 0.1) {
        requestAnimationFrame(zoomAnimate)
      }
    }

    requestAnimationFrame(zoomAnimate)
  }

  const handleMouseDown = (event) => {
    isDragging.current = true
    previousMouseX.current = event.clientX
    previousMouseY.current = event.clientY
  }

  const handleMouseMove = (event) => {
    if (!isDragging.current) return

    const deltaX = event.clientX - previousMouseX.current
    const deltaY = event.clientY - previousMouseY.current

    previousMouseX.current = event.clientX
    previousMouseY.current = event.clientY

    updateTargetAngle(-deltaX * rotationSpeed)

    cameraHeight.current = THREE.MathUtils.clamp(
      cameraHeight.current + deltaY * verticalSpeed,
      5,
      7
    )

    const x = zoomDistance.current * Math.sin(angleRef.current)
    const z = zoomDistance.current * Math.cos(angleRef.current)
    cameraRef.current.position.set(x, cameraHeight.current, z)
    cameraRef.current.lookAt(0, 5.5, 0) // Enfoca en la misma altura
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleWheel = (event) => {
    event.preventDefault()
    const delta = event.deltaY > 0 ? 2 : -2
    animateZoom(delta)
  }

  useEffect(() => {
    const camera = cameraRef.current
    if (camera) {
      const x = zoomDistance.current * Math.sin(angleRef.current)
      const z = zoomDistance.current * Math.cos(angleRef.current)

      camera.position.set(x, cameraHeight.current, z)
      camera.lookAt(0, 5.5, 0) // Ajusta el punto de enfoque
    }

    document.body.style.touchAction = 'none'

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      document.body.style.touchAction = ''
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <Canvas
      gl={{ toneMappingExposure: 0.6 }}
      shadows
      onCreated={({ camera }) => {
        cameraRef.current = camera
        const x = zoomDistance.current * Math.sin(angleRef.current)
        const z = zoomDistance.current * Math.cos(angleRef.current)
        camera.position.set(x, 5.5, z) // Inicia en 5.5 de altura
        camera.lookAt(0, 5.5, 0) // Enfoca en la misma altura
      }}
    >
      <directionalLight
        position={[10, 20, 10]}
        intensity={2}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={0.1}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <Environment
        files='/models/hdri/city_sky.hdr'
        background
        backgroundIntensity={0.2}
      />
      <BuildingModel activeMeshIndex={activeMeshIndex} handleClick={handleClick} />
    </Canvas>
  )
})

export default Scene
