import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "./projectsStyle.css"

const ProjectList = () => {
  const [selectedId, setSelectedId] = useState(null);

  const items = [
    {
      id: 'project1',
      title: 'Komune',
      subtitle: 'Single Page Application (SPA) developed with React and Express.js, 2024',
      description: 'This project uses React on the frontend and Express.js on the backend to provide a smooth and dynamic user experience. The application features authentication and validation to ensure the security and integrity of the data.',
      about: "",
    },
    {
      id: 'project2',
      title: 'HeroZone',
      subtitle: 'Single Page Application (SPA) developed with React and Node.js, 2024',
      description: 'Used React for the front end, with reusable components and React Router for seamless navigation. Responsive design, real-time interaction with API data, and state management with hooks to enhance reactivity and performance.'
    }
  ];

  return (
    <div style={{ position: 'relative'}}>
      {items.map(item => (
        <motion.div 
          key={item.id}
          layoutId={item.id}
          onClick={() => setSelectedId(item.id)}
          className="project1"
          whileHover={{ scale: 1.05 }} 
        >
          <motion.h5>{item.subtitle}</motion.h5>
          <motion.h2>{item.title}</motion.h2>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedId && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10
          }}>
            <motion.div 
              layoutId={selectedId} 
              className="project-detail"
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8 }} 
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                zIndex: 20
              }}
            >
              {items.find(item => item.id === selectedId) && (
                <>
                  {/* <motion.h5>{items.find(item => item.id === selectedId).subtitle}</motion.h5> PONER FOTOS, DESCRIPCIÓN DEL PROYECTO EN LA CARTA*/}
                  <motion.h2>{items.find(item => item.id === selectedId).title}</motion.h2>
                  <motion.p>
                    {items.find(item => item.id === selectedId).description}
                  </motion.p>
                  <motion.button 
                    onClick={() => setSelectedId(null)}
                  >
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
