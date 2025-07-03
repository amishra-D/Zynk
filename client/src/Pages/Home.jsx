import React, { useState } from 'react'
import Header from '../layouts/Header';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Details from '@/layouts/Details';

const Home = () => {
  const captions = [
  "Effortless one-on-one video chats with built-in mic and camera control.",
  "Secure, real-time communication powered by WebRTC—no tracking, ever.",
  "Modern, minimalist interface built for distraction-free conversations.",
];
  return (
      <div className="min-h-screen w-full flex flex-col items-center bg-background text-foreground relative">
        <Header></Header>
        <div className='flex justify-around items-center w-full font-semibold text-5xl font-plus p-8'>
        <div>
          <h2>We Make Your</h2>
        <h2><span className='text-[#D3500C]'>Communications</span> Easier</h2>
<p className='text-muted-foreground text-lg mt-3'>Experience seamless one-on-one video and audio calls with built-in chat,</p>
  <p className='text-muted-foreground text-lg'>mic and camera controls, and secure access—powered by WebRTC.</p>
  <p className='text-muted-foreground text-lg'>No tracking, no clutter. Just clear, private, real-time communication.</p>
  </div>
 <Carousel>
  <CarouselContent className='max-w-sm h-auto'>
    <CarouselItem className='max-w-lg h-auto'>
       <div className="rounded-full overflow-hidden w-40 h-40 mx-auto">
        <img
          className="object-cover w-full h-full"
          src="https://i.pinimg.com/736x/22/76/fe/2276fe48f131f9209d4e1e0728c60f60.jpg"
          alt="Profile"
        />
      </div>
      <p className="text-sm mt-8 text-center text-muted-foreground">
                  {captions[0]}
                </p>
    </CarouselItem >
    <CarouselItem className='max-w-sm h-auto'>
                 <div className="rounded-full overflow-hidden w-40 h-40 mx-auto">
  <img className='object-cover' src="https://i.pinimg.com/736x/64/71/4b/64714be4c86bfdaa1ba6a927700a8e54.jpg" alt="" />
</div>
<p className="text-sm mt-8 text-center text-muted-foreground">
                  {captions[1]}
                </p>
    </CarouselItem>
    <CarouselItem className='max-w-sm h-auto'>
                  <div className="rounded-full overflow-hidden w-40 h-40 mx-auto">
 <img className='object-cover' src="https://i.pinimg.com/736x/d9/6e/b9/d96eb9849af8e9fbac113b21782797b6.jpg" alt="" />
 </div>
 <p className="text-sm mt-8 text-center text-muted-foreground">
                  {captions[2]}
                </p>
    </CarouselItem>
    
  </CarouselContent>
  <CarouselPrevious/>
  <CarouselNext/>
</Carousel>

        </div>
        <Details/>
      </div>
  )
}

export default Home
