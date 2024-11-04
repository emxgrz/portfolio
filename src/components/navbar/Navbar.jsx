import React from 'react'
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <Link to="/">LOGO</Link>
      <Link to="/projects">projects</Link>
      <Link to="/about">about</Link>
      <Link to="/contact">contact</Link>
    </div>
  )
}

export default Navbar