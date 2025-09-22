import { useState, useEffect } from 'react';

// Mock API data
const mockReports = [
  {
    id: 1,
    title: "Large Pothole on Main St",
    category: "Pothole",
    department: "Road Damage",
    location: "Near City Park",
    status: "In-Progress",
    upvotes: 128,
    isUpvoted: true,
    createdAt: new Date('2025-09-15'),
    distance: 0.3
  },
  {
    id: 2,
    title: "Streetlight Outage on Oak Ave",
    category: "Streetlight",
    department: "Public Works",
    location: "Oak Avenue",
    status: "Reported",
    upvotes: 97,
    isUpvoted: false,
    createdAt: new Date('2025-09-18'),
    distance: 0.8
  },
  {
    id: 3,
    title: "Broken Water Pipe Downtown",
    category: "Water",
    department: "Water Department",
    location: "Main Street & 1st Ave",
    status: "Resolved",
    upvotes: 245,
    isUpvoted: false,
    createdAt: new Date('2025-09-10'),
    distance: 1.2
  },
  {
    id: 4,
    title: "Graffiti on Public Building",
    category: "Vandalism",
    department: "Parks & Recreation",
    location: "Community Center",
    status: "In-Progress",
    upvotes: 45,
    isUpvoted: false,
    createdAt: new Date('2025-09-19'),
    distance: 0.5
  },
  {
    id: 5,
    title: "Tree Branch Blocking Sidewalk",
    category: "Trees",
    department: "Parks & Recreation",
    location: "Elm Street",
    status: "Reported",
    upvotes: 23,
    isUpvoted: false,
    createdAt: new Date('2025-09-17'),
    distance: 2.1
  },
  {
    id: 6,
    title: "Missing Stop Sign at Intersection",
    category: "Traffic",
    department: "Traffic Management",
    location: "Pine St & Oak Ave",
    status: "In-Progress",
    upvotes: 189,
    isUpvoted: true,
    createdAt: new Date('2025-09-12'),
    distance: 1.8
  }
];

const CommunityFeed = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('nearMe');

  // Mock API call
  const fetchReports = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setReports(mockReports);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Sort reports based on selected filter
  const sortedReports = [...reports].sort((a, b) => {
    switch (sortBy) {
      case 'nearMe':
        return a.distance - b.distance;
      case 'mostUpvoted':
        return b.upvotes - a.upvotes;
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  const handleUpvote = (reportId) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? {
              ...report,
              isUpvoted: !report.isUpvoted,
              upvotes: report.isUpvoted ? report.upvotes - 1 : report.upvotes + 1
            }
          : report
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In-Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reported':
        return 'bg-red-100 text-red-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    const iconClass = "w-6 h-6 text-gray-600";
    switch (category) {
      case 'Pothole':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      case 'Streetlight':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6 xl:p-8">
        <div className="max-w-4xl mx-auto lg:max-w-6xl xl:max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6 w-48 lg:h-10 lg:mb-8"></div>
            <div className="flex space-x-4 mb-6 lg:space-x-6 lg:mb-8">
              <div className="h-10 bg-gray-300 rounded-full w-24 lg:h-12 lg:w-32"></div>
              <div className="h-10 bg-gray-300 rounded-full w-32 lg:h-12 lg:w-40"></div>
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg p-6 mb-4 shadow-sm lg:p-8 lg:mb-6">
                <div className="h-6 bg-gray-300 rounded mb-2 w-3/4 lg:h-8 lg:mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-1/2 lg:h-5 lg:mb-6"></div>
                <div className="h-10 bg-gray-300 rounded w-32 lg:h-12 lg:w-40"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6 xl:p-8">
        <div className="max-w-4xl mx-auto lg:max-w-6xl xl:max-w-7xl">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 lg:text-3xl xl:text-4xl lg:mb-8">Community Feed</h1>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6 lg:gap-4 lg:mb-8">
          <button
            onClick={() => setSortBy('nearMe')}
            className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors lg:px-6 lg:py-3 ${
              sortBy === 'nearMe'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 mr-2 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Near Me
          </button>
          <button
            onClick={() => setSortBy('mostUpvoted')}
            className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors lg:px-6 lg:py-3 ${
              sortBy === 'mostUpvoted'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 mr-2 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Most Upvoted
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors lg:px-6 lg:py-3 ${
              sortBy === 'newest'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 mr-2 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Newest
          </button>
        </div>

        {/* Reports List */}
        <div className="space-y-4 lg:space-y-6">
          {sortedReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow lg:p-8">
              <div className="flex items-start space-x-4 lg:space-x-6">
                {/* Category Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center lg:w-16 lg:h-16">
                  {getCategoryIcon(report.category)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 lg:text-xl lg:mb-2">
                        {report.title}
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium lg:px-3 lg:py-1 lg:text-sm ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 lg:text-base lg:mb-4">
                        {report.department} • {report.location}
                      </p>
                    </div>
                  </div>

                  {/* Upvote Button */}
                  <button
                    onClick={() => handleUpvote(report.id)}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors lg:px-6 lg:py-3 lg:text-base ${
                      report.isUpvoted
                        ? 'bg-pink-500 text-white hover:bg-pink-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2 lg:w-5 lg:h-5" fill={report.isUpvoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    {report.isUpvoted ? 'Upvoted' : 'Upvote'} ({report.upvotes})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button (for future pagination) */}
        <div className="text-center mt-8 lg:mt-12">
          <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors lg:px-8 lg:py-4 lg:text-lg">
            Load More Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;