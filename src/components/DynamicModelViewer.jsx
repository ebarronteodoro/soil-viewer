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

  console.log(models);
  console.log(isButtonEnabled && models && Object.keys(models).length > 0);
  console.log(isLoaded);
  

  useEffect(() => {
    if (isButtonEnabled && Object.keys(models).length > 0) {
      setIsRouteModelLoaded(true)
    }
  }, [isButtonEnabled])

  const activeModel = useMemo(() => {
    return models[modelId] || models.edificio
  }, [models, modelId])

  if (!activeModel) {
    return <div>Cargando...</div>
  }

  console.log(activeModel)

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      {activeModel === models.edificio ? (
        <HomePage
          models={models.edificio}
          isLoaded={isLoaded}
          isOpened={isOpened}
          setIsOpened={setIsOpened}
          instructionStep={instructionStep}
        />
      ) : activeModel === models.piso ? (
        <FloorPage activeModel={activeModel} isLoaded={isLoaded} />
      ) : (
        <TypoPage activeModel={activeModel} isLoaded={isLoaded} />
      )}
    </Suspense>
  )
}

export default DynamicModelViewer
