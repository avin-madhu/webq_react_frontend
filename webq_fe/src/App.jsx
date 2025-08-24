import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/appContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import ResourceDetails from './pages/ResourceDetails';
import Navigation from './components/Navigation';

const App = () => (
  <AppProvider>
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/resource/:id" element={<ResourceDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  </AppProvider>
);



export default App;