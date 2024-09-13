import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useParams } from 'react-router-dom'
import { Suspense } from 'react'
import HomePage from './HomePage'

function DynamicModelViewer (models, isLoaded) {
  const { modelId } = useParams()
  const activeModel = models.models[modelId] || models.models.edificio

  console.log(activeModel === models.models.edificio)

  return (
    <>
      {activeModel === models.models.edificio
        ? (
          <HomePage models={models.models.edificio} isLoaded={isLoaded} />
          )
        : (
          <div style={{ height: '100vh', width: '100dvw' }}>
            <Canvas>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={0.7} />
              <OrbitControls enablePan enableZoom enableRotate />
              <Suspense fallback={null}>
                <primitive object={activeModel.scene} />
              </Suspense>
            </Canvas>
          </div>
          )}
    </>

  )
}

export default DynamicModelViewer
