import { HashRouter, Link, NavLink, Navigate, Route, Routes } from 'react-router';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProofPage from './pages/ProofPage';
import AtlasPage from './pages/AtlasPage';
import './App.css';

export default function App() {
  return (
    <HashRouter>
      <div className="shell">
        <header className="topbar">
          <Link to="/" className="brand">
            <span className="brand-mark" />
            Proof Atlas
          </Link>
          <nav className="topnav">
            <NavLink to="/" end>
              Tracks
            </NavLink>
            <NavLink to="/atlas">Map</NavLink>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/atlas" element={<AtlasPage />} />
            <Route path="/track/:categoryId" element={<CategoryPage />} />
            <Route path="/proof/:proofId" element={<ProofPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="footer">
          Formal proofs, interactive visualizations, and the physical objects that carry the same structure.
        </footer>
      </div>
    </HashRouter>
  );
}
