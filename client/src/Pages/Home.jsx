import React from 'react'
import Header from '../layouts/Header';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Details from '@/layouts/Details';

const Home = () => {
  const captions = [
    "Effortless one-on-one video chats with built-in mic and camera control.",
    "Secure, real-time communication powered by WebRTC—no tracking, ever.",
    "Modern, minimalist interface built for distraction-free conversations.",
  ];

  return (
    <div className="min-h-screen overflow-x-hidden w-full flex flex-col items-center bg-background text-foreground relative">
      <Header />
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center w-full px-6 py-12 gap-10">
                <div className="flex-1">
          <h2 className="text-4xl sm:text-5xl font-semibold font-plus">We Make Your</h2>
          <h2 className="text-4xl sm:text-5xl font-semibold font-plus">
            <span className="text-[#D3500C]">Communications</span> Easier
          </h2>

          <div className="mt-4 space-y-2 text-muted-foreground">
            <p className="text-base sm:text-lg">
              Experience seamless one-on-one video and audio calls with built-in chat,
            </p>
            <p className="text-base sm:text-lg">
              mic and camera controls, and secure access—powered by WebRTC.
            </p>
            <p className="text-base sm:text-lg">
              No tracking, no clutter. Just clear, private, real-time communication.
            </p>
          </div>
        </div>
        <div className="flex-1 w-full max-w-md">
          <Carousel className='relative px-4'>
            <CarouselContent>
              {captions.map((caption, index) => (
                <CarouselItem key={index} className="w-full flex flex-col items-center">
                  <div className="rounded-full overflow-hidden w-40 h-40">
                    <img
                      className="object-cover w-full h-full"
                      src={
                        index === 0
                          ? "https://i.pinimg.com/736x/22/76/fe/2276fe48f131f9209d4e1e0728c60f60.jpg"
                          : index === 1
                          ? "https://i.pinimg.com/736x/64/71/4b/64714be4c86bfdaa1ba6a927700a8e54.jpg"
                          : "https://i.pinimg.com/736x/d9/6e/b9/d96eb9849af8e9fbac113b21782797b6.jpg"
                      }
                      alt={`Slide ${index + 1}`}
                    />
                  </div>
                  <p className="text-sm mt-6 text-center text-muted-foreground px-4">
                    {caption}
                  </p>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>

      <Details />
    </div>
  );
};

export default Home;
