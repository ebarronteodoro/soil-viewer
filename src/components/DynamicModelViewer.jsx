import { Suspense, lazy, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

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

  const floorModels = useMemo(
    () => new Set(['piso1', 'piso2', 'piso3', 'piso4', 'piso7', 'terraza']),
    []
  )

  const activeModel = useMemo(() => {
    return models[modelId] || models.edificio
  }, [models, modelId])

  useEffect(() => {
    return () => {
      setIsOpened(false)
    }
  }, [setIsOpened])

  const canvasKey = useMemo(() => `${modelId}-${Date.now()}`, [modelId])

  if (!activeModel) {
    return <div>Cargando...</div>
  }

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      {activeModel === models.edificio ? (
        <HomePage
          key={canvasKey}
          models={models.edificio}
          isLoaded={isLoaded}
          isOpened={isOpened}
          setIsOpened={setIsOpened}
          instructionStep={instructionStep}
        />
      ) : floorModels.has(modelId) ? (
        <FloorPage
          key={canvasKey}
          activeModel={activeModel}
          isLoaded={isLoaded}
        />
      ) : (
        <TypoPage
          key={canvasKey}
          activeModel={activeModel}
          isLoaded={isLoaded}
          activeTypology={modelId}
        />
      )}
    </Suspense>
  )
}

export default DynamicModelViewer
