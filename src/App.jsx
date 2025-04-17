import { useState, useEffect } from 'react'
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './common/header'
import Footer from './common/footer'
import Home from './components/home/home'
import About from './components/about/about'
import Contact from './components/contactUs/contact'
import Reviews from './components/reviews/reviews';
import Packages from './components/packages/packages';
import Gallery from './components/gallery/gallery';

import Admin from './components/admin/admin';
import AdminLogin from './components/admin/adminLogin';
import ResetPassword from './components/admin/resetPassword';

function App() {

  const location = useLocation();
  const isAdminRoute=location.pathname.startsWith('/admin');
  
  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/contact-us' element={<Contact/>} />
        <Route path='/reviews' element={<Reviews/>} />
        <Route path='/packages' element={<Packages/>} />
        <Route path='/gallery' element={<Gallery/>} />

        {/* admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route
          path="/admin"
          element={<Admin/>}
        />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App
