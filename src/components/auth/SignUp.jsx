import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaTwitter } from 'react-icons/fa';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!acceptTerms) {
      setError('You must accept the Terms and Conditions');
      return;
    }

    // Dummy signup - just simulate success
    console.log('Signup successful:', formData);
    
    setSuccess('Account created successfully! Redirecting to login...');
    
    // After successful signup, redirect to login after 2 seconds
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const handleSocialSignup = (provider) => {
    console.log(`Social signup with ${provider}`);
    alert(`Social signup with ${provider} would be implemented here`);
  };

  const handleAutoFill = () => {
    // Auto-fill sample data
    setFormData({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
    setAcceptTerms(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Column - Branding/Image */}
        <div className="hidden md:flex relative bg-gradient-to-br from-[#EE2529] to-[#C73834] p-12">
          <div className="relative z-10 text-white">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2"># PreLease</h1>
              <h2 className="text-2xl font-light tracking-widest">LIVING LIFE</h2>
            </div>
            
            <div className="mt-12">
              <h1 className="text-3xl font-bold mb-4">FREE ACCOUNT</h1>
              <p className="text-lg opacity-90 mb-8">
                New to our platform? Sign up now! It only takes a minute.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiCheck className="w-6 h-6 text-red-300 mr-3" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <FiCheck className="w-6 h-6 text-red-300 mr-3" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center">
                  <FiCheck className="w-6 h-6 text-red-300 mr-3" />
                  <span>Access to all features</span>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
          </div>
        </div>

        {/* Right Column - Sign Up Form */}
        <div className="p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="md:hidden mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#EE2529] mb-1"># LDHomes</h1>
              <h2 className="text-xl text-gray-600">LIVING LIFE</h2>
              <h3 className="text-2xl font-bold text-gray-800 mt-4">FREE ACCOUNT</h3>
              <p className="text-gray-600 mt-2">
                New to our platform? Sign up now! It only takes a minute.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">SIGN UP</h3>
            <p className="text-gray-600 mb-8">
              Create your account to get started with our platform.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent"
                    placeholder="Enter your Name"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent"
                    placeholder="Enter your password"
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="relative flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="sr-only"
                    required
                  />
                  <div className={`w-5 h-5 border rounded flex items-center justify-center ${acceptTerms ? 'bg-[#EE2529] border-[#EE2529]' : 'border-gray-300'}`}>
                    {acceptTerms && <FiCheck className="w-4 h-4 text-white" />}
                  </div>
                </div>
                <label className="ml-2 text-gray-700 text-sm">
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
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200"
              >
                Auto-fill Sample Data
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#EE2529] to-[#C73834] hover:from-[#C73834] hover:to-[#EE2529] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Create Account
              </button>

              {/* Social Sign Up Divider */}
              <div className="relative text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative inline-flex items-center bg-white px-4">
                  <span className="text-sm text-gray-500">OR sign with</span>
                </div>
              </div>

              {/* Social Sign Up Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialSignup('google')}
                  className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                  title="Sign up with Google"
                >
                  <FcGoogle size={24} />
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSocialSignup('facebook')}
                  className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition text-blue-600"
                  title="Sign up with Facebook"
                >
                  <FaFacebook size={24} />
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSocialSignup('twitter')}
                  className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition text-blue-400"
                  title="Sign up with Twitter"
                >
                  <FaTwitter size={24} />
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#EE2529] hover:text-[#C73834] font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;