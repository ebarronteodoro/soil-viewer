import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import TypoB from './components/TypoB'
import TypoA from './components/TypoA'

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/tipo-a' element={<TypoA />} />
        <Route path='/tipo-b' element={<TypoB />} />
      </Routes>
    </Router>
  )
}

export default App
