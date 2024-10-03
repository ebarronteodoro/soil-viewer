import { useEffect, useState } from 'react'
import EyeIcon from './icons/EyeIcon'
import View360 from './View360'

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

  return (
    <>
      <div className='inner-shadow' />
      {showLoader && (
        <div className={`loader2 ${fadeOutLoader ? 'fade-out' : ''}`}>
          <div className='vista360'>
            {/* <View360 scene='/models/hdri/Preload.png' /> */}
          </div>
          <img
            className='soil-logo'
            src='/images/soil_logo.png'
            alt='Soil-Logo'
          />
          <div className='loading-container'>
            {!isRouteModelLoaded && (
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
            disabled={!isButtonEnabled}
            style={{
              opacity: isButtonEnabled ? 1 : 0.5,
              cursor: isButtonEnabled ? 'pointer' : 'not-allowed'
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
