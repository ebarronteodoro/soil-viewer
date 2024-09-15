import { useNavigate } from 'react-router-dom'
import View360 from './View360'
import EyeIcon from './icons/EyeIcon'
import { useState, useEffect } from 'react'

function PreloadModels ({ loadingProgress, setIsOpened, isModalClosed }) {
  const [fadeOutLoader, setFadeOutLoader] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  const [statusMessage, setStatusMessage] = useState('0%')
  const navigate = useNavigate()

  const handleLoaderButtonClick = () => {
    setFadeOutLoader(true)
    if (!isModalClosed) {
      setIsOpened(true)
    }
    setTimeout(() => {
      setShowLoader(false)
      navigate('/')
    }, 1000)
  }

  useEffect(() => {
    if (loadingProgress === 100) {
      setStatusMessage('¡Cargado!')
      setTimeout(() => {
        setStatusMessage('¡Dale click al botón de abajo!')
      }, 1000)
    } else {
      setStatusMessage(`${loadingProgress}%`)
    }
  }, [loadingProgress])

  return (
    <>
      {showLoader && (
        <div className={`loader2 ${fadeOutLoader ? 'fade-out' : ''}`}>
          <div className='vista360'>
            {/* <View360 scene='/models/hdri/untitled.png' /> */}
          </div>
          <img
            className='soil-logo'
            src='/images/soil_logo.png'
            alt='Soil-Logo'
          />
          <div className='loading-container'>
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
