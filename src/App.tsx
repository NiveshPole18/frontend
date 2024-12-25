import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Products from './pages/Products.tsx';
import Cart from './pages/Cart.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Complaints from './pages/Complaints.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/complaints" element={<Complaints />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;

