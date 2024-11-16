import React from 'react'
import { useGLTF } from '@react-three/drei'

const Floors = ({ floorPositions, activeMeshIndex, handleClick }) => {
  return (
    <>
      {floorPositions.map((floor, index) => {
        const yOffset =
          index === 0
            ? 3.025
            : floorPositions
              .slice(1, index + 1)
              .reduce((acc, currentFloor) => acc + currentFloor.args[1], 3.06)

        return (
          <mesh
            key={index}
            position={[floor.position[0], yOffset, floor.position[2]]}
            rotation={floor.rotation}
            onClick={e => {
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

const RotateLeftModel = () => {
  const { scene } = useGLTF('/models/direction_arrow.glb') // Cambia por la ruta real del modelo
  return (
    <primitive
      object={scene}
      position={[0.25, 3.3, 0]}
      scale={[0.05, 0.05, 0.05]}
      rotation={[0, Math.PI / 2, 0]}
    />
  )
}

const RotateRightModel = () => {
  const { scene } = useGLTF('/models/direction_arrow2.glb') // Cambia por la ruta real del modelo
  return (
    <primitive
      object={scene}
      position={[-0.13, 3.3, 0]}
      scale={[0.05, 0.05, 0.05]}
      rotation={[0, -Math.PI / 2, 0]}
    />
  )
}

const BuildingModel = ({ activeMeshIndex, handleClick, object, isOpened }) => {
  const floorPositions = [
    {
      position: [0.038, 1, -0.015],
      args: [0.152, 0.095, 0.375],
      rotation: [0, 0, 0]
    },
    {
      position: [0.038, 1, -0.015],
      args: [0.152, 0.029, 0.375],
      rotation: [0, 0, 0]
    }, // Segundo piso
    {
      position: [0.038, 1, -0.015],
      args: [0.152, 0.029, 0.375],
      rotation: [0, 0, 0]
    }, // Tercer piso
    {
      position: [0.038, 1, -0.015],
      args: [0.152, 0.029, 0.375],
      rotation: [0, 0, 0]
    }, // Cuarto piso
    {
      position: [0.038, 1, -0.015],
      args: [0.152, 0.029, 0.375],
      rotation: [0, 0, 0]
    }, // Quinto piso
    {
      position: [0.038, 1, -0.015],
      args: [0.152, 0.029, 0.375],
      rotation: [0, 0, 0]
    }, // Sexto piso
    {
      position: [0.038, 1, -0.015],
      args: [0.152, 0.029, 0.375],
      rotation: [0, 0, 0]
    }, // Séptimo piso
    {
      position: [0.038, 1, -0.015],
      args: [0.152, 0.029, 0.375],
      rotation: [0, 0, 0]
    }, // Octavo piso
    {
      position: [0.038, 1, -0.015],
      args: [0.152, 0.029, 0.375],
      rotation: [0, 0, 0]
    }, // Noveno piso
    {
      position: [0.038, 1, -0.034],
      args: [0.152, 0.029, 0.35],
      rotation: [0, 0, 0]
    }, // Décimo piso
    {
      position: [0.038, 1, -0.034],
      args: [0.152, 0.029, 0.35],
      rotation: [0, 0, 0]
    }, // Onceavo piso
    {
      position: [0.038, 1, -0.034],
      args: [0.152, 0.029, 0.35],
      rotation: [0, 0, 0]
    }, // Doceavo piso
    {
      position: [0.038, 1, -0.034],
      args: [0.152, 0.029, 0.35],
      rotation: [0, 0, 0]
    }, // Treceavo piso
    {
      position: [0.038, 1, -0.034],
      args: [0.152, 0.029, 0.35],
      rotation: [0, 0, 0]
    }, // Catorceavo piso
    {
      position: [0.038, 1, -0.034],
      args: [0.152, 0.029, 0.35],
      rotation: [0, 0, 0]
    }, // Quinceavo piso
    {
      position: [0.038, 1, -0.034],
      args: [0.152, 0.029, 0.35],
      rotation: [0, 0, 0]
    }, // Dieciseisavo piso
    {
      position: [0.038, 1, -0.034],
      args: [0.152, 0.029, 0.35],
      rotation: [0, 0, 0]
    }, // Diecisieteavo piso
    {
      position: [0.038, 1, -0.034],
      args: [0.152, 0.029, 0.35],
      rotation: [0, 0, 0]
    }, // Dieciochoavo piso
    {
      position: [0.038, 1, -0.034],
      args: [0.152, 0.029, 0.35],
      rotation: [0, 0, 0]
    }, // Diecinueveavo piso
    {
      position: [0.038, 1, -0.034],
      args: [0.16, 0.029, 0.35],
      rotation: [0, 0, 0]
    } // Veinteavo piso
  ]

  return (
    <>
      <primitive
        object={object.scene}
        scale={[0.1, 0.1, 0.1]}
        position={[0.06, 2.1, 0]}
      />
      <Floors
        floorPositions={floorPositions}
        activeMeshIndex={activeMeshIndex}
        handleClick={handleClick}
      />
      {isOpened && (
        <>
          <RotateLeftModel />
          <RotateRightModel />
        </>
      )}
    </>
  )
}

export default BuildingModel
