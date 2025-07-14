import React from "react";
import "./homeStyle.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/projects");
  };

  return (
    <div className='main-container'>
      <div className='content'>
        <h1>Hey! I'm Emma ;)</h1>
        <p>a software developer with a passion for learning</p>
        <button onClick={handleClick}>Click here to see my work</button>

        <div className='icon-container'>
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg'
            alt='HTML5'
          />
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg'
            alt='CSS3'
          />
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg'
            alt='JavaScript'
          />
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg'
            alt='React'
          />
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg'
            alt='Node.js'
          />
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg'
            alt='Express'
          />
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg'
            alt='Git'
          />
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg'
            alt='Bootstrap'
          />
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg'
            alt='Python'
          />
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jasmine/jasmine-original.svg'
            alt='Jasmine'
          />
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg'
            alt='MySQL'
          />
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg'
            alt='Vite'
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
