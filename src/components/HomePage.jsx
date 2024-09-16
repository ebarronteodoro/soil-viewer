import React, { useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useLocation } from 'react-router-dom'
import { Sky } from '@react-three/drei'
import * as THREE from 'three'
import BuildingModel from './BuildingModel'
import NavigateButton from './NavigateButton'
import AnimatedButton from './AnimatedButton'
import GlobalRotateIcon from './icons/GlobalRotateIcon'
import ZoomOutIcon from './icons/ZoomOutIcon'
import ZoomInIcon from './icons/ZoomInIcon'
import IconChecklist from './icons/IconChecklist'

const CameraController = () => {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, -5, 10)
    camera.lookAt(new THREE.Vector3(0, -5, 0))
  }, [camera])

  useFrame(() => camera.updateProjectionMatrix())

  return null
}

function HomePage ({ models, isLoaded, setIsOpened }) {
  const [rotation, setRotation] = useState(Math.PI / 4)
  const [zoom, setZoom] = useState(0.5)
  const [activeModel, setActiveModel] = useState(null)
  const [mouseDown, setMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [interactionTimeout, setInteractionTimeout] = useState(null)
  const [activeMeshIndex, setActiveMeshIndex] = useState(null)
  const [buttonRoute, setButtonRoute] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [applyTransition, setApplyTransition] = useState(false)

  const location = useLocation()

  const minZoom = 0.35
  const maxZoom = 1
  const zoomStep = 0.05

  useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => setRotation((prev) => prev + 0.002), 16)
      return () => clearInterval(interval)
    }
  }, [autoRotate])

  useEffect(() => {
    setActiveMeshIndex(null)
  }, [location.pathname])

  const stopAutoRotation = () => {
    setAutoRotate(false)
    clearTimeout(interactionTimeout)
  }

  const restartAutoRotation = () => {
    clearTimeout(interactionTimeout)
    const timeout = setTimeout(() => setAutoRotate(true), 10000)
    setInteractionTimeout(timeout)
  }

  const rotateLeft = () => {
    setRotation((prev) => prev + Math.PI / 8)
    stopAutoRotation()
    restartAutoRotation()
  }

  const rotateRight = () => {
    setRotation((prev) => prev - Math.PI / 8)
    stopAutoRotation()
    restartAutoRotation()
  }

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + zoomStep, maxZoom))
    stopAutoRotation()
    restartAutoRotation()
  }

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - zoomStep, minZoom))
    stopAutoRotation()
    restartAutoRotation()
  }

  const handleMouseDown = (event) => {
    setMouseDown(true)
    setStartX(event.clientX || event.touches[0].clientX)
    setStartY(event.clientY || event.touches[0].clientY)
    stopAutoRotation()
  }

  const handleMouseUp = () => {
    setMouseDown(false)
    restartAutoRotation()
  }

  const handleMouseMove = (event) => {
    if (!mouseDown) return
    const deltaX = (event.clientX || event.touches[0].clientX) - startX
    const deltaY = (event.clientY || event.touches[0].clientY) - startY
    setRotation((prev) => prev + deltaX * 0.002)
    setStartX(event.clientX || event.touches[0].clientX)
    setStartY(event.clientY || event.touches[0].clientY)
  }

  const handleWheel = (event) => {
    const direction = event.deltaY < 0 ? 1 : -1
    setZoom((prev) => Math.max(minZoom, Math.min(prev + direction * zoomStep, maxZoom)))
    stopAutoRotation()
  }

  const handleTouchStart = (event) => {
    const touch = event.touches[0]
    setMouseDown(true)
    setStartX(touch.clientX)
    setStartY(touch.clientY)
    stopAutoRotation()
  }

  const handleTouchEnd = () => {
    setMouseDown(false)
    restartAutoRotation()
  }

  const handleTouchMove = (event) => {
    if (!mouseDown) return
    const touch = event.touches[0]
    const deltaX = touch.clientX - startX
    const deltaY = touch.clientY - startY
    setRotation((prev) => prev + deltaX * 0.002)
    setStartX(touch.clientX)
    setStartY(touch.clientY)
  }

  const handleClick = (index) => {
    setActiveMeshIndex(index)
    const piso = index + 3
    setSelectedFloor(piso)

    if (piso === 5) setButtonRoute('/t903')
    else if (piso === 6) setButtonRoute('/t1901')
    else setButtonRoute(null)
  }

  const handleCopy = (e) => {
    navigator.clipboard.writeText(e.target.innerText)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  useEffect(() => {
    const preventDefault = (event) => event.preventDefault()
    window.addEventListener('wheel', preventDefault, { passive: false })
    isLoaded && setActiveModel(models)
    isLoaded && (
      setTimeout(() => {
        setShowContent(true)
        setTimeout(() => setApplyTransition(true), 500)
      }, 1000)
    )
    return () => window.removeEventListener('wheel', preventDefault)
  }, [isLoaded, models])

  useEffect(() => {
    const preventDefaultTouch = (event) => event.preventDefault()
    window.addEventListener('touchmove', preventDefaultTouch, { passive: false })
    return () => window.removeEventListener('touchmove', preventDefaultTouch)
  }, [])

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      className='viewport-container'
    >
      <Canvas shadows>
        <Suspense fallback={null}>
          <Sky sunPosition={[50, 40, 5]} turbidity={1} rayleigh={1} />
          <ambientLight intensity={2} />
          <directionalLight position={[30, 30, 30]} intensity={2.5} castShadow />
          {activeModel && (
            <BuildingModel
              targetRotation={rotation}
              targetScale={zoom}
              activeMeshIndex={activeMeshIndex}
              handleClick={handleClick}
              object={activeModel.scene}
            />
          )}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -9, 0]}>
            <planeGeometry attach='geometry' args={[10000, 10000]} />
            <meshStandardMaterial attach='material' color='#2a2a2a' metalness={0.8} roughness={0.2} />
          </mesh>
          <CameraController />
        </Suspense>
      </Canvas>

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

          <div className={`menubar2 ${applyTransition ? 'show' : ''}`}>
            <AnimatedButton title='Ver Instrucciones' style={{ display: 'flex', border: 'none', background: 'none', color: 'white' }} onClick={() => setIsOpened(true)}>
              <IconChecklist width='30px' height='30px' />
            </AnimatedButton>
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
            <NavigateButton route={buttonRoute} floor={selectedFloor} clearSelection={() => handleClick(null)} />
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage
