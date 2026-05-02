import { NavLink } from 'react-router-dom';

const TopBar = () => {
  return (
    <header className="topbar">
      <NavLink className="brand" to="/">
        MARA & PEDRO
      </NavLink>
      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Inicio
        </NavLink>
        <NavLink to="/viernes" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Viernes
        </NavLink>
        <NavLink to="/sabado" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Sábado
        </NavLink>
        <NavLink to="/recomendaciones" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Recomendaciones
        </NavLink>
      </nav>
    </header>
  );
};

export default TopBar;
