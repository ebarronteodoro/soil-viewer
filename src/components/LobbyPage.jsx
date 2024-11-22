// LobbyPage.js
import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import GlobalRotateIcon from './icons/GlobalRotateIcon'
import ZoomInIcon from './icons/ZoomInIcon'
import ZoomOutIcon from './icons/ZoomOutIcon'
import { useNavigate } from 'react-router-dom'
import AnimatedButton from './AnimatedButton'
import modelPaths from '../data/modelPaths'
import typologiesData from '../data/building.json' // Importa el JSON de datos
import FloorCameraController from './FloorCameraController'
import LobbyModels from './LobbyModels'
import ReturnIcon from './icons/ReturnIcon'
import { OrbitControls } from '@react-three/drei'
import EyeIcon from './icons/EyeIcon'

function LobbyPage ({ activeModels, isLoaded }) {
  const [zoom, setZoom] = useState(40)
  const [stateView, setStateView] = useState([0, 0, 0])
  const [selectedObjectName, setSelectedObjectName] = useState('')
  const [selectedTypologyData, setSelectedTypologyData] = useState(null)
  const [resetSelection, setResetSelection] = useState(false)
  const [currentFloor, setCurrentFloor] = useState(0)
  const [modelLimits, setModelLimits] = useState(null)
  const [resetPosition, setResetPosition] = useState(false)

  const navigate = useNavigate()

  const minZoom = 15
  const maxZoom = 50
  const zoomStep = 5

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

  // const rotateLeft = () => setRotation((prev) => prev + Math.PI / 8);
  // const rotateRight = () => setRotation((prev) => prev - Math.PI / 8);
  const zoomIn = () => setZoom(prev => Math.max(prev - zoomStep, minZoom))
  const zoomOut = () => setZoom(prev => Math.min(prev + zoomStep, maxZoom))

  const returnHome = () => {
    setTimeout(() => {
      navigate('/')
    }, 1)
    setResetSelection(true)
    setTimeout(() => setResetSelection(false), 100)
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
    return `/typologies images/TIPO-${typologyNumber}.jpg`
  }

  // useEffect para actualizar los datos de tipología cada vez que cambia el objeto seleccionado o la planta
  useEffect(() => {
    if (selectedObjectName) {
      const typologyId = parseInt(selectedObjectName.replace('tipo-', ''))
      const floorData =
        typologiesData[currentFloor === 0 ? 'lobby' : 'planta_2']

      console.log(floorData)

      if (floorData) {
        const typologyData = floorData.find(t => t.tipologia === typologyId)
        setSelectedTypologyData(typologyData || null)
      }
    } else {
      setSelectedTypologyData(null)
    }
  }, [selectedObjectName, currentFloor])

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
          <LobbyModels
            objects={activeModels.map(model => model.scene)}
            setSelectedObjectName={setSelectedObjectName}
            resetSelection={resetSelection}
            setModelLimits={setModelLimits}
            currentFloor={currentFloor}
          />
          <FloorCameraController
            zoom={zoom}
            resetPosition={resetPosition}
            modelLimits={modelLimits}
          />
          {/* <OrbitControls /> */}
        </Suspense>
      </Canvas>

      {isLoaded && (
        <div className='left-section'>
          <button type='button' title='Regresar' onClick={returnHome}>
            <ReturnIcon width='30px' height='30px' />
          </button>
          <span>{currentFloor === 0 ? 'Planta 1' : 'Planta 2'}</span>
        </div>
      )}

      {isLoaded && (
        <div className='menubar'>
          {/* <AnimatedButton style={{ display: 'flex', border: 'none', background: 'none' }} onClick={rotateLeft}>
            <GlobalRotateIcon width='30px' height='30px' />
          </AnimatedButton> */}
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
          {/* <AnimatedButton style={{ display: 'flex', border: 'none', background: 'none' }} onClick={rotateRight}>
            <GlobalRotateIcon width='30px' height='30px' style={{ transform: 'scaleX(-1)' }} />
          </AnimatedButton> */}
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
          <button onClick={toggleFloor}>
            Cambiar a {currentFloor === 0 ? 'Planta 2' : 'Planta 1'}
          </button>
        </aside>
      )}
    </div>
  )
}

export default LobbyPage
