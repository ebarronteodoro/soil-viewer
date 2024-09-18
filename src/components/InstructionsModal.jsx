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
      description: 'Utilice las flechas de rotación en la parte inferior o arrastre con el mouse o su dedo para girar el edificio y verlo desde diferentes ángulos.'
    },
    {
      title: '2. Zoom',
      description: 'Acérquese o aléjese utilizando los botones de zoom (íconos de lupa) o la rueda del mouse para ver el edificio más de cerca y apreciar los detalles.'
    },
    {
      title: '3. Seleccione un piso',
      description: 'Haga clic en los pisos del edificio para descubrir los departamentos disponibles en cada nivel.'
    },
    {
      title: '4. Contáctenos',
      description: 'Si tiene alguna consulta o está interesado, haga clic en el número de contacto para copiarlo y llámenos. Estamos aquí para ayudarle.'
    },
    {
      title: 'Instrucciones',
      description: 'Si desea volver a ver las instrucciones, puede hacer clic en el botón "Ver Instrucciones" en la parte inferior de la pantalla en cualquier momento.'
    },
    {
      title: '¡Listo para explorar!',
      description: 'Ya tiene toda la información que necesita. Comience a explorar y descubra su nuevo hogar en Soil Pueblo Libre.'
    }
  ]

  return (
    <div className='instructions-modal'>
      <div className='instructions-content'>
        <h2>{stepsContent[step].title}</h2>
        <p>{stepsContent[step].description}</p>

        <div className='instructions-buttons'>
          {step > 0 && (
            <button onClick={prevStep} style={{ marginRight: '10px' }}>
              Volver
            </button>
          )}

          {step < stepsContent.length - 1
            ? (
              <>
                <button onClick={nextStep}>Siguiente</button>
                <button onClick={handleClose} style={{ marginLeft: '10px' }}>
                  Omitir
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
