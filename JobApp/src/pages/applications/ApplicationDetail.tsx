import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeftIcon, UserIcon, MailIcon, PhoneIcon, BriefcaseIcon, GraduationCapIcon, FileTextIcon, CheckCircleIcon, XCircleIcon, ClockIcon, StarIcon } from 'lucide-react';
import { updateApplicationStatus, updateApplicationScore, ApplicationStatus } from '../../store/slices/applicationsSlice';
import { RootState } from '../../store/store';
import { toast } from 'sonner';
export const ApplicationDetail: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const application = useSelector((state: RootState) => state.applications.applications.find(app => app.id === id));
  const job = useSelector((state: RootState) => application ? state.jobs.jobs.find(j => j.id === application.jobId) : null);
  const [notes, setNotes] = useState('');
  const [score, setScore] = useState(0);
  useEffect(() => {
    if (application) {
      setNotes(application.notes || '');
      setScore(application.score || 0);
    }
  }, [application]);
  if (!application) {
    return <div className="text-center py-12">
        <p className="text-gray-500">Application not found</p>
        <button onClick={() => navigate('/applications')} className="mt-4 text-blue-600 hover:underline">
          Back to Applications
        </button>
      </div>;
  }
  const handleStatusChange = (status: ApplicationStatus) => {
    dispatch(updateApplicationStatus({
      id: application.id,
      status,
      notes
    }));
    toast.success(`Application marked as ${status}`);
  };
  const handleScoreChange = () => {
    dispatch(updateApplicationScore({
      id: application.id,
      score
    }));
    toast.success('Candidate score updated');
  };
  const handleNotesChange = () => {
    dispatch(updateApplicationStatus({
      id: application.id,
      status: application.status,
      notes
    }));
    toast.success('Notes updated');
  };
  return <div className="space-y-6">
      <div className="flex items-center">
        <button onClick={() => navigate('/applications')} className="mr-4 p-1 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {application.applicantName}
          </h1>
          <p className="text-gray-500">
            {job?.title || 'Unknown Position'} - Application
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Personal Information
                </h2>
                <span className={`px-3 py-1 text-xs rounded-full ${application.status === 'shortlisted' ? 'bg-green-100 text-green-800' : application.status === 'rejected' ? 'bg-red-100 text-red-800' : application.status === 'hired' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{application.applicantName}</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <MailIcon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{application.email}</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <PhoneIcon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{application.phone}</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <BriefcaseIcon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applied For</p>
                    <p className="font-medium">
                      {job?.title || 'Unknown Position'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <ClockIcon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Application Date</p>
                  <p className="font-medium">
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {application.education.map((edu, index) => <div key={index} className="border-l-2 border-blue-500 pl-4 pb-4">
                    <div className="flex items-start">
                      <GraduationCapIcon size={20} className="text-blue-600 mr-2 mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {edu.degree}
                        </h3>
                        <p className="text-gray-700">{edu.institution}</p>
                        <p className="text-sm text-gray-500">
                          Graduated: {edu.year}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Work Experience
              </h2>
              <div className="space-y-6">
                {application.experience.map((exp, index) => <div key={index} className="border-l-2 border-blue-500 pl-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{exp.title}</h3>
                      <p className="text-gray-700">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.duration}</p>
                      <p className="mt-2 text-gray-600">{exp.description}</p>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Skills & Certifications
              </h2>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill, index) => <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </h3>
                <div className="space-y-2">
                  {application.certifications.map((cert, index) => <div key={index} className="flex items-center">
                      <FileTextIcon size={16} className="text-blue-600 mr-2" />
                      <span>{cert}</span>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-900">Application Status</h3>
            </div>
            <div className="p-4 space-y-3">
              <button onClick={() => handleStatusChange('shortlisted')} className={`flex items-center justify-center w-full px-4 py-2 rounded-md text-sm font-medium ${application.status === 'shortlisted' ? 'bg-green-600 text-white' : 'border border-green-500 text-green-700 hover:bg-green-50'}`}>
                <CheckCircleIcon size={18} className="mr-2" />
                Shortlist Candidate
              </button>
              <button onClick={() => handleStatusChange('rejected')} className={`flex items-center justify-center w-full px-4 py-2 rounded-md text-sm font-medium ${application.status === 'rejected' ? 'bg-red-600 text-white' : 'border border-red-500 text-red-700 hover:bg-red-50'}`}>
                <XCircleIcon size={18} className="mr-2" />
                Reject Application
              </button>
              <button onClick={() => handleStatusChange('pending')} className={`flex items-center justify-center w-full px-4 py-2 rounded-md text-sm font-medium ${application.status === 'pending' ? 'bg-yellow-500 text-white' : 'border border-yellow-500 text-yellow-700 hover:bg-yellow-50'}`}>
                <ClockIcon size={18} className="mr-2" />
                Mark as Pending
              </button>
              <button onClick={() => handleStatusChange('hired')} className={`flex items-center justify-center w-full px-4 py-2 rounded-md text-sm font-medium ${application.status === 'hired' ? 'bg-blue-600 text-white' : 'border border-blue-500 text-blue-700 hover:bg-blue-50'}`}>
                <BriefcaseIcon size={18} className="mr-2" />
                Mark as Hired
              </button>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-900">Candidate Score</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-2">
                <div className="flex-1">
                  <input type="range" min="0" max="100" value={score} onChange={e => setScore(parseInt(e.target.value))} className="w-full" />
                </div>
                <div className="ml-4 w-12 text-center font-medium text-blue-600">
                  {score}
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => <StarIcon key={i} size={20} className={`${i < Math.round(score / 20) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />)}
              </div>
              <button onClick={handleScoreChange} className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700">
                Save Score
              </button>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-900">Notes</h3>
            </div>
            <div className="p-4">
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5} className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Add notes about this candidate..."></textarea>
              <button onClick={handleNotesChange} className="mt-2 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700">
                Save Notes
              </button>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4">
              <a href={application.resume} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white">
                <FileTextIcon size={18} className="mr-2" />
                View Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>;
};