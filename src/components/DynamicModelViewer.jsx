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

  // Limpia el canvas al desmontar el componente para evitar múltiples renderizaciones
  useEffect(() => {
    return () => {
      setIsOpened(false) // Limpia cualquier estado relacionado con el canvas o el modelo 3D
    }
  }, [setIsOpened])

  // Crear un key dinámico basado en el modelo activo para forzar el reset del canvas
  const canvasKey = useMemo(() => `${modelId}-${Date.now()}`, [modelId])

  if (!activeModel) {
    return <div>Cargando...</div>
  }

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      {activeModel === models.edificio ? (
        <HomePage
          key={canvasKey} // Forzamos un nuevo render del canvas al cambiar la ruta
          models={models.edificio}
          isLoaded={isLoaded}
          isOpened={isOpened}
          setIsOpened={setIsOpened}
          instructionStep={instructionStep}
        />
      ) : floorModels.has(modelId) ? (
        <FloorPage
          key={canvasKey} // Forzamos un nuevo render del canvas al cambiar la ruta
          activeModel={activeModel}
          isLoaded={isLoaded}
        />
      ) : (
        <TypoPage
          key={canvasKey} // Forzamos un nuevo render del canvas al cambiar la ruta
          activeModel={activeModel}
          isLoaded={isLoaded}
          activeTypology={modelId}
        />
      )}
    </Suspense>
  )
}

export default DynamicModelViewer
