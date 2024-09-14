// import { Canvas } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
// import { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import HomePage from './HomePage'
import TypoB from './TypoB'

function DynamicModelViewer (models, isLoaded) {
  const { modelId } = useParams()
  const activeModel = models.models[modelId] || models.models.edificio

  if (activeModel === models.models.edificio) {
    return <HomePage models={models.models.edificio} isLoaded={isLoaded} />
  } else {
    return <TypoB activeModel={activeModel} isLoaded={isLoaded} />
  }
}

export default DynamicModelViewer
