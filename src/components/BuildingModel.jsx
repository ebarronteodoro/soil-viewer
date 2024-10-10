import { useFrame } from '@react-three/fiber'
import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useLocation } from 'react-router-dom'
import { EffectComposer } from '@react-three/postprocessing'
import { Environment, Sky } from '@react-three/drei'

const Floors = ({
  floorPositions,
  activeMeshIndex,
  handleClick,
  renderFloors
}) => {
  return (
    <>
      {renderFloors &&
        floorPositions.map((floor, index) => (
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

const Lighting = ({ cleanUpBeforeNavigate }) => {
  const ambientLightRef = useRef()
  const directionalLightRef = useRef()

  useEffect(() => {
    return () => {
      if (ambientLightRef.current) {
        ambientLightRef.current.dispose()
      }
      if (directionalLightRef.current) {
        directionalLightRef.current.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (cleanUpBeforeNavigate) {
      cleanUpBeforeNavigate(() => {
        if (ambientLightRef.current) {
          ambientLightRef.current.dispose()
        }
        if (directionalLightRef.current) {
          directionalLightRef.current.dispose()
        }
      })
    }
  }, [cleanUpBeforeNavigate])

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={1.5} />
      <directionalLight
        ref={directionalLightRef}
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
  object,
  cleanUpBeforeNavigate // Pasamos la función de limpieza
}) => {
  const [currentRotation, setCurrentRotation] = useState(targetRotation)
  const [currentScale, setCurrentScale] = useState(targetScale)
  const [renderFloors, setRenderFloors] = useState(true)
  const location = useLocation()
  const objectRef = useRef(object) // Referencia al objeto para evitar recrearlo
  const initialized = useRef(false) // Para controlar la inicialización

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
    if (objectRef.current && initialized.current) {
      setCurrentRotation(
        THREE.MathUtils.lerp(currentRotation, targetRotation, 0.1)
      )
      objectRef.current.rotation.y = currentRotation

      setCurrentScale(THREE.MathUtils.lerp(currentScale, targetScale, 0.1))
      objectRef.current.scale.set(currentScale, currentScale, currentScale)
    }
  })

  // Controlar si se deben renderizar los pisos según la ruta actual
  useEffect(() => {
    setRenderFloors(location.pathname === '/')
  }, [location.pathname])

  // Desactivar el mesh activo cuando los pisos no se deben renderizar
  useEffect(() => {
    if (!renderFloors) {
      handleClick(null)
    }
  }, [renderFloors, handleClick])

  // Solo inicializar el objeto una vez
  useEffect(() => {
    if (!initialized.current) {
      objectRef.current = object
      initialized.current = true
    }
  }, [object])

  // Limpieza de objetos dentro del `primitive` antes de navegar
  useEffect(() => {
    if (cleanUpBeforeNavigate) {
      cleanUpBeforeNavigate(() => {
        if (objectRef.current) {
          objectRef.current.traverse(child => {
            if (child.isMesh) {
              child.geometry.dispose()
              if (Array.isArray(child.material)) {
                child.material.forEach(material => material.dispose())
              } else {
                child.material.dispose()
              }
            }
          })
        }
      })
    }
  }, [cleanUpBeforeNavigate])

  return objectRef.current ? (
    <>
      <primitive
        object={objectRef.current}
        position={[0, -9.8, 0]}
        scale={[1, 1, 1]}
        receiveShadow
      >
        <Floors
          floorPositions={floorPositions}
          activeMeshIndex={activeMeshIndex}
          handleClick={handleClick}
          renderFloors={renderFloors}
        />
        {/* <Environment files='/models/hdri/TypoB.jpg' background blur={0} /> */}
      </primitive>
      <Sky />
      <Lighting cleanUpBeforeNavigate={cleanUpBeforeNavigate} />

      <EffectComposer />
    </>
  ) : null
}

export default BuildingModel
