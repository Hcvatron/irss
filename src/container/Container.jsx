import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from '../component/Header/Header';
import Home from '../component/Home/Home';
import Dashboard from '../component/Dashboard/Dashboard';
import Admin from '../component/Admin/Log/AdminLogin'; // Import your Admin component
import { useLoginProvider } from '../context/LoginContext';
import AdminDashboard from '../component/Admin/dashboard/AdminDashboard';
import { useAdminProvider } from '../context/AdminContext';


const MainContent = () => {
  const { user } = useLoginProvider();
  const { admin } = useAdminProvider();
  const location = useLocation();


  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div>
      {!isAdminRoute && <Header />} 
      <Routes>
        <Route path="/" element={!user ? <Home /> : <Navigate to="/banking/dashboard" />} />
        <Route path="/banking/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/admin" element={!admin ? <Admin /> :  <Navigate to="/admin/dashboard" /> } /> 
        <Route path="/admin/dashboard" element={admin ? <AdminDashboard /> :  <Navigate to="/admin" />} /> 
      </Routes>
    </div>
  );
};

const Container = () => {
  return (
    <Router>
      <MainContent />
    </Router>
  );
};

export default Container;
