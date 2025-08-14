import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Grid from './components/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Admin from './pages/Admin'

import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#ede7e3]">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<Grid />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path= "/admin" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
