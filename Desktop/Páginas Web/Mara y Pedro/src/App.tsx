import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Viernes from './pages/Viernes';
import Sabado from './pages/Sabado';
import Recomendaciones from './pages/Recomendaciones';

function App() {
  return (
    <BrowserRouter>
      <div className="site">
        <TopBar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/viernes" element={<Viernes />} />
            <Route path="/sabado" element={<Sabado />} />
            <Route path="/recomendaciones" element={<Recomendaciones />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <div className="footer-decoration">
            <img
              src="https://www.figma.com/api/mcp/asset/be59f789-4d27-4555-8249-867cd6f53cf8"
              alt="Decorativo footer"
            />
          </div>
          
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
