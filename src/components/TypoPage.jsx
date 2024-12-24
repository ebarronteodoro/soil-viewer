import React, { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import CameraController from './CameraController'
import Model from './Model'
import GlobalRotateIcon from './icons/GlobalRotateIcon'
import ZoomInIcon from './icons/ZoomInIcon'
import ZoomOutIcon from './icons/ZoomOutIcon'
import { useNavigate } from 'react-router-dom'
import AnimatedButton from './AnimatedButton'
import * as THREE from 'three'
import ReturnIcon from './icons/ReturnIcon'
import BuildingIcon from './icons/BuildingIcon'
import View3dIcon from './icons/View3dIcon'
import Hide3dIcon from './icons/Hide3dIcon'
import CameraUpIcon from './icons/CameraUpIcon'
import CameraDownIcon from './icons/CameraDownIcon'
import { Environment } from '@react-three/drei'
import FocusIcon from './icons/FocusIcon'
import TerrazaCameraController from './TerrazaCameraController'

function TypoPage ({ activeModel, isLoaded, activeTypology }) {
  const cameraRef = useRef()
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(70)
  const [zoom2, setZoom2] = useState(0.8)
  const [rotateFront, setRotateFront] = useState(false)

  const [isAnimationTriggered, setIsAnimationTriggered] = useState(false)
  const [isReverseAnimationTriggered, setIsReverseAnimationTriggered] =
    useState(false)
  const [stateView, setStateView] = useState([Math.PI / 2, 0, 0])
  const [isToggleActive, setIsToggleActive] = useState(false)
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [resetPosition, setResetPosition] = useState(false)
  const [cameraPosition, setCameraPosition] = useState([0, 0, 5])

  const minZoom = 15
  const maxZoom = 85
  const zoomStep = 5

  const getTypologyImage = typology => {
    const typologyImages = {
      't-1': '/typologies images/TIPO-1.jpg',
      't-2': '/typologies images/TIPO-2.jpg',
      't-3': '/typologies images/TIPO-3.jpg',
      't-4': '/typologies images/TIPO-4.jpg',
      't-5': '/typologies images/TIPO-5.jpg',
      't-6': '/typologies images/TIPO-6.jpg',
      't-7': '/typologies images/TIPO-7.jpg',
      't-8': '/typologies images/TIPO-8.jpg',
      't-19': '/typologies images/TIPO-19.jpg',
      't-23': '/typologies images/TIPO-23.jpg'
    }
    return typologyImages[typology] || '/typologies images/default.jpg'
  }

  const handleWheel = e => {
    e.preventDefault()
    if (rotateFront) {
      if (e.deltaY < 0) {
        setZoom2(prev => Math.min(Math.max(prev + 0.1, 0.6), 1.4))
      } else {
        setZoom2(prev => Math.min(Math.max(prev - 0.1, 0.6), 1.4))
      }
    } else {
      if (e.deltaY < 0) {
        setZoom(prev => Math.max(prev - zoomStep, minZoom))
      } else {
        setZoom(prev => Math.min(prev + zoomStep, maxZoom))
      }
    }
  }

  const smoothZoom = targetZoom => {
    const deltaZoom = targetZoom - zoom
    if (Math.abs(deltaZoom) < 0.01) {
      setZoom(targetZoom)
    } else {
      const newZoom = zoom + deltaZoom * 0.1
      setZoom(newZoom)
      requestAnimationFrame(() => smoothZoom(targetZoom))
    }
  }

  const rotateLeft = () => setRotation(prev => prev + Math.PI / 8)
  const rotateRight = () => setRotation(prev => prev - Math.PI / 8)
  const zoomIn = () => {
    if (rotateFront) {
      setZoom2(prev => Math.min(Math.max(prev + 0.1, 0.6), 1.4))
    } else {
      setZoom(prev => Math.max(prev - zoomStep, minZoom))
    }
  }

  const toggleView = () => {
    setRotateFront(prev => !prev)
    rotateFront === true ? setZoom(70) : setZoom2(0.8)
  }

  const zoomOut = () => {
    if (rotateFront) {
      setZoom2(prev => Math.min(Math.max(prev - 0.1, 0.6), 1.4))
    } else {
      setZoom(prev => Math.min(prev + zoomStep, maxZoom))
    }
  }
  const navigate = useNavigate()

  const returnHome = () => {
    navigate(-1)
  }

  useEffect(() => {
    console.log(activeModel.animations)

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [rotateFront])

  const triggerAnimation = () => {
    setIsAnimationTriggered(true)
    setIsReverseAnimationTriggered(false)
    setResetPosition(true)
    setTimeout(() => {
      setResetPosition(false)
      toggleView()
      rotateRight()
      rotateRight()
    }, 500)
  }

  const triggerResetPosition = () => {
    setResetPosition(true)
    setTimeout(() => setResetPosition(false), 500)
  }

  const triggerReverseAnimation = () => {
    setIsReverseAnimationTriggered(true)
    setIsAnimationTriggered(false)
    
    setStateView([Math.PI / 2, 0, 0])
    setResetPosition(true)
    setRotateFront(false)
    setIsToggleActive(prev => !prev)
    setTimeout(() => setResetPosition(false), 500)
  }

  const backIndex = () => {
    navigate('/')
  }

  const openImageModal = () => {
    setIsImageOpen(true)
  }

  const closeImageModal = () => {
    setIsImageOpen(false)
  }

  return (
    <div>
      <Canvas camera={{ fov: 15, position: [0, zoom, 0] }} shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight
            color='#fade85'
            position={[10, 40, 20]}
            intensity={2}
            castShadow
            shadow-mapSize-width={8192}
            shadow-mapSize-height={8192}
            shadow-camera-near={1}
            shadow-camera-far={150}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
            shadow-radius={3}
          />
          <Model
            targetRotation={rotation}
            targetScale={zoom}
            stateView={stateView}
            playAnimation={isAnimationTriggered}
            reverseAnimation={isReverseAnimationTriggered}
            object={activeModel.scene}
            animations={activeModel.animations}
          />
          <CameraController
            zoom={zoom}
            rotateFront={rotateFront}
            zoom2={zoom2}
          />
        </Suspense>
      </Canvas>

      {isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            display: 'flex',
            gap: '15px'
          }}
        >
          <AnimatedButton onClick={returnHome}>
            <ReturnIcon width='30px' height='30px' />
          </AnimatedButton>

          {!isAnimationTriggered && (
            <AnimatedButton onClick={triggerAnimation}>
              <View3dIcon width='30px' height='30px' />
            </AnimatedButton>
          )}

          {isAnimationTriggered && (
            <>
              <AnimatedButton onClick={toggleView}>
                {isToggleActive ? (
                  <CameraUpIcon width='30px' height='30px' />
                ) : (
                  <CameraDownIcon width='30px' height='30px' />
                )}
              </AnimatedButton>
              <AnimatedButton onClick={triggerReverseAnimation}>
                <Hide3dIcon width='30px' height='30px' />
              </AnimatedButton>
            </>
          )}

          <AnimatedButton onClick={triggerResetPosition}>
            <FocusIcon width='30px' height='30px' />
          </AnimatedButton>

          <AnimatedButton onClick={backIndex}>
            <BuildingIcon width='30px' height='30px' />
          </AnimatedButton>
        </div>
      )}

      {isLoaded && (
        <div className='menubar'>
          <AnimatedButton
            style={{ display: 'flex', border: 'none', background: 'none' }}
            onClick={rotateLeft}
          >
            <GlobalRotateIcon width='30px' height='30px' />
          </AnimatedButton>

          <AnimatedButton
            style={{
              display: 'flex',
              border: 'none',
              background: 'none',
              color: 'white'
            }}
            onClick={zoomOut}
          >
            <ZoomOutIcon width='30px' height='30px' />
          </AnimatedButton>

          <AnimatedButton
            style={{
              display: 'flex',
              border: 'none',
              background: 'none',
              color: 'white'
            }}
            onClick={zoomIn}
          >
            <ZoomInIcon width='30px' height='30px' />
          </AnimatedButton>

          <AnimatedButton
            style={{ display: 'flex', border: 'none', background: 'none' }}
            onClick={rotateRight}
          >
            <GlobalRotateIcon
              width='30px'
              height='30px'
              style={{ transform: 'scaleX(-1)' }}
            />
          </AnimatedButton>
        </div>
      )}

      {isLoaded && (
        <div className='typo-img' onClick={openImageModal}>
          <img
            src={getTypologyImage(activeTypology)}
            alt={`Tipología ${activeTypology}`}
          />
        </div>
      )}

      {isImageOpen && (
        <div className='modal-overlay'>
          <div className='overlay' onClick={closeImageModal} />
          <button
            onClick={closeImageModal}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '30px',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
          <div style={{ position: 'relative' }}>
            <img
              src={getTypologyImage(activeTypology)}
              alt={`Tipología ${activeTypology}`}
              style={{
                maxWidth: '80dvw',
                maxHeight: '80dvh',
                borderRadius: '8px'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TypoPage
