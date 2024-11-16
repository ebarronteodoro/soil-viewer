import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ZoomInIcon from './icons/ZoomInIcon';
import ZoomOutIcon from './icons/ZoomOutIcon';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';
import modelPaths from '../data/modelPaths';
import typologiesData from '../data/building.json'; // Importa el JSON de datos
import FloorCameraController from './FloorCameraController';
import LobbyModels from './LobbyModels';
import ReturnIcon from './icons/ReturnIcon';

function LobbyPage({ activeModels, isLoaded }) {
  const [zoom, setZoom] = useState(0.2);
  const [stateView, setStateView] = useState([Math.PI / 2, 0, 0]);
  const [selectedObjectName, setSelectedObjectName] = useState('');
  const [selectedTypologyData, setSelectedTypologyData] = useState(null);
  const [resetSelection, setResetSelection] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(0);

  const minZoom = 15
  const maxZoom = 50
  const zoomStep = 5

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const zoomIn = () => setZoom((prev) => Math.min(prev + zoomStep, maxZoom));
  const zoomOut = () => setZoom((prev) => Math.max(prev - zoomStep, minZoom));

  const navigate = useNavigate();

  const returnHome = () => {
    setTimeout(() => {
      navigate('/');
    }, 1);
  };

  const viewTypology = () => {
    if (selectedObjectName) {
      const baseTypology = selectedObjectName.replace('tipo-', 't-').replace('-parent', '');

      if (modelPaths[baseTypology]) {
        setTimeout(() => navigate(`/${baseTypology}`), 1);
      }
    }
    setResetSelection(true);
    setTimeout(() => setResetSelection(false), 100);
  };

  const toggleFloor = () => {
    setTimeout(() => {
      setCurrentFloor((prev) => (prev === 0 ? 1 : 0));
      setResetSelection(false);
    }, 100);

    setResetSelection(true);
  };

  const getImagePath = () => {
    if (!selectedObjectName) return null;

    const typologyNumber = selectedObjectName.replace('tipo-', '').replace('-parent', '');
    return `/typologies images/TIPO-${typologyNumber}.jpg`;
  };

  // useEffect para actualizar los datos de tipología cada vez que cambia el objeto seleccionado o la planta
  useEffect(() => {
    if (selectedObjectName) {
      const typologyId = parseInt(selectedObjectName.replace('tipo-', ''));
      const floorData = typologiesData[currentFloor === 0 ? 'lobby' : 'planta_2'];

      console.log(floorData);

      if (floorData) {
        const typologyData = floorData.find((t) => t.tipologia === typologyId);
        setSelectedTypologyData(typologyData || null);
      }
    } else {
      setSelectedTypologyData(null); // Limpiar los datos si no hay selección
    }
  }, [selectedObjectName, currentFloor]);

  return (
    <div>
      <Canvas camera={{ fov: 15, position: [0, 15, 0] }} shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <directionalLight
            color="#fade85"
            position={[60, 30, 180]}
            intensity={2}
            castShadow
          />
          <LobbyModels
            targetScale={zoom}
            stateView={stateView}
            objects={activeModels}
            currentFloor={currentFloor}
            setSelectedObjectName={setSelectedObjectName}
            resetSelection={resetSelection}
          />
          <FloorCameraController stateView={stateView} />
        </Suspense>
      </Canvas>


      {isLoaded && (
        <div className='left-section'>
          <button type='button' title='Regresar' onClick={returnHome}>
            <ReturnIcon width='30px' height='30px' />
          </button>
          <span>{currentFloor === 0 ? 'Planta 1' : 'Planta 2'}</span>
        </div>
      )}

      <div className="menubar">
        <AnimatedButton style={{ display: 'flex', border: 'none', background: 'none', color: 'white' }} onClick={zoomOut}>
          <ZoomOutIcon width='30px' height='30px' />
        </AnimatedButton>
        <AnimatedButton style={{ display: 'flex', border: 'none', background: 'none', color: 'white' }} onClick={zoomIn}>
          <ZoomInIcon width='30px' height='30px' />
        </AnimatedButton>
      </div>

      {isLoaded && (
        <aside className={`typo-selector ${selectedObjectName !== '' && 'active'}`}>
          {selectedObjectName && (
            <div className="typology-image">
              <img src={`/typologies images/TIPO-${selectedObjectName.replace('tipo-', '')}.jpg`} alt={`Tipología ${selectedObjectName}`} />
            </div>
          )}
          <h2>Tipología:</h2>
          <span>{selectedObjectName}</span>
          {isLoaded && selectedTypologyData && (
            <>
              <h3>Detalles de Tipología</h3>
              <p>N°: {selectedTypologyData.numero}</p>
              <p>Área: {selectedTypologyData.areaTotal}</p>
              <p>Habitaciones: {selectedTypologyData.habitaciones}</p>
              <p>Baños: {selectedTypologyData.banos}</p>
            </>
          )}
          <button className="view-typo" onClick={viewTypology}>
            Ver Tipología
          </button>
          <button onClick={toggleFloor}>
            Cambiar a {currentFloor === 0 ? 'Planta 2' : 'Planta 1'}
          </button>
        </aside>
      )}
    </div>
  );
}

export default LobbyPage;