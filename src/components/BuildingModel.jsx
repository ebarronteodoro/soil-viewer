import { useFrame } from '@react-three/fiber'
import React, { useState, useEffect } from 'react'
import * as THREE from 'three'
import { useLocation } from 'react-router-dom'
import { EffectComposer } from '@react-three/postprocessing'
import { Sky } from '@react-three/drei'

const Floors = ({ floorPositions, activeMeshIndex, handleClick, renderFloors }) => {
  return (
    <>
      {renderFloors && floorPositions.map((floor, index) => (
        <mesh
          key={index}
          position={floor.position}
          onClick={e => {
            e.stopPropagation()
            handleClick(index)
          }}
          castShadow
          receiveShadow
        >
          <boxGeometry args={floor.args} />
          <meshStandardMaterial
            color={activeMeshIndex === index ? '#ACACAC' : '#ffffff'}
            transparent
            opacity={activeMeshIndex === index ? 0.5 : 0}
          />
        </mesh>
      ))}
    </>
  )
}

const Lighting = () => {
  const rectLightRef = React.useRef()

  useEffect(() => {
    if (rectLightRef.current) {
      rectLightRef.current.lookAt(0, 0, 0)
    }
  }, [])

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[-50, 120, 80]}
        intensity={2.8}
      />
    </>
  )
}

const BuildingModel = ({
  targetRotation,
  targetScale,
  activeMeshIndex,
  handleClick,
  object
}) => {
  const [currentRotation, setCurrentRotation] = useState(targetRotation)
  const [currentScale, setCurrentScale] = useState(targetScale)
  const [renderFloors, setRenderFloors] = useState(true)

  const location = useLocation()

  const floorPositions = [
    { position: [0.95, 4, 1], args: [15.5, 6, 37.5] },
    { position: [0.95, 8.6, 1], args: [15.5, 2.9, 37.5] },
    { position: [0.95, 11.5, 1], args: [15.5, 2.9, 37.5] },
    { position: [0.95, 14.4, 1], args: [15.5, 2.9, 37.5] },
    { position: [0.95, 17.3, 1], args: [15.5, 2.9, 37.5] },
    { position: [0.95, 20.2, 1], args: [15.5, 2.9, 37.5] },
    { position: [0.95, 22.8, 1], args: [15.5, 2.9, 37.5] },
    { position: [0.95, 25.5, 1], args: [15.5, 2.9, 37.5] },
    { position: [0.95, 28.5, 1], args: [15.5, 2.9, 37.5] },
    { position: [0.95, 31.4, 1], args: [15.5, 2.9, 37.5] },
    { position: [0.95, 34.5, -0.7], args: [15.5, 2.9, 34.2] },
    { position: [0.95, 37.4, -0.7], args: [15.5, 2.9, 34.2] },
    { position: [0.95, 40.3, -0.7], args: [15.5, 2.9, 34.2] },
    { position: [0.95, 43.2, -0.7], args: [15.5, 2.9, 34.2] },
    { position: [0.95, 46.1, -0.7], args: [15.5, 2.9, 34.2] },
    { position: [0.95, 49, -0.7], args: [15.5, 2.9, 34.2] },
    { position: [0.95, 51.9, -0.7], args: [15.5, 2.9, 34.2] },
    { position: [0.95, 54.8, -0.7], args: [15.5, 2.9, 34.2] },
    { position: [0.95, 57.7, -0.7], args: [15.5, 2.9, 34.2] },
    { position: [0.95, 60.6, -0.7], args: [15.5, 2.9, 34.2] }
  ]

  useFrame(() => {
    if (object) {
      setCurrentRotation(THREE.MathUtils.lerp(currentRotation, targetRotation, 0.1))
      object.rotation.y = currentRotation

      setCurrentScale(THREE.MathUtils.lerp(currentScale, targetScale, 0.1))
      object.scale.set(currentScale, currentScale, currentScale)
    }
  })

  useEffect(() => {
    setRenderFloors(location.pathname === '/')
  }, [location.pathname])

  useEffect(() => {
    if (!renderFloors) {
      handleClick(null)
    }
  }, [renderFloors, handleClick])

  return object
    ? (
      <>
        <primitive
          object={object}
          position={[0, -7.8, 0]}
          scale={[1, 1, 1]}
          receiveShadow
        >
          <Floors
            floorPositions={floorPositions}
            activeMeshIndex={activeMeshIndex}
            handleClick={handleClick}
            renderFloors={renderFloors}
          />
          <Lighting />
        </primitive>
        <Sky />

        <EffectComposer />
      </>
      )
    : null
}

export default BuildingModel
