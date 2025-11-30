import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { logout } from '../firebaseAuth';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate('/');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  // Show navbar on landing page and all footer pages
  const footerPages = [
    '/',
    '/about',
    '/blog',
    '/team',
    '/science',
    '/knowledge-center',
    '/contact',
    '/follow-us'
  ];

  if (!footerPages.includes(location.pathname)) {
    return null;
  }

  return (
    <Navbar expand="lg" className="navbar fixed-navbar">
      <Container fluid className="px-5">
        <Navbar.Brand
          className="navbar-brand d-flex align-items-center"
          style={{ cursor: 'pointer', marginLeft: '-10px' }}
          onClick={handleLogoClick}
        >
          <img
            src="/assets/images/braintest-logo.png"
            alt="BrainTest Music Logo"
            className="logo-image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const logoText = e.currentTarget.nextElementSibling as HTMLElement;
              if (logoText) logoText.style.display = 'inline';
            }}
          />
          <span className="logo-text" style={{ display: 'none' }}>
            🧠 BrainTest Music
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="ms-auto d-flex align-items-center"
            style={{ marginRight: '-10px' }}
          >
            {user ? (
              <>
                <button className="btn-login me-3" onClick={handleDashboardClick}>
                  Dashboard
                </button>
                <button className="btn-login me-3" onClick={handleLogoutClick}>
                  Log out
                </button>
              </>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <button className="btn-login me-3" onClick={handleLoginClick}>
                    Log in
                  </button>
                )}
                <button className="btn-signup" onClick={handleSignUpClick}>
                  Sign up
                </button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
