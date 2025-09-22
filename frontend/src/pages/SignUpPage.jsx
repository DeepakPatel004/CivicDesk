import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join the community and make a difference.</p>
        </div>
        
        <AuthForm isSignIn={false} />
        
        <div className="text-center mt-6">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;