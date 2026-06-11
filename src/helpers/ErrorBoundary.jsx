import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center text-red-600 text-2xl font-black mb-6 border border-red-100/50">
              !
            </div>
            <h1 className="text-lg font-bold text-slate-800 uppercase tracking-tight mb-2">
              Something went wrong
            </h1>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-8">
              An unexpected error occurred. Please reload the page to continue.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
