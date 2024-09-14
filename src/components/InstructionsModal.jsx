import React from 'react'

function InstructionsModal ({ setIsOpened }) {
  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('instructionsModalClosed', 'true')
      setIsOpened(false)
    }
  }

  return (
    <>
      <div className='instructions-modal'>
        <div className='instructions-content'>
          <h2>Bienvenido al primer paso para tener tu depa en Soil!</h2>
          <p>
            SIGUE ESTOS SENCILLOS PASOS PARA DISFRUTAR LA EXPERIENCIA Y ENCONTRAR
            TU NUEVO HOGAR:
          </p>
          <p>
            1. Utiliza los botones de navegación para rotar la vista y explorar el
            edificio.
          </p>
          <p>
            2. Haz clic en el piso o departamento que más te guste para descubrir
            más opciones y detalles.
          </p>
          <p>
            3. ¡Da el siguiente paso! Contacta a uno de nuestros asesores y
            asegúrate de conseguir el depa de tus sueños.
          </p>
          <button onClick={handleClose}>Cerrar</button>
        </div>
      </div>
    </>
  )
}

export default InstructionsModal
