import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiMail,
  FiUser,
  FiPhone,
  FiLock,
  FiCheck,
  FiBriefcase,
} from "react-icons/fi";
import { apiCall } from "../../helpers/apicall/apiCall";
import AOS from "aos";
import "aos/dist/aos.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [showOtpField, setShowOtpField] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    reraNumber: "",
    roleName: "Admin",
    otp: "",
    verificationId: "",
  });

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    });

    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, []);

  const handleSendOtp = () => {
    if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError("Please fill in all mandatory fields");
      return;
    }
    setError("");
    
    setIsSubmitting(true);
    apiCall.post({
      route: "/send-otp",
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
          alert("OTP sent to your mobile number");
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
      setError("Please enter the 6-digit OTP");
      return;
    }

    if (!formData.verificationId) {
       setError("Verification ID missing. Please resend OTP.");
       return;
    }

    setIsSubmitting(true);
    apiCall.post({
      route: "/signup",
      payload: formData,
      onSuccess: (res) => {
        setIsSubmitting(false);
        if (res.success) {
          setSuccess("Account created successfully! Redirecting to login...");

          const submitBtn = e.target.querySelector('button[type="submit"]');
          if (submitBtn) submitBtn.classList.add("success-animation");

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setError(res.message || "Signup failed");
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

  return (
    <>
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
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
          
          .shake-animation {
            animation: shake 0.5s ease-in-out;
          }
          
          .success-animation {
            animation: success 1s ease-in-out;
          }
          
          .highlight-animation {
            animation: highlight 0.5s ease-in-out;
          }

          .hide-scrollbar::-webkit-scrollbar {
            display: none;
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
              <div className="mb-8" data-aos="fade-up" data-aos-delay="300">
                <h1 className="text-4xl font-bold mb-2"># PreLease</h1>
                <h2 className="text-2xl font-light tracking-widest text-white uppercase opacity-80">
                  Living Life
                </h2>
              </div>

              <div className="mt-12" data-aos="fade-up" data-aos-delay="400">
                <h1
                  className="text-3xl font-bold mb-4 text-white uppercase tracking-wider"
                  data-aos="fade-right"
                  data-aos-delay="500"
                >
                  Join the Team
                </h1>
                <p
                  className="text-lg opacity-90 mb-8 text-white leading-relaxed"
                  data-aos="fade-right"
                  data-aos-delay="600"
                >
                  Register your administrative account. It only takes a minute
                  to get started.
                </p>

                <div className="space-y-4">
                  {[
                    "Role-Based Access Control",
                    "Administrative Dashboard",
                    "Team Collaboration",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center"
                      data-aos="fade-right"
                      data-aos-delay={700 + index * 100}
                    >
                      <FiCheck className="w-6 h-6 text-red-300 mr-3" />
                      <span className="text-white font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
            </div>
          </div>

          {/* Right Column - Sign Up Form */}
          <div
            className="p-8 md:p-12 flex items-center justify-center bg-white"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="w-full max-w-md hide-scrollbar max-h-[90vh] overflow-y-auto pr-2">
              <h3
                className="text-2xl font-bold text-gray-800 mb-2 uppercase tracking-tight"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                SIGN UP
              </h3>
              <p
                className="text-gray-500 mb-8 text-sm"
                data-aos="fade-right"
                data-aos-delay="600"
              >
                Create your administrative account to access the platform.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-[#EE2529] text-red-700 text-sm shake-animation">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Inputs */}
                <div
                  className="grid grid-cols-2 gap-4"
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
                      First Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
                      Last Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div data-aos="fade-up" data-aos-delay="800">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all"
                      placeholder="example@gmail.com"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number Input */}
                <div data-aos="fade-up" data-aos-delay="900">
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all"
                      placeholder="10 digit number"
                      disabled={showOtpField}
                      required
                    />
                  </div>
                </div>

                {/* Role and RERA */}
                <div
                  className="grid grid-cols-2 gap-4"
                  data-aos="fade-up"
                  data-aos-delay="1000"
                >
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
                      Role
                    </label>
                    <div className="relative">
                      <FiBriefcase className="absolute left-3 top-3.5 text-gray-400" />
                      <select
                        value={formData.roleName}
                        onChange={(e) =>
                          setFormData({ ...formData, roleName: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] bg-white appearance-none"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Sales Manager">Sales Manager</option>
                        <option value="Sales Executive - Client Dealer">Sales Executive(Client Dealer)</option>
                        <option value="Sales Executive - Property Manager">Sales Executive(Property Manager)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-tighter">
                      RERA (Opt)
                    </label>
                    <input
                      type="text"
                      value={formData.reraNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, reraNumber: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
                      placeholder="RERA No"
                    />
                  </div>
                </div>

                {/* OTP Verification */}
                {showOtpField && (
                  <div data-aos="fade-up" data-aos-delay="200">
                    <label className="block text-xs font-bold text-[#EE2529] mb-2 uppercase">
                      Enter OTP
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.otp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border-2 border-[#EE2529] rounded-lg focus:outline-none font-bold tracking-[0.5em]"
                        placeholder="6 DIGITS"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#EE2529] to-[#C73834] hover:from-[#C73834] hover:to-[#EE2529] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 uppercase tracking-widest mt-2"
                  data-aos="zoom-in"
                  data-aos-delay="1100"
                >
                  {isSubmitting
                    ? "Processing..."
                    : showOtpField
                      ? "Confirm & Sign Up"
                      : "Register with OTP"}
                </button>

                {/* Login Link */}
                <div
                  className="text-center pt-4 border-t border-gray-100"
                  data-aos="fade-up"
                  data-aos-delay="1200"
                >
                  <p className="text-gray-600 text-sm font-medium">
                    Already a member?{" "}
                    <Link
                      to="/login"
                      className="text-[#EE2529] hover:text-[#C73834] font-bold transition-all duration-300 hover:scale-105 inline-block"
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
