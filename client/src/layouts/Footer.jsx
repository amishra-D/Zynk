import { Button } from '@/components/ui/button'
import { Cable, ListCollapse, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate=useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
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
      },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className='bg-gradient-to-b from-background to-[#622505] sm:mt-48 mt-24 bottom-0 flex flex-col w-full items-center justify-center font-plus p-4 gap-4'
    >
      <motion.div
        variants={itemVariants}
        className='sm:w-1/2 sm:self-start font-bold text-white sm:text-4xl text-2xl w-full sm:text-left text-center self-center'
      >
        <h2>
          Connect seamlessly with secure, high-quality video calls.
          Host or join meetings in seconds — no hassle, just clarity.
        </h2>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className='w-full sm:self-end sm:text-xl text-sm text-foreground sm:text-right text-center self-center font-semibold flex flex-col'
      >
        <p>no installs, no fuss.</p>
        <p>Just share your link and start talking.</p>

        <motion.div
          variants={containerVariants}
          className='mt-4 flex flex-col sm:flex-row gap-2 sm:self-end self-center'
        >
          {[ 
            { icon: <Cable className='w-4 h-4' />, label: "Features",path:'/features' },
            { icon: <ListCollapse className='w-4 h-4' />, label: "About Us",path:'/aboutus' },
            { icon: <Send className='w-4 h-4' />, label: "Contact Us",path:'/contactus' }
          ].map(({ icon, label,path }, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button variant="ghost" onClick={()=>navigate(path)} className='gap-2'>
                  {icon}
                  <span>{label}</span>
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className='mt-2 text-neutral-300 text-xs'
      >
        © 2025 Zynk. All rights reserved
      </motion.p>
    </motion.div>
  )
}

export default Footer;
