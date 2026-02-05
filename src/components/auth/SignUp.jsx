import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
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
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      
      // Shake animation for error
      const form = e.target;
      form.classList.add('shake-animation');
      setTimeout(() => {
        form.classList.remove('shake-animation');
      }, 500);
      return;
    }

    if (!acceptTerms) {
      setError('You must accept the Terms and Conditions');
      setIsSubmitting(false);
      
      // Highlight terms checkbox
      const termsCheckbox = document.querySelector('input[type="checkbox"]');
      if (termsCheckbox) {
        termsCheckbox.parentElement.parentElement.classList.add('highlight-animation');
        setTimeout(() => {
          termsCheckbox.parentElement.parentElement.classList.remove('highlight-animation');
        }, 1000);
      }
      return;
    }

    // Dummy signup - just simulate success
    console.log('Signup successful:', formData);
    
    setSuccess('Account created successfully! Redirecting to login...');
    
    // Add success animation
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.classList.add('success-animation');
    }
    
    // After successful signup, redirect to login after 2 seconds
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const handleSocialSignup = (provider) => {
    console.log(`Social signup with ${provider}`);
    
    // Add click animation
    const buttons = document.querySelectorAll(`[title*="${provider}"]`);
    if (buttons[0]) {
      buttons[0].classList.add('scale-animation');
      setTimeout(() => {
        buttons[0].classList.remove('scale-animation');
      }, 300);
    }
    
    alert(`Social signup with ${provider} would be implemented here`);
  };

  const handleAutoFill = () => {
    // Auto-fill sample data with animation
    const autoFillBtn = document.querySelector('[type="button"]:contains("Auto-fill Sample Data")');
    if (autoFillBtn) {
      autoFillBtn.classList.add('success-animation');
      setTimeout(() => {
        autoFillBtn.classList.remove('success-animation');
      }, 1000);
    }
    
    // Animate form fields
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    inputs.forEach((input, index) => {
      setTimeout(() => {
        input.classList.add('highlight-animation');
        setTimeout(() => {
          input.classList.remove('highlight-animation');
        }, 500);
      }, index * 200);
    });
    
    // Set form data
    setFormData({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
    setAcceptTerms(true);
    
    // Animate checkbox
    setTimeout(() => {
      const checkbox = document.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.parentElement.classList.add('scale-animation');
        setTimeout(() => {
          checkbox.parentElement.classList.remove('scale-animation');
        }, 300);
      }
    }, 600);
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
            0% { background-color: initial; }
            50% { background-color: #d4edda; }
            100% { background-color: initial; }
          }
          
          @keyframes highlight {
            0%, 100% { border-color: #d1d5db; box-shadow: none; }
            50% { border-color: #EE2529; box-shadow: 0 0 0 3px rgba(238, 37, 41, 0.1); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes checkmark {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
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
          
          .checkmark-animation {
            animation: checkmark 0.3s ease-out;
          }
          
          .loading-button {
            position: relative;
            overflow: hidden;
          }
          
          .loading-button::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: loading 1.5s infinite;
          }
          
          @keyframes loading {
            0% { left: -100%; }
            100% { left: 100%; }
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
                className="mt-12"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <h1 
                  className="text-3xl font-bold mb-4"
                  data-aos="fade-right"
                  data-aos-delay="500"
                >
                  FREE ACCOUNT
                </h1>
                <p 
                  className="text-lg opacity-90 mb-8"
                  data-aos="fade-right"
                  data-aos-delay="600"
                >
                  New to our platform? Sign up now! It only takes a minute.
                </p>
                
                <div className="space-y-4">
                  {['No credit card required', '14-day free trial', 'Access to all features'].map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center"
                      data-aos="fade-right"
                      data-aos-delay={700 + (index * 100)}
                    >
                      <FiCheck className="w-6 h-6 text-red-300 mr-3 checkmark-animation" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"
                data-aos="fade-down-left"
                data-aos-delay="1000"
              ></div>
              <div 
                className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"
                data-aos="fade-up-right"
                data-aos-delay="1100"
              ></div>
            </div>
          </div>

          {/* Right Column - Sign Up Form */}
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
                <h3 
                  className="text-2xl font-bold text-gray-800 mt-4"
                  data-aos="zoom-in"
                  data-aos-delay="500"
                >
                  FREE ACCOUNT
                </h3>
                <p 
                  className="text-gray-600 mt-2"
                  data-aos="fade-up"
                  data-aos-delay="600"
                >
                  New to our platform? Sign up now! It only takes a minute.
                </p>
              </div>

              <h3 
                className="text-2xl font-bold text-gray-800 mb-2"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                SIGN UP
              </h3>
              <p 
                className="text-gray-600 mb-8"
                data-aos="fade-right"
                data-aos-delay="600"
              >
                Create your account to get started with our platform.
              </p>

              {error && (
                <div 
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  data-aos="shake"
                  data-aos-delay="100"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div 
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                >
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div data-aos="fade-up" data-aos-delay="700">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all duration-300 hover:border-[#EE2529]"
                      placeholder="Enter your Name"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div data-aos="fade-up" data-aos-delay="800">
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
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div data-aos="fade-up" data-aos-delay="900">
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
                      placeholder="Enter your password"
                      required
                      minLength="6"
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

                {/* Terms and Conditions */}
                <div 
                  className="flex items-start"
                  data-aos="fade-up"
                  data-aos-delay="1000"
                >
                  <div className="relative flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="sr-only"
                      required
                    />
                    <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-300 ${acceptTerms ? 'bg-[#EE2529] border-[#EE2529] scale-110' : 'border-gray-300 hover:border-[#EE2529]'}`}>
                      {acceptTerms && <FiCheck className="w-4 h-4 text-white checkmark-animation" />}
                    </div>
                  </div>
                  <label className="ml-2 text-gray-700 text-sm hover:text-[#EE2529] transition-colors duration-300">
                    I accept{' '}
                    <a href="#" className="text-[#EE2529] hover:text-[#C73834] font-medium">
                      Terms and Condition
                    </a>
                  </label>
                </div>

                {/* Auto-fill Button */}
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md"
                  data-aos="zoom-in"
                  data-aos-delay="1100"
                >
                  Auto-fill Sample Data
                </button>

                {/* Divider */}
                <div className="relative" data-aos="fade-up" data-aos-delay="1200">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#EE2529] to-[#C73834] hover:from-[#C73834] hover:to-[#EE2529] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg active:scale-95 ${isSubmitting ? 'loading-button opacity-90' : ''}`}
                  data-aos="zoom-in"
                  data-aos-delay="1300"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Social Sign Up Divider */}
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

                {/* Social Sign Up Buttons */}
                <div 
                  className="flex justify-center gap-4"
                  data-aos="zoom-in"
                  data-aos-delay="1500"
                >
                  <button
                    type="button"
                    onClick={() => handleSocialSignup('google')}
                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 hover:shadow-md"
                    title="Sign up with Google"
                    data-aos="flip-left"
                    data-aos-delay="1600"
                  >
                    <FcGoogle size={24} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSocialSignup('facebook')}
                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 hover:shadow-md text-blue-600"
                    title="Sign up with Facebook"
                    data-aos="flip-left"
                    data-aos-delay="1700"
                  >
                    <FaFacebook size={24} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSocialSignup('twitter')}
                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 hover:shadow-md text-blue-400"
                    title="Sign up with Twitter"
                    data-aos="flip-left"
                    data-aos-delay="1800"
                  >
                    <FaTwitter size={24} />
                  </button>
                </div>

                {/* Login Link */}
                <div 
                  className="text-center pt-4"
                  data-aos="fade-up"
                  data-aos-delay="1900"
                >
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-[#EE2529] hover:text-[#C73834] font-semibold transition-all duration-300 hover:scale-105 inline-block"
                    >
                      Sign In
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

export default SignUp;