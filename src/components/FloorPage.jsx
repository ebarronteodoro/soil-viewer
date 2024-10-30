import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import GlobalRotateIcon from './icons/GlobalRotateIcon'
import ZoomInIcon from './icons/ZoomInIcon'
import ZoomOutIcon from './icons/ZoomOutIcon'
import { useNavigate } from 'react-router-dom'
import AnimatedButton from './AnimatedButton'
import FloorModel from './FloorModel'
import ReturnIcon from './icons/ReturnIcon'
import modelPaths from '../data/modelPaths'
import FloorCameraController from './FloorCameraController'
import { Environment } from '@react-three/drei'

function FloorPage ({ activeModel, isLoaded }) {
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(0.15)
  const [stateView, setStateView] = useState([Math.PI / 2, 0, 0])
  const [selectedObjectName, setSelectedObjectName] = useState('')
  const [resetSelection, setResetSelection] = useState(false)

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
        .replace('-parent', '')
        .replace('-aprent', '')
        .replace('tipo-', 't-')

      console.log(baseTypology)

      if (modelPaths[baseTypology]) {
        setTimeout(() => {
          navigate(`/${baseTypology}`)
        }, 1)
      } else {
        console.log(`No se encontró una ruta para ${selectedObjectName}`)
      }
    }

    setResetSelection(true)
    setTimeout(() => setResetSelection(false), 100)
  }

  // Obtener la ruta de la imagen de la tipología seleccionada
  const getImagePath = () => {
    if (!selectedObjectName) return null

    // Extraer el número de la tipología y construir la ruta de imagen
    const typologyNumber = selectedObjectName
      .replace('tipo-', '')
      .replace('-parent', '')
    const imagePath = `/typologies images/TIPO-${typologyNumber}.jpg`

    return imagePath
  }

  return (
    <div>
      <Canvas camera={{ fov: 15, position: [0, 0, 10] }} shadows>
        <ambientLight intensity={1.5} />
        <directionalLight
          color='#fade85'
          position={[60, 30, 160]}
          intensity={2}
          castShadow
        />
        <Suspense fallback={null}>
          <FloorModel
            targetRotation={rotation}
            targetScale={zoom}
            stateView={stateView}
            object={activeModel.scene}
            setSelectedObjectName={setSelectedObjectName}
            resetSelection={resetSelection}
          />
          <Environment files='/models/hdri/TypoB.jpg' />
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
            <picture className='typology-image'>
              <img
                src={getImagePath()}
                alt={`Tipología ${selectedObjectName}`}
              />
            </picture>
          )}
          <h2>Tipología:</h2>
          <span>{selectedObjectName}</span>
          <button className='view-typo' onClick={viewTypology}>
            Ver Tipología
          </button>
        </aside>
      )}
    </div>
  )
}

export default FloorPage
