import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BriefcaseIcon, CalendarIcon, ClockIcon, CheckCircleIcon, XCircleIcon, FileTextIcon, DownloadIcon, MailIcon } from 'lucide-react';
// Mock application data - in a real app, this would come from an API
const mockApplication = {
  id: '1',
  jobId: '1',
  jobTitle: 'District Health Officer',
  department: 'Health',
  description: 'Overseeing all health services in the district',
  status: 'shortlisted',
  appliedDate: '2023-10-15',
  statusUpdatedAt: '2023-10-18',
  resume: '/resumes/john_doe_resume.pdf',
  coverLetter: 'I am writing to express my interest in the District Health Officer position at Kapchorwa District Local Government. With my extensive experience in public health and healthcare administration, I believe I am well-qualified for this role. I have spent the last five years working at Mbale Regional Hospital, where I have gained valuable experience in clinical duties and administrative work. I am particularly interested in this position because it would allow me to contribute to improving healthcare services in rural communities.',
  timeline: [{
    date: '2023-10-15',
    status: 'Application Submitted',
    description: 'Your application has been successfully submitted.'
  }, {
    date: '2023-10-16',
    status: 'Application Received',
    description: 'Your application has been received and is under initial review.'
  }, {
    date: '2023-10-18',
    status: 'Shortlisted',
    description: 'Congratulations! You have been shortlisted for the position.'
  }, {
    date: '2023-10-25',
    status: 'Interview Scheduled',
    description: 'You have been invited for an interview on November 5, 2023 at 10:00 AM.'
  }],
  nextSteps: 'Prepare for your interview. You will be contacted via email with more details.'
};
export const UserApplicationDetail: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [application] = useState(mockApplication);
  if (!application) {
    return <div className="text-center py-12">
        <p className="text-gray-500">Application not found</p>
        <button onClick={() => navigate('/user/applications')} className="mt-4 text-blue-600 hover:underline">
          Back to Applications
        </button>
      </div>;
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center text-yellow-800 bg-yellow-100 px-3 py-1.5 rounded-full text-sm font-medium">
            <ClockIcon size={16} className="mr-1" />
            Under Review
          </span>;
      case 'shortlisted':
        return <span className="flex items-center text-green-800 bg-green-100 px-3 py-1.5 rounded-full text-sm font-medium">
            <CheckCircleIcon size={16} className="mr-1" />
            Shortlisted
          </span>;
      case 'rejected':
        return <span className="flex items-center text-red-800 bg-red-100 px-3 py-1.5 rounded-full text-sm font-medium">
            <XCircleIcon size={16} className="mr-1" />
            Not Selected
          </span>;
      case 'hired':
        return <span className="flex items-center text-blue-800 bg-blue-100 px-3 py-1.5 rounded-full text-sm font-medium">
            <BriefcaseIcon size={16} className="mr-1" />
            Hired
          </span>;
      default:
        return null;
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center">
        <button onClick={() => navigate('/user/applications')} className="mr-4 p-1 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Application Details
          </h1>
          <p className="text-gray-500">{application.jobTitle}</p>
        </div>
        <div>{getStatusBadge(application.status)}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Application Timeline
              </h2>
              <div className="space-y-6">
                {application.timeline.map((event, index) => <div key={index} className="relative pb-6">
                    {index < application.timeline.length - 1 && <div className="absolute left-4 top-4 -bottom-6 w-0.5 bg-gray-200"></div>}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {index === 0 ? <FileTextIcon size={16} /> : index === application.timeline.length - 1 ? <CheckCircleIcon size={16} /> : <ClockIcon size={16} />}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">
                          {event.status}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {event.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </div>
              {application.nextSteps && <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Next Steps
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>{application.nextSteps}</p>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Cover Letter
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700">{application.coverLetter}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-900">Job Information</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center">
                <BriefcaseIcon size={18} className="text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{application.jobTitle}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CalendarIcon size={18} className="text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Applied On</p>
                  <p className="font-medium">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <ClockIcon size={18} className="text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(application.statusUpdatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-900">Documents</h3>
            </div>
            <div className="p-4">
              <a href={application.resume} download className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mb-3">
                <DownloadIcon size={16} className="mr-2" />
                Download Resume
              </a>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-900">Need Help?</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions about your application status, please
                contact our HR department.
              </p>
              <a href="mailto:hr@kdlg.go.ug" className="flex items-center justify-center w-full px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <MailIcon size={16} className="mr-2" />
                Contact HR
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
// Helper component for the information icon
const InformationCircleIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>;
};