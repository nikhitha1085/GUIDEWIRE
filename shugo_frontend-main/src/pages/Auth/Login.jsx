import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Shield, Phone, Lock, ArrowRight } from 'lucide-react';
import Loader from '../../components/Loader';
import api from '../../services/api';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { phone, password });
      setLoading(false);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      <div className="glass-panel w-full max-w-md rounded-3xl p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h2>
          <p className="text-cyan-200/80 text-sm mt-2">Login to manage your policies and claims</p>
        </div>

        {error && (
          <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/25 transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader /> : (
              <>
                Login Securely
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
