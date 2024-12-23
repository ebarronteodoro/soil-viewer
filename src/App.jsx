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
import modelPaths from './data/modelPaths'
import * as THREE from 'three'

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

  useEffect(() => {
    const loadAllModels = async () => {
      const loader = new GLTFLoader()
      const modelPromises = Object.keys(modelPaths).map(
        modelName =>
          new Promise(resolve => {
            loader.load(
              modelPaths[modelName],
              gltf => {
                const totalProgress = Math.round(
                  (++progressRef.current / Object.keys(modelPaths).length) * 100
                )
                setLoadingProgress(totalProgress)
                if (totalProgress === 100) setIsRouteModelLoaded(true)

                gltf.scene.traverse(child => {
                  if (child.isMesh) {
                    if (modelName === 'edificio') {
                      child.material.metalness = 0.3
                      child.material.roughness = 0.2
                      child.castShadow = true
                      child.receiveShadow = true
                      // child.material.flatShading = true

                      // if (child.material.map) {
                      //   child.material.map.minFilter = THREE.NearestFilter // Reduce la interpolación
                      //   child.material.map.magFilter = THREE.LinearFilter
                      //   child.material.map.generateMipmaps = false // Desactiva mipmaps
                      //   child.material.map.anisotropy = 1 // Reduce la anisotropía para menos procesamiento
                        
                      //   const canvas = document.createElement('canvas')
                      //   const context = canvas.getContext('2d')
                      //   canvas.width = child.material.map.image.width / 2
                      //   canvas.height = child.material.map.image.height / 2
                      //   context.drawImage(child.material.map.image, 0, 0, canvas.width, canvas.height)
                      //   const lowResTexture = new THREE.CanvasTexture(canvas)
                      //   child.material.map = lowResTexture
                      // }
                    } else {
                      child.material.metalness = 0.5
                      child.material.roughness = 0.3
                      child.castShadow = true
                      child.receiveShadow = true
                    }
                  }
                })

                resolve({ name: modelName, gltf })
              },
              undefined,
              error => {
                console.error(`Error al cargar ${modelName}:`, error)
                resolve({ name: modelName, gltf: null })
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

  const modelExists = Object.keys(modelPaths).includes(modelId)

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
