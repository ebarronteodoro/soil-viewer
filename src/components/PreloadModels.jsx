// import { useNavigate } from 'react-router-dom'
import View360 from './View360'
import EyeIcon from './icons/EyeIcon'
import { useState } from 'react'

function PreloadModels (isLoaded) {
  const [fadeOutLoader, setFadeOutLoader] = useState(false)
  const [showLoader, setShowLoader] = useState(true)
  // const navigate = useNavigate()
  const handleLoaderButtonClick = () => {
    setFadeOutLoader(true)
    setTimeout(() => {
      setShowLoader(false)
    }, 1000)
  }

  return (
    <>
      {showLoader && (
        <div className={`loader2 ${fadeOutLoader ? 'fade-out' : ''}`}>
          <div className='vista360'>
            <View360 scene='/models/hdri/untitled.png' />
          </div>
          <img className='soil-logo' src='/images/soil_logo.png' alt='Soil-Logo' />
          <button
            className='loader-button'
            onClick={handleLoaderButtonClick}
            disabled={isLoaded.isLoaded === false}
            style={{ opacity: isLoaded.isLoaded === true ? 1 : 0.5, cursor: isLoaded.isLoaded === true ? 'pointer' : 'not-allowed' }}
          >
            <EyeIcon width='24px' height='24px' />
            <span className='button-text'>VER PROYECTO</span>
          </button>
        </div>
      )}
      {/* <div className='asd'>
        <button onClick={() => navigate('/model1')}>Modelo 1</button>
        <button onClick={() => navigate('/model2')}>Modelo 2</button>
        <button onClick={() => navigate('/model3')}>Modelo 3</button>
        <button onClick={() => navigate('/model4')}>Modelo 4</button>
        <button onClick={() => navigate('/')}>Edificio</button>
      </div> */}
    </>
  )
}

export default PreloadModels
