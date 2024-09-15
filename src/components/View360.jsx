import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function View360 ({ scene }) {
  const containerRef = useRef(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    let renderer, camera, scene3D, sphere

    const init = () => {
      scene3D = new THREE.Scene()

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(0, -10, 5)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement)
      }

      const textureLoader = new THREE.TextureLoader()
      textureLoader.load(scene, (texture) => {
        const geometry = new THREE.SphereGeometry(300, 32, 32)
        geometry.scale(-1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ map: texture })
        sphere = new THREE.Mesh(geometry, material)
        scene3D.add(sphere)
      })
    }

    const animate = () => {
      if (isMounted) {
        window.requestAnimationFrame(animate)
        camera.rotation.y += 0.0005
        renderer.render(scene3D, camera)
      }
    }

    init()
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    setIsMounted(true)

    return () => {
      setIsMounted(false)
      window.removeEventListener('resize', handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      if (sphere) sphere.geometry.dispose()
    }
  }, [scene, isMounted])

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
}

export default View360
