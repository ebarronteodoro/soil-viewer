import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

function View360 ({ scene }) {
  const containerRef = useRef(null)

  useEffect(() => {
    let renderer, camera, scene3D, sphere, animationId

    const init = () => {
      scene3D = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(0, -10, 5)
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      containerRef.current.appendChild(renderer.domElement)
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
      animationId = window.requestAnimationFrame(animate)
      camera.rotation.y += 0.0005
      renderer.render(scene3D, camera)
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    init()
    animate()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.cancelAnimationFrame(animationId)

      if (renderer) {
        renderer.dispose()
        if (containerRef.current) {
          containerRef.current.removeChild(renderer.domElement)
        }
      }

      if (sphere) {
        sphere.geometry.dispose()
        sphere.material.dispose()
      }
    }
  }, [scene])

  return <div ref={containerRef} style={{ width: '100vw', height: '100dvh' }} />
}

export default View360
