import React from 'react'
import { Microwave } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate=useNavigate();
    const currentDate = new Date().toString().split(' ').slice(0,5).join(' ');
  return (
    <div className='w-full flex items-center justify-between bg-background text-foreground relative font-plus'>
      <div className='flex w-full gap-2 flex-row items-center p-4'>
                  <Microwave className='w-14 h-14' color='#D3500C'/>
                   <h1 className='font-bold text-white text-5xl font-plus'>Zynk</h1>
                   </div>
       <div className='flex flex-row gap-3 mr-2'>
        <h2 className='mr-2 font-semibold text-[#D3500C] items-center text-xl '>{currentDate}</h2>
        <Button onClick={()=>navigate('/auth')} className='self-center'>Login</Button>
        <Button onClick={()=>navigate('/auth')}className='self-center'>Sign Up</Button>
</div>            
    </div>
  )
}

export default Header
