import React, {
  useState,
  useEffect,
  Suspense,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useLocation } from 'react-router-dom'
import * as THREE from 'three'
import BuildingModel from './BuildingModel'
import NavigateButton from './NavigateButton'
import AnimatedButton from './AnimatedButton'
import GlobalRotateIcon from './icons/GlobalRotateIcon'
import ZoomOutIcon from './icons/ZoomOutIcon'
import ZoomInIcon from './icons/ZoomInIcon'
import IconChecklist from './icons/IconChecklist'
import { Environment, useGLTF } from '@react-three/drei'

const Scene = forwardRef(({ activeMeshIndex, handleClick }, ref) => {
  const cameraRef = useRef()
  const zoomDistance = useRef(0.85)
  const angleRef = useRef(Math.PI / 2)
  const targetAngleRef = useRef(Math.PI / 2)
  const targetZoomDistance = useRef(zoomDistance.current)
  const cameraHeight = useRef(3.7)
  const isAnimating = useRef(false)
  const isDragging = useRef(false)
  const previousMouseX = useRef(0)
  const previousMouseY = useRef(0)
  const zoomSpeed = 0.03 // Controla la velocidad de zoom, más suave
  const rotationSpeed = 0.0015 // Ajusta la velocidad de rotación, más lenta
  const baseVerticalSpeed = 0.0003 // Reducido para suavizar el arrastre

  const maxYLimitBase = 4.1 // Límite base ajustable del eje Y
  const minYLimit = 3.2 // Límite mínimo en el eje Y

  useImperativeHandle(ref, () => ({
    rotateCameraLeft: () => {
      updateTargetAngle(0.15)
    },
    rotateCameraRight: () => {
      updateTargetAngle(-0.15)
    },
    zoomIn: () => {
      animateZoom(-0.2)
    },
    zoomOut: () => {
      animateZoom(0.2)
    }
  }))

  const updateTargetAngle = deltaAngle => {
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
      cameraRef.current.lookAt(0, cameraHeight.current, 0)

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

  const animateZoom = delta => {
    targetZoomDistance.current = THREE.MathUtils.clamp(
      targetZoomDistance.current + delta,
      0.5,
      1
    )

    const zoomAnimate = () => {
      zoomDistance.current +=
        (targetZoomDistance.current - zoomDistance.current) * zoomSpeed

      const x = zoomDistance.current * Math.sin(angleRef.current)
      const z = zoomDistance.current * Math.cos(angleRef.current)

      let maxYLimit =
        zoomDistance.current >= 0.9
          ? 3.8
          : zoomDistance.current < 0.6
          ? maxYLimitBase * 0.9
          : maxYLimitBase * (2 - zoomDistance.current)

      cameraRef.current.position.set(x, cameraHeight.current, z)

      if (Math.abs(targetZoomDistance.current - zoomDistance.current) > 0.05) {
        requestAnimationFrame(zoomAnimate)
      }
    }

    requestAnimationFrame(zoomAnimate)
  }

  const handleMouseDown = event => {
    isDragging.current = true
    previousMouseX.current = event.clientX
    previousMouseY.current = event.clientY
  }

  const handleMouseMove = event => {
    if (!isDragging.current) return

    const deltaX = event.clientX - previousMouseX.current
    const deltaY = event.clientY - previousMouseY.current

    previousMouseX.current = event.clientX
    previousMouseY.current = event.clientY

    updateTargetAngle(-deltaX * rotationSpeed)

    const verticalSpeed = baseVerticalSpeed * (2 - zoomDistance.current)

    let maxYLimit =
      zoomDistance.current >= 0.9
        ? 3.8
        : zoomDistance.current < 0.6
        ? maxYLimitBase * 0.9
        : maxYLimitBase * (2 - zoomDistance.current)

    cameraHeight.current = THREE.MathUtils.clamp(
      cameraHeight.current + deltaY * verticalSpeed,
      minYLimit,
      maxYLimit
    )

    const x = zoomDistance.current * Math.sin(angleRef.current)
    const z = zoomDistance.current * Math.cos(angleRef.current)

    cameraRef.current.position.set(x, cameraHeight.current, z)
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleWheel = event => {
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
      camera.rotation.x = -0.2
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
        camera.position.set(x, 5, z) // Inicia en 5.5 de altura
        camera.rotation.x = -0.2 // Inclinación inicial hacia abajo
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
        files='/models/hdri/sky-4.hdr'
        background
        backgroundIntensity={0.2}
      />
      <BuildingModel
        activeMeshIndex={activeMeshIndex}
        handleClick={handleClick}
      />
    </Canvas>
  )
})

function HomePage ({
  models,
  isLoaded,
  isOpened,
  setIsOpened,
  instructionStep
}) {
  const [rotation, setRotation] = useState(Math.PI / 1.5)
  const [zoom, setZoom] = useState(0.16)
  const [activeModel, setActiveModel] = useState(null)
  const [mouseDown, setMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [interactionTimeout, setInteractionTimeout] = useState(null)
  const [activeMeshIndex, setActiveMeshIndex] = useState(null)
  const [buttonRoute, setButtonRoute] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [applyTransition, setApplyTransition] = useState(false)
  const [departamentos, setDepartamentos] = useState([])
  const sceneRef = useRef()

  useEffect(() => {
    fetch('/src/data/building.json')
      .then(response => response.json())
      .then(data => setDepartamentos(data))
      .catch(error => console.error('Error al cargar los datos:', error))
  }, [])

  const handleClick = index => {
    setActiveMeshIndex(index)

    const piso = index === 0 ? 1 : index + 2
    setSelectedFloor(piso)

    if (piso >= 3 && piso <= 20) {
      setButtonRoute(`/planta_${piso}`)
    } else if (piso === 1 || piso === 2) {
      setButtonRoute('/lobby')
    } else if (piso === 21) {
      setButtonRoute('/terraza')
    } else {
      setButtonRoute(null)
    }
  }

  const handleCopy = e => {
    navigator.clipboard.writeText(e.target.innerText)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  useEffect(() => {
    const preventDefault = event => event.preventDefault()
    window.addEventListener('wheel', preventDefault, { passive: false })
    isLoaded && setActiveModel(models)
    isLoaded &&
      setTimeout(() => {
        setShowContent(true)
        setTimeout(() => setApplyTransition(true), 500)
      }, 1000)
    return () => window.removeEventListener('wheel', preventDefault)
  }, [isLoaded, models])

  useEffect(() => {
    const preventDefaultTouch = event => event.preventDefault()
    window.addEventListener('touchmove', preventDefaultTouch, {
      passive: false
    })
    return () => window.removeEventListener('touchmove', preventDefaultTouch)
  }, [])

  return (
    <div className='viewport-container'>
      <Scene
        ref={sceneRef}
        activeMeshIndex={activeMeshIndex}
        handleClick={handleClick}
      />

      {showContent && (
        <>
          <div className={`soil-info ${applyTransition ? 'show' : ''}`}>
            <img src='/images/soil_logo.png' alt='Soil-logo' />
            <h1>Soil Pueblo Libre</h1>
            <a href='#'>ventas.soil@verdant.pe</a>
            <span onClick={handleCopy}>(+51) 982 172 656</span>
          </div>

          {copied && (
            <div className='copy-notification'>
              Número copiado correctamente: (+51) 982 172 656
            </div>
          )}

          <div
            className={`menubar2 ${applyTransition ? 'show' : ''} ${
              !isOpened ? 'hideinstructions' : 'showinstructions'
            }`}
          >
            <AnimatedButton
              onClick={() => setIsOpened(true)}
              className={instructionStep === 5 ? 'on' : ''}
            >
              <IconChecklist width='45px' height='45px' />
            </AnimatedButton>
            <AnimatedButton
              onMouseDown={() => sceneRef.current.rotateCameraRight()}
              onTouchStart={() => sceneRef.current.rotateCameraRight()}
              className={instructionStep === 1 ? 'on' : ''}
            >
              <GlobalRotateIcon width='45px' height='45px' />
            </AnimatedButton>
            <AnimatedButton
              onMouseDown={() => sceneRef.current.rotateCameraLeft()}
              onTouchStart={() => sceneRef.current.rotateCameraLeft()}
              className={instructionStep === 1 ? 'on' : ''}
            >
              <GlobalRotateIcon
                width='45px'
                height='45px'
                style={{ transform: 'scaleX(-1)' }}
              />
            </AnimatedButton>
            <AnimatedButton
              onMouseDown={() => sceneRef.current.zoomOut()}
              onTouchStart={() => sceneRef.current.zoomOut()}
              className={instructionStep === 2 ? 'on' : ''}
            >
              <ZoomOutIcon width='45px' height='45px' />
            </AnimatedButton>
            <AnimatedButton
              onMouseDown={() => sceneRef.current.zoomIn()}
              onTouchStart={() => sceneRef.current.zoomIn()}
              className={instructionStep === 2 ? 'on' : ''}
            >
              <ZoomInIcon width='45px' height='45px' />
            </AnimatedButton>
          </div>

          <div className={`floors-info ${selectedFloor && 'active'}`}>
            <span className='floor-name'>
              {selectedFloor === 1
                ? 'Planta 1 y 2'
                : selectedFloor === 21
                ? 'Terraza'
                : `Planta ${selectedFloor}`}
            </span>
            <div className='floor-details'>
              <span className='floor-capacity'>
                Departamentos:{' '}
                {departamentos[`planta${selectedFloor}`]
                  ? departamentos[`planta${selectedFloor}`].length
                  : 0}
              </span>

              <span className='available-apartments'>
                Departamentos Disponibles:
              </span>
            </div>
            <NavigateButton
              route={buttonRoute}
              floor={selectedFloor}
              clearSelection={() => handleClick(null)}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage
