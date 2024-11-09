import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

function Error404() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Container className="text-center mt-5">
      <FaExclamationTriangle size={64} color="#dc3545" className="mb-4" />
      <h1 className="mb-3">Página no encontrada</h1>
      <p
        className="mb-4 mx-auto"
        style={{
          maxWidth: "560px",
          textAlign: "center",
          border: "1px solid white",
          fontSize: "1.2rem",
        }}
      >
        Lo sentimos, no hemos podido encontrar la página que buscas 🕵🏻 Pero no
        te preocupes, puedes volver a la página anterior o ir a la página
        principal 👩‍🚀
      </p>

      <Button variant="primary" onClick={goBack} className="me-2">
        Vuelve atrás
      </Button>
      <Button variant="secondary" onClick={() => navigate("/")}>
        Página principal
      </Button>
    </Container>
  );
}

export default Error404;