import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from '../../components/contactForm';
import './contactStyle.css';

function Contact() {
  return (
    <motion.div 
      className="contact-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2>Contact me!</h2>
      
      <motion.div 
        className="contact-links"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.a 
          href="https://github.com/emxgrz" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="contact-link"
          whileHover={{ scale: 1.1 }}
        >
          GitHub
        </motion.a>
        
        <motion.a 
          href="https://www.linkedin.com/in/emma-mtz/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="contact-link"
          whileHover={{ scale: 1.1 }}
        >
          LinkedIn
        </motion.a>
        
        <motion.a 
          href="mailto:emmamartinezgarcia2806@gmail.com" 
          className="contact-link"
          whileHover={{ scale: 1.1 }}
        >
          Email
        </motion.a>
      </motion.div>
      
      <ContactForm />
    </motion.div>
  );
}

export default Contact;

