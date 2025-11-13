import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, EditIcon, TrashIcon, CheckCircleIcon, XCircleIcon, UsersIcon, FileTextIcon } from 'lucide-react';
import { fetchJobById } from '../../store/slices/jobsSlice';
import { RootState } from '../../store/store';
export const JobDetail: React.FC = () => {
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
    applications
  } = useSelector((state: RootState) => state.applications);
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
        <Link to="/jobs" className="mt-4 text-blue-600 hover:underline">
          Back to Jobs
        </Link>
      </div>;
  }
  const jobApplications = applications.filter(app => app.jobId === currentJob.id);
  const pendingCount = jobApplications.filter(app => app.status === 'pending').length;
  const shortlistedCount = jobApplications.filter(app => app.status === 'shortlisted').length;
  const rejectedCount = jobApplications.filter(app => app.status === 'rejected').length;
  const isDeadlinePassed = new Date(currentJob.deadline) < new Date();
  return <div className="space-y-6">
      <div className="flex items-center">
        <button onClick={() => navigate('/jobs')} className="mr-4 p-1 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentJob.title}
          </h1>
          <p className="text-gray-500">{currentJob.department}</p>
        </div>
        <div className="flex space-x-2">
          <Link to={`/jobs/${currentJob.id}/edit`} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <EditIcon size={16} className="mr-1" />
            Edit
          </Link>
          <button className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <TrashIcon size={16} className="mr-1" />
            Delete
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Job Details
                </h2>
                <span className={`px-3 py-1 text-xs rounded-full ${currentJob.status === 'published' ? 'bg-green-100 text-green-800' : currentJob.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                  {currentJob.status.charAt(0).toUpperCase() + currentJob.status.slice(1)}
                </span>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700">{currentJob.description}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">
                  Qualifications:
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {currentJob.qualifications.map((qualification, index) => <li key={index} className="text-gray-700">
                      {qualification}
                    </li>)}
                </ul>
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">
                  Responsibilities:
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {currentJob.responsibilities.map((responsibility, index) => <li key={index} className="text-gray-700">
                      {responsibility}
                    </li>)}
                </ul>
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
                <UsersIcon size={18} className="text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Total Applications</p>
                  <p className="font-medium">{jobApplications.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-900">
                Application Statistics
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-sm">Pending Review</span>
                  </div>
                  <span className="font-medium">{pendingCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Shortlisted</span>
                  </div>
                  <span className="font-medium">{shortlistedCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm">Rejected</span>
                  </div>
                  <span className="font-medium">{rejectedCount}</span>
                </div>
              </div>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="flex h-full">
                  {pendingCount > 0 && <div className="bg-yellow-400 h-full" style={{
                  width: `${pendingCount / jobApplications.length * 100}%`
                }}></div>}
                  {shortlistedCount > 0 && <div className="bg-green-500 h-full" style={{
                  width: `${shortlistedCount / jobApplications.length * 100}%`
                }}></div>}
                  {rejectedCount > 0 && <div className="bg-red-500 h-full" style={{
                  width: `${rejectedCount / jobApplications.length * 100}%`
                }}></div>}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="space-y-3">
                <Link to={`/applications?jobId=${currentJob.id}`} className="flex items-center justify-between w-full px-4 py-2 text-sm text-left font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100">
                  <div className="flex items-center">
                    <UsersIcon size={18} className="mr-2" />
                    View All Applications
                  </div>
                  <span className="bg-blue-200 text-blue-800 py-0.5 px-2 rounded-full text-xs">
                    {jobApplications.length}
                  </span>
                </Link>
                <Link to={`/shortlisting?jobId=${currentJob.id}`} className="flex items-center justify-between w-full px-4 py-2 text-sm text-left font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100">
                  <div className="flex items-center">
                    <CheckCircleIcon size={18} className="mr-2" />
                    Manage Shortlisting
                  </div>
                  <span className="bg-green-200 text-green-800 py-0.5 px-2 rounded-full text-xs">
                    {shortlistedCount}
                  </span>
                </Link>
                <Link to={`/reports?jobId=${currentJob.id}`} className="flex items-center justify-between w-full px-4 py-2 text-sm text-left font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100">
                  <div className="flex items-center">
                    <FileTextIcon size={18} className="mr-2" />
                    Generate Report
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};