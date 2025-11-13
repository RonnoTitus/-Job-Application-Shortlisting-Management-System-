import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BriefcaseIcon, SearchIcon, ClipboardCheckIcon, ChevronRightIcon, ClockIcon, XIcon, UserIcon } from 'lucide-react';
import { fetchJobs } from '../../store/slices/jobsSlice';
import { RootState } from '../../store/store';
export const UserDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    user
  } = useSelector((state: RootState) => state.userAuth);
  const {
    jobs,
    isLoading
  } = useSelector((state: RootState) => state.jobs);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  useEffect(() => {
    dispatch(fetchJobs() as any);
  }, [dispatch]);
  const featuredJobs = jobs.filter(job => job.status === 'published').slice(0, 4);
  const handleApplyClick = (jobId: string) => {
    if (!user) {
      setSelectedJobId(jobId);
      setShowAuthPrompt(true);
    } else {
      navigate(`/user/apply/${jobId}`);
    }
  };
  return <div>
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
                Create an Account or Sign In
              </h3>
              <p className="text-gray-600 mt-2">
                To apply for jobs and track your applications, you need to
                create an account or sign in
              </p>
            </div>
            <div className="space-y-3">
              <Link to="/user/login" state={{
            from: selectedJobId ? `/user/apply/${selectedJobId}` : '/user'
          }} className="block w-full bg-blue-600 text-white text-center py-3 rounded-md font-medium hover:bg-blue-700">
                Sign In
              </Link>
              <Link to="/user/register" className="block w-full bg-white border border-gray-300 text-gray-700 text-center py-3 rounded-md font-medium hover:bg-gray-50">
                Create Account
              </Link>
              <button onClick={() => setShowAuthPrompt(false)} className="block w-full text-gray-500 text-center py-2 text-sm hover:text-gray-700">
                Continue Browsing
              </button>
            </div>
          </div>
        </div>}
      {/* Hero Section */}
      <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Next Career Opportunity with Kapchorwa District
          </h1>
          <p className="text-blue-100 text-lg mb-6">
            Explore open positions and join our team to make a difference in the
            community
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/user/jobs" className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 text-center">
              Browse All Jobs
            </Link>
            {!user && <button onClick={() => setShowAuthPrompt(true)} className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 text-center">
                Create Account
              </button>}
          </div>
        </div>
      </div>
      {/* Job Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="relative">
          <input type="text" placeholder="Search for jobs by title, department or keyword..." className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <div className="absolute left-3 top-3.5 text-gray-400">
            <SearchIcon size={20} />
          </div>
          <button className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700">
            Search
          </button>
        </div>
      </div>
      {/* Featured Jobs */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
          <Link to="/user/jobs" className="text-blue-600 hover:text-blue-800 flex items-center">
            View all jobs
            <ChevronRightIcon size={16} className="ml-1" />
          </Link>
        </div>
        {isLoading ? <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div> : featuredJobs.length > 0 ? <div className="grid md:grid-cols-2 gap-4">
            {featuredJobs.map(job => <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-gray-600">{job.department}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <BriefcaseIcon size={20} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <ClockIcon size={16} className="mr-1" />
                    <span>
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Link to={`/user/jobs/${job.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                      View Details
                    </Link>
                    {new Date(job.deadline) >= new Date() && <button onClick={() => handleApplyClick(job.id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                        Apply Now
                      </button>}
                  </div>
                </div>
              </div>)}
          </div> : <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ClipboardCheckIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No jobs available
            </h3>
            <p className="text-gray-600">
              There are no job postings available at the moment. Please check
              back later.
            </p>
          </div>}
      </div>
      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How to Apply
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="font-medium text-lg mb-2">Create an Account</h3>
            <p className="text-gray-600">
              Register to create your profile and access job applications
            </p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="font-medium text-lg mb-2">Find a Job</h3>
            <p className="text-gray-600">
              Browse available positions and find the right fit for your skills
            </p>
          </div>
          <div className="text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="font-medium text-lg mb-2">Submit Application</h3>
            <p className="text-gray-600">
              Complete the application form and upload required documents
            </p>
          </div>
        </div>
      </div>
    </div>;
};