import { useEffect, useState } from 'react'
import EyeIcon from './icons/EyeIcon'

function PreloadModels ({
  loadingProgress,
  setIsOpened,
  isModalClosed,
  isRouteModelLoaded,
  isButtonEnabled
}) {
  const [fadeOutLoader, setFadeOutLoader] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const [statusMessage, setStatusMessage] = useState('0%')

  const handleLoaderButtonClick = () => {
    if (isButtonEnabled) {
      setFadeOutLoader(true)
      if (!isModalClosed) {
        setIsOpened(true)
      }
      setTimeout(() => {
        setShowLoader(false)
      }, 1000)
    }
  }

  useEffect(() => {
    setStatusMessage(`${loadingProgress}%`)
    if (isRouteModelLoaded) {
      setStatusMessage('¡Dale click al botón de abajo!')
    }
  }, [loadingProgress, isRouteModelLoaded])

  // Desactivar comportamiento de scroll y zoom
  useEffect(() => {
    const preventDefault = (event) => {
      event.preventDefault()
    }

    // Deshabilitar eventos de scroll y zoom
    window.addEventListener('wheel', preventDefault, { passive: false })
    window.addEventListener('touchmove', preventDefault, { passive: false })

    return () => {
      window.removeEventListener('wheel', preventDefault)
      window.removeEventListener('touchmove', preventDefault)
    }
  }, [])

  return (
    <>
      <div className='inner-shadow' />
      {showLoader && (
        <div className={`loader2 ${fadeOutLoader ? 'fade-out' : ''}`}>
          <div className='vista360'>
            {/* <View360 scene='/models/hdri/Preload.png' /> */}
          </div>
          <div className='loader-bg' />
          <img
            className='soil-logo'
            src='/images/soil_logo.png'
            alt='Soil-Logo'
          />
          {!isRouteModelLoaded && (
            <div className='loading-container'>
              <h2 className='loading-text'>
                cargando
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </h2>
              <h2 className='loading-percentage'>{statusMessage}</h2>
            </div>
          )}
          {isRouteModelLoaded && (
            <button
              className='loader-button'
              onClick={handleLoaderButtonClick}
              disabled={!isButtonEnabled}
              style={{
                opacity: isButtonEnabled ? 1 : 0.5,
                cursor: isButtonEnabled ? 'pointer' : 'not-allowed'
              }}
            >
              <EyeIcon width='24px' height='24px' />
              <span className='button-text'>Empezar</span>
            </button>
          )}
          <div className='sdc-watermark'>
            <picture>
              <img src='/images/sdc-test.png' alt='sdc-logo' />
            </picture>
            <h2>A System Digital Creation’s product</h2>
          </div>
        </div>
      )}
    </>
  )
}

export default PreloadModels
