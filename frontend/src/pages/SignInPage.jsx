import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:max-w-lg xl:max-w-xl">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 lg:w-20 lg:h-20">
            <svg className="w-8 h-8 text-blue-600 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 lg:text-4xl">CivicLens</h1>
          <p className="text-gray-600 mt-2 lg:text-lg lg:mt-3">Report issues, improve your city.</p>
        </div>
        
        <div className="lg:px-6">
          <AuthForm isSignIn={true} />
        </div>
        
        <div className="text-center mt-6 lg:mt-8 lg:px-6">
          <span className="text-gray-600 lg:text-lg">Don't have an account? </span>
          <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium lg:text-lg">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;