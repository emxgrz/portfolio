import "./App.css";
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/home/HomePage";
import Navbar from "./components/navbar/Navbar";
import Contact from "./pages/contact/Contact";
import About from "./pages/about/About";
import Projects from "./pages/projects/Projects";
import Footer from "./components/Footer";
import Error404 from "./pages/Error404";

function App() {
  return (
    <div id="root">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/*" element={<Error404 />} />

        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
