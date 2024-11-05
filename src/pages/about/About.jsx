import React from 'react';
import './aboutStyle.css';

function About() {
  return (
    <div className="about-container">
      <h1>About Me</h1>
      <section>
        <p>
          Hi! I’m <strong>Emma</strong>, a 22-year-old Full-Stack Developer with a deep passion for technology and a solid foundation in web development. I recently completed an intensive Full-Stack Web Development bootcamp at Ironhack, where I gained hands-on experience in HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB. Through this experience, I developed a developer’s mindset: solving problems, adapting quickly, and tackling new challenges head-on.
        </p>
      </section>
      
      <section>
        <h2>My Approach</h2>
        <p>
          Though early in my professional journey, I’m committed to continuous learning and always building on my skills. I’m a fast learner and thrive on discovering new technologies and frameworks to deepen my knowledge and deliver efficient, impactful solutions. Technology excites me, and I find it incredibly rewarding to solve complex problems using the best tools to make development smooth and scalable.
        </p>
      </section>

      <section>
        <h2>Values & Goals</h2>
        <p>
          One of my strengths is my enthusiasm for collaboration and growth. I believe in the power of teamwork; working with others not only strengthens the final product but also accelerates my own learning. I’m looking for opportunities in dynamic, creative environments where I can contribute, grow, and make a positive impact.
        </p>
        <p>
          Whether remote or in person, I’m open to relocating if the right opportunity comes along. I look forward to joining a team that values innovation and growth as much as I do!
        </p>
      </section>
    </div>
  );
}

export default About;
