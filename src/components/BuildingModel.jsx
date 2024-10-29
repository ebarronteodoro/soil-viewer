import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

const Floors = ({ floorPositions, activeMeshIndex, handleClick }) => {
  return (
    <>
      {floorPositions.map((floor, index) => {
        const yOffset =
          floorPositions
            .slice(0, index)
            .reduce((acc, currentFloor) => acc + currentFloor.args[1], 0)

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
  const { scene } = useGLTF('/models/PISOS/prueba total 1- centrao.glb')

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
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 2.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Primer piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Segundo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Tercer piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Cuarto piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Quinto piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Sexto piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Séptimo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Octavo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Noveno piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Décimo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Onceavo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Doceavo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Treceavo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Catorceavo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Quinceavo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Dieciseisavo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Diecisieteavo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Dieciochoavo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Diecinueveavo piso
    {
      position: [-4.2, 0, -1.2],
      args: [14 * 0.6, 1.5 * 0.6, 30 * 0.6],
      rotation: [0, Math.PI / -8.5, 0],
    }, // Veinteavo piso
  ];

  return (
    <>
      <primitive object={scene} {...props} scale={[0.2, 0.2, 0.2]} position={[0.15, 4.9, 0]} />
      <Floors floorPositions={floorPositions} {...props} />
    </>
  )
}

export default BuildingModel
