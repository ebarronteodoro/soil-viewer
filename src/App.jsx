import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TypoA from './components/TypoA'
import TypoB from './components/TypoB'
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js'
import { useEffect, useState } from 'react'
import DynamicModelViewer from './components/DynamicModelViewer'
import PreloadModels from './components/PreloadModels'

function App () {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/')

  const [models, setModels] = useState({
    model1: null,
    model2: null,
    model3: null,
    model4: null,
    edificio: null
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadModels = async () => {
      const modelPaths = [
        '/models/draco_models/903.glb',
        '/models/draco_models/1901.glb',
        '/models/draco_models/1905.glb',
        '/models/draco_models/TERRAZA.glb',
        '/models/Edificio optimizado.glb'
      ]

      const loader = new GLTFLoader()
      loader.setDRACOLoader(dracoLoader)

      const modelPromises = modelPaths.map(path => {
        return new Promise(resolve => {
          loader.load(path, (gltf) => {
            gltf.scene.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
                child.material.metalness = 0.5
                child.material.roughness = 0.2
              }
            })
            resolve(gltf)
          })
        })
      })

      const [model1, model2, model3, model4, edificio] = await Promise.all(
        modelPromises
      )

      setModels({ model1, model2, model3, model4, edificio })
      setIsLoaded(true)
    }

    loadModels()
  }, [])

  return (
    <Router>
      <PreloadModels isLoaded={isLoaded} />
      {isLoaded &&
        (
          <Routes>
            <Route path='/:modelId' element={<DynamicModelViewer models={models} isLoaded={isLoaded} />} />
            <Route path='/' element={<DynamicModelViewer models={models} isLoaded={isLoaded} />} />
            <Route path='/tipo-a' element={<TypoA />} />
            <Route path='/tipo-b' element={<TypoB />} />
          </Routes>
        )}
    </Router>
  )
}

export default App
