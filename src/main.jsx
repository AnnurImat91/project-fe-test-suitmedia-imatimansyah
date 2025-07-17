import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import Work from './pages/Work.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Ideas from './pages/Ideas.jsx';
import Careers from './pages/Careers.jsx';
import Contact from './pages/Contact.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/work" element={<Work />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/ideas" element={<Ideas />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  </BrowserRouter>
);