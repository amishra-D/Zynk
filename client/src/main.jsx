import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import store from './App/store'
import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/sonner"
import { SocketProvider } from './Socket/socketContext'

createRoot(document.getElementById('root')).render(
    <>
        <BrowserRouter>
    <SocketProvider>
        <Toaster position="top-right" richColors />
    <Provider store={store}>
    <App />
    </Provider>
    </SocketProvider>
        </BrowserRouter>
    </>
)
