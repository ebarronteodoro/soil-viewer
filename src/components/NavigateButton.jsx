import React from 'react'
import { useNavigate } from 'react-router-dom'
import { invalidate } from '@react-three/fiber'
import './NavigateButton.css'
import EyeIcon from './icons/EyeIcon'

function NavigateButton ({ route, floor, clearSelection, animation }) {
  const navigate = useNavigate()

  const handleClick = () => {
    clearSelection()
    if (route) {
      cleanUpScene()
      animation()
      setTimeout(() => {
        console.log('hola')
        navigate(route)
        // animateLookAt(0, 0, 0, 0.05)
      }, 600)
    } else {
      window.alert(`No hay página disponible para el piso ${floor}`)
    }
  }

  const cleanUpScene = () => {
    invalidate()
  }

  return (
    <button type='button' className='navigate-button' onClick={handleClick} disabled={!route}>
      Ver Planta <EyeIcon width='24px' height='24px' />
    </button>
  )
}

export default NavigateButton
