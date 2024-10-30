import { Suspense, lazy, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import modelPaths from '../data/modelPaths';
import TerrazaPage from './TerrazaPage';
import LobbyPage from './LobbyPage';

const HomePage = lazy(() => import('./HomePage'));
const TypoPage = lazy(() => import('./TypoPage'));
const FloorPage = lazy(() => import('./FloorPage'));

function DynamicModelViewer({
  models,
  isLoaded,
  isOpened,
  setIsOpened,
  setIsRouteModelLoaded,
  isButtonEnabled,
  instructionStep
}) {
  const { modelId } = useParams();

  useEffect(() => {
    if (isButtonEnabled && Object.keys(models).length > 0) {
      setIsRouteModelLoaded(true);
    }
  }, [isButtonEnabled, models, setIsRouteModelLoaded]);

  const floorModels = useMemo(() => {
    return new Set(
      Object.keys(modelPaths).filter(key => key.startsWith('planta_'))
    );
  }, []);

  const activeModel = useMemo(() => {
    return models[modelId] || models.edificio;
  }, [models, modelId]);

  const activeModels = useMemo(() => {
    // Si es planta_1, incluir ambos modelos, planta_1 y planta_2
    return modelId === 'planta_1' ? [models.planta_1, models.planta_2] : [activeModel];
  }, [modelId, models]);
  
  console.log(models);
  

  useEffect(() => {
    return () => {
      setIsOpened(false);
    };
  }, [setIsOpened]);

  const canvasKey = useMemo(() => `${modelId}-${Date.now()}`, [modelId]);

  if (!activeModel) {
    return <div>Cargando...</div>;
  }

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      {activeModel === models.edificio ? (
        <HomePage
          key={canvasKey}
          models={models.edificio}
          isLoaded={isLoaded}
          isOpened={isOpened}
          setIsOpened={setIsOpened}
          instructionStep={instructionStep}
        />
      ) : modelId === 'planta_1' ? ( // Condición específica para planta_1
        <LobbyPage
          key={canvasKey}
          activeModels={activeModels} // Pasamos ambos modelos a LobbyPage
          isLoaded={isLoaded}
        />
      ) : floorModels.has(modelId) ? (
        <FloorPage
          key={canvasKey}
          activeModel={activeModel}
          isLoaded={isLoaded}
        />
      ) : modelId === 'terraza' ? (
        <TerrazaPage
          key={canvasKey}
          activeModel={activeModel}
          isLoaded={isLoaded}
          activeTypology={modelId}
        />
      ) : (
        <TypoPage
          key={canvasKey}
          activeModel={activeModel}
          isLoaded={isLoaded}
          activeTypology={modelId}
        />
      )}
    </Suspense>
  );
}

export default DynamicModelViewer;
