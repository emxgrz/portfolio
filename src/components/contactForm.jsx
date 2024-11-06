import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import "../pages/contact/contactStyle.css"

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      name,
      email,
      subject,
      message,
    };

    emailjs.init(import.meta.env.VITE_EMAILJS_MY_PUBLIC_KEY);

    emailjs.send(import.meta.env.VITE_EMAILJS_MY_SERVICE_KEY, import.meta.env.VITE_EMAILJS_MY_TEMPLATE_KEY, templateParams)
      .then((response) => {
        console.log('Email sent successfully:', response.status, response.text);
        setStatus('Email sent successfully!');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }, (err) => {
        console.error('Failed to send email:', err);
        setStatus('Failed to send email. Please try again later.');
      });
  };

  return (
    <div className="form-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Subject:</label>
          <input 
            type="text" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Send</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default ContactForm;
