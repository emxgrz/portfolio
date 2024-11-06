import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './navbarStyle.css';
import image2 from "../../assets/images/image2.png"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Añadir o quitar la clase que controla el overflow del body
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Evita que el fondo se desplace
    } else {
      document.body.style.overflow = 'auto'; // Permite el desplazamiento normal
    }
  }, [isOpen]);

  
  return (
    <nav className={`navbar navbar-expand-lg custom-navbar ${isOpen ? 'open' : ''}`}>
      <div className="container">
        <Link to="/" className="navbar-brand text-white">
          
          <img src={image2} alt="logo image" style={{width:"18%"}}/>
          
        </Link>

        <button className="navbar-toggler text-white" type="button" onClick={toggleMenu}>
          Menu
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/projects" className="nav-link text-white">
                Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link text-white">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

