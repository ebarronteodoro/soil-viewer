import React from 'react'
import { useNavigate } from 'react-router-dom'
import './NavigateButton.css'

function NavigateButton ({ route, floor }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (route) {
      navigate(route)
    } else {
      window.alert(`No hay página disponible para el piso ${floor}`)
    }
  }

  return (
    <button
      className='navigate-button'
      onClick={handleClick}
      disabled={!route} // Deshabilitar si no hay ruta
    >
      {route ? `Ir al piso ${floor}` : `Piso ${floor} no disponible`}
    </button>
  )
}

export default NavigateButton
