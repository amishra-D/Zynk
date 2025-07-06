import Header from '@/layouts/Header'
import { MapPin, MessageSquare, PhoneCall, Mail, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Contactus = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    }),
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
    }
  }

  const buttonVariants = {
    hover: {
      backgroundColor: "rgba(234, 88, 12, 0.1)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  }

  const contactMethods = [
    {
      name: 'Chat Support',
      logo: <MessageSquare className="w-8 h-8 text-orange-500" />,
      description: '24/7 live chat assistance',
      action: 'Start Chat',
      details: 'Typically replies in under 5 minutes'
    },
    {
      name: 'Visit Us',
      logo: <MapPin className="w-8 h-8 text-orange-500" />,
      description: 'Our headquarters',
      action: 'Get Directions',
      details: '28/A Newtown, Kolkata 700001'
    },
    {
      name: 'Call Us',
      logo: <PhoneCall className="w-8 h-8 text-orange-500" />,
      description: 'Direct phone support',
      action: 'Call Now',
      details: '+91 9087753456'
    },
    {
      name: 'Email Us',
      logo: <Mail className="w-8 h-8 text-orange-500" />,
      description: 'Send us a message',
      action: 'Send Email',
      details: 'anshumishraocog@gmail.com'
    }
  ]
  
  return (
    <div className='w-full min-h-screen flex flex-col bg-background font-plus'>
      <Header/>
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className='flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24'
      >
        <motion.div 
          variants={itemVariants}
          className='text-center mb-16'
        >
          <motion.h1 
            className='font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-4'
            whileHover={{ scale: 1.02 }}
          >
            Contact <span className='text-orange-500'>Us</span>
          </motion.h1>
          <motion.p 
            className='text-lg text-muted-foreground max-w-2xl mx-auto'
            whileHover={{ x: 5 }}
          >
            We're here to help and answer any questions you might have. 
            Let's talk about how we can serve you better.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20'
        >
          {contactMethods.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              whileHover="hover"
            >
              <Card className='h-full'>
                <CardHeader className='items-center'>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    {item.logo}
                  </motion.div>
                  <CardTitle className='text-center'>{item.name}</CardTitle>
                  <CardDescription className='text-center'>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className='text-center'>
                  <p className='text-sm text-muted-foreground'>{item.details}</p>
                </CardContent>
                <CardFooter className='justify-center'>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button variant="ghost" className='border-orange-500 text-orange-500'>
                      {item.action}
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>        

        <motion.div 
          variants={itemVariants}
          className='max-w-4xl mx-auto mt-2 flex items-center gap-4 bg-card rounded-xl p-6'
          whileHover={{ scale: 1.01 }}
        >
          <motion.div 
            whileHover={{ rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <Clock className='w-8 h-8 text-orange-500' />
          </motion.div>
          <div>
            <h3 className='font-semibold'>Our Support Hours</h3>
            <p className='text-sm text-muted-foreground'>
              Monday - Friday: 9:00 AM to 6:00 PM (PST) | 
              Saturday: 10:00 AM to 4:00 PM | 
              Sunday: Closed
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Contactus