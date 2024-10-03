import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams
} from 'react-router-dom'
import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import PreloadModels from './components/PreloadModels'
import InstructionsModal from './components/InstructionsModal'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import NotFound from './components/NotFound'

const DynamicModelViewer = lazy(() => import('./components/DynamicModelViewer'))

function App () {
  const [models, setModels] = useState({})
  const [isOpened, setIsOpened] = useState(false)
  const [isRouteModelLoaded, setIsRouteModelLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const [instructionStep, setInstructionStep] = useState(0)
  const [is404, setIs404] = useState(false)
  const progressRef = useRef(0)
  const isModalClosed = window.localStorage.getItem('InstructionsModalClosed')

  const modelPaths = [
    { name: 't903', path: '/models/draco_models/903.glb' },
    { name: 't1901', path: '/models/draco_models/1901.glb' },
    { name: 't1905', path: '/models/draco_models/1905.glb' },
    { name: 'terraza', path: '/models/draco_models/TERRAZA.glb' },
    { name: 'edificio', path: '/models/draco_models/ediificio2.glb' },
    { name: 'piso', path: '/models/draco_models/Floor.glb' }
  ]

  useEffect(() => {
    const loadAllModels = async () => {
      const loader = new GLTFLoader()
      const modelPromises = modelPaths.map(
        modelInfo =>
          new Promise(resolve => {
            loader.load(
              modelInfo.path,
              gltf => {
                const totalProgress = Math.round(
                  (++progressRef.current / modelPaths.length) * 100
                )
                setLoadingProgress(totalProgress)
                totalProgress === 100 && setIsRouteModelLoaded(true)

                gltf.scene.traverse(child => {
                  if (child.isMesh) {
                    child.material.metalness =
                      modelInfo.name === 'edificio' ? 0.5 : 0.6
                    child.material.roughness =
                      modelInfo.name === 'edificio' ? 0.3 : 0.2
                  }
                })

                resolve({ name: modelInfo.name, gltf })
              },
              undefined,
              error => {
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
    console.log(models)
  }, [])

  return (
    <Router>
      <Suspense fallback={<div>Cargando modelos...</div>}>
        <Routes>
          <Route
            path='/:modelId'
            element={
              <ModelViewerWrapper
                models={models}
                isRouteModelLoaded={isRouteModelLoaded}
                setIsRouteModelLoaded={setIsRouteModelLoaded}
                isOpened={isOpened}
                setIsOpened={setIsOpened}
                setInstructionStep={setInstructionStep}
                modelPaths={modelPaths}
                setIs404={setIs404}
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
          <Route path='*' element={<NotFound setIs404={setIs404} />} />
        </Routes>
      </Suspense>

      {!is404 && (
        <>
          <PreloadModels
            loadingProgress={loadingProgress}
            isOpened={isOpened}
            setIsOpened={setIsOpened}
            isModalClosed={isModalClosed}
            isRouteModelLoaded={isRouteModelLoaded}
            isButtonEnabled={isButtonEnabled}
          />
          {isOpened === true && (
            <InstructionsModal
              isOpened={isOpened}
              setIsOpened={setIsOpened}
              setInstructionStep={setInstructionStep}
            />
          )}
        </>
      )}
    </Router>
  )
}

function ModelViewerWrapper ({
  models,
  isRouteModelLoaded,
  setIsRouteModelLoaded,
  isOpened,
  setIsOpened,
  setInstructionStep,
  modelPaths,
  setIs404
}) {
  const { modelId } = useParams()

  const modelExists = modelPaths.some(model => model.name === modelId)

  useEffect(() => {
    setIs404(!modelExists)
  }, [modelExists, setIs404])

  return modelExists ? (
    <DynamicModelViewer
      models={models}
      isLoaded={isRouteModelLoaded}
      setIsOpened={setIsOpened}
      isOpened={isOpened}
      setIsRouteModelLoaded={setIsRouteModelLoaded}
      isButtonEnabled={true}
      instructionStep={setInstructionStep}
    />
  ) : (
    <NotFound />
  )
}

export default App
