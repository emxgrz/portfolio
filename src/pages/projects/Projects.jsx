import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './projectsStyle.css';
import image1 from '../../assets/images/komune/image1.png';
import image2 from '../../assets/images/komune/image2.png';
import image3 from '../../assets/images/komune/image3.png';
import image4 from '../../assets/images/komune/image4.png';
import image5 from '../../assets/images/komune/image5.png';
import image8 from '../../assets/images/herozone/image6.png';
import image7 from '../../assets/images/herozone/image7.png';
import image6 from '../../assets/images/herozone/image8.png';

const ProjectList = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const items = [
    {
      id: 'project1',
      title: 'Komune',
      subtitle: 'Single Page Application (SPA) developed with React and Express.js, 2024',
      description:
        'This project uses React on the frontend and a custom-built backend with Express.js, Node.js, and MongoDB to deliver a dynamic user experience. A robust RESTful API manages multiple data models, while secure user authentication and data handling ensure the integrity and privacy of information throughout the application.',
      about: 'A platform that enables professionals to exchange services with one another, operating as a modern barter network.',
      githubLink: 'https://github.com/emxgrz/komune_client',
      images: [image1, image2, image3, image4, image5],
    },
    {
      id: 'project2',
      title: 'HeroZone',
      subtitle: 'Single Page Application (SPA) developed with React and Node.js, 2024',
      description:
        'Used React for the front end, with reusable components and React Router for seamless navigation. Responsive design, real-time interaction with API data, and state management with hooks to enhance reactivity and performance.',
      about: 'An interactive platform for superhero and comic fans, where users can explore a library of Marvel heroes, comics, and storylines',
      githubLink: 'https://github.com/emxgrz/HeroZone_frontend',
      images: [image6, image7, image8],
    },
  ];

  const handlePrevImage = () => {
    const currentItem = items.find((item) => item.id === selectedId);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? currentItem.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    const currentItem = items.find((item) => item.id === selectedId);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === currentItem.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="project-list">
      {items.map((item) => (
        <motion.div
          key={item.id}
          layoutId={item.id}
          onClick={() => setSelectedId(item.id)}
          className="project-item"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div className="project-carousel">
            <motion.img
              src={item.images[0]}
              alt={`${item.title} preview`}
              className="carousel-preview"
            />
          </motion.div>
          <motion.h2>{item.title}</motion.h2>
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
              <motion.h2>{items.find((item) => item.id === selectedId).title}</motion.h2>
              <motion.p>{items.find((item) => item.id === selectedId).description}</motion.p>

              <div className="carousel-container">
                <motion.img
                  src={items.find((item) => item.id === selectedId).images[currentImageIndex]}
                  alt="Project image"
                  className="carousel-image"
                />
                <div className="carousel-controls">
                  <button className="prev" onClick={handlePrevImage}>←</button>
                  <button className="next" onClick={handleNextImage}>→</button>
                </div>
              </div>

              <div className="modal-buttons">
                <button onClick={() => setSelectedId(null)} className="modal-back">Back</button>
                <a
                  href={items.find((item) => item.id === selectedId).githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-code"
                >
                  Wanna see the code?
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectList;
