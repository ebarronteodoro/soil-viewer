import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import GlobalRotateIcon from './icons/GlobalRotateIcon'
import ZoomInIcon from './icons/ZoomInIcon'
import ZoomOutIcon from './icons/ZoomOutIcon'
import { useNavigate, useParams } from 'react-router-dom'
import AnimatedButton from './AnimatedButton'
import FloorModel from './FloorModel'
import ReturnIcon from './icons/ReturnIcon'
import modelPaths from '../data/modelPaths'
import typologiesData from '../data/building.json'
import FloorCameraController from './FloorCameraController'
import { Environment } from '@react-three/drei'
import FocusIcon from './icons/FocusIcon'
import EyeIcon from './icons/EyeIcon'

function FloorPage ({ activeModel, isLoaded }) {
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(0.2)
  const [stateView, setStateView] = useState([Math.PI / 2, 0, 0])
  const [selectedObjectName, setSelectedObjectName] = useState('')
  const [selectedTypologyData, setSelectedTypologyData] = useState(null)
  const [resetSelection, setResetSelection] = useState(false)

  const [resetPosition, setResetPosition] = useState(false)
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 })

  const { modelId } = useParams()

  const minZoom = 0.15
  const maxZoom = 0.7
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

  const zoomIn = () => {
    setZoom(prev => {
      const newZoom = Math.min(prev + zoomStep, maxZoom)
      centerCamera()
      return newZoom
    })
  }

  const zoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - zoomStep, minZoom)
      centerCamera()
      return newZoom
    })
  }

  const navigate = useNavigate()
  const returnHome = () => {
    setTimeout(() => {
      navigate('/')
    }, 1)
  }

  const centerCamera = () => {
    setCurrentPosition({ x: 0, y: 0 })
  }

  const handleResetPosition = () => {
    setResetPosition(true)
    setTimeout(() => setResetPosition(false), 100)
  }

  const viewTypology = () => {
    if (selectedObjectName) {
      const baseTypology = selectedObjectName
        .replace('-parent', '')
        .replace('-aprent', '')
        .replace('tipo-', 't-')

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

  useEffect(() => {
    if (selectedObjectName) {
      const typologyId = parseInt(selectedObjectName.replace('tipo-', ''))
      const floorData = typologiesData[modelId] // Obtener datos del piso actual

      if (floorData) {
        const typologyData = floorData.find(t => t.tipologia === typologyId)
        setSelectedTypologyData(typologyData || null) // Guardar datos de la tipología seleccionada
      }
    } else {
      setSelectedTypologyData(null) // Limpiar si no hay selección
    }
  }, [selectedObjectName, modelId])

  // Obtener la ruta de la imagen de la tipología seleccionada
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
            position={[60, 30, 160]}
            intensity={2}
            castShadow
          />
          <FloorModel
            targetRotation={rotation}
            targetScale={zoom}
            stateView={stateView}
            object={activeModel.scene}
            setSelectedObjectName={setSelectedObjectName}
            resetSelection={resetSelection}
          />
          <Environment files='/models/hdri/TypoB.jpg' />
          <FloorCameraController zoom={zoom} resetPosition={resetPosition} />
        </Suspense>
      </Canvas>

      {isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '2rem',
            display: 'flex'
          }}
          className='left-section'
        >
          <button onClick={returnHome}>
            <ReturnIcon width='30px' height='30px' />
          </button>
          <span>{`${modelId.replace('planta_', 'PLANTA ')}`}</span>
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
          <AnimatedButton
            style={{ display: 'flex', border: 'none', background: 'none' }}
            onClick={handleResetPosition}
          >
            <FocusIcon width='30px' height='30px' />
          </AnimatedButton>
        </div>
      )}

      {isLoaded && (
        <span className='hook_content'>¡ELIGE TU TIPOLOGÍA PREFERIDA!</span>
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
          {isLoaded && selectedTypologyData && (
            <>
              <p>N°: {selectedTypologyData.numero}</p>
              <p>Habitaciones: {selectedTypologyData.habitaciones}</p>
              <p>Baños: {selectedTypologyData.banos}</p>
              <p>Área Total: {selectedTypologyData.areaTotal}</p>
              <p>Área Techada: {selectedTypologyData.areaTechada}</p>
              <p>Área Libre: {selectedTypologyData.areaLibre}</p>
            </>
          )}
          <button className='view-typo' onClick={viewTypology}>
            Ver Departamento <EyeIcon width="20px" height="20px" />
          </button>
        </aside>
      )}
    </div>
  )
}

export default FloorPage
