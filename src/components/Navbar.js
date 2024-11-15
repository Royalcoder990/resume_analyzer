// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-lg font-semibold">Resume Analyzer</h1>
        <ul className="flex space-x-4">
          <li><Link to="/" className="text-white hover:text-gray-200">Home</Link></li>
          <li><Link to="/about" className="text-white hover:text-gray-200">About</Link></li>
          <li><Link to="/contact" className="text-white hover:text-gray-200">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
