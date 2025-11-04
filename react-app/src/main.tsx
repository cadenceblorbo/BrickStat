import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.tsx'
import StatsCanvas from './canvas.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StatsCanvas />
  </StrictMode>,
)
