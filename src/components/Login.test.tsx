import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { login } from '../firebaseAuth';

// Mock the firebaseAuth module
jest.mock('../firebaseAuth', () => ({
  __esModule: true,
  login: jest.fn(),
}));

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Login', () => {
  beforeEach(() => {
    // Clear mock history before each test
    (login as jest.Mock).mockClear();
    mockedNavigate.mockClear();
  });

  test('renders email and password inputs', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('allows user to type in email and password', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('successful login navigates to dashboard', async () => {
    (login as jest.Mock).mockResolvedValueOnce({ user: {} });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows an error message for invalid email format', async () => {
    const error = { code: 'auth/invalid-email' };
    (login as jest.Mock).mockRejectedValueOnce(error);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  test('shows an error message for invalid credentials', async () => {
    const error = { code: 'auth/wrong-password' };
    (login as jest.Mock).mockRejectedValueOnce(error);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
  });
});
