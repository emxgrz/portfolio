import React, { useState } from 'react';
import emailjs from 'emailjs-com';

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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            type="text" 
            value={name} 
            placeholder='write here your name 🖊️'
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <input 
            type="email" 
            value={email}
            placeholder='here goes your email ✉️'
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <input 
            type="text" 
            value={subject} 
            placeholder="what's the matter? 📄"
            onChange={(e) => setSubject(e.target.value)} 
            required 
          />
        </div>
        <div>
          <textarea 
            value={message} 
            placeholder="anything else you'd like to say? ⌨️"
            onChange={(e) => setMessage(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Send 📤</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default ContactForm;
