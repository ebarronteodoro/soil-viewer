import React from 'react'
import { useNavigate } from 'react-router-dom'
import { invalidate } from '@react-three/fiber'
import './NavigateButton.css'

function NavigateButton ({ route, floor, clearSelection }) {
  const navigate = useNavigate()

  const handleClick = () => {
    clearSelection()
    if (route) {
      // Limpiar el canvas antes de la navegación
      cleanUpScene()
      navigate(route)
    } else {
      window.alert(`No hay página disponible para el piso ${floor}`)
    }
  }

  const cleanUpScene = () => {
    // Invalida el render actual para evitar duplicación de luces y meshes
    invalidate()
  }

  return (
    <button className='navigate-button' onClick={handleClick} disabled={!route}>
      {floor === 1
        ? route
          ? 'Ver piso 1 y 2'
          : 'Piso 1 y 2 no disponible'
        : floor === 21
        ? route
          ? 'Ver terraza'
          : 'Terraza no disponible'
        : floor === null
        ? 'Piso sin seleccionar'
        : route
        ? `Ver piso ${floor}`
        : `Piso ${floor} no disponible`}
    </button>
  )
}

export default NavigateButton
