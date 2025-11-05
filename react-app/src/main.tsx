import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.tsx'
import StatsCanvas from './rendering/StatsCanvas.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StatsCanvas />
  </StrictMode>,
)
