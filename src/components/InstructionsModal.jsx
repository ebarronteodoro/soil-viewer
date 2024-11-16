import React, { useState, useEffect } from 'react'

function InstructionsModal ({ setIsOpened, setInstructionStep }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    setInstructionStep(step)
  }, [step, setInstructionStep])

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('InstructionsModalClosed', 'true')
      setIsOpened(false)
    }
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const stepsContent = [
    {
      title: 'Bienvenido a Soil',
      description: 'Explore el edificio y descubra los detalles de los departamentos disponibles. Vamos a guiarlo paso a paso.'
    },
    {
      title: '1. Rotar el edificio',
      description: 'Utiliza los botones de rotacion de la parte inferior o arrastra con el mouse para girar el edificio y verlo desde diferentes ángulos'
    },
    {
      title: '2. Zoom',
      description: 'Acercate o alejate utilizando los botones de zoom o la rueda del mouse para ver el edificio mas cerca y apreciar detalles'
    },
    {
      title: '3. Seleccione un piso',
      description: 'Haz click en la planta que deseas ver y luego en "Ver planta"'
    },
    {
      title: '4. Contáctenos',
      description: 'Si deseas mas informacion haz click en el numero de contacto para comunicarse con un asesor. Estamos aqui para ayudarte'
    },
    {
      title: 'Instrucciones',
      description: 'Para volver a ver la guia puedes hacer click en el boton de Instrucciones en la parte inferior de la pantalla en cualquier momento'
    },
    {
      title: '¡Listo para explorar!',
      description: '¡Ya estas listo!'
    }
  ]

  return (
    <div className='instructions-modal'>
      <div className='instructions-content'>
        <h2>{stepsContent[step].title}</h2>
        <p>{stepsContent[step].description}</p>

        <div className='instructions-buttons'>
          {step > 0 && (
            <button onClick={prevStep}>
              VOLVER
            </button>
          )}

          {step < stepsContent.length - 1
            ? (
              <>
                <button onClick={nextStep}>SIGUIENTE</button>
                <button title='Omitir Tutorial' className='skipButton' onClick={handleClose}>
                  OMITIR &gt;
                </button>
              </>
              )
            : (
              <button onClick={handleClose}>Comienza a explorar</button>
              )}
        </div>
      </div>
    </div>
  )
}

export default InstructionsModal
