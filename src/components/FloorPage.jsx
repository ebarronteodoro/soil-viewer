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
import Text3D from './Text3D'
import NumbersPositions from '../data/NumbersPositions'

function FloorPage ({ activeModel, isLoaded }) {
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(40)
  const [modelLimits, setModelLimits] = useState(null)
  const [selectedObjectName, setSelectedObjectName] = useState('')
  const [selectedTypologyData, setSelectedTypologyData] = useState(null)
  const [resetSelection, setResetSelection] = useState(false)
  const [resetPosition, setResetPosition] = useState(false)

  const { modelId } = useParams()
  const navigate = useNavigate()

  const minZoom = 15
  const maxZoom = 50
  const zoomStep = 5

  const texts = NumbersPositions[`planta_${modelId.split('_')[1]}`] || []

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

  const zoomIn = () => setZoom(prev => Math.max(prev - zoomStep, minZoom))
  const zoomOut = () => setZoom(prev => Math.min(prev + zoomStep, maxZoom))

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
      const floorData = typologiesData[modelId]

      if (floorData) {
        const typologyData = floorData.find(t => t.tipologia === typologyId)
        setSelectedTypologyData(typologyData || null)
      }
    } else {
      setSelectedTypologyData(null)
    }
  }, [selectedObjectName, modelId])

  const getImagePath = () => {
    if (!selectedObjectName) return null
    const typologyNumber = selectedObjectName
      .replace('tipo-', '')
      .replace('-parent', '')
    return `/typologies images/TIPO-${typologyNumber}.jpg`
  }

  return (
    <div>
      <Canvas camera={{ fov: 15, position: [0, zoom, 0] }} shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={2.5} />
          <directionalLight
            color='#fade85'
            position={[-10, 30, 5]}
            intensity={1.5}
            scale={[2, 2, 2]}
            castShadow
            shadow-mapSize-width={8192}
            shadow-mapSize-height={8192}
            shadow-camera-near={1}
            shadow-camera-far={150}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          <FloorModel
            object={activeModel.scene}
            setSelectedObjectName={setSelectedObjectName}
            resetSelection={resetSelection}
            setModelLimits={setModelLimits}
          />
          <Environment files='/models/hdri/TypoB.jpg' />

          {texts.map(({ text, position, rotation }, index) => (
            <Text3D
              key={index}
              text={text}
              position={position}
              rotation={rotation}
              size={0.5}
              depth={0.2}
              color={0x033f35}
            />
          ))}

          <FloorCameraController
            zoom={zoom}
            resetPosition={resetPosition}
            modelLimits={modelLimits}
          />
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
            Ver Departamento <EyeIcon width='20px' height='20px' />
          </button>
        </aside>
      )}
    </div>
  )
}

export default FloorPage
