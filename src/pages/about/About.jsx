import React from "react";
import { motion } from "framer-motion";
import "./aboutStyle.css";
import yo from "../../assets/images/yo.jpeg";

function About() {
  return (
    <motion.div
      className='about-section'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className='about-image'
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img src={yo} alt='image about me' />
      </motion.div>

      <motion.div
        className='about-text'
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <section>
          <p>
            Hi! I’m <strong>Emma</strong>, a 23-year-old Full-Stack Developer
            passionate about technology and software development. I have
            hands-on experience with a variety of technologies including HTML,
            CSS, Typecript, JavaScript, React, Node.js, Express, and MongoDB.
            Currently, I am pursuing a degree in Computer Engineering and while
            working as a Junior Software Developer at a start-up. My key roles
            include creating AI conversational agents, client integration and
            maintenance using both code and no-code tools, and specializing in
            platforms like Twilio and Meta for Developers. I also focus on
            integrating AI to enhance productivity and am skilled in automation.
          </p>
          <section>
            <p>
              Committed to continuous learning, I thrive on discovering new
              technologies to deliver efficient solutions. I enjoy solving
              complex problems and believe in the power of teamwork to
              strengthen products and accelerate learning.
            </p>
          </section>
          <section>
            <p>
              I’m looking for opportunities in dynamic environments where I can
              contribute, grow, and make a positive impact. I am excited to join
              a team that values innovation and growth.
            </p>
          </section>
        </section>
      </motion.div>
    </motion.div>
  );
}

export default About;
