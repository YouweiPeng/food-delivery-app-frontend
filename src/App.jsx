import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CheckoutPage from './pages/CheckoutPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'
import Header from './components/Header'
import { useNavigate } from 'react-router-dom'
import ComboSelectionPage from './pages/ComboSelectionPage'
function App() {

  return (
    <BrowserRouter>
    <div className="h-screen flex flex-col items-center justify-center">
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/combo" element={<ComboSelectionPage />} />
    </Routes>
    </div>
    </BrowserRouter>
    
  )
}

export default App
