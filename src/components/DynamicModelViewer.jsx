import { Suspense, lazy, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

const HomePage = lazy(() => import('./HomePage'))
const TypoB = lazy(() => import('./TypoB'))

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
    if (isButtonEnabled && models && Object.keys(models).length > 0) {
      setIsRouteModelLoaded(true)
    }
  }, [isButtonEnabled])

  const activeModel = useMemo(() => {
    return models[modelId] || models.edificio
  }, [models, modelId])

  if (!activeModel) {
    return <div>Cargando...</div>
  }

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      {activeModel === models.edificio
        ? (
          <HomePage
            models={models.edificio}
            isLoaded={isLoaded}
            isOpened={isOpened}
            setIsOpened={setIsOpened}
            instructionStep={instructionStep}
          />
          )
        : (
          <TypoB activeModel={activeModel} isLoaded={isLoaded} />
          )}
    </Suspense>
  )
}

export default DynamicModelViewer
