import { Suspense, lazy, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    if (isButtonEnabled && Object.keys(models).length > 0) {
      setIsRouteModelLoaded(true);
    }
  }, [isButtonEnabled, models, setIsRouteModelLoaded]);

  useEffect(() => {
    if (modelId === 'planta_2') {
      navigate('/lobby');
    }
  }, [modelId, navigate]);

  const floorModels = useMemo(() => {
    return new Set(
      Object.keys(modelPaths).filter(key => key.startsWith('planta_'))
    );
  }, []);

  const activeModel = useMemo(() => {
    return models[modelId] || models.edificio;
  }, [models, modelId]);

  const activeModels = useMemo(() => {
    return modelId === 'lobby' ? [models.lobby, models.planta_2] : [activeModel];
  }, [modelId, models]);

  useEffect(() => {
    return () => {
      setIsOpened(false);
    };
  }, [setIsOpened]);

  useEffect(() => {
    
    if (modelId && modelId.startsWith('t-')) {
      document.body.style.backgroundImage = "url('/models/hdri/typo.jpg')";
    } else {
      document.body.style.backgroundImage = 'none';
    }

    return () => {
      document.body.style.backgroundImage = 'none';
    };
  }, [modelId]);

  const canvasKey = useMemo(() => `${modelId}-${Date.now()}`, [modelId]);

  if (!activeModel) {
    return <div>Cargando...</div>;
  }

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      {activeModel === models.edificio ? (
        <HomePage
          key={canvasKey}
          models={activeModel}
          isLoaded={isLoaded}
          isOpened={isOpened}
          setIsOpened={setIsOpened}
          instructionStep={instructionStep}
        />
      ) : modelId === 'lobby' ? (
        <LobbyPage
          key={canvasKey}
          activeModels={activeModels}
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
