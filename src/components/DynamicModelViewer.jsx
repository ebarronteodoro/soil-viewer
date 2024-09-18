import { useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
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
  const [isModelLoading, setIsModelLoading] = useState(true)

  // Efecto para indicar que los modelos están listos y el botón habilitado
  useEffect(() => {
    if (isButtonEnabled && models && Object.keys(models).length > 0) {
      setIsRouteModelLoaded(true)
      setIsModelLoading(false)
    }
  }, [isButtonEnabled, models, setIsRouteModelLoaded])

  // Verificación y memoización del modelo activo
  const activeModel = useMemo(() => {
    if (!models || Object.keys(models).length === 0) return null
    return models[modelId] || models.edificio
  }, [models, modelId])

  // Si el modelo sigue cargando, muestra el indicador de carga
  if (isModelLoading) {
    return <div>Cargando...</div>
  }

  // Mostrar un mensaje de error detallado si el modelo no se encuentra
  if (!activeModel) {
    console.error(`Error: No se pudo encontrar el modelo con id: ${modelId}`)
    console.log('Modelos disponibles:', Object.keys(models))
    return (
      <div>
        Error al cargar el modelo.
        <br />
        {`No se pudo encontrar el modelo con id: ${modelId}.`}
        <br />
        {`Modelos disponibles: ${Object.keys(models).join(', ')}`}
      </div>
    )
  }

  // Renderiza el modelo adecuado según el tipo
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
