import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import TerrazaModel from './TerrazaModel'
import GlobalRotateIcon from './icons/GlobalRotateIcon'
import ZoomInIcon from './icons/ZoomInIcon'
import ZoomOutIcon from './icons/ZoomOutIcon'
import AnimatedButton from './AnimatedButton'
import TerrazaCameraController from './TerrazaCameraController'
import ReturnIcon from './icons/ReturnIcon'
import { useNavigate } from 'react-router-dom'

function TerrazaPage ({ activeModel, isLoaded }) {
  const cameraRef = useRef()
  const [zoom, setZoom] = useState(70)
  const [zoom2, setZoom2] = useState(0.4)
  const [rotateFront, setRotateFront] = useState(false)
  const navigate = useNavigate()

  const minZoom = 15
  const maxZoom = 85
  const zoomStep = 5

  // Controla la rotación hacia la izquierda
  const handleRotateLeft = () => {
    cameraRef.current.position.x += 2
  }

  // Controla la rotación hacia la derecha
  const handleRotateRight = () => {
    cameraRef.current.position.x -= 2
  }

  // Zoom con el scroll
  const handleWheel = e => {
    e.preventDefault()
    if (rotateFront) {
      // Zoom para el estado de rotación front
      if (e.deltaY < 0) {
        setZoom2(prev => Math.min(Math.max(prev + 0.1, 0.3), 1.2))
      } else {
        setZoom2(prev => Math.min(Math.max(prev - 0.1, 0.3), 1.2))
      }
    } else {
      // Zoom normal
      if (e.deltaY < 0) {
        setZoom(prev => Math.max(prev - zoomStep, minZoom)) // Acerca zoom
      } else {
        setZoom(prev => Math.min(prev + zoomStep, maxZoom)) // Aleja zoom
      }
    }
  }

  // Maneja el zoom con los botones
  const zoomIn = () => {
    if (rotateFront) {
      setZoom2(prev => Math.min(Math.max(prev + 0.1, 0.3), 1.2))
    } else {
      setZoom(prev => Math.max(prev - zoomStep, minZoom)) // Acerca zoom
    }
  }

  const zoomOut = () => {
    if (rotateFront) {
      // setZoom2(prev => Math.min(prev - 0.1, 0.3))
      setZoom2(prev => Math.min(Math.max(prev - 0.1, 0.3), 1.2))
    } else {
      setZoom(prev => Math.min(prev + zoomStep, maxZoom)) // Aleja zoom
    }
  }

  useEffect(() => {
    console.log(zoom2)
  }, [zoom2])

  // Cambia el estado de rotación
  const handleToggleRotateFront = () => {
    setRotateFront(prev => !prev)
    rotateFront === true ? setZoom(70) : setZoom2(0.4)
  }

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [rotateFront])

  return (
    <div>
      <Canvas camera={{ fov: 15, position: [0, zoom, 0] }} shadows>
        <ambientLight intensity={1} />
        <directionalLight
          color='#fade85'
          position={[-20, 30, 20]}
          intensity={2}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-near={0.1}
          shadow-camera-far={100}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <Environment files='/models/hdri/typo.jpg' backgroundIntensity={0.4} />
        <Suspense fallback={null}>
          <TerrazaModel object={activeModel.scene} />
        </Suspense>
        <TerrazaCameraController
          zoom={zoom}
          rotateFront={rotateFront}
          zoom2={zoom2}
        />
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
          <button onClick={() => navigate('/')}>
            <ReturnIcon width='30px' height='30px' />
          </button>
        </div>
      )}

      <div className='menubar'>
        <AnimatedButton
          style={{ display: 'flex', border: 'none', background: 'none' }}
          onClick={handleRotateLeft}
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
          onClick={handleRotateRight}
        >
          <GlobalRotateIcon
            width='30px'
            height='30px'
            style={{ transform: 'scaleX(-1)' }}
          />
        </AnimatedButton>
        <button onClick={handleToggleRotateFront}>Toggle Rotate Front</button>
      </div>
    </div>
  )
}

export default TerrazaPage
