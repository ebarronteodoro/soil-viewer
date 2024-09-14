import { useNavigate } from 'react-router-dom'
import View360 from './View360'
import EyeIcon from './icons/EyeIcon'
import { useState, useEffect } from 'react'

function PreloadModels ({ loadingProgress, isLoaded }) {
  const [fadeOutLoader, setFadeOutLoader] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const [statusMessage, setStatusMessage] = useState('0%') // Mensaje de estado
  const navigate = useNavigate()

  const handleLoaderButtonClick = () => {
    setFadeOutLoader(true)
    setTimeout(() => {
      setShowLoader(false)
      navigate('/') // Redirige al modelo principal o la página de inicio
    }, 1000)
  }

  useEffect(() => {
    if (loadingProgress === 100) {
      setTimeout(() => {
        setStatusMessage('¡Cargado!')
        setTimeout(() => {
          setStatusMessage('¡Dale click al botón de abajo!')
        }, 1000)
      }, 1000)
    } else {
      const interval = setInterval(() => {
        if (loadingProgress < 100) {
          setStatusMessage(`${loadingProgress}%`)
        }
      }, 500) // Actualizamos cada 500ms

      return () => clearInterval(interval)
    }
  }, [loadingProgress])

  return (
    <>
      {showLoader && (
        <div className={`loader2 ${fadeOutLoader ? 'fade-out' : ''}`}>
          <div className='vista360'>
            <View360 scene='/models/hdri/untitled.png' />
          </div>
          <img
            className='soil-logo'
            src='/images/soil_logo.png'
            alt='Soil-Logo'
          />
          <div className='loading-containter'>
            {loadingProgress !== 100 && (
              <h2 className='loading-text'>
                cargando
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </h2>
            )}
            <h2 className='loading-percentage'>{statusMessage}</h2>
          </div>
          <button
            className='loader-button'
            onClick={handleLoaderButtonClick}
            disabled={loadingProgress < 100}
            style={{
              opacity: loadingProgress === 100 ? 1 : 0.5,
              cursor: loadingProgress === 100 ? 'pointer' : 'not-allowed'
            }}
          >
            <EyeIcon width='24px' height='24px' />
            <span className='button-text'>VER PROYECTO</span>
          </button>
        </div>
      )}
    </>
  )
}

export default PreloadModels
