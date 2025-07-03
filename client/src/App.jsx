import React from 'react'
import { ThemeProvider } from './components/theme-provider'
import Home from './Pages/Home'
import Details from './layouts/Details'
import Call from './Pages/Call'
import { Route, Routes } from 'react-router-dom'
import Auth from './Pages/Auth'

const App = () => {
  return (
    <div>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
<Routes>
  <Route path='/' element={<Home/>}/>
  <Route path='/call' element={<Call/>}/>
    <Route path='/auth' element={<Auth/>}/>
</Routes>
</ThemeProvider>
    </div>
  )
}

export default App
