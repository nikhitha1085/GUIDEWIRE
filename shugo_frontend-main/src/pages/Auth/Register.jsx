import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Shield, User, Phone, FileDigit, Briefcase, MapPin, IndianRupee, Lock, ArrowRight } from 'lucide-react';
import Loader from '../../components/Loader';
import api from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadhaar: '',
    occupation: '',
    zone: '',
    income: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    if (formData.aadhaar.length !== 12) {
      setError('Aadhaar number must be exactly 12 digits.');
      return;
    }
    if (Object.values(formData).some(val => !val)) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name: formData.name, 
        phone: formData.phone, 
        aadhaar: formData.aadhaar,
        occupation: formData.occupation,
        zone: formData.zone,
        weekly_income: formData.income,
        password: formData.password
      });
      setLoading(false);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 rounded-xl glass-input transition-all placeholder:text-slate-500 text-sm";
  const iconClasses = "absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400";

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden py-12">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none" />

      <div className="glass-panel w-full max-w-xl rounded-3xl p-8 relative z-10 w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Create Account</h2>
          <p className="text-cyan-200/80 text-sm mt-2">Join Protect Your Worker Platform</p>
        </div>

        {error && (
          <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5 container max-w-none">
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
            <div className="relative">
              <User className={iconClasses} size={18} />
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name as per Aadhaar" className={inputClasses} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className={iconClasses} size={18} />
              <input type="number" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit mobile" className={inputClasses} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Aadhaar Number</label>
            <div className="relative">
              <FileDigit className={iconClasses} size={18} />
              <input type="number" name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} placeholder="12-digit Aadhaar" className={inputClasses} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Occupation</label>
            <div className="relative">
              <Briefcase className={iconClasses} size={18} />
              <select name="occupation" value={formData.occupation} onChange={handleInputChange} className={inputClasses + " appearance-none"}>
                <option value="" className="text-slate-900 bg-slate-200">Select Occupation</option>
                <option value="construction" className="text-slate-900 bg-slate-200">Construction Worker</option>
                <option value="agriculture" className="text-slate-900 bg-slate-200">Agriculture / Farmer</option>
                <option value="textile" className="text-slate-900 bg-slate-200">Textile Worker</option>
                <option value="manufacturing" className="text-slate-900 bg-slate-200">Factory / Manufacturing</option>
                <option value="delivery" className="text-slate-900 bg-slate-200">Delivery / Gig Worker</option>
                <option value="other" className="text-slate-900 bg-slate-200">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Home Zone / District</label>
            <div className="relative">
              <MapPin className={iconClasses} size={18} />
              <select name="zone" value={formData.zone} onChange={handleInputChange} className={inputClasses + " appearance-none"}>
                <option value="" className="text-slate-900 bg-slate-200">Select Zone Risk</option>
                <option value="low" className="text-slate-900 bg-slate-200">Low Risk Zone</option>
                <option value="medium" className="text-slate-900 bg-slate-200">Medium Risk Zone</option>
                <option value="high" className="text-slate-900 bg-slate-200">High Risk Flood/Weather Zone</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Weekly Income (₹)</label>
            <div className="relative">
              <IndianRupee className={iconClasses} size={18} />
              <input type="number" name="income" value={formData.income} onChange={handleInputChange} placeholder="E.g. 2000" className={inputClasses} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock className={iconClasses} size={18} />
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Create password" className={inputClasses} />
            </div>
          </div>

          <div className="md:col-span-2 mt-4 text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-lg shadow-lg shadow-purple-500/25 transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader /> : (
                <>
                  Complete Registration
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
