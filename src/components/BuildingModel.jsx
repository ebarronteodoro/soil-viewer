import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

const Floors = ({ floorPositions, activeMeshIndex, handleClick }) => {
  return (
    <>
      {floorPositions.map((floor, index) => {
        const yOffset =
          floorPositions
            .slice(0, index)
            .reduce((acc, currentFloor) => acc + currentFloor.args[1], 4.925)

        return (
          
          <mesh
            key={index}
            position={[floor.position[0], yOffset, floor.position[2]]}
            rotation={floor.rotation}
            onClick={(e) => {
              e.stopPropagation()
              handleClick(index)
              
            }}
          >
            <boxGeometry args={floor.args} />
            <meshStandardMaterial
              color={activeMeshIndex === index ? '#033f35' : '#ffffff'}
              transparent
              opacity={activeMeshIndex === index ? 0.5 : 0}
            />
          </mesh>
        )
      })}
    </>
  )
}

const BuildingModel = (props) => {
  const { scene } = useGLTF('/models/EDIFICIO/edificio_final.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  const floorPositions = [
    {
      position: [0.127, 1, -0.015],
      // primer argumento es el ancho
      // segundo argumento es el alto
      // tercer argumento es el largo
      args: [.152, 0.095, .375],
      rotation: [0, 0, 0],
    }, // Primer piso
    {
      position: [0.127, 1, -0.015],
      args: [.152, 0.0276525, .375],
      rotation: [0, 0, 0],
    }, // Segundo piso
    {
      position: [0.127, 1, -0.015],
      args: [.152, 0.0276525, .375],
      rotation: [0, 0, 0],
    }, // Tercer piso
    {
      position: [0.127, 1, -0.015],
      args: [.152, 0.0276525, .375],
      rotation: [0, 0, 0],
    }, // Cuarto piso
    {
      position: [0.127, 1, -0.015],
      args: [.152, 0.0276525, .375],
      rotation: [0, 0, 0],
    }, // Quinto piso
    {
      position: [0.127, 1, -0.015],
      args: [.152, 0.0276525, .375],
      rotation: [0, 0, 0],
    }, // Sexto piso
    {
      position: [0.127, 1, -0.015],
      args: [.152, 0.0276525, .375],
      rotation: [0, 0, 0],
    }, // Séptimo piso
    {
      position: [0.127, 1, -0.015],
      args: [.152, 0.0276525, .375],
      rotation: [0, 0, 0],
    }, // Octavo piso
    {
      position: [0.127, 1, -0.015],
      args: [.152, 0.0276525, .375],
      rotation: [0, 0, 0],
    }, // Noveno piso
    {
      position: [0.127, 1, -0.034],
      args: [.152, 0.0276525, .35],
      rotation: [0, 0, 0],
    }, // Décimo piso
    {
      position: [0.127, 1, -0.034],
      args: [.152, 0.0276525, .35],
      rotation: [0, 0, 0],
    }, // Onceavo piso
    {
      position: [0.127, 1, -0.034],
      args: [.152, 0.0276525, .35],
      rotation: [0, 0, 0],
    }, // Doceavo piso
    {
      position: [0.127, 1, -0.034],
      args: [.152, 0.0276525, .35],
      rotation: [0, 0, 0],
    }, // Treceavo piso
    {
      position: [0.127, 1, -0.034],
      args: [.152, 0.0276525, .35],
      rotation: [0, 0, 0],
    }, // Catorceavo piso
    {
      position: [0.127, 1, -0.034],
      args: [.152, 0.0276525, .35],
      rotation: [0, 0, 0],
    }, // Quinceavo piso
    {
      position: [0.127, 1, -0.034],
      args: [.152, 0.0276525, .35],
      rotation: [0, 0, 0],
    }, // Dieciseisavo piso
    {
      position: [0.127, 1, -0.034],
      args: [.152, 0.0276525, .35],
      rotation: [0, 0, 0],
    }, // Diecisieteavo piso
    {
      position: [0.127, 1, -0.034],
      args: [.152, 0.0276525, .35],
      rotation: [0, 0, 0],
    }, // Dieciochoavo piso
    {
      position: [0.127, 1, -0.034],
      args: [.152, 0.0276525, .35],
      rotation: [0, 0, 0],
    }, // Diecinueveavo piso
    {
      position: [0.127, 1, -0.034],
      args: [.16, 0.0276525, .35],
      rotation: [0, 0, 0],
    }, // Veinteavo piso
  ];

  return (
    <>
      <primitive object={scene} {...props} scale={[0.1, 0.1, 0.1]} position={[0.15, 4.9, 0]} />
      <Floors floorPositions={floorPositions} {...props} />
    </>
  )
}

export default BuildingModel