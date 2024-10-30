import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import GlobalRotateIcon from './icons/GlobalRotateIcon'
import ZoomInIcon from './icons/ZoomInIcon'
import ZoomOutIcon from './icons/ZoomOutIcon'
import { useNavigate } from 'react-router-dom'
import AnimatedButton from './AnimatedButton'
import modelPaths from '../data/modelPaths'
import FloorCameraController from './FloorCameraController'
import LobbyModels from './LobbyModels'
import ReturnIcon from './icons/ReturnIcon'

function LobbyPage ({ activeModels, isLoaded }) {
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(0.15)
  const [stateView, setStateView] = useState([Math.PI / 2, 0, 0])
  const [selectedObjectName, setSelectedObjectName] = useState('')
  const [resetSelection, setResetSelection] = useState(false)
  const [currentFloor, setCurrentFloor] = useState(0) // Estado para la planta activa

  const minZoom = 0.1
  const maxZoom = 0.5
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
    setTimeout(() => {
      navigate('/')
    }, 1)
  }

  const viewTypology = () => {
    if (selectedObjectName) {
      const baseTypology = selectedObjectName
        .replace('tipo-', 't-')
        .replace('-parent', '')

      if (modelPaths[baseTypology]) {
        setTimeout(() => navigate(`/${baseTypology}`), 1)
      }
    }
    setResetSelection(true)
    setTimeout(() => setResetSelection(false), 100)
  }

  const toggleFloor = () => {
    setTimeout(() => {
      setCurrentFloor(prev => (prev === 0 ? 1 : 0))
      setResetSelection(false)
    }, 100)

    setResetSelection(true)
  }

  const getImagePath = () => {
    if (!selectedObjectName) return null

    const typologyNumber = selectedObjectName
      .replace('tipo-', '')
      .replace('-parent', '')
    const imagePath = `/typologies images/TIPO-${typologyNumber}.jpg`

    return imagePath
  }

  return (
    <div>
      <Canvas camera={{ fov: 15, position: [0, 0, 10] }} shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />

          <directionalLight
            color='#fade85'
            position={[60, 30, 180]}
            intensity={2}
            castShadow
          />

          <LobbyModels
            targetRotation={rotation}
            targetScale={zoom}
            stateView={stateView}
            objects={activeModels.map(model => model.scene)}
            currentFloor={currentFloor}
            setSelectedObjectName={setSelectedObjectName}
            resetSelection={resetSelection}
          />
          <FloorCameraController />
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
          <AnimatedButton onClick={returnHome}>
            <ReturnIcon width='30px' height='30px' />
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
        <aside
          className={`typo-selector ${selectedObjectName !== '' && 'active'}`}
        >
          {selectedObjectName && (
            <div className='typology-image'>
              <img
                src={getImagePath()}
                alt={`Tipología ${selectedObjectName}`}
              />
            </div>
          )}
          <h3>Piso Actual: {currentFloor === 0 ? 'Planta 1' : 'Planta 2'}</h3>
          <h2>Tipología:</h2>
          <span>{selectedObjectName}</span>
          <button className='view-typo' onClick={viewTypology}>
            Ver Tipología
          </button>
          <button onClick={toggleFloor}>
            Cambiar a {currentFloor === 0 ? 'Planta 2' : 'Planta 1'}
          </button>
        </aside>
      )}
    </div>
  )
}

export default LobbyPage
