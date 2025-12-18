import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/index'
import MLPage from './pages/ml'
import SWEPage from './pages/swe'
import ResearchPage from './pages/research'

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ml" element={<MLPage />} />
        <Route path="/swe" element={<SWEPage />} />
        <Route path="/research" element={<ResearchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App