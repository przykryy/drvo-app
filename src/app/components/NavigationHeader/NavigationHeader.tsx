import React, { useState } from 'react';
import './navigation-header.scss'; 


export const NavigationHeader = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <header className="main-header">
      <nav>
        <div className="logo">Twoja Strona</div>
        <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <button onClick={toggleMenu} className="menu-toggle">
          {isMenuOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </nav>
    </header>
  );
};

export default NavigationHeader;
