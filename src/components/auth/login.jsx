import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: 'preleaseadmin@gmail.com',
    password: '123456'
  });

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
    });
    
    // Refresh AOS after component mounts
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Dummy login - check for specific credentials
    if (formData.email === 'preleaseadmin@gmail.com' && formData.password === '123456') {
      console.log('Login successful with admin credentials');
      
      // Add animation before redirect
      const loginBtn = e.target.querySelector('button[type="submit"]');
      if (loginBtn) {
        loginBtn.classList.add('animate-pulse');
      }
      
      // Call the onLogin callback to update authentication state
      if (onLogin) {
        onLogin();
      }
      
      // Redirect to dashboard after animation
      setTimeout(() => {
        navigate('/dashboard/analytics');
      }, 800);
    } else {
      // Shake animation for invalid credentials
      const form = e.target;
      form.classList.add('shake-animation');
      setTimeout(() => {
        form.classList.remove('shake-animation');
      }, 500);
      
      alert('Invalid credentials. Use: preleaseadmin@gmail.com / 123456');
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Social login with ${provider}`);
    
    // Add click animation
    const buttons = document.querySelectorAll(`[title*="${provider}"]`);
    if (buttons[0]) {
      buttons[0].classList.add('scale-animation');
      setTimeout(() => {
        buttons[0].classList.remove('scale-animation');
      }, 300);
    }
    
    alert(`Social login with ${provider} would be implemented here`);
  };

  const handleUseAdminCredentials = () => {
    // Auto-fill admin credentials with animation
    const adminBtn = document.querySelector('[type="button"]:contains("Use Admin Credentials")');
    if (adminBtn) {
      adminBtn.classList.add('success-animation');
      setTimeout(() => {
        adminBtn.classList.remove('success-animation');
      }, 1000);
    }
    
    setFormData({
      email: 'preleaseadmin@gmail.com',
      password: '123456'
    });
    setRememberMe(true);
    
    // Animate the form fields
    document.querySelectorAll('input').forEach((input, index) => {
      setTimeout(() => {
        input.classList.add('highlight-animation');
        setTimeout(() => {
          input.classList.remove('highlight-animation');
        }, 500);
      }, index * 200);
    });
  };

  return (
    <>
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          @keyframes scale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.9); }
          }
          
          @keyframes success {
            0% { background-color: #f0f0f0; }
            50% { background-color: #d4edda; }
            100% { background-color: #f0f0f0; }
          }
          
          @keyframes highlight {
            0%, 100% { border-color: #d1d5db; box-shadow: none; }
            50% { border-color: #EE2529; box-shadow: 0 0 0 3px rgba(238, 37, 41, 0.1); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          .shake-animation {
            animation: shake 0.5s ease-in-out;
          }
          
          .scale-animation {
            animation: scale 0.3s ease-in-out;
          }
          
          .success-animation {
            animation: success 1s ease-in-out;
          }
          
          .highlight-animation {
            animation: highlight 0.5s ease-in-out;
          }
          
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
          
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
      
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
        <div 
          className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden"
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          
          {/* Left Column - Branding/Image */}
          <div 
            className="hidden md:flex relative bg-gradient-to-br from-[#EE2529] to-[#C73834] p-12"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <div className="relative z-10 text-white">
              <div 
                className="mb-8"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <h1 className="text-4xl font-bold mb-2"># PreLease</h1>
                <h2 className="text-2xl font-light tracking-widest">LIVING LIFE</h2>
              </div>
              
              <div 
                className="mt-8"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div 
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 float-animation"
                  data-aos="zoom-in"
                  data-aos-delay="500"
                >
                  <h3 className="text-lg font-semibold mb-2">Demo Credentials</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> preleaseadmin@gmail.com
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Password:</span> 123456
                    </p>
                  </div>
                </div>
                
                <p 
                  className="text-lg opacity-90"
                  data-aos="fade-up"
                  data-aos-delay="600"
                >
                  Your gateway to premium property management
                </p>
              </div>
              
              {/* Decorative elements */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"
                data-aos="fade-down-left"
                data-aos-delay="700"
              ></div>
              <div 
                className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"
                data-aos="fade-up-right"
                data-aos-delay="800"
              ></div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div 
            className="p-8 md:p-12 flex items-center justify-center"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="w-full max-w-md">
              <div 
                className="md:hidden mb-8 text-center"
                data-aos="fade-down"
                data-aos-delay="400"
              >
                <h1 className="text-3xl font-bold text-[#EE2529] mb-1"># LDHomes</h1>
                <h2 className="text-xl text-gray-600">LIVING LIFE</h2>
                
                {/* Demo credentials for mobile */}
                <div 
                  className="mt-4 p-3 bg-red-50 rounded-lg float-animation"
                  data-aos="zoom-in"
                  data-aos-delay="500"
                >
                  <h3 className="text-sm font-semibold text-[#C73834] mb-1">Demo Credentials</h3>
                  <p className="text-xs text-gray-600">
                    Email: preleaseadmin@gmail.com<br />
                    Password: 123456
                  </p>
                </div>
              </div>

              <h3 
                className="text-2xl font-bold text-gray-800 mb-2"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                SIGN IN
              </h3>
              <p 
                className="text-gray-600 mb-8"
                data-aos="fade-right"
                data-aos-delay="600"
              >
                Enter your email address and password to access admin panel.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div data-aos="fade-up" data-aos-delay="700">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all duration-300 hover:border-[#EE2529]"
                      placeholder="preleaseadmin@gmail.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div data-aos="fade-up" data-aos-delay="800">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all duration-300 hover:border-[#EE2529]"
                      placeholder="123456"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-transform hover:scale-110"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div 
                  className="flex items-center justify-between"
                  data-aos="fade-up"
                  data-aos-delay="900"
                >
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-300 ${rememberMe ? 'bg-[#EE2529] border-[#EE2529] scale-110' : 'border-gray-300 group-hover:border-[#EE2529]'}`}>
                        {rememberMe && <FiCheck className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                    <span className="ml-2 text-gray-700 text-sm group-hover:text-[#EE2529] transition-colors duration-300">Remember me</span>
                  </label>
                  
                  <Link 
                    to="/reset-email" 
                    className="text-sm text-[#EE2529] hover:text-[#C73834] font-medium transition-all duration-300 hover:scale-105"
                    data-aos="fade-left"
                    data-aos-delay="1000"
                  >
                    Reset password?
                  </Link>
                </div>

                {/* Use Admin Credentials Button */}
                <button
                  type="button"
                  onClick={handleUseAdminCredentials}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  data-aos="zoom-in"
                  data-aos-delay="1100"
                >
                  <span>🔑</span>
                  Use Admin Credentials
                </button>

                {/* Divider */}
                <div className="relative" data-aos="fade-up" data-aos-delay="1200">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#EE2529] to-[#C73834] hover:from-[#C73834] hover:to-[#EE2529] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg active:scale-95"
                  data-aos="zoom-in"
                  data-aos-delay="1300"
                >
                  Sign In
                </button>

                {/* Social Login Divider */}
                <div 
                  className="relative text-center"
                  data-aos="fade-up"
                  data-aos-delay="1400"
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative inline-flex items-center bg-white px-4">
                    <span className="text-sm text-gray-500">OR sign with</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div 
                  className="flex justify-center gap-4"
                  data-aos="zoom-in"
                  data-aos-delay="1500"
                >
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 hover:shadow-md"
                    title="Sign in with Google"
                    data-aos="flip-left"
                    data-aos-delay="1600"
                  >
                    <FcGoogle size={24} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('facebook')}
                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 hover:shadow-md text-blue-600"
                    title="Sign in with Facebook"
                    data-aos="flip-left"
                    data-aos-delay="1700"
                  >
                    <FaFacebook size={24} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('twitter')}
                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 hover:shadow-md text-blue-400"
                    title="Sign in with Twitter"
                    data-aos="flip-left"
                    data-aos-delay="1800"
                  >
                    <FaTwitter size={24} />
                  </button>
                </div>

                {/* Sign Up Link */}
                <div 
                  className="text-center pt-4"
                  data-aos="fade-up"
                  data-aos-delay="1900"
                >
                  <p className="text-gray-600">
                    New here?{' '}
                    <Link 
                      to="/signup" 
                      className="text-[#EE2529] hover:text-[#C73834] font-semibold transition-all duration-300 hover:scale-105 inline-block"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;