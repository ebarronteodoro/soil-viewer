import React, { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function FloorModel({ targetRotation, targetScale, stateView, object }) {
  const meshRef = useRef()
  const { gl, camera } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const [selectedObject, setSelectedObject] = useState(null) // Estado para rastrear el objeto seleccionado

  useEffect(() => {
    gl.toneMappingExposure = 0.6
  }, [gl])

  // Actualización de la rotación y la escala de forma suave
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

  // Función para manejar los clics en la escena
  const handleClick = (event) => {
    // Obtener las coordenadas del clic y convertirlas al rango [-1, 1]
    const { clientX, clientY } = event
    const { width, height } = gl.domElement

    mouse.current.x = (clientX / width) * 2 - 1
    mouse.current.y = -(clientY / height) * 2 + 1

    // Configurar el raycaster con la posición de la cámara y la posición del mouse
    raycaster.current.setFromCamera(mouse.current, camera)

    // Detectar intersecciones con los objetos de la escena
    const intersects = raycaster.current.intersectObjects(meshRef.current.children, true)

    // Si hay una intersección, cambiar el color del objeto
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object

      // Despintar el objeto previamente seleccionado, si existe
      if (selectedObject) {
        selectedObject.material.color.set('white') // Cambiar al color original
        selectedObject.material.opacity = 1 // Restaurar opacidad
      }

      // Pintar el nuevo objeto clickeado
      intersectedObject.material.color.set('red')
      intersectedObject.material.transparent = true
      intersectedObject.material.opacity = 0.5

      // Actualizar el objeto seleccionado
      setSelectedObject(intersectedObject)
    } else {
      // Si se hace clic en el área vacía, despintar el objeto seleccionado
      if (selectedObject) {
        selectedObject.material.color.set('white') // Cambiar al color original
        selectedObject.material.opacity = 1 // Restaurar opacidad
        setSelectedObject(null) // Limpiar selección
      }
    }
  }

  // Agregar el evento de clic a la escena
  useEffect(() => {
    gl.domElement.addEventListener('click', handleClick)
    gl.domElement.addEventListener('touchstart', handleClick) // Para el soporte táctil
    return () => {
      gl.domElement.removeEventListener('click', handleClick)
      gl.domElement.removeEventListener('touchstart', handleClick)
    }
  }, [gl, selectedObject]) // Agregar selectedObject como dependencia

  return (
    <>
      {object && (
        <group ref={meshRef}>
          <primitive
            object={object}
            position={[-0.5, 0, 0]}
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
