import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { SearchIcon, FilterIcon, BriefcaseIcon, CalendarIcon, ClipboardCheckIcon, XIcon, UserIcon } from 'lucide-react';
import { fetchJobs } from '../../store/slices/jobsSlice';
import { RootState } from '../../store/store';
export const UserJobsList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    jobs,
    isLoading,
    error
  } = useSelector((state: RootState) => state.jobs);
  const {
    isAuthenticated
  } = useSelector((state: RootState) => state.userAuth);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  useEffect(() => {
    dispatch(fetchJobs() as any);
  }, [dispatch]);
  // Get unique departments for filter
  const departments = ['all', ...new Set(jobs.map(job => job.department))];
  // Filter jobs based on search and department
  const filteredJobs = jobs.filter(job => {
    if (job.status !== 'published') return false;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.description.toLowerCase().includes(searchTerm.toLowerCase()) || job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });
  const handleApplyClick = (jobId: string) => {
    if (!isAuthenticated) {
      setSelectedJobId(jobId);
      setShowAuthPrompt(true);
    } else {
      navigate(`/user/apply/${jobId}`);
    }
  };
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
  }
  if (error) {
    return <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">Error loading jobs: {error}</p>
      </div>;
  }
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
                Authentication Required
              </h3>
              <p className="text-gray-600 mt-2">
                You need to sign in or create an account to apply for this job
              </p>
            </div>
            <div className="space-y-3">
              <Link to="/user/login" state={{
            from: selectedJobId ? `/user/apply/${selectedJobId}` : '/user/jobs'
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Available Job Positions
        </h1>
        <p className="text-gray-600">
          Browse through our current job openings and find your next opportunity
        </p>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <input type="text" placeholder="Search jobs..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon size={18} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <FilterIcon size={18} className="text-gray-500" />
                <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
                  <option value="all">All Departments</option>
                  {departments.filter(dept => dept !== 'all').map(department => <option key={department} value={department}>
                        {department}
                      </option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
        {filteredJobs.length > 0 ? <div className="p-4 grid gap-4">
            {filteredJobs.map(job => <div key={job.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <BriefcaseIcon size={14} className="mr-1" />
                        <span>{job.department}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500 justify-end mb-1">
                        <CalendarIcon size={14} className="mr-1" />
                        <span>
                          Deadline:{' '}
                          {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      {new Date(job.deadline) < new Date() ? <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Closed
                        </span> : <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Active
                        </span>}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-3 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.qualifications.slice(0, 3).map((qual, index) => <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {qual}
                      </span>)}
                    {job.qualifications.length > 3 && <span className="text-gray-500 text-xs px-2 py-1">
                        +{job.qualifications.length - 3} more
                      </span>}
                  </div>
                  <div className="flex justify-between items-center">
                    <Link to={`/user/jobs/${job.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                      View Details
                    </Link>
                    {new Date(job.deadline) >= new Date() && <button onClick={() => handleApplyClick(job.id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                        Apply Now
                      </button>}
                  </div>
                </div>
              </div>)}
          </div> : <div className="text-center py-12">
            <ClipboardCheckIcon size={40} className="mx-auto mb-2 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No jobs found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || departmentFilter !== 'all' ? 'Try adjusting your search or filter criteria' : 'There are no job postings available at the moment'}
            </p>
          </div>}
      </div>
    </div>;
};