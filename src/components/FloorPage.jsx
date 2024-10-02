import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import CameraController from './CameraController'
import GlobalRotateIcon from './icons/GlobalRotateIcon'
import ZoomInIcon from './icons/ZoomInIcon'
import ZoomOutIcon from './icons/ZoomOutIcon'
import { useNavigate } from 'react-router-dom'
import AnimatedButton from './AnimatedButton'
import FloorModel from './FloorModel'
import ReturnIcon from './icons/ReturnIcon'

function FloorPage ({ activeModel, isLoaded }) {
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(0.34)
  const [stateView, setStateView] = useState([Math.PI / 2, 0, 0])
  const [selectedObjectName, setSelectedObjectName] = useState('')

  const minZoom = 0.3
  const maxZoom = 0.5
  const zoomStep = 0.025

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

  return (
    <div>
      <Canvas shadows>
        <ambientLight intensity={5} />
        <Suspense fallback={null}>
          <FloorModel
            targetRotation={rotation}
            targetScale={zoom}
            stateView={stateView}
            object={activeModel.scene}
            setSelectedObjectName={setSelectedObjectName}
          />
          <CameraController />
        </Suspense>
      </Canvas>

      {isLoaded && (
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '2rem',
            display: 'flex'
          }}
        >
          <AnimatedButton onClick={returnHome}><ReturnIcon width='30px' height='30px' /></AnimatedButton>
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
        <aside
          className={`typo-selector ${selectedObjectName !== '' && 'active'}`}
        >
          <h2>Tipología:</h2>
          <span>{selectedObjectName}</span>
        </aside>
      )}
    </div>
  )
}

export default FloorPage
