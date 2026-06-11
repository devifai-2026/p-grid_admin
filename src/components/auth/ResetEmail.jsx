import React from 'react';
import { Link } from 'react-router-dom';
import { FiLock, FiArrowLeft, FiPhone } from 'react-icons/fi';

// NOTE: This admin app authenticates exclusively via mobile-number + OTP login.
// The backend exposes no password-reset / forgot-password endpoints, so the
// previous "send reset code" flow only simulated success (setTimeout) and was
// misleading. Until a real reset API exists, this page honestly tells the user
// that password reset is unavailable and points them to OTP sign-in.
const ResetEmail = () => {
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
              This portal doesn&apos;t use passwords. You sign in with your mobile
              number and a one-time code (OTP), so there&apos;s nothing to reset.
            </p>
          </div>

          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-700 text-sm">
              If you can&apos;t access your account, please contact your
              administrator to verify your registered mobile number.
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

export default ResetEmail;
