import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import CameraController from './CameraController'
import Model from './Model'
import GlobalRotateIcon from './icons/GlobalRotateIcon'
import ZoomInIcon from './icons/ZoomInIcon'
import ZoomOutIcon from './icons/ZoomOutIcon'
import { useNavigate } from 'react-router-dom'
import AnimatedButton from './AnimatedButton'
import ReturnIcon from './icons/ReturnIcon'

function TypoPage ({ activeModel, isLoaded }) {
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(0.65)
  const [isAnimationTriggered, setIsAnimationTriggered] = useState(false)
  const [isReverseAnimationTriggered, setIsReverseAnimationTriggered] =
    useState(false)
  const [stateView, setStateView] = useState([Math.PI / 2, 0, 0])

  const minZoom = 0.5
  const maxZoom = 0.75
  const zoomStep = 0.05

  useEffect(() => {
    const handleWheel = e => {
      e.preventDefault()
      if (e.deltaY < 0) {
        zoomIn()
      } else {
        zoomOut()
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  const rotateLeft = () => setRotation(prev => prev + Math.PI / 8)
  const rotateRight = () => setRotation(prev => prev - Math.PI / 8)
  const zoomIn = () => setZoom(prev => Math.min(prev + zoomStep, maxZoom))
  const zoomOut = () => setZoom(prev => Math.max(prev - zoomStep, minZoom))
  const navigate = useNavigate()

  const returnHome = () => {
    navigate('/')
  }

  const triggerAnimation = () => {
    setIsAnimationTriggered(true)
    setIsReverseAnimationTriggered(false)
  }

  const triggerReverseAnimation = () => {
    setIsReverseAnimationTriggered(true)
    setIsAnimationTriggered(false)
    setStateView([Math.PI / 2, 0, 0])
  }

  const toggleView = () => {
    const currentRotation = stateView[0]
    const newRotation =
      currentRotation === Math.PI / 2 ? Math.PI / 4 : Math.PI / 2
    setStateView([newRotation, 0, 0])
  }

  return (
    <div>
      <Canvas>
        <ambientLight intensity={7} />
        <Suspense fallback={null}>
          <Model
            targetRotation={rotation}
            targetScale={zoom}
            stateView={stateView}
            playAnimation={isAnimationTriggered}
            reverseAnimation={isReverseAnimationTriggered}
            environmentPath='/models/hdri/TypoB.jpg'
            object={activeModel.scene}
            animations={activeModel.animations}
          />
          <CameraController />
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
          <button onClick={triggerAnimation}>Vista 3d</button>
          {isAnimationTriggered && (
            <>
              <button onClick={toggleView}>Toggle View</button>
              <button onClick={triggerReverseAnimation}>
                Reverse Animation
              </button>
            </>
          )}
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
        <div className='typo-img'>
          <img src='/typologies images/TIPO-2-B.jpg' alt='Tipología 2-B' />
        </div>
      )}
    </div>
  )
}

export default TypoPage
