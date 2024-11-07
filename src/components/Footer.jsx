import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="footer bg-dark text-white py-3"
      style={{ position: "relative" }}
    >
      <Container>
        <Row className="d-flex align-items-center justify-content-between">
          <Col className="text-center mb-2 mb-md-0">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Emma García - Full Stack Developer
            </p>
          </Col>

          <Col className="text-center mb-2 mb-md-0">
            <p className="mb-0 d-inline">Follow me! </p>
            <div className="social-icons d-inline-flex ms-2">
              <a
                href="https://www.linkedin.com/in/emma-martinez-garcia/"
                className="text-white me-3"
              >
                <FaLinkedin size={24} />
              </a>
              <a href="https://github.com/emxgrz" className="text-white">
                <FaGithub size={24} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;