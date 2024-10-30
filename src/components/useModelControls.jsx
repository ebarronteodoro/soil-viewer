// useModelControls.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useModelControls = () => {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(0.65);
  const [stateView, setStateView] = useState([Math.PI / 2, 0, 0]);
  const navigate = useNavigate();

  const minZoom = 0.5;
  const maxZoom = 0.75;
  const zoomStep = 0.05;

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const rotateLeft = () => setRotation((prev) => prev + Math.PI / 8);
  const rotateRight = () => setRotation((prev) => prev - Math.PI / 8);
  const zoomIn = () => setZoom((prev) => Math.min(prev + zoomStep, maxZoom));
  const zoomOut = () => setZoom((prev) => Math.max(prev - zoomStep, minZoom));

  const returnHome = () => {
    navigate('/');
  };

  return {
    rotation,
    zoom,
    stateView,
    rotateLeft,
    rotateRight,
    zoomIn,
    zoomOut,
    returnHome,
  };
};

export default useModelControls;
