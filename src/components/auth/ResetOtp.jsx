import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle, FiClock, FiSend } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'preleaseadmin@gmail.com';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [shakeInputs, setShakeInputs] = useState(false);
  
  const inputRefs = useRef([]);

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
    
    // Auto-focus first input
    if (inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0].focus();
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
      setIsPulsing(true);
    }
  }, [timer, canResend]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');

      // Add animation to current input
      if (inputRefs.current[index]) {
        inputRefs.current[index].classList.add('input-pop');
        setTimeout(() => {
          inputRefs.current[index].classList.remove('input-pop');
        }, 200);
      }

      // Auto-focus next input
      if (value && index < 5) {
        setTimeout(() => {
          inputRefs.current[index + 1].focus();
          inputRefs.current[index + 1].classList.add('input-focus');
          setTimeout(() => {
            inputRefs.current[index + 1].classList.remove('input-focus');
          }, 300);
        }, 100);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      inputRefs.current[index - 1].classList.add('input-focus');
      setTimeout(() => {
        inputRefs.current[index - 1].classList.remove('input-focus');
      }, 300);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const numbers = pasteData.replace(/\D/g, '');
    
    if (numbers.length === 6) {
      const newOtp = numbers.split('').slice(0, 6);
      setOtp(newOtp);
      
      // Animate all inputs
      inputRefs.current.forEach((input, idx) => {
        if (input) {
          setTimeout(() => {
            input.classList.add('input-success');
            setTimeout(() => {
              input.classList.remove('input-success');
            }, 500);
          }, idx * 100);
        }
      });
      
      setTimeout(() => {
        inputRefs.current[5].focus();
      }, 600);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setShakeInputs(false);

    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      setShakeInputs(true);
      triggerShakeAnimation();
      return;
    }

    // Check if OTP is 123456 (demo OTP)
    if (otpString === '123456') {
      setIsLoading(true);
      
      // Add loading animation to button
      const submitBtn = e.target.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.classList.add('loading-animation');
      }
      
      // Animate all inputs on success
      inputRefs.current.forEach((input, idx) => {
        if (input) {
          setTimeout(() => {
            input.classList.add('input-success');
          }, idx * 100);
        }
      });
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        if (submitBtn) {
          submitBtn.classList.remove('loading-animation');
          submitBtn.classList.add('success-animation');
        }
        
        // Navigate after showing success animation
        setTimeout(() => {
          navigate('/confirm-password', { state: { email, otp: otpString } });
        }, 1000);
      }, 1500);
    } else {
      setError('Invalid verification code. Try: 123456');
      setShakeInputs(true);
      triggerShakeAnimation();
      
      // Animate inputs with error
      inputRefs.current.forEach(input => {
        if (input) {
          input.classList.add('input-error');
          setTimeout(() => {
            input.classList.remove('input-error');
          }, 1000);
        }
      });
    }
  };

  const triggerShakeAnimation = () => {
    const form = document.querySelector('form');
    if (form) {
      form.classList.add('shake-animation');
      setTimeout(() => {
        form.classList.remove('shake-animation');
      }, 500);
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setTimer(60);
      setCanResend(false);
      setIsPulsing(false);
      setError('');
      setOtp(['', '', '', '', '', '']);
      
      // Reset all inputs
      inputRefs.current.forEach(input => {
        if (input) {
          input.classList.add('input-reset');
          setTimeout(() => {
            input.classList.remove('input-reset');
          }, 300);
        }
      });
      
      // Focus first input
      setTimeout(() => {
        inputRefs.current[0].focus();
        inputRefs.current[0].classList.add('input-focus');
        setTimeout(() => {
          inputRefs.current[0].classList.remove('input-focus');
        }, 300);
      }, 400);
      
      // Show success animation
      const resendBtn = document.querySelector('[type="button"]:contains("Resend Code")');
      if (resendBtn) {
        resendBtn.classList.add('success-animation');
        setTimeout(() => {
          resendBtn.classList.remove('success-animation');
        }, 1000);
      }
      
      // Show success message with animation
      setError('');
      const successMsg = `New code sent to ${email}`;
      const errorDiv = document.querySelector('.error-container');
      if (errorDiv) {
        errorDiv.innerHTML = `<div class="p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in"><p class="text-green-600 text-sm">${successMsg}</p></div>`;
        setTimeout(() => {
          errorDiv.innerHTML = '';
        }, 3000);
      }
    }
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
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }
          
          @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          @keyframes success {
            0% { background: linear-gradient(to right, #EE2529, #C73834); }
            50% { background: linear-gradient(to right, #4CAF50, #45a049); }
            100% { background: linear-gradient(to right, #EE2529, #C73834); }
          }
          
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes countdown {
            from { width: 100%; }
            to { width: 0%; }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes checkmark {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          
          .shake-animation {
            animation: shake 0.5s ease-in-out;
          }
          
          .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .input-pop {
            animation: pop 0.2s ease-out;
          }
          
          .input-focus {
            animation: bounce 0.3s ease-out;
            border-color: #EE2529 !important;
            box-shadow: 0 0 0 3px rgba(238, 37, 41, 0.1);
          }
          
          .input-success {
            border-color: #10B981 !important;
            background-color: #D1FAE5;
            animation: checkmark 0.3s ease-out;
          }
          
          .input-error {
            border-color: #EF4444 !important;
            background-color: #FEE2E2;
            animation: shake 0.5s ease-in-out;
          }
          
          .input-reset {
            animation: fadeInUp 0.3s ease-out;
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
          
          .countdown-bar {
            height: 3px;
            background: linear-gradient(to right, #EE2529, #C73834);
            animation: countdown 60s linear forwards;
            border-radius: 1.5px;
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
          
          .otp-input {
            transition: all 0.3s ease;
          }
          
          .otp-input:focus {
            transform: scale(1.1);
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
              to="/reset-email" 
              className="inline-flex items-center text-[#EE2529] hover:text-[#C73834] mb-6 transition-all duration-300 hover:translate-x-1 group"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
              Back
            </Link>

            <div 
              className="text-center mb-8"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div 
                className={`w-16 h-16 ${isPulsing ? 'bg-green-100 pulse-animation' : 'bg-green-50'} rounded-full flex items-center justify-center mx-auto mb-4`}
                data-aos="zoom-in"
                data-aos-delay="400"
              >
                <FiCheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 
                className="text-2xl font-bold text-gray-800 mb-2"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                Enter Verification Code
              </h2>
              <p 
                className="text-gray-600 mb-2"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                We sent a 6-digit code to <span className="font-semibold text-[#EE2529]">{email}</span>
              </p>
              <p 
                className="text-sm text-gray-500"
                data-aos="fade-up"
                data-aos-delay="700"
              >
                Enter the code below to verify your identity
              </p>
            </div>

            {/* Countdown Bar */}
            <div 
              className="mb-6 h-1 bg-gray-200 rounded-full overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <div 
                className="countdown-bar h-full"
                style={{animationDuration: `${timer}s`}}
              ></div>
            </div>

            <div className="error-container mb-4">
              {error && (
                <div 
                  className="p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in"
                  data-aos="shake"
                >
                  <p className="text-red-600 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}
            </div>

            <form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              data-aos="fade-up"
              data-aos-delay="900"
            >
              {/* OTP Inputs */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  6-Digit Verification Code
                </label>
                <div className={`flex justify-center gap-2 mb-4 ${shakeInputs ? 'shake-animation' : ''}`}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-12 h-12 text-center text-2xl font-bold border-2 ${digit ? 'border-[#EE2529]' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent otp-input transition-all duration-300`}
                      required
                    />
                  ))}
                </div>
                <p 
                  className="text-center text-sm text-gray-500 mt-2"
                  data-aos="fade-up"
                  data-aos-delay="1000"
                >
                  Demo code: <span className="font-mono font-bold text-[#EE2529]">123456</span>
                </p>
              </div>

              {/* Timer/Resend */}
              <div 
                className="text-center"
                data-aos="fade-up"
                data-aos-delay="1100"
              >
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-[#EE2529] hover:text-[#C73834] font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center mx-auto gap-2"
                  >
                    <FiSend className="w-4 h-4" />
                    Resend Code
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FiClock className="w-4 h-4 animate-pulse" />
                    <span>Resend code in </span>
                    <span className="font-semibold text-[#EE2529]">{timer}s</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#EE2529] to-[#C73834] hover:from-[#C73834] hover:to-[#EE2529] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                data-aos="zoom-in"
                data-aos-delay="1200"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="mr-2 transition-transform group-hover:scale-110" />
                    Verify Code
                  </>
                )}
              </button>

              <div 
                className="text-center pt-4 border-t border-gray-200"
                data-aos="fade-up"
                data-aos-delay="1300"
              >
                <p className="text-gray-600 text-sm">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={!canResend}
                    className={`text-[#EE2529] hover:text-[#C73834] font-medium transition-all duration-300 ${canResend ? 'hover:scale-105' : 'text-gray-400 cursor-not-allowed'}`}
                  >
                    {canResend ? 'Click to Resend' : 'Resend'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetOtp;