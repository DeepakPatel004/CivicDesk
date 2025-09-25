import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import Header from './components/Header.jsx';
import LoadingPage from './pages/LoadingPage.jsx'; 
import CommunityFeed from './pages/CommunityFeed.jsx';
import ReportIssue from './pages/ReportIssuePage.jsx';
import OTPVerification from './pages/OtpPage.jsx';

import './variables.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // New state to hold the logged-in user

  useEffect(() => {
    const API_BASE_URL = 'http://localhost:5000/api';

    const checkAuthStatus = async () => {
      try {
        // Correctly retrieve the token from sessionStorage
        const token = sessionStorage.getItem('userToken');
        if (!token) {
          // No token found, so no user is logged in.
          setLoading(false);
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // User is authenticated, save their profile
          setUser(data.user);
          console.log('User authenticated:', data.user);
        } else {
          // Token is invalid or expired, clear it
          sessionStorage.removeItem('userToken');
          sessionStorage.removeItem('userProfile');
          setUser(null);
          console.log('Authentication failed. Token cleared.');
        }
      } catch (error) {
        console.error('Failed to authenticate:', error);
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('userProfile');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }
  
  return (
    <Router>
      <div className="bg-gray-200 min-h-screen flex flex-col">
        {/* Pass the user state to Header to show personalized content */}
        <Header user={user} />
        <main className="flex-grow flex items-center justify-center py-10 px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            {/* Pass user state to protected routes */}
            <Route path="/community_feed" element={<CommunityFeed user={user} />} />
            <Route path="/report" element={<ReportIssue user={user} />} />
            <Route path="/verify-email" element={<OTPVerification />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
// import HomePage from './pages/HomePage.jsx';
// import SignInPage from './pages/SignInPage.jsx';
// import SignUpPage from './pages/SignUpPage.jsx';
// import Header from './components/Header.jsx';
// import LoadingPage from './pages/LoadingPage.jsx'; 
// import CommunityFeed from './pages/CommunityFeed.jsx';
// import ReportIssue from './pages/ReportIssuePage.jsx';
// import OTPVerification from './pages/OtpPage.jsx';

// import './variables.css';

// function App() {
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null); // New state to hold the logged-in user

//   useEffect(() => {
//     const API_BASE_URL = 'http://localhost:5000/api';

//     const checkAuthStatus = async () => {
//       try {
//         const token = localStorage.getItem('userToken');
//         if (!token) {
//           // No token found, so no user is logged in.
//           setLoading(false);
//           return;
//         }
//         console.log(12)

//         const response = await fetch(`${API_BASE_URL}/auth/me`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         });

        
//         console.log(response)
//         console.log(12)

//         if (response.ok) {
//           const data = await response.json();
//           // User is authenticated, save their profile
//           setUser(data.user);
//           console.log('User authenticated:', data.user);
//         } else {
//           // Token is invalid or expired, clear it
//           localStorage.removeItem('userToken');
//           localStorage.removeItem('userProfile');
//           setUser(null);
//           console.log('Authentication failed. Token cleared.');
//         }
//       } catch (error) {
//         console.error('Failed to authenticate:', error);
//         localStorage.removeItem('userToken');
//         localStorage.removeItem('userProfile');
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuthStatus();
//   }, []);

//   if (loading) {
//     return <LoadingPage />;
//   }
  
//   return (
//     <Router>
//       <div className="bg-gray-200 min-h-screen flex flex-col">
//         {/* Pass the user state to Header to show personalized content */}
//         <Header user={user} />
//         <main className="flex-grow flex items-center justify-center py-10 px-4">
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/signin" element={<SignInPage />} />
//             <Route path="/signup" element={<SignUpPage />} />
//             {/* Pass user state to protected routes */}
//             <Route path="/community_feed" element={<CommunityFeed user={user} />} />
//             <Route path="/report" element={<ReportIssue user={user} />} />
//             <Route path="/verify-email" element={<OTPVerification />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;
