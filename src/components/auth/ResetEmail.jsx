import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ResetEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shake, setShake] = useState(false);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
    });
    
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      triggerShakeAnimation();
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      triggerShakeAnimation();
      return;
    }

    setIsLoading(true);
    
    // Add loading animation to button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.classList.add('loading-animation');
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (submitBtn) {
        submitBtn.classList.remove('loading-animation');
        submitBtn.classList.add('success-animation');
      }
      
      setSuccess(`Reset code sent to ${email}`);
      
      // Add success animation to email icon
      const emailIcon = document.querySelector('.email-icon');
      if (emailIcon) {
        emailIcon.classList.add('float-animation');
      }
      
      // Navigate to OTP page after 2 seconds
      setTimeout(() => {
        navigate('/reset-otp', { state: { email } });
      }, 2000);
    }, 1500);
  };

  const triggerShakeAnimation = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Add subtle animation on typing
    const input = e.target;
    input.classList.add('typing-animation');
    setTimeout(() => {
      input.classList.remove('typing-animation');
    }, 300);
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes slideInRight {
            from {
              transform: translateX(-10px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes typing {
            0% { box-shadow: 0 0 0 0 rgba(238, 37, 41, 0.2); }
            100% { box-shadow: 0 0 0 10px rgba(238, 37, 41, 0); }
          }
          
          @keyframes success {
            0% { background: linear-gradient(to right, #EE2529, #C73834); }
            50% { background: linear-gradient(to right, #4CAF50, #45a049); }
            100% { background: linear-gradient(to right, #EE2529, #C73834); }
          }
          
          .shake-animation {
            animation: shake 0.5s ease-in-out;
          }
          
          .float-animation {
            animation: float 1s ease-in-out;
          }
          
          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .slide-in-animation {
            animation: slideInRight 0.3s ease-out;
          }
          
          .loading-animation {
            position: relative;
            overflow: hidden;
          }
          
          .loading-animation::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: loading 1.5s infinite;
          }
          
          .success-animation {
            animation: success 0.5s ease-in-out;
          }
          
          .typing-animation {
            animation: typing 0.3s ease-out;
          }
          
          .fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
          }
          
          .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          
          .input-focus {
            transition: all 0.3s ease;
          }
          
          .input-focus:focus {
            transform: scale(1.02);
          }
        `}
      </style>
      
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
        <div 
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden card-hover"
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <div className="p-8">
            {/* Back Button */}
            <Link 
              to="/login" 
              className="inline-flex items-center text-[#EE2529] hover:text-[#C73834] mb-6 transition-all duration-300 hover:translate-x-1 group"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Login
            </Link>

            <div 
              className="text-center mb-8"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div 
                className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 email-icon pulse-animation"
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                <FiMail className="w-8 h-8 text-[#EE2529]" />
              </div>
              <h2 
                className="text-2xl font-bold text-gray-800 mb-2"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                Reset Password
              </h2>
              <p 
                className="text-gray-600"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                Enter your email address and we'll send you a code to reset your password
              </p>
            </div>

            {error && (
              <div 
                className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-lg ${shake ? 'shake-animation' : 'slide-in-animation'}`}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <p className="text-red-600 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div 
                className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg slide-in-animation"
                data-aos="zoom-in"
                data-aos-delay="100"
              >
                <p className="text-green-600 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </p>
              </div>
            )}

            <form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent input-focus transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                  {email && (
                    <div className="absolute right-3 top-3.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Enter the email address associated with your account
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#EE2529] to-[#C73834] hover:from-[#C73834] hover:to-[#EE2529] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                data-aos="zoom-in"
                data-aos-delay="800"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending code...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2 transition-transform group-hover:translate-x-1" />
                    Send Reset Code
                  </>
                )}
              </button>

              <div 
                className="text-center pt-4 border-t border-gray-200"
                data-aos="fade-up"
                data-aos-delay="900"
              >
                <p className="text-gray-600 text-sm">
                  Remember your password?{' '}
                  <Link 
                    to="/login" 
                    className="text-[#EE2529] hover:text-[#C73834] font-medium transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetEmail;