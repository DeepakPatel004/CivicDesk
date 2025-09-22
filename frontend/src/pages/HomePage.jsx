import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="card w-full max-w-lg shadow-2xl rounded-2xl bg-gradient-to-r from-orange-400 to-white text-white">
      <div className="card-body p-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-2">Welcome to the Official Portal</h1>
        <p className="text-lg text-gray-700">Your trusted gateway for government services.</p>
        <p className="text-sm mt-4 text-gray-600">Please sign in to access your dashboard or create a new account to get started.</p>
        <div className="mt-8 flex justify-center space-x-6">
          <Link to="/signin" className="btn btn-primary btn-lg rounded-xl shadow-md px-6 py-3 text-black">Sign In</Link>
<Link to="/signup" className="btn btn-secondary btn-lg rounded-xl shadow-md px-6 py-3 text-black">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;