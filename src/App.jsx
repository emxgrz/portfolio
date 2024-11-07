import "./App.css";
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/home/HomePage";
import Navbar from "./components/navbar/Navbar";
import Contact from "./pages/contact/Contact";
import About from "./pages/about/About";
import Projects from "./pages/projects/Projects";
import Footer from "./components/footer";

function App() {
  return (
    <>
      <div>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
