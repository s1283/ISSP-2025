import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import DebugInfo from './components/DebugInfo';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import TeamPage from './pages/TeamPage';
import SciencePage from './pages/SciencePage';
import KnowledgeCenterPage from './pages/KnowledgeCenterPage';
import ContactPage from './pages/ContactPage';
import FrontPage from './pages/FrontPage';
import Dashboard from './pages/Dashboard';
import PlaylistDetail from './pages/PlaylistDetail';
import LikedPlaylist from './pages/LikedPlaylist';
import Timeline from './pages/Timeline';
import FAQPage from './pages/FAQPage';
import MoodHistory from './pages/MoodHistory';
import ProfilePage from './pages/ProfilePage';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import PrivateRoute from './components/PrivateRoute';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || 
                    location.pathname.startsWith('/playlist/') || 
                    location.pathname === '/timeline' || 
                    location.pathname === '/mood-history' || 
                    location.pathname === '/profile' ||
                    location.pathname === '/liked-songs';

  const appRoutes = (
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/science" element={<SciencePage />} />
      <Route path="/knowledge-center" element={<KnowledgeCenterPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/dashboard/faq" element={<PrivateRoute><FAQPage /></PrivateRoute>} />
      <Route path="/playlist/:playlistName" element={<PrivateRoute><PlaylistDetail /></PrivateRoute>} />
      <Route path="/liked-songs" element={<PrivateRoute><LikedPlaylist /></PrivateRoute>} />
      <Route path="/timeline" element={<PrivateRoute><Timeline /></PrivateRoute>} />
      <Route path="/mood-history" element={<PrivateRoute><MoodHistory /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
    </Routes>
  );

  return (
    <div className="App">
      {/* <DebugInfo /> */}
      {!isDashboard && <Header />}
      {isDashboard ? <AudioPlayerProvider>{appRoutes}</AudioPlayerProvider> : appRoutes}
      {!isDashboard && <Footer />}
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
