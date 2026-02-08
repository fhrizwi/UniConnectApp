import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'

export default function RoutingMap() {
  return (
    <BrowserRouter>
    <Header/>
        <Routes>
           <Route path='/' element={<Home/>} />
           <Route path='/login' element={Login} />
           <Route path='/signup' element={Signup} />
        </Routes>
    </BrowserRouter>
  )
}
