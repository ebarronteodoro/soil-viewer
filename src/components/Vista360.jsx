import React from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader' // Importar RGBELoader
import * as THREE from 'three'

const Vista360 = () => {
  // Cargar el archivo HDR con RGBELoader
  const texture = useLoader(RGBELoader, '/models/hdri/untitled.hdr')

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <Environment background map={texture} />
      <mesh>
        <sphereGeometry args={[100, 100, 100]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
    </Canvas>
  )
}

export default Vista360
