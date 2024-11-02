import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js'
import * as THREE from 'three'

function Text3D ({
  text,
  position,
  rotation = [0, 0, 0],
  size = 1,
  depth = 0.2,
  color = 0xffffff
}) {
  const mesh = useRef()
  const { scene } = useThree()

  useEffect(() => {
    const fontLoader = new FontLoader()
    fontLoader.load('/fonts/ThreeFonts/Poppins_Regular.json', font => {
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: size,
        depth: depth // Cambiamos height a depth
      })
      const material = new THREE.MeshBasicMaterial({ color: color }) // Usamos el color como propiedad
      mesh.current = new THREE.Mesh(textGeometry, material)
      mesh.current.position.set(...position)
      mesh.current.rotation.set(...rotation)
      scene.add(mesh.current)
    })

    return () => {
      if (mesh.current) scene.remove(mesh.current)
    }
  }, [scene, text, position, rotation, size, depth, color])

  return null
}

export default Text3D
