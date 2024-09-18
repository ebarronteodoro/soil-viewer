import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useState, useRef, useEffect, useMemo } from 'react'
import DynamicModelViewer from './components/DynamicModelViewer'
import PreloadModels from './components/PreloadModels'
import InstructionsModal from './components/InstructionsModal'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function App () {
  const dracoLoader = useMemo(() => {
    const loader = new DRACOLoader()
    loader.setDecoderPath('/draco/')
    return loader
  }, [])

  const [models, setModels] = useState({})
  const [isOpened, setIsOpened] = useState(false)
  const [isRouteModelLoaded, setIsRouteModelLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const [instructionStep, setInstructionStep] = useState(0)
  const progressRef = useRef(0)
  const isModalClosed = window.localStorage.getItem('InstructionsModalClosed')

  useEffect(() => {
    const loadAllModels = async () => {
      const modelPaths = [
        { name: 't903', path: '/models/draco_models/903.glb' },
        { name: 't1901', path: '/models/draco_models/1901.glb' },
        { name: 't1905', path: '/models/draco_models/1905.glb' },
        { name: 'terraza', path: '/models/draco_models/TERRAZA.glb' },
        { name: 'edificio', path: '/models/edficio_mil_objetos.glb' }
      ]

      const loader = new GLTFLoader()
      loader.setDRACOLoader(dracoLoader)

      const modelPromises = modelPaths.map(
        (modelInfo) =>
          new Promise((resolve) => {
            loader.load(
              modelInfo.path,
              (gltf) => {
                const totalProgress = Math.round(
                  (++progressRef.current / modelPaths.length) * 100
                )
                setLoadingProgress(totalProgress)

                gltf.scene.traverse((child) => {
                  if (child.isMesh) {
                    if (modelInfo.name === 'edificio') {
                      child.material.metalness = 0.3
                      child.material.roughness = 0.3
                    } else {
                      child.material.metalness = 0.6
                      child.material.roughness = 0.2
                    }
                  }
                })

                resolve({ name: modelInfo.name, gltf })
              },
              undefined,
              (error) => {
                console.error(`Error al cargar ${modelInfo.name}:`, error)
                resolve({ name: modelInfo.name, gltf: null })
              }
            )
          })
      )

      const loadedModels = await Promise.all(modelPromises)
      const newModels = loadedModels.reduce((acc, { name, gltf }) => {
        acc[name] = gltf
        return acc
      }, {})

      setModels(newModels)
      setIsButtonEnabled(true)
    }

    loadAllModels()
  }, [])

  return (
    <Router>
      <Routes>
        <Route
          path='/:modelId'
          element={
            <DynamicModelViewer
              models={models}
              isLoaded={isRouteModelLoaded}
              isOpened={isOpened}
              setIsOpened={setIsOpened}
              setIsRouteModelLoaded={setIsRouteModelLoaded}
              isButtonEnabled={isButtonEnabled}
              instructionStep={instructionStep}
            />
          }
        />
        <Route
          path='/'
          element={
            <DynamicModelViewer
              models={models}
              isLoaded={isRouteModelLoaded}
              isOpened={isOpened}
              setIsOpened={setIsOpened}
              setIsRouteModelLoaded={setIsRouteModelLoaded}
              isButtonEnabled={isButtonEnabled}
              instructionStep={instructionStep}
            />
          }
        />
      </Routes>
      <PreloadModels
        loadingProgress={loadingProgress}
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        isModalClosed={isModalClosed}
        isRouteModelLoaded={isRouteModelLoaded}
        isButtonEnabled={isButtonEnabled}
      />
      {isOpened === true && (
        <InstructionsModal isOpened={isOpened} setIsOpened={setIsOpened} setInstructionStep={setInstructionStep} />
      )}
    </Router>
  )
}

export default App
