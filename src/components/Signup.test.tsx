import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Signup from './Signup';
import { signUp } from '../firebaseAuth';

// Mock the firebaseAuth module
jest.mock('../firebaseAuth', () => ({
  __esModule: true,
  signUp: jest.fn(),
}));

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Signup', () => {
  beforeEach(() => {
    // Clear mock history before each test
    (signUp as jest.Mock).mockClear();
    mockedNavigate.mockClear();
  });

  test('renders initial step with email input', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('allows user to type in email', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
  });

  test('moves to the next step on email submission', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  test('successful signup navigates to dashboard', async () => {
    (signUp as jest.Mock).mockResolvedValueOnce({ user: {} });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Step 1: Email
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Step 2: Password
    const passwordInput = await screen.findByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Step 3: Birthdate
    expect(await screen.findByText('Birthdate')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Step 4: Agree to Terms
    const agreeCheckbox = await screen.findByLabelText(/i agree to the/i);
    fireEvent.click(agreeCheckbox);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Step 5: Genres and Sign up
    const signupButton = await screen.findByRole('button', { name: /sign up/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard', { state: { selectedGenres: [] } });
    });
  });

  test('shows an error message for email already in use', async () => {
    const error = { code: 'auth/email-already-in-use' };
    (signUp as jest.Mock).mockRejectedValueOnce(error);

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Next'));

    const passwordInput = await screen.findByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    const confirmPasswordInput = await screen.findByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Next'));
    expect(await screen.findByText('Birthdate')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));

    const agreeCheckbox = await screen.findByLabelText(/i agree to the/i);
    fireEvent.click(agreeCheckbox);
    fireEvent.click(screen.getByText('Next'));

    const signupButton = await screen.findByRole('button', { name: /sign up/i });
    fireEvent.click(signupButton);

    expect(await screen.findByText(/This email address is already in use/)).toBeInTheDocument();
  });

  test('shows an error message for a weak password', async () => {
    const error = { code: 'auth/weak-password' };
    (signUp as jest.Mock).mockRejectedValueOnce(error);

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Next'));

    const passwordInput = await screen.findByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    const confirmPasswordInput = await screen.findByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });
    fireEvent.click(screen.getByText('Next'));

    expect(await screen.findByText('Birthdate')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));

    const agreeCheckbox = await screen.findByLabelText(/i agree to the/i);
    fireEvent.click(agreeCheckbox);
    fireEvent.click(screen.getByText('Next'));

    const signupButton = await screen.findByRole('button', { name: /sign up/i });
    fireEvent.click(signupButton);

    expect(await screen.findByText(/The password is too weak/)).toBeInTheDocument();
  });

  test('shows an error message for mismatched passwords', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Next'));

    const passwordInput = await screen.findByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    const confirmPasswordInput = await screen.findByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(screen.getByText('Next'));

    expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument();
  });
});
