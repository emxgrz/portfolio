import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";

import "./navbarStyle.css";

function Navbar() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navRef = useRef(null);

  const handleNavLinkClick = () => {
    setIsNavCollapsed(true);
  };

  const handleToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsNavCollapsed(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className='navbar navbar-expand-lg navbar-dark bg-dark fixed-top'
      ref={navRef}
    >
      <div className='container-fluid'>
        <NavLink
          className='navbar-brand'
          to='/'
          onClick={handleNavLinkClick}
          style={{ padding: "0 3px 0 3px" }}
        >
          <IoHomeOutline />
        </NavLink>
        <button
          className='navbar-toggler'
          type='button'
          onClick={handleToggle}
          aria-controls='navbarNav'
          aria-expanded={!isNavCollapsed ? "true" : "false"}
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div
          className={`collapse navbar-collapse ${
            !isNavCollapsed ? "show" : ""
          }`}
          id='navbarNav'
        >
          <ul className='navbar-nav ms-auto'>
            <li className='nav-item'>
              <NavLink
                className='nav-link'
                to='/projects'
                onClick={handleNavLinkClick}
              >
                projects
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                className='nav-link'
                to='/about'
                onClick={handleNavLinkClick}
              >
                about
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                className='nav-link'
                to='/contact'
                onClick={handleNavLinkClick}
              >
                contact
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
