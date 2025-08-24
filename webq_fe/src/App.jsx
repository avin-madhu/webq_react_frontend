import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/appContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HeroPage from './pages/HeroPage';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import ResourceDetails from './pages/ResourceDetails';

const Layout = () => {
  const location = useLocation();
  const showNav = location.pathname !== '/';
  return (
    <>
      {showNav && <Header />}
      {showNav && <Navigation />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/resource/:id" element={<ResourceDetails />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => (
  <AppProvider>
    <Router>
      <Layout />
    </Router>
  </AppProvider>
);

export default App;