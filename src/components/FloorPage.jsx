import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import CameraController from './CameraController'
import GlobalRotateIcon from './icons/GlobalRotateIcon'
import ZoomInIcon from './icons/ZoomInIcon'
import ZoomOutIcon from './icons/ZoomOutIcon'
import { useNavigate } from 'react-router-dom'
import AnimatedButton from './AnimatedButton'
import FloorModel from './FloorModel'

function FloorPage ({ activeModel, isLoaded }) {
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(0.34)
  const [stateView, setStateView] = useState([Math.PI / 2, 0, 0])

  const minZoom = 0.3
  const maxZoom = 0.5
  const zoomStep = 0.025

  // Maneja el evento del scroll del mouse para controlar el zoom
  useEffect(() => {
    const handleWheel = (e) => {
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

  // Funciones para manejar la rotación y el zoom
  const rotateLeft = () => setRotation((prev) => prev + Math.PI / 8)
  const rotateRight = () => setRotation((prev) => prev - Math.PI / 8)
  const zoomIn = () => setZoom((prev) => Math.min(prev + zoomStep, maxZoom))
  const zoomOut = () => setZoom((prev) => Math.max(prev - zoomStep, minZoom))

  const navigate = useNavigate()

  // Navegación de retorno a la página de inicio
  const returnHome = () => {
    navigate('/')
  }

  return (
    <div>
      <Canvas>
        <ambientLight intensity={7} />
        <Suspense fallback={null}>
          <FloorModel
            targetRotation={rotation} // Rotación basada en el estado actual
            targetScale={zoom}         // Escala basada en el estado actual
            stateView={stateView}       // Vista (rotación en el eje X)
            object={activeModel.scene}  // Modelo 3D
          />
          <CameraController />
        </Suspense>
      </Canvas>

      {/* Controles y botones para manejar el modelo */}
      {isLoaded && (
        <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '15px' }}>
          <button onClick={returnHome}>Volver</button>
        </div>
      )}
      
      {/* Barra de herramientas con botones de rotación y zoom */}
      {isLoaded && (
        <div className='menubar'>
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
        </div>
      )}
    </div>
  )
}

export default FloorPage
