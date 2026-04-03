import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { ShieldAlert, IndianRupee, Clock, Activity, ArrowRight, ShieldCheck, Umbrella, ChevronRight } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activePolicy: null,
    totalClaims: 0,
    approvedClaims: 0,
    premiumDetails: null
  });

  const activities = [
    { id: 1, title: 'Premium paid for Week 12', time: '2 hours ago', icon: <IndianRupee size={18} />, color: 'text-indigo-600', bg: 'bg-indigo-500/20' },
    { id: 2, title: 'Weather warning: Heavy rain expected', time: '1 day ago', icon: <Umbrella size={18} />, color: 'text-amber-600', bg: 'bg-amber-500/20' },
    { id: 3, title: 'Policy renewed automatically', time: '3 days ago', icon: <ShieldCheck size={18} />, color: 'text-emerald-600', bg: 'bg-emerald-500/20' },
    { id: 4, title: 'Claim #4002 auto-approved', time: '1 week ago', icon: <Activity size={18} />, color: 'text-cyan-600', bg: 'bg-cyan-500/20' },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const [policiesRes, claimsRes] = await Promise.all([
          api.get('/policy/my'),
          api.get('/claims/my')
        ]);
        
        const activePol = policiesRes.data.find(p => p.status === 'active');
        
        let premiumRes = null;
        if (activePol) {
          try {
            const premResponse = await api.get(`/premium/${activePol.id}`);
            premiumRes = premResponse.data;
          } catch (e) {
            // premium not generated yet
          }
        }

        setStats({
          activePolicy: activePol || null,
          totalClaims: claimsRes.data.length,
          approvedClaims: claimsRes.data.filter(c => c.status === 'auto_approved' || c.status === 'completed').length,
          premiumDetails: premiumRes
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><Loader /></div>;
  }

  const profileData = isAuthenticated ? user : { name: 'Demo Worker', phone: '999XXXX321', occupation: 'Construction', zone: 'low' };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 ease-out fill-mode-forwards text-slate-800">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2 relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-900 via-slate-800 to-slate-600 tracking-tight drop-shadow-sm pb-1">
            {isAuthenticated ? `Hello, ${user?.name?.split(' ')[0]}` : 'Platform Dashboard'}
          </h1>
          <p className="text-slate-500 mt-2 font-medium tracking-wide text-lg">
            {isAuthenticated ? 'Your protection system is active and monitoring.' : 'Explore the automated insurance experience.'}
          </p>
        </div>
        <GlassButton 
          onClick={() => navigate(isAuthenticated ? "/premium" : "/login")}
          variant={isAuthenticated ? "primary" : "secondary"}
          className="px-8 py-4"
        >
          {isAuthenticated ? 'View Premium' : 'Login to Transact'}
          <ArrowRight size={18} />
        </GlassButton>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
        
        {/* Coverage Card */}
        <GlassCard highlightColor="emerald" className="cursor-pointer" onClick={() => navigate('/policy')}>
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-500/20 text-emerald-500 flex items-center justify-center shadow-[0_4px_10px_rgba(16,185,129,0.15)]">
              <ShieldCheck size={28} />
            </div>
            <StatusBadge status={isAuthenticated && stats.activePolicy ? "Active" : isAuthenticated ? "Pending" : "Active"} />
          </div>
          <h3 className="text-slate-500 text-sm font-extrabold tracking-widest uppercase mb-2">Active Coverage</h3>
          <p className="text-3xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm mb-2">
            {isAuthenticated ? (stats.activePolicy?.coverage_type || 'No Active Plan') : 'Standard Plan'}
          </p>
          <div className="flex items-center text-emerald-600 text-sm font-bold mt-4 gap-1 group-hover:gap-2 transition-all">
            Manage policies <ChevronRight size={16} />
          </div>
        </GlassCard>

        {/* Premium Card */}
        <GlassCard highlightColor="cyan" className="cursor-pointer" onClick={() => navigate('/premium')}>
          <div className="w-14 h-14 rounded-2xl bg-white border border-cyan-500/20 text-cyan-500 flex items-center justify-center mb-6 shadow-[0_4px_10px_rgba(6,182,212,0.15)]">
            <IndianRupee size={28} />
          </div>
          <h3 className="text-slate-500 text-sm font-extrabold tracking-widest uppercase mb-2">This Week's Premium</h3>
          <div className="flex items-end gap-3 mb-2">
            <p className="text-4xl font-black text-slate-800 tracking-tight drop-shadow-sm">
              ₹{isAuthenticated && stats.premiumDetails ? stats.premiumDetails.final_amount : '48'}
            </p>
            <span className="text-cyan-700 text-xs font-black tracking-widest uppercase mb-1.5 px-3 py-1 rounded-full bg-cyan-100 border border-cyan-300 shadow-sm">
              -₹2 Discount
            </span>
          </div>
          <div className="flex items-center text-cyan-600 text-sm font-bold mt-5 gap-1 group-hover:gap-2 transition-all">
            Pay premium <ChevronRight size={16} />
          </div>
        </GlassCard>

        {/* Claims Card */}
        <GlassCard highlightColor="purple" className="cursor-pointer" onClick={() => navigate('/claims')}>
          <div className="w-14 h-14 rounded-2xl bg-white border border-purple-500/20 text-indigo-500 flex items-center justify-center mb-6 shadow-[0_4px_10px_rgba(99,102,241,0.15)]">
            <ShieldAlert size={28} />
          </div>
          <h3 className="text-slate-500 text-sm font-extrabold tracking-widest uppercase mb-2">Claims Summary</h3>
          <div className="flex gap-8 mb-2">
            <div>
              <p className="text-4xl font-black text-slate-800 drop-shadow-sm">
                {isAuthenticated ? (stats.totalClaims - stats.approvedClaims) : '1'}
              </p>
              <p className="text-slate-400 text-xs font-bold tracking-widest mt-1 uppercase">Pending</p>
            </div>
            <div className="w-px bg-slate-300" />
            <div>
              <p className="text-4xl font-black text-slate-800 drop-shadow-sm">
                {isAuthenticated ? stats.approvedClaims : '3'}
              </p>
              <p className="text-indigo-600 text-xs font-bold tracking-widest mt-1 uppercase">Approved</p>
            </div>
          </div>
          <div className="flex items-center text-indigo-600 text-sm font-bold mt-4 gap-1 group-hover:gap-2 transition-all">
            File new claim <ChevronRight size={16} />
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative z-10">
        
        {/* Profile Card Breakdown */}
        <GlassCard className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-8 text-slate-800 drop-shadow-sm flex items-center gap-3">
              Worker Profile
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">Registered Name</p>
                <p className="font-extrabold text-lg text-slate-800">{profileData.name}</p>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-slate-200 to-transparent" />
              
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1.5">Secure Contact</p>
                <p className="font-extrabold text-lg text-slate-800">{profileData.phone}</p>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-slate-200 to-transparent" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Risk Class</p>
                  <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-100 px-3 py-1.5 rounded-xl text-sm font-black border border-amber-300 shadow-sm">
                    Medium
                  </span>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Zone Risk</p>
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl text-sm font-black border border-emerald-300 shadow-sm">
                    {profileData.zone.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Real-time Activity Feed */}
        <GlassCard className="lg:col-span-7">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-800 drop-shadow-sm flex items-center gap-3">
              Live Activity
            </h2>
            <span className="flex items-center gap-2 text-xs font-black text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ACTIVE
            </span>
          </div>

          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="group flex gap-5 items-start p-4 rounded-2xl hover:bg-white/60 transition-all duration-300 -mx-4 cursor-pointer border border-transparent hover:border-slate-200 hover:shadow-md">
                <div className={`p-3.5 rounded-2xl bg-white ${activity.color} border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)] group-hover:scale-110 transition-transform duration-300`}>
                  {activity.icon}
                </div>
                <div className="pt-2 flex-1">
                  <p className="font-extrabold text-slate-800 text-[15px] tracking-wide mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{activity.title}</p>
                  <p className="text-sm text-slate-500 font-semibold tracking-wide">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
