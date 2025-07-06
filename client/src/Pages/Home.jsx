import React from 'react'
import Header from '../layouts/Header';
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Details from '@/layouts/Details';
import Footer from '@/layouts/Footer';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.5
      }
    }
  };

  const carouselItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 10
      }
    }
  };
  const imageHoverVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const captions = [
    "Effortless one-on-one video chats with built-in mic and camera control.",
    "Secure, real-time communication powered by WebRTC—no tracking, ever.",
    "Modern, minimalist interface built for distraction-free conversations.",
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen overflow-x-hidden w-full flex flex-col items-center bg-background text-foreground relative"
    >
      <Header />
      
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center w-full px-6 py-12 gap-10">
        <motion.div 
          variants={containerVariants}
          className="flex-1 sm:space-y-6"
        >
          <motion.h2 variants={textVariants} className="text-4xl sm:text-5xl font-semibold font-plus">
            We Make Your
          </motion.h2>
          
          <motion.h2 
            variants={textVariants}
            className="text-4xl sm:text-5xl font-semibold font-plus"
          >
            <span className="text-[#D3500C]">Communications</span> Easier
          </motion.h2>

          <motion.div 
            variants={containerVariants}
            className="mt-4 space-y-2 text-muted-foreground"
          >
            {[
              "Experience seamless one-on-one video and audio calls with built-in chat,",
              "mic and camera controls, and secure access—powered by WebRTC.",
              "No tracking, no clutter. Just clear, private, real-time communication."
            ].map((text, index) => (
              <motion.p 
                key={index}
                variants={textVariants}
                className="text-base sm:text-lg"
              >
                {text}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={textVariants}
          className="flex-1 w-full max-w-md"
        >
          <Carousel className='relative px-4'>
            <CarouselContent>
              {captions.map((caption, index) => (
                <CarouselItem key={index} className="w-full flex flex-col items-center">
                  <motion.div
                    variants={carouselItemVariants}
                    whileHover="hover"
                    className="rounded-full overflow-hidden w-40 h-40"
                  >
                    <motion.img
                      variants={imageHoverVariants}
                      className="object-cover w-full h-full cursor-pointer"
                      src={
                        index === 0
                          ? "https://i.pinimg.com/736x/22/76/fe/2276fe48f131f9209d4e1e0728c60f60.jpg"
                          : index === 1
                          ? "https://i.pinimg.com/736x/64/71/4b/64714be4c86bfdaa1ba6a927700a8e54.jpg"
                          : "https://i.pinimg.com/736x/d9/6e/b9/d96eb9849af8e9fbac113b21782797b6.jpg"
                      }
                      alt={`Slide ${index + 1}`}
                    />
                  </motion.div>
                  <motion.p 
                    variants={textVariants}
                    className="text-sm mt-6 text-center text-muted-foreground px-4"
                  >
                    {caption}
                  </motion.p>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext className="right-2" />
          </Carousel>
        </motion.div>
      </div>

      <Details />
      <Footer />
    </motion.div>
  );
};

export default Home;