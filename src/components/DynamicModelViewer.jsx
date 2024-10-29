import { Suspense, lazy, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import modelPaths from '../data/modelPaths'
import TerrazaPage from './TerrazaPage'

const HomePage = lazy(() => import('./HomePage'))
const TypoPage = lazy(() => import('./TypoPage'))
const FloorPage = lazy(() => import('./FloorPage'))

function DynamicModelViewer ({
  models,
  isLoaded,
  isOpened,
  setIsOpened,
  setIsRouteModelLoaded,
  isButtonEnabled,
  instructionStep
}) {
  const { modelId } = useParams()

  useEffect(() => {
    if (isButtonEnabled && Object.keys(models).length > 0) {
      setIsRouteModelLoaded(true)
    }
  }, [isButtonEnabled, models, setIsRouteModelLoaded])

  const floorModels = useMemo(() => {
    return new Set(
      Object.keys(modelPaths).filter(key => key.startsWith('planta_'))
    )
  }, [])

  const activeModel = useMemo(() => {
    return models[modelId] || models.edificio
  }, [models, modelId])

  useEffect(() => {
    return () => {
      setIsOpened(false)
    }
  }, [setIsOpened])

  const canvasKey = useMemo(() => `${modelId}-${Date.now()}`, [modelId])

  return activeModel === models.edificio ? (
    <HomePage
      key={canvasKey}
      models={models.edificio}
      isLoaded={isLoaded}
      isOpened={isOpened}
      setIsOpened={setIsOpened}
      instructionStep={instructionStep}
    />
  ) : floorModels.has(modelId) ? (
    <FloorPage key={canvasKey} activeModel={activeModel} isLoaded={isLoaded} />
  ) : modelId === 'terraza' ? (
    <TerrazaPage
      key={canvasKey}
      activeModel={activeModel}
      isLoaded={isLoaded}
      activeTypology={modelId}
    />
  ) : (
    <TypoPage
      key={canvasKey}
      activeModel={activeModel}
      isLoaded={isLoaded}
      activeTypology={modelId}
    />
  )
}

export default DynamicModelViewer
