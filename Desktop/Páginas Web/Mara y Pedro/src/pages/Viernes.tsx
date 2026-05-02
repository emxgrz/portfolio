import FaqAccordion from '../components/FaqAccordion';
import { useState } from 'react';

const Viernes = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const formData = new FormData(e.target);
    formData.append('sheet', 'Viernes');

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
      question: '¿Se pueden traer niños?',
      answer: 'Sí, el viernes sí. Si vais a venir con niños, avisadnos para tenerlo en cuenta.',
    },
    {
      question: '¿Hay código de vestimenta?',
      answer: 'No hay un código de vestimenta cerrado, pero sí una idea bastante clara del ambiente. El novio irá sin corbata ni pajarita, la novia sin cola ni velo, y además estaremos en pleno julio. Así que venid guapos, sí, pero pensando también en el calor y en estar cómodos. La boda es tipo cóctel aunque habrá taburetes y sillas de apoyo.',
    },
    {
      question: '¿Lleváis wedding planner?',
      answer: 'Sí, y menos mal. Contamos con Pepas, así que si queréis organizar una sorpresa, coordinar cualquier detalle o consultar algo relacionado con la boda, podéis escribirles directamente. Si la duda es sobre el modelito que vais a llevar, eso mejor nos lo preguntáis a nosotros, claro. Mamen: +34 686 69 95 06 / Nerea: +34 649 33 61 78',
    },
    {
      question: '¿A qué hora hay que estar?',
      answer: 'Sed puntuales, por favor. Nos casamos al atardecer y no queremos que os perdáis ni un minuto. A las 20:00 en el Ayuntamiento.',
    },
    {
      question: '¿La ceremonia es al aire libre?',
      answer: 'Sí, será en la terraza del Ayuntamiento, así que tened en cuenta que estaremos al aire libre y en verano.',
    },
  ];

  return (
    <>
   

      <div className="section-heading">
        <img
          src="https://www.figma.com/api/mcp/asset/342e5744-9e80-4515-8ace-5857a989e5b3"
          alt="El viernes"
        />
      </div>

      <div className="card-grid">
        <article className="card">
          <img
            src="https://www.figma.com/api/mcp/asset/6dd59913-2c08-458c-9f8c-907b1506fb46"
            alt="La ceremonia"
          />
          <div className="card-body">
            <h2>La ceremonia</h2>
            <p>
              Nos casamos el viernes 10 de julio a las 20:00 h en la terraza del
              Ayuntamiento, justo al atardecer.
            </p>
            <a
              className="button button-secondary"
              href="https://maps.app.goo.gl/WXDLbvm725ZjEPpx7"
            >
              Cómo llegar →
            </a>
          </div>
        </article>

        <article className="card">
          <img
            src="https://www.figma.com/api/mcp/asset/f267c4fd-7677-430a-aa87-d3898a685a13"
            alt="La cena y la fiesta"
          />
          <div className="card-body">
            <h2>La cena y la fiesta</h2>
            <p>
              Después de la ceremonia, nos iremos a Bar Restaurante Wassy para
              seguir celebrándolo juntos.
            </p>
            <a
              className="button button-primary"
              href="https://maps.app.goo.gl/BoWMdHLhPpAJvcv67"
            >
              Cómo llegar →
            </a>
          </div>
        </article>
      </div>

      <div className="section-timeline">
        <img
          src="https://www.figma.com/api/mcp/asset/925c78d5-4d48-484d-9419-5f91875695fd"
          alt="Timeline"
        />
      </div>

      <div className="info-panel">
        <div className="info-block info-orange">
          <div className="info-copy">
            <h3>Mesas altas</h3>
            <p>
              La celebración será tipo cóctel, con mesas altas y algunas zonas
              con taburetes, así que nuestra recomendación oficial es que
              vengáis con calzado cómodo. Queremos que estéis a gusto, que
              comáis, brindéis, bailéis y aguantéis la noche sin estar pensando
              en el dolor de pies.
            </p>
          </div>
          <div className="info-image">
            <img
              src="https://www.figma.com/api/mcp/asset/0f5a6bc0-538b-4d58-ac6b-c5909c82197d"
              alt="Mesas altas"
            />
          </div>
        </div>

        <div className="info-block info-beige">
          <div className="info-image">
            <img
              src="https://www.figma.com/api/mcp/asset/92973740-1f7b-4adb-b20c-816e503eebf7"
              alt="Dress code"
            />
          </div>
          <div className="info-copy">
            <h3>Dress code</h3>
            <p>
              No hay un dress code cerrado ni hace falta venir de un color
              concreto, con smoking ni con grandes complicaciones. Lo importante
              es venir cómodos y acordes al calor.
            </p>
          </div>
        </div>
  <div id="portada" className="portada-block">
  <img
    src="https://www.figma.com/api/mcp/asset/19caf058-e001-42ff-a8c4-a06765ba9671"
    alt="Portada"
    className="portada-img"
  />
  <div className="portada-overlay">
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <input type="text" name="nombre" placeholder="Nombre y Apellidos" className="rsvp-input" required />
      <input type="text" name="intolerancia" placeholder="¿Tienes alguna intolerancia?" className="rsvp-input" required />
      <input type="text" name="cancion" placeholder="¿Cuál es la canción que no debe faltar?" className="rsvp-input" required />
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
    </div>
           <div className="cover-block secondary-cover">
        <img
          src="https://www.figma.com/api/mcp/asset/c8c05b15-1cba-40da-b2f7-8b3b35442aa5"
          alt="El viernes detalle"
        />
      </div>


 

    
    </>
  );
};

export default Viernes;
