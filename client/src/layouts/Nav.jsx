import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, Mail, Zap, ChevronLeft, Menu } from 'lucide-react'

const Nav = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path) => pathname === path

  const navItems = [
    { path: '/', name: 'Home', icon: <Home className="h-4 w-4" /> },
    { path: '/aboutus', name: 'About', icon: <Users className="h-4 w-4" /> },
    { path: '/contactus', name: 'Contact', icon: <Mail className="h-4 w-4" /> },
    { path: '/features', name: 'Features', icon: <Zap className="h-4 w-4" /> }
  ]

  if(pathname === '/call' || pathname === '/auth') return null

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-4 bottom-4 z-50 transition-all ${isOpen ? 'rotate-90' : ''}`}
      >
        {isOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      <div className={`fixed right-0 top-0 h-full z-40 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0'}`}>
        <div className={`h-full bg-white/10 backdrop-blur-lg overflow-hidden border-l border-white/20 shadow-lg ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col gap-1 p-4 h-full">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => {
                  navigate(item.path)
                  setIsOpen(false)
                }}
                className={`justify-start gap-3 h-12 rounded-lg transition-colors ${isActive(item.path) ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Nav