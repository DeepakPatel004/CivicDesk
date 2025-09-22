import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  // Get email from navigation state or use default
  const email = location.state?.email || 'your.email@example.com';

  // Timer countdown for resend
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
    inputRefs.current[focusIndex]?.focus();
  };

  // Mock OTP verification
  const verifyOTP = async () => {
    setIsVerifying(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const otpString = otp.join('');
      
      if (otpString.length !== 6) {
        alert('Please enter the complete 6-digit code.');
        setIsVerifying(false);
        return;
      }

      // Mock verification - accept any 6-digit code for demo
      const mockResponse = {
        success: true,
        message: 'Email verified successfully!',
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: Math.floor(Math.random() * 1000),
          email: email,
          verified: true
        }
      };

      console.log('Mock OTP Verification Response:', mockResponse);
      alert('Email verified successfully! You can now access your account.');
      
      // Navigate to dashboard or home page
      navigate('/community_feed');
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Mock resend OTP
  const resendOTP = async () => {
    setResendLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = {
        success: true,
        message: 'Verification code sent successfully!'
      };

      console.log('Mock Resend OTP Response:', mockResponse);
      alert('New verification code sent to your email!');
      
      // Reset timer
      setTimer(60);
      // Clear current OTP
      setOtp(['', '', '', '', '', '']);
      // Focus first input
      inputRefs.current[0]?.focus();
      
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOTP();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            Enter the 6-digit code sent to your email.
          </p>
          <p className="text-sm text-blue-600 mt-1">{email}</p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input Fields */}
          <div className="flex justify-center space-x-2 sm:space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-50"
                autoComplete="off"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isVerifying || otp.some(digit => !digit)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isVerifying ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </button>
        </form>

        {/* Resend Code */}
        <div className="text-center mt-6">
          <span className="text-gray-600">Didn't receive a code? </span>
          {timer > 0 ? (
            <span className="text-gray-500">
              Resend in {timer}s
            </span>
          ) : (
            <button
              onClick={resendOTP}
              disabled={resendLoading}
              className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
            >
              {resendLoading ? 'Sending...' : 'Resend'}
            </button>
          )}
        </div>

        {/* Back to Sign In */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/signin')}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Back to Sign In
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Check your spam folder if you don't see the email in your inbox.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;