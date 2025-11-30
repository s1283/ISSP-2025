import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    // Add forgot password logic here
    console.log('Forgot password clicked');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <Login
      onForgotPassword={handleForgotPassword}
      onSignUp={handleSignUp}
    />
  );
};

export default LoginPage;
