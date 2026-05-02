import FaqAccordion from '../components/FaqAccordion';
import { useState } from 'react';

const Sabado = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const formData = new FormData(e.target);
    formData.append('sheet', 'Sábado');

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwt9viJur4CWxM0ib1c6Pg4Q5DBjTh5bIW97Ssdvxc_P6ZhZl-KylJSGhge-sZjkD3R2w/exec', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setSubmitMessage('¡Gracias por confirmar tu asistencia!');
        e.target.reset();
      } else {
        setSubmitMessage('Error al enviar. Inténtalo de nuevo.');
      }
    } catch (error) {
      setSubmitMessage('Error de conexión. Inténtalo de nuevo.');
    }

    setIsSubmitting(false);
  };

  const faqItems = [
    {
      question: '¿Hay que cumplir el código de vestimenta?',
      answer: 'Pues claro que sí. No me he pasado horas haciendo el moodboard, pensando colores y observando vuestros ropajes para que luego os tengamos que borrar con Photoshop. El sábado sí hay que respetar la estética de la boda.',
    },
    {
      question: '¿Se pueden traer niños?',
      answer: 'El sábado no. Ese día la celebración será solo para adultos.',
    },
    {
      question: '¿Habrá sorpresas?',
      answer: 'Si quieres montar una, habla con Pepas (pon los números).',
    },
    {
      question: '¿Puedo llevar tacones imposibles?',
      answer: 'Poder, puedes. Aguantarlos ya es otra cosa. Habrá mesas altas y algo de taburete, así que luego no digáis que no avisamos.',
    },
  ];

  return (
    <>
      <section className="saturday-hero">
        <img
          className="hero-background"
          src="https://www.figma.com/api/mcp/asset/c1b68877-a9a3-4d19-96fa-1666a0fb4c62"
          alt="El sábado"
        />
        
       
      </section>
          <div id="portada" className="portada-block">
  <img
    src="https://www.figma.com/api/mcp/asset/19caf058-e001-42ff-a8c4-a06765ba9671"
    alt="Portada"
    className="portada-img"
  />
  <div className="portada-overlay">
    <form className="rsvp-form saturday-rsvp-form" onSubmit={handleSubmit}>
      <input type="text" name="nombre" placeholder="Nombre y Apellidos" className="rsvp-input" required />
      <input type="text" name="intolerancia" placeholder="¿Tienes alguna intolerancia?" className="rsvp-input" required />
      <input type="text" name="cancion" placeholder="¿Cuál es la canción que no debe faltar?" className="rsvp-input" required />
       <input type="text" name="autobus" placeholder="¿Usarás el servicio de autobuses?" className="rsvp-input" required />
      <button type="submit" className="rsvp-button" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : '¡Claro que voy!'}
      </button>
      {submitMessage && <p className="submit-message">{submitMessage}</p>}
      <p className="rsvp-note">* Si vienes con acompañante, rellena el formulario de nuevo; una respuesta por persona.</p>
    </form>
  </div>
</div>


 

      <FaqAccordion
        items={faqItems}
        backgroundImage="https://www.figma.com/api/mcp/asset/dc2b344a-f8d4-4f5c-9621-8b5224271942"
      />

     <section className="section saturday-banner">
        <img
          src="https://www.figma.com/api/mcp/asset/c877001e-8dbe-4b57-ad2f-45b0043d229c"
          alt="Decoración secundaria"
        />
      </section>

    
    </>
  );
};

export default Sabado;
