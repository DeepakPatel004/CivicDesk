import { Link } from 'react-router-dom';
import { FaMobileAlt, FaChartBar, FaUserTie, FaCheckCircle, FaUsers, FaUserPlus, FaRegLightbulb, FaMapMarkerAlt } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">
        
        {/* Top Hero Section: Welcome Banner */}
        <div className="p-8 sm:p-12 text-center bg-blue-600 text-white rounded-t-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 animate-fadeInDown">
            Building a Better Community Together
          </h1>
          <p className="text-lg sm:text-xl font-light opacity-90 animate-fadeInUp">
            Your seamless platform for civic engagement and government accountability.
          </p>
        </div>

        {/* Data & Statistics Section */}
        <div className="bg-gray-800 text-white p-6 md:p-8 flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="text-center">
            <FaCheckCircle className="text-4xl text-green-400 mx-auto mb-2" />
            <div className="text-4xl font-bold">12,450+</div>
            <p className="text-sm text-gray-400 mt-1">Problems Solved</p>
          </div>
          <div className="text-center">
            <FaUsers className="text-4xl text-purple-400 mx-auto mb-2" />
            <div className="text-4xl font-bold">1,890+</div>
            <p className="text-sm text-gray-400 mt-1">Active Citizens</p>
          </div>
          <div className="text-center">
            <FaChartBar className="text-4xl text-orange-400 mx-auto mb-2" />
            <div className="text-4xl font-bold">35+</div>
            <p className="text-sm text-gray-400 mt-1">Municipal Departments</p>
          </div>
        </div>

        {/* Main Content Section: Citizen & Staff Portals */}
        <div className="p-8 sm:p-12 text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Citizen's Solution */}
            <div className="space-y-6">
              <div className="flex items-center text-blue-600 mb-4">
                <FaMobileAlt className="text-4xl mr-3" />
                <h2 className="text-2xl font-bold">For Citizens: A Mobile-First Experience</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                Effortlessly **report and track civic issues** from your phone. Our platform ensures you're always in the loop with real-time notifications on the status of your reports, from submission to resolution.
              </p>
            </div>

            {/* Municipal Staff Solution */}
            <div className="space-y-6 md:border-l md:pl-10">
              <div className="flex items-center text-green-600 mb-4">
                <FaUserTie className="text-4xl mr-3" />
                <h2 className="text-2xl font-bold">For Municipal Staff: A Powerful Portal</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                Manage and resolve reports efficiently. The administrative portal provides a centralized dashboard to **filter, assign, and track tasks**, ensuring a streamlined and responsive workflow for all departments.
              </p>
            </div>
          </div>
        </div>

        {/* New "How It Works" Section with simplified steps */}
        <div className="bg-blue-50 p-8 sm:p-12 text-center rounded-b-3xl">
          <h3 className="text-3xl font-bold text-blue-800 mb-8">Ready to Make a Difference?</h3>
          <p className="text-lg text-gray-700 mb-10">
            Follow these simple steps to get started and help improve your community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <FaUserPlus className="text-5xl text-orange-500 mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">1. Create an Account</h4>
              <p className="text-gray-600">
                Sign up with your details and verify your email with a one-time password (OTP) to get secure access.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <FaRegLightbulb className="text-5xl text-blue-500 mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">2. Report an Issue</h4>
              <p className="text-gray-600">
                Easily submit a new report by adding a photo, description, and selecting the location.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <FaMapMarkerAlt className="text-5xl text-green-500 mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">3. Track Progress</h4>
              <p className="text-gray-600">
                Stay updated in real-time as your report is confirmed, assigned, and resolved by the relevant department.
              </p>
            </div>
          </div>
          <Link to="/signup" className="mt-12 inline-block btn btn-lg bg-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105">
            Sign Up Now
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
// import { Link } from 'react-router-dom';
// import { FaMobileAlt, FaChartBar, FaUserTie, FaCheckCircle, FaUsers } from 'react-icons/fa';

// const HomePage = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
//       <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">
        
//         {/* Top Hero Section: Welcome Banner */}
//         <div className="p-8 sm:p-12 text-center bg-blue-600 text-white rounded-t-3xl">
//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 animate-fadeInDown">
//             Building a Better Community Together
//           </h1>
//           <p className="text-lg sm:text-xl font-light opacity-90 animate-fadeInUp">
//             Your seamless platform for civic engagement and government accountability.
//           </p>
//         </div>

//         {/* Data & Statistics Section */}
//         <div className="bg-gray-800 text-white p-6 md:p-8 flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0 md:space-x-8">
//           <div className="text-center">
//             <FaCheckCircle className="text-4xl text-green-400 mx-auto mb-2" />
//             <div className="text-4xl font-bold">12,450+</div>
//             <p className="text-sm text-gray-400 mt-1">Problems Solved</p>
//           </div>
//           <div className="text-center">
//             <FaUsers className="text-4xl text-purple-400 mx-auto mb-2" />
//             <div className="text-4xl font-bold">1,890+</div>
//             <p className="text-sm text-gray-400 mt-1">Active Citizens</p>
//           </div>
//           <div className="text-center">
//             <FaChartBar className="text-4xl text-orange-400 mx-auto mb-2" />
//             <div className="text-4xl font-bold">35+</div>
//             <p className="text-sm text-gray-400 mt-1">Municipal Departments</p>
//           </div>
//         </div>

//         {/* Main Content Section: Citizen & Staff Portals */}
//         <div className="p-8 sm:p-12 text-gray-800">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
//             {/* Citizen's Solution */}
//             <div className="space-y-6">
//               <div className="flex items-center text-blue-600 mb-4">
//                 <FaMobileAlt className="text-4xl mr-3" />
//                 <h2 className="text-2xl font-bold">For Citizens: A Mobile-First Experience</h2>
//               </div>
//               <p className="text-lg leading-relaxed text-gray-700">
//                 Effortlessly **report and track civic issues** from your phone. Our platform ensures you're always in the loop with real-time notifications on the status of your reports, from submission to resolution.
//               </p>
//               <div className="mt-8 flex flex-col sm:flex-row justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
//                 <Link to="/signin" className="btn btn-primary bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
//                   Sign In
//                 </Link>
//                 <Link to="/signup" className="btn btn-secondary bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
//                   Get Started
//                 </Link>
//               </div>
//             </div>

//             {/* Municipal Staff Solution */}
//             <div className="space-y-6 md:border-l md:pl-10">
//               <div className="flex items-center text-green-600 mb-4">
//                 <FaUserTie className="text-4xl mr-3" />
//                 <h2 className="text-2xl font-bold">For Municipal Staff: A Powerful Portal</h2>
//               </div>
//               <p className="text-lg leading-relaxed text-gray-700">
//                 Manage and resolve reports efficiently. The administrative portal provides a centralized dashboard to **filter, assign, and track tasks**, ensuring a streamlined and responsive workflow for all departments.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// import { Link } from 'react-router-dom';
// import { FaMobileAlt, FaChartBar, FaUserTie } from 'react-icons/fa';

// const HomePage = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
//       <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">
//         <div className="p-8 sm:p-12 text-center bg-blue-600 text-white rounded-t-3xl">
//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 animate-fadeInDown">
//             Building a Better Community Together
//           </h1>
//           <p className="text-lg sm:text-xl font-light opacity-90 animate-fadeInUp">
//             Your seamless platform for civic engagement and government accountability.
//           </p>
//         </div>

//         <div className="p-8 sm:p-12 text-gray-800">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
//             {/* Citizen's Solution */}
//             <div className="space-y-6">
//               <div className="flex items-center text-blue-600 mb-4">
//                 <FaMobileAlt className="text-4xl mr-3" />
//                 <h2 className="text-2xl font-bold">For Citizens: A Mobile-First Experience</h2>
//               </div>
//               <p className="text-lg leading-relaxed text-gray-700">
//                 Effortlessly **report and track civic issues** from your phone. Our platform ensures you're always in the loop with real-time notifications on the status of your reports, from submission to resolution.
//               </p>
//               <ul className="list-disc list-inside space-y-2 text-gray-600 text-base">
//                 <li>Capture issues with a few taps.</li>
//                 <li>Receive confirmations, acknowledgements, and resolution updates.</li>
//                 <li>Track the progress of your reports in real-time.</li>
//               </ul>
//               <div className="mt-8 flex flex-col sm:flex-row justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
//                 <Link to="/signin" className="btn btn-primary bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
//                   Sign In
//                 </Link>
//                 <Link to="/signup" className="btn btn-secondary bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
//                   Get Started
//                 </Link>
//               </div>
//             </div>

//             {/* Municipal Staff Solution */}
//             <div className="space-y-6 md:border-l md:pl-10">
//               <div className="flex items-center text-green-600 mb-4">
//                 <FaUserTie className="text-4xl mr-3" />
//                 <h2 className="text-2xl font-bold">For Municipal Staff: A Powerful Portal</h2>
//               </div>
//               <p className="text-lg leading-relaxed text-gray-700">
//                 Manage and resolve reports efficiently. The administrative portal provides a centralized dashboard to **filter, assign, and track tasks**, ensuring a streamlined and responsive workflow for all departments.
//               </p>
//               <ul className="list-disc list-inside space-y-2 text-gray-600 text-base">
//                 <li>Automated routing to the correct department.</li>
//                 <li>Filter issues by category, location, and priority.</li>
//                 <li>Update statuses and communicate progress seamlessly.</li>
//               </ul>
//               <div className="flex items-center text-purple-600 mt-6">
//                 <FaChartBar className="text-3xl mr-3" />
//                 <p className="text-base font-semibold">
//                   Analytics & Reporting for Data-Driven Decisions
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// import { Link } from 'react-router-dom';

// const HomePage = () => {
//   return (
//     <div className="card w-full max-w-lg shadow-2xl rounded-2xl bg-gradient-to-r from-orange-400 to-white text-white">
//       <div className="card-body p-10 text-center">
//         <h1 className="text-4xl font-extrabold text-blue-800 mb-2">Welcome to the Official Portal</h1>
//         <p className="text-lg text-gray-700">Your trusted gateway for government services.</p>
//         <p className="text-sm mt-4 text-gray-600">Please sign in to access your dashboard or create a new account to get started.</p>
//         <div className="mt-8 flex justify-center space-x-6">
//           <Link to="/signin" className="btn btn-primary btn-lg rounded-xl shadow-md px-6 py-3 text-black">Sign In</Link>
// <Link to="/signup" className="btn btn-secondary btn-lg rounded-xl shadow-md px-6 py-3 text-black">Sign Up</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;