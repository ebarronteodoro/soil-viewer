import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
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

  // Efecto para monitorear el ciclo de vida del componente
  useEffect(() => {
    console.log("DynamicModelViewer montado");
    return () => {
      console.log("DynamicModelViewer desmontado");
    };
  }, []);

  // Efecto para actualizar el estado de carga cuando los modelos y el botón están habilitados
  useEffect(() => {
    if (isButtonEnabled && models && Object.keys(models).length > 0) {
      console.log("Modelos disponibles y botón habilitado");
      setIsRouteModelLoaded(true);
    }
  }, [isButtonEnabled, models, setIsRouteModelLoaded]);

  // Usamos useMemo para evitar cálculos innecesarios si los modelos no cambian
  const activeModel = useMemo(() => {
    return models[modelId] || models.edificio;
  }, [models, modelId]);

  // Condicional para mostrar un indicador de carga si el modelo no está disponible aún
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
