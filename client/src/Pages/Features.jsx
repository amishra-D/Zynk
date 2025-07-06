import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Header from '@/layouts/Header';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

const Features = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 10,
        delay: 0.2
      }
    }
  };

  const featureItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    })
  };

  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    { 
      desc: 'one-on-one video calls', 
      img: 'https://i.pinimg.com/736x/d8/6b/87/d86b870615079c340205cd85b4e5ee9b.jpg',
      highlight: 'Crystal clear conversations'
    },
    { 
      desc: 'high-quality audio and video', 
      img: 'https://i.pinimg.com/736x/ca/89/3f/ca893fb5e3ca379d853c2296f280f519.jpg',
      highlight: 'Studio-quality streaming'
    },
    { 
      desc: 'real-time in-call chat', 
      img: 'https://i.pinimg.com/736x/e2/36/f3/e236f32a9d24460389e1df94e75560b6.jpg',
      highlight: 'Seamless messaging'
    },
    { 
      desc: 'screen sharing and mic/cam control', 
      img: 'https://i.pinimg.com/736x/8e/ed/f5/8eedf59b4d99ed7fa94501da3a1c5282.jpg',
      highlight: 'Total presentation control'
    },
    { 
      desc: 'instant room creation', 
      img: 'https://i.pinimg.com/736x/2a/47/6d/2a476d30a45eeb8928247ea64a6b7b63.jpg',
      highlight: 'One-click meetings'
    }
  ];

  const progressValue = (active / (features.length - 1)) * 100;

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setActive(prev => (prev === features.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isHovered, features.length]);

  const handlePrev = () => {
    setActive(prev => (prev === 0 ? features.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActive(prev => (prev === features.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background font-plus">
      <Header />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-1 flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 py-12 gap-8"
      >
        <div className="w-full lg:w-1/2 space-y-8">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-bold text-foreground"
          >
            Discover <span className="text-orange-500">Powerful</span> Features
          </motion.h1>
          
          <motion.div 
            variants={containerVariants}
            className="relative space-y-6 pl-6"
          >
            {features.map((feature, index) => (
              <motion.p
                key={index}
                custom={index}
                variants={featureItemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ x: 5 }}
                className={`text-lg sm:text-xl transition-all duration-300 ${
                  active === index 
                    ? 'text-foreground scale-[1.02] pl-2 border-l-4 border-orange-500' 
                    : 'opacity-70'
                }`}
              >
                <span className={`font-semibold ${
                  active === index ? 'text-orange-500' : 'text-muted-foreground'
                }`}>
                  {feature.highlight}:
                </span> {feature.desc}
              </motion.p>
            ))}
          </motion.div>
        </div>

        <motion.div 
          variants={imageVariants}
          className="w-full lg:w-1/2 flex flex-col items-center gap-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div 
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl aspect-video"
          >
            <img 
              src={features[active].img} 
              alt={features[active].desc} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-4 left-4 text-white text-lg font-medium"
            >
              {features[active].highlight}
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-md flex items-center gap-4"
          >
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePrev}
                className="rounded-full hover:bg-orange-500/10 hover:text-orange-500"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </motion.div>
            
            <Progress 
              value={progressValue} 
              className="flex-1 h-2 [&>div]:bg-orange-500" 
            />
            
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNext}
                className="rounded-full hover:bg-orange-500/10 hover:text-orange-500"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Features;