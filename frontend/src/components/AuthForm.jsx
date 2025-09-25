import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ isSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const API_BASE_URL = 'http://localhost:5000/api';
    const endpoint = isSignIn ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/signup`;

    try {
      const requestBody = isSignIn 
        ? { email, password }
        : { name, email, password };

        console.log(requestBody)
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('API Response:', response);

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        console.log('API Response:', data);

        if (isSignIn) {
          // Store token and user data in sessionStorage on successful login
          sessionStorage.setItem('userToken', data.token);
          sessionStorage.setItem('userProfile', JSON.stringify(data.user));
          window.dispatchEvent(new Event('authStateChanged'));

          navigate('/community_feed'); 
        } else {
          // For sign-up, redirect to OTP verification page with email.
          // User data will be stored in session storage after OTP verification is successful.
          navigate('/verify-email', { state: { email: email } });
        }
      } else {
        // Handle API error responses
        setMessage(data.message || 'An unexpected error occurred.');
      }
    } catch (error) {
      console.error('API Error:', error);
      setMessage('Something went wrong. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-4 rounded-lg text-sm ${
          message.includes('successful') || message.includes('logged') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
      {!isSignIn && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={!isSignIn}
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="your.email@example.com"
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-6 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Loading...' : (isSignIn ? 'Sign In' : 'Create Account')}
      </button>
    </form>
  );
};

export default AuthForm;
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthForm = ({ isSignIn }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState(''); // New state for user name
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Mock API call with simulated delay
//     try {
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Mock validation
//       if (!email || !password || (!isSignIn && !name)) {
//         alert('Please fill in all required fields.');
//         return;
//       }
      
//       if (password.length < 6) {
//         alert('Password must be at least 6 characters long.');
//         return;
//       }
      
//       // Mock successful response
//       const mockResponse = {
//         success: true,
//         message: isSignIn ? 'Sign in successful!' : 'Account created successfully!',
//         user: {
//           id: Math.floor(Math.random() * 1000),
//           email: email,
//           name: isSignIn ? 'User' : name
//         }
//       };
      
//       console.log('Mock API Response:', mockResponse);
//       alert(mockResponse.message);
      
//       if (isSignIn) {
//         navigate('/community'); // or wherever you want to redirect after sign in
//       } else {
//         // Redirect to OTP verification page with email
//         navigate('/verify-email', { state: { email: email } });
//       }
      
//     } catch (error) {
//       console.error('Mock API error:', error);
//       alert('Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {!isSignIn && (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Full Name
//           </label>
//           <input
//             type="text"
//             placeholder="Your Name"
//             className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required={!isSignIn}
//           />
//         </div>
//       )}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Email
//         </label>
//         <input
//           type="email"
//           placeholder="your.email@example.com"
//           className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Password
//         </label>
//         <input
//           type="password"
//           placeholder="••••••••"
//           className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//       </div>
//       <button 
//         type="submit" 
//         className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-6"
//       >
//         {isSignIn ? 'Sign In' : 'Create Account'}
//       </button>
//     </form>
//   );
// };

// export default AuthForm;