import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "./projectsStyle.css";

const ProjectList = () => {
  const [selectedId, setSelectedId] = useState(null);

  const items = [
    {
      id: 'project1',
      title: 'Komune',
      subtitle: 'Single Page Application (SPA) developed with React and Express.js, 2024',
      description: 'This project uses React on the frontend and a custom-built backend with Express.js, Node.js, and MongoDB to deliver a dynamic user experience. A robust RESTful API manages multiple data models, while secure user authentication and data handling ensure the integrity and privacy of information throughout the application.',
      about: "A platform that enables professionals to exchange services with one another, operating as a modern barter network. This system empowers users to leverage their skills and expertise to access valuable services without traditional payment, fostering collaboration and resource-sharing within the professional community.",
    },
    {
      id: 'project2',
      title: 'HeroZone',
      subtitle: 'Single Page Application (SPA) developed with React and Node.js, 2024',
      description: 'Used React for the front end, with reusable components and React Router for seamless navigation. Responsive design, real-time interaction with API data, and state management with hooks to enhance reactivity and performance.',
      about: "HeroZone is an interactive platform for superhero and comic fans, where users can explore a vast library of Marvel heroes, comics, and storylines. HeroZone offers both discovery and creativity, letting fans dive into Marvel’s universe while crafting their own heroes"
    }
  ];

  return (
    <div style={{ position: 'relative', paddingTop: '4rem' }}>
      {items.map(item => (
        <motion.div 
          key={item.id}
          layoutId={item.id}
          onClick={() => setSelectedId(item.id)}
          className="project1"
          whileHover={{ scale: 1.05 }}
        >
          <motion.h2>{item.title}</motion.h2>
          <motion.h5>{item.subtitle}</motion.h5>
          <motion.h6>{item.about}</motion.h6>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedId && (
          <div className="project-modal-overlay">
            <motion.div 
              layoutId={selectedId} 
              className="project-detail"
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {items.find(item => item.id === selectedId) && (
                <>
                  <motion.h2>{items.find(item => item.id === selectedId).title}</motion.h2>
                  <motion.p>
                    {items.find(item => item.id === selectedId).description}
                  </motion.p>
                  <motion.button onClick={() => setSelectedId(null)}>
                    Cerrar
                  </motion.button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectList;
