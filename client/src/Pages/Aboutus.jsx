import Header from '@/layouts/Header'
import { motion } from 'framer-motion'
import React from 'react'

const Aboutus = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren"
      }
    }
  }

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
  }

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 10,
        delay: 0.3
      }
    }
  }

  const dotVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 8
      }
    }
  }

  return (
    <div className='flex flex-col w-full min-h-screen bg-background font-plus'>
      <Header />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className='flex-1 flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 py-12 gap-12 max-w-7xl mx-auto'
      >
        <div className='w-full lg:w-1/2 flex flex-col gap-8'>
          <motion.div variants={itemVariants} className='relative'>
            <h1 className='font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6'>
              About <span className='text-orange-500'>Us</span>
            </h1>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            className='space-y-6 text-lg md:text-xl text-muted-foreground'
          >
            <motion.p 
              variants={itemVariants}
              className='relative pl-6 border-l-4 border-orange-500'
              whileHover={{ x: 5 }}
            >
              <motion.span 
                className='absolute -left-1 top-0 w-3 h-3 bg-orange-500 rounded-full'
                variants={dotVariants}
              />
              In a world full of noise, we believe communication should feel effortless, human, and secure.
            </motion.p>
            
            <motion.p 
              variants={itemVariants}
              className='relative pl-6 border-l-4 border-orange-400'
              whileHover={{ x: 5 }}
            >
              <motion.span 
                className='absolute -left-1 top-0 w-3 h-3 bg-orange-400 rounded-full'
                variants={dotVariants}
              />
              Our mission is simple: to remove barriers. No downloads, no delays — just real-time connection that works.
            </motion.p>
            
            <motion.p 
              variants={itemVariants}
              className='relative pl-6 border-l-4 border-orange-300'
              whileHover={{ x: 5 }}
            >
              <motion.span 
                className='absolute -left-1 top-0 w-3 h-3 bg-orange-300 rounded-full'
                variants={dotVariants}
              />
              Built with passion, privacy, and performance at its core, we're redefining how people meet, talk, and collaborate online.
            </motion.p>
          </motion.div>
        </div>
        
        <motion.div 
          variants={imageVariants}
          className='w-full lg:w-1/2'
        >
          <motion.div 
            className='relative rounded-2xl overflow-hidden aspect-video shadow-lg'
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <img 
              src="https://i.pinimg.com/736x/ef/4b/4c/ef4b4c63892803100e7efe85dbccb5ca.jpg" 
              alt="Team collaborating" 
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-background/30'/>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Aboutus