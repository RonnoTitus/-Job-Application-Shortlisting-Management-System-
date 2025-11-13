import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BriefcaseIcon, CalendarIcon, ClockIcon, MapPinIcon, CheckCircleIcon, FileTextIcon, UserIcon, XIcon } from 'lucide-react';
import { fetchJobById } from '../../store/slices/jobsSlice';
import { RootState } from '../../store/store';
export const UserJobDetail: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentJob,
    isLoading,
    error
  } = useSelector((state: RootState) => state.jobs);
  const {
    isAuthenticated
  } = useSelector((state: RootState) => state.userAuth);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id) as any);
    }
  }, [dispatch, id]);
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
  }
  if (error) {
    return <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">Error loading job details: {error}</p>
      </div>;
  }
  if (!currentJob) {
    return <div className="text-center py-12">
        <p className="text-gray-500">Job not found</p>
        <Link to="/user/jobs" className="mt-4 text-blue-600 hover:underline">
          Back to Jobs
        </Link>
      </div>;
  }
  const isDeadlinePassed = new Date(currentJob.deadline) < new Date();
  const handleApplyClick = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
    } else {
      navigate(`/user/apply/${currentJob.id}`);
    }
  };
  return <div className="space-y-6">
      {/* Auth Prompt Modal */}
      {showAuthPrompt && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button onClick={() => setShowAuthPrompt(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <XIcon size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <UserIcon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Authentication Required
              </h3>
              <p className="text-gray-600 mt-2">
                You need to sign in or create an account to apply for this job
              </p>
            </div>
            <div className="space-y-3">
              <Link to="/user/login" state={{
            from: `/user/apply/${currentJob.id}`
          }} className="block w-full bg-blue-600 text-white text-center py-3 rounded-md font-medium hover:bg-blue-700">
                Sign In
              </Link>
              <Link to="/user/register" className="block w-full bg-white border border-gray-300 text-gray-700 text-center py-3 rounded-md font-medium hover:bg-gray-50">
                Create Account
              </Link>
              <button onClick={() => setShowAuthPrompt(false)} className="block w-full text-gray-500 text-center py-2 text-sm hover:text-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>}
      <div className="flex items-center">
        <button onClick={() => navigate('/user/jobs')} className="mr-4 p-1 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentJob.title}
          </h1>
          <p className="text-gray-500">{currentJob.department}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <p className="text-gray-700">{currentJob.description}</p>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Qualifications</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {currentJob.qualifications.map((qualification, index) => <li key={index} className="text-gray-700">
                      {qualification}
                    </li>)}
                </ul>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {currentJob.responsibilities.map((responsibility, index) => <li key={index} className="text-gray-700">
                      {responsibility}
                    </li>)}
                </ul>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">How to Apply</h2>
                <p className="text-gray-700 mb-4">
                  To apply for this position, please click the "Apply Now"
                  button and follow the instructions to submit your application
                  online. Make sure to have your resume, cover letter, and any
                  required documents ready.
                </p>
                <div className="mt-6">
                  {isDeadlinePassed ? <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-red-700">
                        The application deadline for this position has passed.
                      </p>
                    </div> : <button onClick={handleApplyClick} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <CheckCircleIcon size={20} className="mr-2" />
                      Apply Now
                    </button>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-900">Job Summary</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center">
                <BriefcaseIcon size={18} className="text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{currentJob.department}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CalendarIcon size={18} className="text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Application Deadline</p>
                  <p className="font-medium">
                    {new Date(currentJob.deadline).toLocaleDateString()}
                    {isDeadlinePassed && <span className="ml-2 text-xs text-red-600">
                        (Expired)
                      </span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <ClockIcon size={18} className="text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Posted On</p>
                  <p className="font-medium">
                    {new Date(currentJob.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPinIcon size={18} className="text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">Kapchorwa District, Uganda</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-900">Share This Job</h3>
            </div>
            <div className="p-4">
              <div className="flex justify-around">
                <button className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </button>
                <button className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </button>
                <button className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </button>
                <button className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="text-center">
                <FileTextIcon size={24} className="mx-auto text-gray-400 mb-2" />
                <h3 className="text-gray-900 font-medium mb-1">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions about this job, please contact our
                  HR department.
                </p>
                <a href="mailto:hr@kdlg.go.ug" className="text-blue-600 hover:underline text-sm">
                  hr@kdlg.go.ug
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};