import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'register' | 'forgot-password';
}

type AuthMode = 'login' | 'register' | 'forgot-password';

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  defaultMode = 'login' 
}) => {
  const [currentMode, setCurrentMode] = useState<AuthMode>(defaultMode);
  const [isVisible, setIsVisible] = useState(false);

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Prevent modal from closing accidentally
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    console.log('🔄 AuthModal closing');
    setCurrentMode('login'); // Reset to login when closing
    onClose();
  };

  const handleSuccess = () => {
    console.log('✅ Auth success, calling onSuccess callback');
    if (onSuccess) onSuccess();
    handleClose();
  };

  // Don't render if not open
  if (!isOpen && !isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto transform transition-transform duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-xl z-10">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎌</div>
            <h1 className="text-lg font-semibold text-gray-900">
              {currentMode === 'login' && 'Sign In'}
              {currentMode === 'register' && 'Create Account'}
              {currentMode === 'forgot-password' && 'Reset Password'}
            </h1>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {currentMode === 'login' && (
            <LoginForm
              onSwitchToRegister={() => setCurrentMode('register')}
              onSwitchToForgotPassword={() => setCurrentMode('forgot-password')}
              onClose={handleSuccess}
            />
          )}

          {currentMode === 'register' && (
            <RegisterForm
              onSwitchToLogin={() => setCurrentMode('login')}
              onClose={handleSuccess}
            />
          )}

          {currentMode === 'forgot-password' && (
            <ForgotPasswordForm
              onSwitchToLogin={() => setCurrentMode('login')}
              onClose={handleClose}
            />
          )}
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => {
                window.location.href = `${window.location.protocol}//${window.location.hostname}:5000/api/auth/google`;
              }}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;