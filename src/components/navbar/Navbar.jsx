// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './navbarStyle.css';
// import image2 from "../../assets/images/image2.png"

// function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden'; 
//     } else {
//       document.body.style.overflow = 'auto'; 
//     }
//   }, [isOpen]);

  
//   return (
//     <nav className={`navbar navbar-expand-lg custom-navbar ${isOpen ? 'open' : ''}`}>
//       <div className="container">
//         <Link to="/" className="navbar-brand text-white">
          
//           <img src={image2} alt="logo image" style={{width:"18%"}}/>
          
//         </Link>

//         <button className="navbar-toggler text-white" type="button" onClick={toggleMenu}>
//           Menu
//         </button>

//         <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
//           <ul className="navbar-nav ms-auto">
//             <li className="nav-item">
//               <Link to="/projects" className="nav-link text-white">
//                 Projects
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link to="/about" className="nav-link text-white">
//                 About
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link to="/contact" className="nav-link text-white">
//                 Contact
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import { NavLink } from "react-router-dom";
import image2 from "../../assets/images/image2.png"
import './navbarStyle.css';

function Navbar() {
  const handleNavLinkClick = () => {
    const navCollapse = document.getElementById("navbarNav");
    if (navCollapse.classList.contains("show")) {
      navCollapse.classList.remove("show"); 
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/" onClick={handleNavLinkClick}>
        <img src={image2} alt="logo image" style={{width:"18%"}}/>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/projects"
                onClick={handleNavLinkClick}
              >
                {" "}
                projects{" "}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                aria-current="page"
                to="/about"
                onClick={handleNavLinkClick}
              >
                {" "}
                about{" "}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/contact"
                onClick={handleNavLinkClick}
              >
                {" "}
                contact{" "}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
