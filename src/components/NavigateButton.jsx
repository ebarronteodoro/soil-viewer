import React from 'react'
import { useNavigate } from 'react-router-dom'
import './NavigateButton.css'

function NavigateButton ({ route, floor, clearSelection }) {
  const navigate = useNavigate()

  const handleClick = () => {
    clearSelection()
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
      disabled={!route}
    >
      {floor === 1
        ? (
            route ? 'Ver piso 1 y 2' : 'Piso 1 y 2 no disponible'
          )
        : floor === 21
          ? (
              route ? 'Ver terraza' : 'Terraza no disponible'
            )
          : (
              route ? `Ver piso ${floor}` : `Piso ${floor} no disponible`
            )}
    </button>
  )
}

export default NavigateButton
