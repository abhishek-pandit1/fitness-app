import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
// cant use <a> in react, instead, use <link> from react router dom
import { Link, useLocation } from "react-router-dom";
import Auth from "../utils/auth"
import heart from "../assets/images/heart.png"

export default function Header() {
  const loggedIn = Auth.loggedIn();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for transparent to solid navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Determine navbar background
  let navbarClass = "custom-navbar";
  
  if (loggedIn) {
    if (isHomePage) {
      navbarClass += scrolled ? " navbar-scrolled" : " navbar-transparent";
    } else {
      navbarClass += " navbar-dark";
    }
  } else {
    navbarClass += (isLoginPage || isSignupPage) ? " navbar-light" : " navbar-transparent";
  }

  return (
    <Navbar 
      collapseOnSelect 
      expand="lg" 
      fixed="top" 
      className={navbarClass}
    >
      <Container>
        {loggedIn ? (
          <>
            <Navbar.Brand as={Link} to="/" className="brand d-flex align-items-center">
              <img alt="heart" src={heart} className="heart-icon" />
              <span className="brand-text">FitTrack</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
              <Nav>
                <Nav.Link as={Link} to="/exercise" className="nav-item" active={location.pathname === '/exercise'}>
                  <span className="nav-link-inner">Exercise</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/history" className="nav-item" active={location.pathname === '/history'}>
                  <span className="nav-link-inner">History</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/ai-workout" className="nav-item" active={location.pathname === '/ai-workout'}>
                  <span className="nav-link-inner">AI Workout</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className="nav-item" active={location.pathname === '/profile'}>
                  <span className="nav-link-inner">Profile</span>
                </Nav.Link>
                <Nav.Link onClick={Auth.logout} className="nav-item logout-link">
                  <span className="nav-link-inner">Logout</span>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        ) : (
          <Navbar.Brand as={Link} to="/" className="brand mx-auto d-flex align-items-center">
            <img alt="heart" src={heart} className="heart-icon" />
            <span className="brand-text">FitTrack</span>
          </Navbar.Brand>
        )}
      </Container>
    </Navbar>
  );
}
