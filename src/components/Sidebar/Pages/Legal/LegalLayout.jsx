import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../../../../assets/Navbar/Preleasegrid logo 1.png";

/**
 * Shared chrome for the public legal pages (Terms & Conditions, Privacy Policy).
 * Kept intentionally standalone (no sidebar/auth) so it can be linked from the
 * public listing/signup flow as well as from inside the app.
 */
const LegalLayout = ({ title, lastUpdated, children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between">
          <img src={logo} alt="P-Lease-Grid" className="h-9 w-auto object-contain" />
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#EE2529] transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {lastUpdated && (
          <p className="text-sm text-gray-400 mt-2">Last updated: {lastUpdated}</p>
        )}
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-gray-700">
          {children}
        </div>

        <footer className="mt-14 pt-6 border-t border-gray-200 text-xs text-gray-400">
          © {new Date().getFullYear()} P-Lease-Grid. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

// Small helpers so both legal pages render consistent section headings/lists.
export const Section = ({ heading, children }) => (
  <section>
    <h2 className="text-lg font-semibold text-gray-900 mb-2">{heading}</h2>
    <div className="space-y-2">{children}</div>
  </section>
);

export const Bullets = ({ items }) => (
  <ul className="list-disc pl-5 space-y-1">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

export default LegalLayout;
