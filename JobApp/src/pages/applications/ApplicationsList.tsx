import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  SearchIcon, FilterIcon, DownloadIcon, UserIcon, BriefcaseIcon
} from 'lucide-react';
import {
  fetchApplications,
  updateApplicationStatus,
  setFilters,
  clearFilters,
  ApplicationStatus
} from '../../store/slices/applicationsSlice';
import { fetchJobs } from '../../store/slices/jobsSlice';
import { RootState, AppDispatch } from '../../store/store';

interface ApplicationsListProps {
  isAdmin?: boolean; // true = admin sees all applications
}

export const ApplicationsList: React.FC<ApplicationsListProps> = ({ isAdmin = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { applications, filteredApplications, filters, isLoading, error } =
    useSelector((state: RootState) => state.applications);
  const { jobs } = useSelector((state: RootState) => state.jobs);

  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');

  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    // Apply filters from URL
    const params = new URLSearchParams(location.search);
    const jobId = params.get('jobId');
    const status = params.get('status') as ApplicationStatus | null;
    if (jobId) setJobFilter(jobId);
    if (status) setStatusFilter(status);
    if (jobId || status) {
      dispatch(setFilters({ jobId: jobId || undefined, status: status || undefined }));
    }
  }, [location.search, dispatch]);

  const handleSearch = () => {
    dispatch(setFilters({ ...filters, searchTerm: searchTerm || undefined }));
  };

  const handleFilterChange = () => {
    dispatch(setFilters({
      jobId: jobFilter || undefined,
      status: statusFilter || undefined,
      searchTerm: searchTerm || undefined,
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setJobFilter('');
    setStatusFilter('');
    dispatch(clearFilters());
  };

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    dispatch(updateApplicationStatus({ id, status: newStatus }));
  };

  const exportApplications = () => {
    alert('Export functionality can be implemented here');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">Error loading applications: {error}</p>
      </div>
    );
  }

  // ✅ Filter for non-admin: show only current user's applications
  const currentUserEmail = localStorage.getItem('userEmail');
  const visibleApplications = isAdmin
    ? filteredApplications
    : filteredApplications.filter(app => app.email === currentUserEmail);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'All Job Applications' : 'My Applications'}
          </h1>
          <p className="text-gray-500">
            {visibleApplications.length} application
            {visibleApplications.length !== 1 ? 's' : ''}
            {Object.keys(filters).length > 0 ? ' (filtered)' : ''}
          </p>
        </div>
        <button
          onClick={exportApplications}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <DownloadIcon size={16} className="mr-2" /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, email, or skills..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon size={18} />
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <select
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={jobFilter}
                onChange={(e) => {
                  setJobFilter(e.target.value);
                  handleFilterChange();
                }}
              >
                <option value="">All Jobs</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>

              <select
                className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as ApplicationStatus | '');
                  handleFilterChange();
                }}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>

              {Object.keys(filters).length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="p-2 text-sm text-red-600 hover:text-red-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Applications Table */}
        {visibleApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {visibleApplications.map((application) => {
                  const job = jobs.find((j) => j.id === application.jobId);
                  return (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <UserIcon size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{application.applicantName}</div>
                            <div className="text-sm text-gray-500">{application.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        <BriefcaseIcon size={16} className="inline text-gray-400 mr-1" />
                        {job?.title || 'Unknown'}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            application.status === 'shortlisted'
                              ? 'bg-green-100 text-green-800'
                              : application.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : application.status === 'hired'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </td>

                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleStatusChange(application.id, 'shortlisted')}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No applications found.</div>
        )}
      </div>
    </div>
  );
};
