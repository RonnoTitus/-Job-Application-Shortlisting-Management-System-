import React, { useEffect, useState, createElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { DownloadIcon, FileTextIcon, BarChartIcon, PieChartIcon, UserIcon, BriefcaseIcon, FilterIcon, PrinterIcon } from 'lucide-react';
import { RootState } from '../../store/store';
import { fetchJobs } from '../../store/slices/jobsSlice';
import { fetchApplications } from '../../store/slices/applicationsSlice';
export const ReportsPage: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    jobs
  } = useSelector((state: RootState) => state.jobs);
  const {
    applications
  } = useSelector((state: RootState) => state.applications);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [reportType, setReportType] = useState<'shortlisted' | 'all'>('shortlisted');
  useEffect(() => {
    dispatch(fetchJobs() as any);
    dispatch(fetchApplications() as any);
    // Parse query parameters from URL
    const params = new URLSearchParams(location.search);
    const jobId = params.get('jobId');
    if (jobId) {
      setSelectedJobId(jobId);
    }
  }, [dispatch, location.search]);
  const selectedJob = jobs.find(job => job.id === selectedJobId);
  const filteredApplications = applications.filter(app => {
    if (!selectedJobId) return false;
    if (app.jobId !== selectedJobId) return false;
    if (reportType === 'shortlisted' && app.status !== 'shortlisted') return false;
    return true;
  });
  const exportCSV = () => {
    if (filteredApplications.length === 0) {
      alert('No data to export');
      return;
    }
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Education', 'Experience', 'Skills', 'Score', 'Status'];
    const rows = filteredApplications.map(app => [app.name, app.email, app.phone, app.education.map(e => `${e.degree} (${e.institution})`).join('; '), app.experience.map(e => `${e.title} at ${e.company} (${e.duration})`).join('; '), app.skills.join(', '), app.score || 0, app.status]);
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    // Create and download the file
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedJob?.title || 'applications'}_report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const printReport = () => {
    window.print();
  };
  const jobApplications = selectedJobId ? applications.filter(app => app.jobId === selectedJobId) : [];
  const pendingCount = jobApplications.filter(app => app.status === 'pending').length;
  const shortlistedCount = jobApplications.filter(app => app.status === 'shortlisted').length;
  const rejectedCount = jobApplications.filter(app => app.status === 'rejected').length;
  const hiredCount = jobApplications.filter(app => app.status === 'hired').length;
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">Generate and export candidate reports</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={exportCSV} disabled={filteredApplications.length === 0} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
            <DownloadIcon size={16} className="mr-2" />
            Export CSV
          </button>
          <button onClick={printReport} disabled={filteredApplications.length === 0} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400">
            <PrinterIcon size={16} className="mr-2" />
            Print
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex items-center">
              <FileTextIcon size={18} className="text-blue-600 mr-2" />
              <h2 className="font-medium text-gray-900">Report Options</h2>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <label htmlFor="job" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Job Position
                </label>
                <select id="job" value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a job position</option>
                  {jobs.map(job => <option key={job.id} value={job.id}>
                      {job.title}
                    </option>)}
                </select>
              </div>
              {selectedJobId && <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Report Type
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input id="shortlisted" name="report-type" type="radio" checked={reportType === 'shortlisted'} onChange={() => setReportType('shortlisted')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                        <label htmlFor="shortlisted" className="ml-2 block text-sm text-gray-700">
                          Shortlisted Candidates Only
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input id="all" name="report-type" type="radio" checked={reportType === 'all'} onChange={() => setReportType('all')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                        <label htmlFor="all" className="ml-2 block text-sm text-gray-700">
                          All Candidates
                        </label>
                      </div>
                    </div>
                  </div>
                </>}
            </div>
          </div>
          {selectedJobId && <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center">
                <BarChartIcon size={18} className="text-blue-600 mr-2" />
                <h2 className="font-medium text-gray-900">
                  Application Statistics
                </h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Application Status
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Applications
                        </span>
                        <span className="font-medium">
                          {jobApplications.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Pending Review
                        </span>
                        <span className="font-medium">{pendingCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Shortlisted
                        </span>
                        <span className="font-medium">{shortlistedCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Rejected</span>
                        <span className="font-medium">{rejectedCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Hired</span>
                        <span className="font-medium">{hiredCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-4"></div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Visual Breakdown
                    </h3>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
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
                        {hiredCount > 0 && <div className="bg-blue-500 h-full" style={{
                      width: `${hiredCount / jobApplications.length * 100}%`
                    }}></div>}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
                        <span>Pending</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                        <span>Shortlisted</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                        <span>Rejected</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                        <span>Hired</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div className="flex items-center">
                <FileTextIcon size={18} className="text-blue-600 mr-2" />
                <h2 className="font-medium text-gray-900">
                  {reportType === 'shortlisted' ? 'Shortlisted Candidates Report' : 'All Candidates Report'}
                </h2>
              </div>
              {selectedJob && <span className="text-sm text-gray-500">
                  {selectedJob.title} - {selectedJob.department}
                </span>}
            </div>
            {selectedJobId ? filteredApplications.length > 0 ? <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidate
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Education
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Experience
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications.map(application => <tr key={application.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                <UserIcon size={20} />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {application.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {application.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {application.education[0]?.degree || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.education[0]?.institution || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {application.experience[0]?.title || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.experience[0]?.duration || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">
                              {application.score || 0}/100
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${application.status === 'shortlisted' ? 'bg-green-100 text-green-800' : application.status === 'rejected' ? 'bg-red-100 text-red-800' : application.status === 'hired' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div> : <div className="text-center py-12">
                  <FileTextIcon size={40} className="mx-auto mb-2 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No candidates found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {reportType === 'shortlisted' ? 'No shortlisted candidates for this job position yet' : 'No applications for this job position yet'}
                  </p>
                </div> : <div className="text-center py-12">
                <FilterIcon size={40} className="mx-auto mb-2 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Select a job position
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please select a job position to generate a report
                </p>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};