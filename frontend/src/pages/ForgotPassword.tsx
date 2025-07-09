import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8020';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password?email=${encodeURIComponent(email)}`);
      setSuccess(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Forgot Password</h2>
      {success ? (
        <div style={{ color: 'green', textAlign: 'center' }}>
          Please check your email for password reset instructions.
          <div style={{ marginTop: 24 }}>
            <button
              type="button"
              onClick={() => window.location.href = '/reset-password'}
              style={{ width: '100%', padding: 10, borderRadius: 4, background: '#667eea', color: '#fff', border: 'none', fontWeight: 600 }}
            >
              Go to Reset Password
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleForgotPassword}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="forgotEmail">Email Address</label>
            <input
              id="forgotEmail"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', marginTop: 4 }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: 10, borderRadius: 4, background: '#667eea', color: '#fff', border: 'none', fontWeight: 600 }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword; 