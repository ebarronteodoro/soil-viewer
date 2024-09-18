import { useParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import HomePage from './HomePage'
import TypoB from './TypoB'

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

  return activeModel === models.edificio
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
      )
}

export default DynamicModelViewer
