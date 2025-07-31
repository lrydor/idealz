import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Grid from './components/Menu'
import Cart from './pages/Cart'

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Grid />} />
        <Route path="/cart" element={<Cart />} />
        
      </Routes>
    </Router>
  )
}

export default App
