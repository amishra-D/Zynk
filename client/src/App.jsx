import React, { useEffect } from 'react'
import { ThemeProvider } from './components/theme-provider'
import Home from './Pages/Home'
import Call from './Pages/Call'
import { Route, Routes } from 'react-router-dom'
import Auth from './Pages/Auth'
import Protected from './Pages/Protected'
import { useDispatch, useSelector } from 'react-redux';
import { Getmyuserthunk } from './Features/auth/authSlice';
import { useLocation } from 'react-router-dom';
import Features from './Pages/Features'
import Aboutus from './Pages/Aboutus'
import Contactus from './Pages/Contactus'
import Nav from './layouts/Nav'

const App = () => {
  const initialized = useSelector(state => state.auth.initialized);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!initialized && pathname !== "/auth") {
      dispatch(Getmyuserthunk());
    }
  }, [dispatch, initialized, pathname]);
  return (
    <div>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Nav/>
<Routes>
  <Route path='/' element={<Home/>}/>
  <Route path='/call' element={
    <Protected>
    <Call/>
    </Protected>
    }/>
    <Route path='/auth' element={<Auth/>}/>
    <Route path='/protected' element={<Protected><Auth></Auth></Protected>}/>
        <Route path='/features' element={<Features/>}/>
            <Route path='/aboutus' element={<Aboutus/>}/>
                <Route path='/contactus' element={<Contactus/>}/>


</Routes>
</ThemeProvider>
    </div>
  )
}

export default App
