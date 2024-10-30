import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import TerrazaModel from './TerrazaModel';
import GlobalRotateIcon from './icons/GlobalRotateIcon';
import ZoomInIcon from './icons/ZoomInIcon';
import ZoomOutIcon from './icons/ZoomOutIcon';
import AnimatedButton from './AnimatedButton';

function CustomCameraControls({ cameraRef }) {
  const { camera } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [rotationAngles, setRotationAngles] = useState({ phi: 0, theta: 0 });
  const thetaMin = -Math.PI / 2.5; // Límite de ángulo hacia abajo
  const thetaMax = Math.PI / 2.5;  // Límite de ángulo hacia arriba
  const zoomMin = 5;               // Límite mínimo de zoom
  const zoomMax = 50;              // Límite máximo de zoom

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = (e.clientX - lastMousePosition.x) * -0.002;
    const deltaY = (e.clientY - lastMousePosition.y) * 0.002;

    setRotationAngles((prev) => ({
      phi: prev.phi + deltaX,
      theta: Math.max(thetaMin, Math.min(thetaMax, prev.theta + deltaY)),
    }));

    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleWheel = (e) => {
    camera.position.z -= e.deltaY * 0.01;
    camera.position.z = Math.max(zoomMin, Math.min(zoomMax, camera.position.z));
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isDragging, lastMousePosition]);

  useFrame(() => {
    camera.position.x = 20 * Math.sin(rotationAngles.phi) * Math.cos(rotationAngles.theta);
    camera.position.y = 20 * Math.sin(rotationAngles.theta);
    camera.position.z = 20 * Math.cos(rotationAngles.phi) * Math.cos(rotationAngles.theta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function TerrazaPage({ activeModel, isLoaded }) {
  const cameraRef = useRef();

  const handleRotateLeft = () => {
    cameraRef.current.position.x += 2;
  };

  const handleRotateRight = () => {
    cameraRef.current.position.x -= 2;
  };

  const handleZoomIn = () => {
    if (cameraRef.current.position.z > 5) {
      cameraRef.current.position.z -= 2; // Acerca el zoom
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current.position.z < 50) {
      cameraRef.current.position.z += 2; // Aleja el zoom
    }
  };

  return (
    <div>
      <Canvas shadows>
        <CustomCameraControls cameraRef={cameraRef} />
        <ambientLight intensity={1} />
        <directionalLight
          color='#fade85'
          position={[-20, 30, 20]}
          intensity={2}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-near={0.1}
          shadow-camera-far={100}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <Environment files='/models/hdri/typo.jpg' backgroundIntensity={0.4} />
        <Suspense fallback={null}>
          <TerrazaModel object={activeModel.scene} />
        </Suspense>
      </Canvas>

      {/* Botones de control */}
      <div className='menubar'>
        <AnimatedButton
          style={{ display: 'flex', border: 'none', background: 'none' }}
          onClick={handleRotateLeft}
        >
          <GlobalRotateIcon width='30px' height='30px' />
        </AnimatedButton>
        <AnimatedButton
          style={{
            display: 'flex',
            border: 'none',
            background: 'none',
            color: 'white'
          }}
          onClick={handleZoomOut}
        >
          <ZoomOutIcon width='30px' height='30px' />
        </AnimatedButton>
        <AnimatedButton
          style={{
            display: 'flex',
            border: 'none',
            background: 'none',
            color: 'white'
          }}
          onClick={handleZoomIn}
        >
          <ZoomInIcon width='30px' height='30px' />
        </AnimatedButton>
        <AnimatedButton
          style={{ display: 'flex', border: 'none', background: 'none' }}
          onClick={handleRotateRight}
        >
          <GlobalRotateIcon
            width='30px'
            height='30px'
            style={{ transform: 'scaleX(-1)' }}
          />
        </AnimatedButton>
      </div>
    </div>
  );
}

export default TerrazaPage;
