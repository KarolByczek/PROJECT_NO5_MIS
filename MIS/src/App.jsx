import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import DuarealismPage from './pages/DuarealismPage';
import ProexistentialismPage from './pages/ProexistentialismPage';
import { HelmetProvider } from 'react-helmet-async';
import UniformismPage from './pages/UniformismPage';
import './index.scss';


function App() {
  return (
    <HelmetProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/duarealizm" element={<DuarealismPage />} />
            <Route path="/proegzystencjalizm" element={<ProexistentialismPage />} />
            <Route path="/uniformizm" element={<UniformismPage />}></Route>
          </Routes>
        </Router>
    </HelmetProvider>
  );
}

export default App;