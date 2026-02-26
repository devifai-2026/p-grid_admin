import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiPhone, FiLock, FiCheck } from "react-icons/fi";
import { apiCall } from "../../helpers/apicall/apiCall";
import { showToast } from "../../helpers/swalHelper";
import AOS from "aos";

import "aos/dist/aos.css";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showOtpField, setShowOtpField] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: "",
    otp: "",
    verificationId: "",
  });

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    });

    // Refresh AOS after component mounts
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, []);

  const handleSendOtp = () => {
    setError("");
    if (formData.mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);
    apiCall.post({
      route: "/send-otp", // Corrected route
      payload: {
        mobileNumber: formData.mobileNumber,
      },
      onSuccess: (res) => {
        setIsSubmitting(false);
        if (res.success) {
          setFormData((prev) => ({
            ...prev,
            verificationId: res.data.verificationId,
          }));
          setShowOtpField(true);
          // Auto-fill OTP if it was pre-filled (e.g. demo credentials)
          if (formData.otp === "1111") {
            // keep it
          } else {
            showToast("success", "OTP sent to your mobile number");
          }
        } else {
          setError(res.message || "Failed to send OTP");
        }
      },
      onError: (err) => {
        setIsSubmitting(false);
        setError(err.message || "Failed to send OTP");
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!showOtpField) {
      handleSendOtp();
      return;
    }

    if (formData.otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    if (!formData.verificationId) {
      setError("Verification ID missing. Please resend OTP.");
      return;
    }

    setIsSubmitting(true);
    apiCall.post({
      route: "/login", // Corrected route
      payload: {
        mobileNumber: formData.mobileNumber,
        otp: formData.otp,
        verificationId: formData.verificationId,
      },
      onSuccess: (res) => {
        setIsSubmitting(false);
        if (res.success) {
          console.log("Login successful:", res.data);
          if (
            res.data.role === "Owner" ||
            res.data.role === "Broker" ||
            res.data.role === "Investor"
          ) {
            setError(
              "You are not authorized to login, only Admin, Sales Manager, Sales Executive and Super Admin can login",
            );
            return;
          }
          // Add pulse animation to button
          const loginBtn = e.target.querySelector('button[type="submit"]');
          if (loginBtn) {
            loginBtn.classList.add("animate-pulse");
          }

          // Call the onLogin callback with user data
          if (onLogin) {
            onLogin(res.data);
          }
          // Redirect after short delay for animation
          setTimeout(() => {
            navigate("/dashboard/analytics");
          }, 800);
        } else {
          setError(res.message || "Login failed");
          const form = e.target;
          form.classList.add("shake-animation");
          setTimeout(() => form.classList.remove("shake-animation"), 500);
        }
      },
      onError: (err) => {
        setIsSubmitting(false);
        setError(err.data?.message || err.message || "Something went wrong");
        const form = e.target;
        form.classList.add("shake-animation");
        setTimeout(() => form.classList.remove("shake-animation"), 500);
      },
    });
  };

  const handleUseAdminCredentials = () => {
    setFormData({
      mobileNumber: "6666666661",
      otp: "111111",
      verificationId: "", // Reset verification ID to force new generation
    });
    setShowOtpField(false); // Force creating new OTP flow

    // Animate the form fields
    document.querySelectorAll("input").forEach((input, index) => {
      setTimeout(() => {
        input.classList.add("highlight-animation");
        setTimeout(() => {
          input.classList.remove("highlight-animation");
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
          
          .highlight-animation {
            animation: highlight 0.5s ease-in-out;
          }
          
          .float-animation {
            animation: float 3s ease-in-out infinite;
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
            {/* Decorative elements - Background */}
            <div
              className="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-20 rounded-full -translate-y-16 translate-x-16 z-0"
              data-aos="fade-down-left"
              data-aos-delay="700"
            ></div>
            <div
              className="absolute bottom-0 left-0 w-48 h-48 bg-red-500 opacity-20 rounded-full translate-y-24 -translate-x-24 z-0"
              data-aos="fade-up-right"
              data-aos-delay="800"
            ></div>

            <div className="relative z-10 text-white">
              <div className="mb-8" data-aos="fade-up" data-aos-delay="300">
                <h1 className="text-4xl font-bold mb-2"># PreLease</h1>
                <h2 className="text-2xl font-light tracking-widest text-white uppercase opacity-80">
                  Living Life
                </h2>
              </div>

              <div className="mt-8" data-aos="fade-up" data-aos-delay="400">
                <div
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 float-animation"
                  data-aos="zoom-in"
                  data-aos-delay="500"
                >
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    OTP Verification
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-white">
                      Enter your mobile number to receive a secure OTP. Use 1111
                      for demo purposes.
                    </p>
                  </div>
                </div>

                <p
                  className="text-lg opacity-90 text-white mt-12"
                  data-aos="fade-up"
                  data-aos-delay="600"
                >
                  Your gateway to premium property management.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div
            className="p-8 md:p-12 flex items-center justify-center"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="w-full max-w-md">
              <h3
                className="text-2xl font-bold text-gray-800 mb-2 uppercase"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                SIGN IN -
              </h3>
              <p
                className="text-gray-600 mb-8"
                data-aos="fade-right"
                data-aos-delay="600"
              >
                Access the admin panel securely via OTP.
              </p>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border-l-4 border-[#EE2529] rounded text-red-700 text-sm shake-animation">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Mobile Number Input */}
                <div data-aos="fade-up" data-aos-delay="700">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobileNumber: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10),
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all duration-300 hover:border-[#EE2529]"
                      placeholder="Enter 10 digit number"
                      disabled={showOtpField || isSubmitting}
                      required
                    />
                  </div>
                </div>

                {/* OTP Input */}
                {showOtpField && (
                  <div data-aos="fade-up" data-aos-delay="300">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      OTP
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.otp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all duration-300 hover:border-[#EE2529] font-bold tracking-widest"
                        placeholder="6 digit OTP"
                        required
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowOtpField(false)}
                      className="mt-2 text-xs text-[#EE2529] font-semibold uppercase hover:underline"
                    >
                      Change Number?
                    </button>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#EE2529] to-[#C73834] hover:from-[#C73834] hover:to-[#EE2529] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 flex items-center justify-center uppercase tracking-widest"
                    data-aos="zoom-in"
                    data-aos-delay="800"
                  >
                    {isSubmitting
                      ? "Verifying..."
                      : showOtpField
                        ? "Login"
                        : "Get OTP"}
                  </button>
                </div>

                {!showOtpField && (
                  <button
                    type="button"
                    onClick={handleUseAdminCredentials}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2 uppercase text-xs tracking-wider"
                    data-aos="zoom-in"
                    data-aos-delay="900"
                  >
                    🔑 Use Demo Credentials
                  </button>
                )}

                {/* Sign Up Link */}
                <div
                  className="text-center pt-4 border-t border-gray-100"
                  data-aos="fade-up"
                  data-aos-delay="1000"
                >
                  <p className="text-gray-600">
                    New to the team?{" "}
                    <Link
                      to="/signup"
                      className="text-[#EE2529] hover:text-[#C73834] font-bold transition-all duration-300 hover:scale-105 inline-block"
                    >
                      Create Account
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
