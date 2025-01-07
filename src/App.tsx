import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Inscription from './pages/Inscription';
import Profile from './pages/Profile';
import Messagerie from './pages/Messagerie';
import Dashboard from './pages/Dashboard';
import Assistance from './pages/Assistance';
import Contact from './pages/Contact';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="inscription" element={<Inscription />} />
        <Route path="profile" element={<Profile />} />
        <Route path="messagerie" element={<Messagerie />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="assistance" element={<Assistance />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;