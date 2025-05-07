import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Auth from '../utils/auth';

const AppNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
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

  const getNavbarClass = () => {
    let classes = 'custom-navbar';
    
    if (scrolled) {
      classes += ' navbar-scrolled';
    } else {
      if (location.pathname === '/') {
        classes += ' navbar-transparent';
      } else {
        classes += ' navbar-dark';
      }
    }
    
    return classes;
  };

  return (
    <>
      <Navbar 
        expand="lg" 
        className={getNavbarClass()} 
        fixed="top" 
        expanded={expanded} 
        onToggle={(expanded) => setExpanded(expanded)}
      >
        <Container fluid className="nav-container">
          <Navbar.Brand as={Link} to="/" className="brand-link">
            <span className="brand-text">Fitness Tracker</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="navbar" />
          
          <Navbar.Collapse id="navbar" className="justify-content-end">
            <Nav className="ml-auto">
              {Auth.loggedIn() ? (
                <>
                  <Nav.Item>
                    <Nav.Link 
                      as={Link} 
                      to="/me" 
                      className={location.pathname === '/me' ? 'active' : ''}
                      onClick={() => setExpanded(false)}
                    >
                      <span className="nav-link-inner">
                        Dashboard
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                  
                  <Nav.Item>
                    <Nav.Link 
                      as={Link} 
                      to="/exercises" 
                      className={location.pathname === '/exercises' ? 'active' : ''}
                      onClick={() => setExpanded(false)}
                    >
                      <span className="nav-link-inner">
                        Exercises
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                  
                  <Nav.Item>
                    <Nav.Link 
                      as={Link} 
                      to="/history" 
                      className={location.pathname === '/history' ? 'active' : ''}
                      onClick={() => setExpanded(false)}
                    >
                      <span className="nav-link-inner">
                        History
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                  
                  <Nav.Item>
                    <Nav.Link 
                      as={Link} 
                      to="/profile" 
                      className={location.pathname === '/profile' ? 'active' : ''}
                      onClick={() => setExpanded(false)}
                    >
                      <span className="nav-link-inner">
                        Profile
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                  
                  <Nav.Item className="logout-link">
                    <Nav.Link 
                      onClick={() => {
                        Auth.logout();
                        setExpanded(false);
                      }}
                    >
                      <span className="nav-link-inner">
                        Logout
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                </>
              ) : (
                <>
                  <Nav.Item>
                    <Nav.Link 
                      as={Link} 
                      to="/login" 
                      className={location.pathname === '/login' ? 'active' : ''}
                      onClick={() => setExpanded(false)}
                    >
                      <span className="nav-link-inner">
                        Login
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                  
                  <Nav.Item>
                    <Nav.Link 
                      as={Link} 
                      to="/signup" 
                      className={location.pathname === '/signup' ? 'active' : ''}
                      onClick={() => setExpanded(false)}
                    >
                      <span className="nav-link-inner">
                        Sign Up
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ height: 'var(--nav-height)' }}></div>
    </>
  );
};

export default AppNavbar; 