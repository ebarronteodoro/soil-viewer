import React, { useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import BuildingModel from './BuildingModel'
import NavigateButton from './NavigateButton'
import AnimatedButton from './AnimatedButton'
import GlobalRotateIcon from './icons/GlobalRotateIcon'
import ZoomOutIcon from './icons/ZoomOutIcon'
import ZoomInIcon from './icons/ZoomInIcon'
import * as THREE from 'three'
import View360 from './View360'
import EyeIcon from './icons/EyeIcon'

const CameraController = () => {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, -5, 10)
    camera.lookAt(new THREE.Vector3(0, -5, 0))
  }, [camera])

  useFrame(() => camera.updateProjectionMatrix())
  return null
}

function HomePage () {
  const [rotation, setRotation] = useState(Math.PI / 4)
  const [zoom, setZoom] = useState(0.5)
  const [loading, setLoading] = useState(true)
  const [showLoader, setShowLoader] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mouseDown, setMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [interactionTimeout, setInteractionTimeout] = useState(null)
  const [activeMeshIndex, setActiveMeshIndex] = useState(null)
  const [buttonRoute, setButtonRoute] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [copied, setCopied] = useState(false)

  const minZoom = 0.35
  const maxZoom = 1
  const zoomStep = 0.05

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [loading])

  useEffect(() => {
    let interval
    if (autoRotate) {
      interval = setInterval(() => {
        setRotation(prev => prev + 0.002)
      }, 16)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRotate])

  const rotateLeft = () => {
    setRotation(prev => prev + Math.PI / 8)
    stopAutoRotation()
    restartAutoRotation()
  }

  const rotateRight = () => {
    setRotation(prev => prev - Math.PI / 8)
    stopAutoRotation()
    restartAutoRotation()
  }

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + zoomStep, maxZoom))
    stopAutoRotation()
    restartAutoRotation()
  }

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - zoomStep, minZoom))
    stopAutoRotation()
    restartAutoRotation()
  }

  const handleMouseDown = event => {
    setMouseDown(true)
    setStartX(event.clientX)
    stopAutoRotation()
  }

  const handleMouseUp = () => {
    setMouseDown(false)
    restartAutoRotation()
  }

  const handleMouseMove = event => {
    if (!mouseDown) return
    const deltaX = event.clientX - startX
    setRotation(prev => prev + deltaX * 0.02)
    setStartX(event.clientX)
  }

  const handleWheel = event => {
    const direction = event.deltaY < 0 ? 1 : -1
    setZoom(prev => {
      const newZoom = prev + direction * zoomStep
      return Math.max(minZoom, Math.min(newZoom, maxZoom))
    })
    stopAutoRotation()
  }

  useEffect(() => {
    const preventDefault = event => event.preventDefault()
    window.addEventListener('wheel', preventDefault, { passive: false })
    return () => {
      window.removeEventListener('wheel', preventDefault)
    }
  }, [])

  const stopAutoRotation = () => {
    setAutoRotate(false)
    clearTimeout(interactionTimeout)
  }

  const restartAutoRotation = () => {
    clearTimeout(interactionTimeout)
    const timeout = setTimeout(() => {
      setAutoRotate(true)
    }, 3000)
    setInteractionTimeout(timeout)
  }

  const handleClick = (index) => {
    setActiveMeshIndex(index)
    const piso = index + 3
    setSelectedFloor(piso)

    if (piso === 5) {
      setButtonRoute('/tipo-a')
    } else if (piso === 6) {
      setButtonRoute('/tipo-b')
    } else {
      setButtonRoute(null)
      console.log(`No hay página disponible para el Piso ${piso}`)
    }
  }

  const handleLoaderButtonClick = () => {
    setShowLoader(false)
  }

  const handleCopy = (e) => {
    const number = e.target.innerText
    navigator.clipboard.writeText(number)
    setCopied(true)

    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      className='viewport-container'
    >
      {showLoader && (
        <div className='loader2'>
          <div className='vista360'>
            <View360 scene='/models/hdri/untitled.png' />
          </div>
          <img className='soil-logo' src='/images/soil_logo.png' alt='Soil-Logo' />
          <button className='loader-button' onClick={handleLoaderButtonClick}>
            <EyeIcon width='24px' height='24px' />
            <span className='button-text'>VER EDIFICIO</span>
          </button>
        </div>
      )}

      <Canvas shadows>
        <Suspense fallback={null}>
          <Sky sunPosition={[50, 40, 5]} turbidity={1} rayleigh={1} />
          <directionalLight position={[30, 30, 30]} intensity={2.5} castShadow />
          <ambientLight intensity={2} />

          <BuildingModel
            targetRotation={rotation}
            targetScale={zoom}
            onLoadingComplete={setLoading}
            activeMeshIndex={activeMeshIndex}
            handleClick={handleClick}
          />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -9, 0]}>
            <planeGeometry attach='geometry' args={[10000, 10000]} />
            <meshStandardMaterial attach='material' color='#2a2a2a' metalness={0.8} roughness={0.2} />
          </mesh>

          <CameraController />
        </Suspense>
      </Canvas>

      {!loading && isLoaded && !showLoader && (
        <>
          <div className='soil-info'>
            <img src='/images/soil_logo.png' alt='Soil-logo' />
            <h1>Soil Pueblo Libre</h1>
            <a href='#'>ventas.soil@verdant.pe</a>
            <span onClick={handleCopy}>
              (+51) 982 172 656
            </span>
          </div>
          {copied && <div style={{ background: '#B6CCA8', padding: '1em', color: 'white', borderRadius: '10px', position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }}>Número copiado correctamente: (+51) 982 172 656</div>}
          <div className='menubar'>
            <AnimatedButton style={{ display: 'flex', border: 'none', background: 'none' }} onClick={rotateLeft}>
              <GlobalRotateIcon width='30px' height='30px' />
            </AnimatedButton>
            <AnimatedButton style={{ display: 'flex', border: 'none', background: 'none', color: 'white' }} onClick={zoomOut}>
              <ZoomOutIcon width='30px' height='30px' />
            </AnimatedButton>
            <AnimatedButton style={{ display: 'flex', border: 'none', background: 'none', color: 'white' }} onClick={zoomIn}>
              <ZoomInIcon width='30px' height='30px' />
            </AnimatedButton>
            <AnimatedButton style={{ display: 'flex', border: 'none', background: 'none' }} onClick={rotateRight}>
              <GlobalRotateIcon width='30px' height='30px' style={{ transform: 'scaleX(-1)' }} />
            </AnimatedButton>
            <NavigateButton route={buttonRoute} floor={selectedFloor} />
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage
