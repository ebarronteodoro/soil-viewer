import React, { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function FloorModel({ targetRotation, targetScale, stateView, object, setSelectedObjectName }) {
  const meshRef = useRef()
  const { gl, camera } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const [selectedObject, setSelectedObject] = useState(null)

  useEffect(() => {
    gl.toneMappingExposure = 0.6
  }, [gl])

  useFrame(() => {
    if (meshRef.current) {
      const rotationSpeed = 0.08
      const scaleSpeed = 0.25

      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        rotationSpeed
      )
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        stateView[0],
        rotationSpeed
      )

      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        scaleSpeed
      )
    }
  })

  const handleClick = (event) => {
    const { clientX, clientY } = event
    const { width, height } = gl.domElement

    mouse.current.x = (clientX / width) * 2 - 1
    mouse.current.y = -(clientY / height) * 2 + 1

    raycaster.current.setFromCamera(mouse.current, camera)
    const intersects = raycaster.current.intersectObjects(meshRef.current.children, true)

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object

      if (intersectedObject.name.startsWith('tipo')) {
        if (selectedObject) {
          selectedObject.material.color.set('white')
          selectedObject.material.opacity = 1
        }

        intersectedObject.material.color.set('#9bff46')
        intersectedObject.material.transparent = true
        intersectedObject.material.opacity = 0.5

        setSelectedObject(intersectedObject)
        setSelectedObjectName(intersectedObject.name)
        console.log('Objeto seleccionado:', intersectedObject.name)
      }
    } else {
      if (selectedObject) {
        selectedObject.material.color.set('white')
        selectedObject.material.opacity = 1
        setSelectedObject(null)
        setSelectedObjectName('')
      }
    }
  }

  useEffect(() => {
    gl.domElement.addEventListener('click', handleClick)
    gl.domElement.addEventListener('touchstart', handleClick)
    return () => {
      gl.domElement.removeEventListener('click', handleClick)
      gl.domElement.removeEventListener('touchstart', handleClick)
    }
  }, [gl, selectedObject])

  return (
    <>
      {object && (
        <group ref={meshRef}>
          <primitive
            object={object}
            position={[0, 0, 0]}
            scale={[0.5, 0.5, 0.5]}
            castShadow
          />
        </group>
      )}

      <ambientLight intensity={0.2} />

      <directionalLight
        color='#fade85'
        position={[-3, 40, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-near={2}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-radius={3}
      />

      <pointLight
        color='#808080'
        position={[0, 0, 0]}
        intensity={0.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-near={0.5}
      />
    </>
  )
}

export default FloorModel
