import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Header from './components/Header';
import LoadingPage from './pages/LoadingPage'; // Import the new component

import './variables.css';
import CommunityFeed from './pages/CommunityFeed';
import ReportIssue from './pages/ReportIssuePage';
import OTPVerification from './pages/OtpPage';

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      // Replace this with your actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }
  return (
    <Router>
      <div className="bg-gray-200 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-10 px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/community_feed" element={<CommunityFeed />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/verify-email" element={<OTPVerification />} />
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
