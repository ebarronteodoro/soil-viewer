import { useParams } from 'react-router-dom'
import HomePage from './HomePage'
import TypoB from './TypoB'

function DynamicModelViewer ({ models, isLoaded, setIsOpened }) {
  const { modelId } = useParams()
  const activeModel = models[modelId] || models.edificio

  if (activeModel === models.edificio) {
    return <HomePage models={models.edificio} isLoaded={isLoaded} setIsOpened={setIsOpened} />
  } else {
    return <TypoB activeModel={activeModel} isLoaded={isLoaded} />
  }
}

export default DynamicModelViewer
