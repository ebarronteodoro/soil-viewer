import { useParams } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./HomePage";
import TypoB from "./TypoB";

function DynamicModelViewer({
  models,
  isLoaded,
  setIsOpened,
  dracoLoader,
  setLoadingProgress,
  setIsRouteModelLoaded,
  isButtonEnabled,
}) {
  const { modelId } = useParams();

  useEffect(() => {
    if (isButtonEnabled) {
      setIsRouteModelLoaded(true);
    }
  }, [isButtonEnabled, setIsRouteModelLoaded]);

  const activeModel = models[modelId] || models.edificio;

  if (!activeModel) {
    return <div>Loading...</div>;
  }

  return activeModel === models.edificio ? (
    <HomePage
      models={models.edificio}
      isLoaded={isLoaded}
      setIsOpened={setIsOpened}
    />
  ) : (
    <TypoB activeModel={activeModel} isLoaded={isLoaded} />
  );
}

export default DynamicModelViewer;
