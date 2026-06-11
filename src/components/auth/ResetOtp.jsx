import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiPhone } from 'react-icons/fi';

// NOTE: The previous implementation hardcoded a demo OTP ("123456") and faked a
// successful verification with setTimeout. The backend has no password-reset OTP
// endpoint (login OTP is a separate, real flow), so this was deceptive. This page
// now honestly states that password reset isn't available and redirects users to
// the real OTP-based sign-in.
const ResetOtp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          {/* Back Button */}
          <Link
            to="/login"
            className="inline-flex items-center text-[#EE2529] hover:text-[#C73834] mb-6 transition-all duration-300 hover:translate-x-1 group"
          >
            <FiArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="w-8 h-8 text-[#EE2529]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Password Reset Unavailable
            </h2>
            <p className="text-gray-600">
              There is no password to reset for this portal. Sign in with your
              mobile number and a one-time code (OTP) instead.
            </p>
          </div>

          <Link
            to="/login"
            className="w-full bg-gradient-to-r from-[#EE2529] to-[#C73834] hover:from-[#C73834] hover:to-[#EE2529] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <FiPhone className="mr-2" />
            Sign in with OTP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetOtp;
