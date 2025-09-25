import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data for Jharkhand districts and their blocks
const jharkhandDistricts = {
  '': ['Select a district first'],
  'Bokaro': ['Bokaro', 'Chas', 'Chandankiyari', 'Bermo'],
  'Chatra': ['Chatra', 'Pratappur', 'Gidhour', 'Simaria'],
  'Deoghar': ['Deoghar', 'Sarwan', 'Sonaraithari', 'Madhupur'],
  'Dhanbad': ['Dhanbad', 'Jharia', 'Tundi', 'Topchanchi'],
  'Dumka': ['Dumka', 'Masalia', 'Jama', 'Jarmundi'],
  'East Singhbhum': ['Jamshedpur', 'Potka', 'Ghatshila', 'Musabani'],
  'Garhwa': ['Garhwa', 'Kandi', 'Ramna', 'Bhandaria'],
  'Giridih': ['Giridih', 'Bagodar', 'Suriya', 'Gawan'],
  'Godda': ['Godda', 'Mahagama', 'Poreyahat', 'Sunderpahari'],
  'Gumla': ['Gumla', 'Palkot', 'Raidih', 'Sisai'],
  'Hazaribagh': ['Hazaribagh', 'Barhi', 'Ichak', 'Padma'],
  'Jamtara': ['Jamtara', 'Nala', 'Kundhit', 'Fategarh'],
  'Khunti': ['Khunti', 'Karra', 'Murhu', 'Torpa'],
  'Koderma': ['Koderma', 'Satgawan', 'Jainagar', 'Markacho'],
  'Latehar': ['Latehar', 'Mahuadanr', 'Balumath', 'Mankiya'],
  'Lohardaga': ['Lohardaga', 'Kisko', 'Senha', 'Bhandra'],
  'Pakur': ['Pakur', 'Mahespur', 'Hiranpur', 'Amrapara'],
  'Palamu': ['Daltonganj', 'Lesliganj', 'Satbarwa', 'Panki'],
  'Ramgarh': ['Ramgarh', 'Mandu', 'Gola', 'Patratu'],
  'Ranchi': ['Ranchi', 'Namkum', 'Mandar', 'Ormanjhi'],
  'Sahebganj': ['Sahebganj', 'Barhait', 'Pathna', 'Taljhari'],
  'Seraikela Kharsawan': ['Seraikela', 'Kharsawan', 'Gamharia', 'Ichagarh'],
  'Simdega': ['Simdega', 'Bansjor', 'Jaldega', 'Kolebira'],
  'West Singhbhum': ['Chaibasa', 'Manjhari', 'Tonto', 'Jagannathpur']
};

const ReportIssue = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    district: '',
    block: '',
    locality: '',
    category: '',
    photo: null
  });
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle district change and reset block
  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData(prev => ({
      ...prev,
      district: selectedDistrict,
      block: '' // Reset block when district changes
    }));
  };

  // Handle file upload
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    } else {
      alert('Please select a valid image file.');
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // 🔄 INTEGRATED API CALL 🔄
  const submitReport = async () => {
    setIsSubmitting(true);
    
    try {
      // 1. Basic frontend validation
      if (!formData.title || !formData.description || !formData.district || !formData.block || !formData.locality || !formData.category || !formData.photo) {
        alert('Please fill in all required fields and upload a photo.');
        setIsSubmitting(false);
        return;
      }
      
      // 2. Prepare the FormData object for the multipart/form-data request
      const data = new FormData();
      // Construct location object and serialize to JSON string
      const locationData = {
        district: formData.district,
        block: formData.block,
        locality: formData.locality
      };
      data.append('location', JSON.stringify(locationData));
      data.append('photo', formData.photo);
      data.append('description', formData.description);
      // Optional: Add other form fields if needed by backend (e.g., title, category)
      data.append('title', formData.title);
      data.append('category', formData.category);

      console.log(data)

      // 3. Get the authentication token from localStorage
      const token = sessionStorage.getItem('userToken'); // Assuming token is stored here
      console.log(token)
      if (!token) {
        navigate('/signin');
        alert('You must be logged in to submit a report.');
        setIsSubmitting(false);
        return;
      }

      const API_BASE_URL = 'http://localhost:5000/api';
      

      // 4. Make the API request
      const response = await fetch(`${API_BASE_URL}/reports/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data // FormData is automatically handled by fetch
      });
      
      const result = await response.json();
      
      console.log("report submitting: ", response);
      // 5. Handle responses based on status code
      if (response.ok) { // Status code 200-299
        alert(result.message);
        navigate('/community_feed');
      } else {
        // Handle specific error codes
        let errorMessage = 'Failed to submit report. Please try again.';
        if (response.status === 401) {
          errorMessage = 'Unauthorized: Please log in again.';
        } else if (response.status === 429) {
          errorMessage = 'You have reached your daily report limit.';
        } else if (result.message) {
          errorMessage = result.message; // Use the message from the API
        }
        alert(errorMessage);
      }
      
    } catch (error) {
      console.error('Network or server error:', error);
      // alert('An unexpected error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitReport();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Report a New Issue</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo *
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {formData.photo ? (
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-600">{formData.photo.name}</p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <button
                        type="button"
                        onClick={handleFileInputClick}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Click to upload
                      </button>
                      <span className="text-gray-600"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInputChange}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Broken sidewalk"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                required
              >
                <option value="">Select a category</option>
                <option value="Pothole">Road/Pothole</option>
                <option value="Streetlight">Streetlight</option>
                <option value="Water">Water/Plumbing</option>
                <option value="Traffic">Traffic</option>
                <option value="Trees">Trees/Parks</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Provide more details..."
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 resize-none"
                required
              />
            </div>

            {/* Location Fields (District, Block, Locality) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* District Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                  required
                >
                  <option value="">Select a District</option>
                  {Object.keys(jharkhandDistricts).filter(d => d !== '').map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Block Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Block *
                </label>
                <select
                  name="block"
                  value={formData.block}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                  required
                  disabled={!formData.district}
                >
                  <option value="">Select a Block</option>
                  {formData.district && jharkhandDistricts[formData.district].map(block => (
                    <option key={block} value={block}>{block}</option>
                  ))}
                </select>
              </div>

              {/* Locality Text Field */}
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Locality *
                </label>
                <input
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleInputChange}
                  placeholder="e.g., Near Main Market"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting Report...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Your report will be reviewed by the relevant department and you'll receive updates on its status.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
// import { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ReportIssue = () => {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     location: '',
//     category: '',
//     photo: null
//   });
//   const [dragActive, setDragActive] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [locationLoading, setLocationLoading] = useState(false);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle file upload
//   const handleFileSelect = (file) => {
//     if (file && file.type.startsWith('image/')) {
//       setFormData(prev => ({
//         ...prev,
//         photo: file
//       }));
//     } else {
//       alert('Please select a valid image file.');
//     }
//   };

//   // Handle drag and drop
//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFileSelect(e.dataTransfer.files[0]);
//     }
//   };

//   // Handle file input click
//   const handleFileInputClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileInputChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       handleFileSelect(e.target.files[0]);
//     }
//   };

//   // Get current location
//   const getCurrentLocation = () => {
//     setLocationLoading(true);
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           // Mock reverse geocoding - in real app, you'd call a geocoding API
//           setFormData(prev => ({
//             ...prev,
//             location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Current Location)`
//           }));
//           setLocationLoading(false);
//         },
//         (error) => {
//           console.error('Error getting location:', error);
//           alert('Unable to get current location. Please enter manually.');
//           setLocationLoading(false);
//         }
//       );
//     } else {
//       alert('Geolocation is not supported by this browser.');
//       setLocationLoading(false);
//     }
//   };

//   // Mock API call to submit report
//   const submitReport = async () => {
//     setIsSubmitting(true);
    
//     try {
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Mock validation
//       if (!formData.title || !formData.description || !formData.location) {
//         alert('Please fill in all required fields.');
//         setIsSubmitting(false);
//         return;
//       }

//       // Mock successful submission
//       const mockResponse = {
//         success: true,
//         reportId: Math.floor(Math.random() * 10000),
//         message: 'Report submitted successfully!',
//         data: {
//           ...formData,
//           id: Math.floor(Math.random() * 10000),
//           status: 'Reported',
//           createdAt: new Date().toISOString(),
//           upvotes: 0
//         }
//       };

//       console.log('Mock API Response:', mockResponse);
//       alert('Report submitted successfully! You will be redirected to the community feed.');
      
//       // Navigate to community feed after successful submission
//       navigate('/community_feed');
      
//     } catch (error) {
//       console.error('Error submitting report:', error);
//       alert('Failed to submit report. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     submitReport();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button 
//             onClick={() => navigate(-1)}
//             className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back
//           </button>
//           <h1 className="text-2xl font-bold text-gray-900">Report a New Issue</h1>
//         </div>

//         {/* Form */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Photo Upload */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Upload Photo
//               </label>
//               <div
//                 className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
//                   dragActive 
//                     ? 'border-blue-400 bg-blue-50' 
//                     : 'border-gray-300 hover:border-gray-400'
//                 }`}
//                 onDragEnter={handleDrag}
//                 onDragLeave={handleDrag}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//               >
//                 {formData.photo ? (
//                   <div className="space-y-2">
//                     <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <p className="text-sm text-gray-600">{formData.photo.name}</p>
//                     <button
//                       type="button"
//                       onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
//                       className="text-sm text-red-600 hover:text-red-800"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     <div>
//                       <button
//                         type="button"
//                         onClick={handleFileInputClick}
//                         className="text-blue-600 hover:text-blue-800 font-medium"
//                       >
//                         Click to upload
//                       </button>
//                       <span className="text-gray-600"> or drag and drop</span>
//                     </div>
//                     <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                   </div>
//                 )}
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleFileInputChange}
//                 />
//               </div>
//             </div>

//             {/* Title */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Title *
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="e.g., Broken sidewalk"
//                 className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
//                 required
//               />
//             </div>

//             {/* Category */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category *
//               </label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
//                 required
//               >
//                 <option value="">Select a category</option>
//                 <option value="Pothole">Road/Pothole</option>
//                 <option value="Streetlight">Streetlight</option>
//                 <option value="Water">Water/Plumbing</option>
//                 <option value="Traffic">Traffic</option>
//                 <option value="Trees">Trees/Parks</option>
//                 <option value="Vandalism">Vandalism</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={4}
//                 placeholder="Provide more details..."
//                 className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 resize-none"
//                 required
//               />
//             </div>

//             {/* Location */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Location *
//               </label>
//               <div className="flex space-x-2">
//                 <input
//                   type="text"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   placeholder="Enter address or location"
//                   className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={getCurrentLocation}
//                   disabled={locationLoading}
//                   className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
//                 >
//                   {locationLoading ? (
//                     <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
//                   ) : (
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 {locationLoading ? 'Getting your location...' : 'Click the location icon to use your current location'}
//               </p>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                   Submitting Report...
//                 </>
//               ) : (
//                 'Submit Report'
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Help Text */}
//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600">
//             Your report will be reviewed by the relevant department and you'll receive updates on its status.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportIssue;