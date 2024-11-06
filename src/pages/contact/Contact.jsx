import React from 'react';
import ContactForm from '../../components/contactForm';
import './contactStyle.css';

function Contact() {
  return (
    <div className="contact-container">
      <h2>Contact Me</h2>
      <div className="contact-links">
        <a href="https://github.com/emxgrz" target="_blank" rel="noopener noreferrer" className="contact-link">GitHub</a>
        <a href="hhttps://www.linkedin.com/in/emma-mtz/" target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>
        <a href="mailto:emmamartinezgarcia2806@gmail.com" className="contact-link">Email</a>
      </div>
      <ContactForm />
    </div>
  );
}

export default Contact;
