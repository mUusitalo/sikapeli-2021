import 'react-app-polyfill/stable'
import { createRoot } from 'react-dom/client'
import App from './App'
import './App.css'

const root = document.getElementById('root')

createRoot(root).render(<App />)