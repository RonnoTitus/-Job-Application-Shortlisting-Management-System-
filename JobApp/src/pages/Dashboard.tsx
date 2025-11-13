import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, UsersIcon, CheckSquareIcon, AlertCircleIcon, TrendingUpIcon, ClipboardListIcon, CalendarIcon } from 'lucide-react';
import { fetchJobs } from '../store/slices/jobsSlice';
import { fetchApplications } from '../store/slices/applicationsSlice';
import { RootState } from '../store/store';
export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const {
    jobs
  } = useSelector((state: RootState) => state.jobs);
  const {
    applications,
    filteredApplications
  } = useSelector((state: RootState) => state.applications);
  useEffect(() => {
    dispatch(fetchJobs() as any);
    dispatch(fetchApplications() as any);
  }, [dispatch]);
  const statsCards = [{
    title: 'Active Job Postings',
    value: jobs.filter(job => job.status === 'published').length,
    icon: <BriefcaseIcon className="text-blue-600" />,
    color: 'bg-blue-50',
    link: '/jobs'
  }, {
    title: 'Total Applications',
    value: applications.length,
    icon: <UsersIcon className="text-green-600" />,
    color: 'bg-green-50',
    link: '/applications'
  }, {
    title: 'Shortlisted Candidates',
    value: applications.filter(app => app.status === 'shortlisted').length,
    icon: <CheckSquareIcon className="text-purple-600" />,
    color: 'bg-purple-50',
    link: '/shortlisting'
  }, {
    title: 'Pending Review',
    value: applications.filter(app => app.status === 'pending').length,
    icon: <AlertCircleIcon className="text-amber-600" />,
    color: 'bg-amber-50',
    link: '/applications?status=pending'
  }];
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">
          Welcome to Kapchorwa District Local Government Shortlisting Management
          System
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => <Link to={card.link} key={index} className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${card.color} mr-4`}>
                {card.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {card.value}
                </h3>
                <p className="text-sm text-gray-500">{card.title}</p>
              </div>
            </div>
          </Link>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Job Postings
            </h2>
            <Link to="/jobs" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {jobs.length > 0 ? <div className="space-y-4">
              {jobs.slice(0, 5).map(job => <Link to={`/jobs/${job.id}`} key={job.id} className="block p-3 rounded hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.department}</p>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon size={14} className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">
                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${job.status === 'published' ? 'bg-green-100 text-green-800' : job.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {applications.filter(app => app.jobId === job.id).length}{' '}
                      applications
                    </span>
                  </div>
                </Link>)}
            </div> : <div className="text-center py-6 text-gray-500">
              <ClipboardListIcon size={40} className="mx-auto mb-2 text-gray-400" />
              <p>No job postings yet</p>
              <Link to="/jobs/create" className="text-blue-600 hover:underline mt-2 inline-block">
                Create your first job posting
              </Link>
            </div>}
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Applications
            </h2>
            <Link to="/applications" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {applications.length > 0 ? <div className="space-y-3">
              {applications.slice(0, 5).map(application => {
            const job = jobs.find(j => j.id === application.jobId);
            return <Link to={`/applications/${application.id}`} key={application.id} className="block p-3 rounded hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {application.applicantName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {job?.title || 'Unknown Position'}
                        </p>
                      </div>
                      <div>
                        <span className={`px-2 py-1 text-xs rounded-full ${application.status === 'shortlisted' ? 'bg-green-100 text-green-800' : application.status === 'rejected' ? 'bg-red-100 text-red-800' : application.status === 'hired' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      Applied on{' '}
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </div>
                  </Link>;
          })}
            </div> : <div className="text-center py-6 text-gray-500">
              <UsersIcon size={40} className="mx-auto mb-2 text-gray-400" />
              <p>No applications yet</p>
            </div>}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center mb-4">
          <TrendingUpIcon size={20} className="text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">
            Recruitment Progress
          </h2>
        </div>
        <div className="space-y-4">
          {jobs.slice(0, 3).map(job => {
          const totalApps = applications.filter(app => app.jobId === job.id).length;
          const shortlistedApps = applications.filter(app => app.jobId === job.id && app.status === 'shortlisted').length;
          const progress = totalApps ? Math.round(shortlistedApps / totalApps * 100) : 0;
          return <div key={job.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{job.title}</span>
                  <span className="text-gray-500">
                    {shortlistedApps}/{totalApps} shortlisted
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{
                width: `${progress}%`
              }}></div>
                </div>
              </div>;
        })}
        </div>
      </div>
    </div>;
};