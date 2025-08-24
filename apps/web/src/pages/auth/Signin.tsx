import React, { useState } from 'react';
import axios from 'axios';
import { IoMdArrowBack } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { CiMail } from "react-icons/ci";
import { MdLockOutline } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const navigate = useNavigate();
  const isDark = currentTheme === 'dark';

  const handleSignin = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try{
        const res = await axios.post(`${API_BASE_URL}/api/v1/auth/signin`,{
            email,
            password
        });
        localStorage.setItem('token',res.data.token);
        navigate('/dashboard');
    }catch(err){
        if (axios.isAxiosError(err)){
        setError(err.response?.data?.error || 'Signin failed');
      } else{
        setError('Signin failed');
      } 
    } finally {
        setLoading(false);
      }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/v1/auth/google`;
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/20' 
        : 'bg-gradient-to-br from-emerald-50 to-green-50'
    }`}>
      <div className={`w-full max-w-md rounded-2xl shadow-xl p-8 backdrop-blur-sm border ${
        isDark 
          ? 'bg-slate-900/80 border-slate-700/50' 
          : 'bg-white/80 border-emerald-100'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <Link to="/" className={`text-md hover:text-emerald-600 flex justify-center items-center gap-1 cursor-pointer transition-colors ${
            isDark ? 'text-slate-300 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-700'
          }`}>
            <IoMdArrowBack className="text-md" />
            Back to home
          </Link>
          <ThemeToggle theme={currentTheme} onThemeChange={setCurrentTheme} />
        </div>
        
        <h2 className={`text-2xl font-bold mb-2 flex justify-center items-center ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>Sign in</h2>
        <p className={`text-sm mb-6 flex justify-center items-center ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>Welcome back to Cultiva!</p>

        <div className={`w-full max-w-md rounded-2xl shadow-lg p-8 backdrop-blur-sm border ${
          isDark 
            ? 'bg-slate-800/60 border-slate-700/50' 
            : 'bg-white/60 border-emerald-50'
        }`}>
          <div className='flex flex-col mb-6'>
            <button 
              className={`flex justify-center items-center gap-4 py-3 rounded-xl w-full border transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-md ${
                isDark 
                  ? 'bg-slate-700/80 text-slate-200 border-slate-600 hover:bg-slate-600/80' 
                  : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-slate-50'
              }`} 
              onClick={handleGoogleLogin}
            >
              <FcGoogle className='text-lg' />Continue with Google
            </button>
          </div>

          <div className='flex items-center my-6'>
            <hr className={`grow ${
              isDark ? 'border-slate-600' : 'border-slate-200'
            }`} />
            <span className={`text-xs mx-3 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>OR CONTINUE WITH EMAIL</span>
            <hr className={`grow ${
              isDark ? 'border-slate-600' : 'border-slate-200'
            }`} />
          </div>

          <form className='flex flex-col gap-4' onSubmit={handleSignin}>
            <div>
              <label className={`flex text-sm mb-1 font-medium ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}>Email Address</label>
              <div className="relative">
                <CiMail className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg ${
                  isDark ? 'text-slate-400' : 'text-slate-400'
                }`} />
                <input
                  className={`w-full px-3 py-3 pl-10 placeholder:text-sm rounded-xl transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    isDark 
                      ? 'bg-slate-700/80 border-slate-600 placeholder-slate-400 text-white' 
                      : 'bg-white/80 border-slate-200 placeholder-slate-400 text-slate-900'
                  }`}
                  placeholder='your.email@example.com'
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`flex text-sm mb-1 font-medium ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}>Password</label>
              <div className="relative">
                <MdLockOutline className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg ${
                  isDark ? 'text-slate-400' : 'text-slate-400'
                }`} />
                <input
                  className={`w-full px-3 py-3 pl-10 placeholder:text-sm rounded-xl transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    isDark 
                      ? 'bg-slate-700/80 border-slate-600 placeholder-slate-400 text-white' 
                      : 'bg-white/80 border-slate-200 placeholder-slate-400 text-slate-900'
                  }`}
                  placeholder='••••••••'
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <FaRegEyeSlash className="text-lg" /> : <FaRegEye className="text-lg" />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className={`text-xs hover:underline font-medium mt-1 cursor-pointer ${
                  isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
                }`}>Forgot password?</Link>
              </div>
            </div>
            {error && (
              <div className={`text-red-500 text-sm p-3 rounded-lg border ${
                isDark 
                  ? 'bg-red-900/20 border-red-700/50' 
                  : 'bg-red-50 border-red-200'
              }`}>
                {error}
              </div>
            )}
            <button 
              className="bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 text-white rounded-xl py-3 font-semibold w-full mt-2 cursor-pointer" 
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in... " : "Sign in"}
            </button>
          </form>

          <p className={`text-center mt-8 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Don&apos;t have an account?{" "}
            <Link to="/auth/signup" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium cursor-pointer">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
