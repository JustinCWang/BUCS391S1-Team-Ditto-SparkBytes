// __tests__/ResetPasswordPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPasswordPage from '@/app/reset/page';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/supabase');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('<ResetPasswordPage />', () => {
  const push = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    // Reset supabase mocks
    (supabase.auth.updateUser as jest.Mock).mockReset();
    (supabase.auth.signOut as jest.Mock).mockReset();
  });

  it('shows password-too-short error when password length < 8', async () => {
    render(<ResetPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter your new password/i), {
      target: { value: 'short' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your new password/i), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
    expect(await screen.findByText(/at least 8 characters long/i)).toBeInTheDocument();
  });

  it('alerts when passwords do not match', async () => {
    window.alert = jest.fn();
    render(<ResetPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter your new password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your new password/i), {
      target: { value: 'password321' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Passwords do not match');
    });
  });

  it('handles successful password reset and redirects', async () => {
    // mock success response
    (supabase.auth.updateUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'abc' } },
      error: null,
    });
    render(<ResetPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter your new password/i), {
      target: { value: 'validpass' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your new password/i), {
      target: { value: 'validpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
    await waitFor(() => expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'validpass' }));
    await waitFor(() => expect(supabase.auth.signOut).toHaveBeenCalled());
    expect(push).toHaveBeenCalledWith('/login?fromReset=true');
  });

  it('shows error message when supabase returns error', async () => {
    (supabase.auth.updateUser as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'fail' },
    });
    render(<ResetPasswordPage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter your new password/i), {
      target: { value: 'validpass' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your new password/i), {
      target: { value: 'validpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
    expect(await screen.findByText(/An error occurred while resetting your password/i)).toBeInTheDocument();
  });

  it('toggles password visibility when clicking eye icon', () => {
    render(<ResetPasswordPage />);
    const pwdInput = screen.getByPlaceholderText(/Enter your new password/i) as HTMLInputElement;
    const toggle = screen.getAllByRole('button', { hidden: true })[0]; // 找到第一个眼睛按钮
    // 默认是 password
    expect(pwdInput.type).toBe('password');
    fireEvent.click(toggle);
    expect(pwdInput.type).toBe('text');
    fireEvent.click(toggle);
    expect(pwdInput.type).toBe('password');
  });
});
