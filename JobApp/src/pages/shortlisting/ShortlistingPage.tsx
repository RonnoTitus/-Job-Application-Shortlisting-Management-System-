import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { SlidersIcon, CheckSquareIcon, SaveIcon, DownloadIcon, FilterIcon, UserIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from 'lucide-react';
import { RootState } from '../../store/store';
import { fetchJobs } from '../../store/slices/jobsSlice';
import { fetchApplications, updateApplicationStatus } from '../../store/slices/applicationsSlice';
import { setCriteria, addToShortlist, removeFromShortlist, clearShortlist } from '../../store/slices/shortlistingSlice';
import { toast } from 'sonner';
export const ShortlistingPage: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    jobs
  } = useSelector((state: RootState) => state.jobs);
  const {
    applications
  } = useSelector((state: RootState) => state.applications);
  const {
    criteria,
    shortlistedCandidates
  } = useSelector((state: RootState) => state.shortlisting);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [educationWeight, setEducationWeight] = useState(30);
  const [experienceWeight, setExperienceWeight] = useState(40);
  const [skillsWeight, setSkillsWeight] = useState(20);
  const [certificationsWeight, setCertificationsWeight] = useState(10);
  const [minimumDegree, setMinimumDegree] = useState<'bachelor' | 'master' | 'phd'>('bachelor');
  const [minimumYears, setMinimumYears] = useState(2);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [requiredCertifications, setRequiredCertifications] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
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
  useEffect(() => {
    if (criteria) {
      setEducationWeight(criteria.education.weight);
      setExperienceWeight(criteria.experience.weight);
      setSkillsWeight(criteria.skills.weight);
      setCertificationsWeight(criteria.certifications.weight);
      setMinimumDegree(criteria.education.minimumDegree);
      setMinimumYears(criteria.experience.minimumYears);
      setRequiredSkills(criteria.skills.requiredSkills);
      setRequiredCertifications(criteria.certifications.requiredCertifications);
    }
  }, [criteria]);
  const jobApplications = applications.filter(app => app.jobId === selectedJobId);
  const saveCriteria = () => {
    // Validate that weights add up to 100
    const totalWeight = educationWeight + experienceWeight + skillsWeight + certificationsWeight;
    if (totalWeight !== 100) {
      toast.error('Weights must add up to 100%');
      return;
    }
    dispatch(setCriteria({
      education: {
        weight: educationWeight,
        minimumDegree
      },
      experience: {
        weight: experienceWeight,
        minimumYears
      },
      skills: {
        weight: skillsWeight,
        requiredSkills
      },
      certifications: {
        weight: certificationsWeight,
        requiredCertifications
      }
    }));
    toast.success('Shortlisting criteria saved');
  };
  const addSkill = () => {
    if (newSkill && !requiredSkills.includes(newSkill)) {
      setRequiredSkills([...requiredSkills, newSkill]);
      setNewSkill('');
    }
  };
  const addCertification = () => {
    if (newCertification && !requiredCertifications.includes(newCertification)) {
      setRequiredCertifications([...requiredCertifications, newCertification]);
      setNewCertification('');
    }
  };
  const removeSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };
  const removeCertification = (cert: string) => {
    setRequiredCertifications(requiredCertifications.filter(c => c !== cert));
  };
  const applyShortlisting = () => {
    // Simple scoring algorithm
    jobApplications.forEach(applicant => {
      let score = 0;
      // Education score
      const hasDegree = applicant.education.some(edu => {
        const degree = edu.degree.toLowerCase();
        if (minimumDegree === 'bachelor' && (degree.includes('bachelor') || degree.includes('master') || degree.includes('phd'))) {
          return true;
        } else if (minimumDegree === 'master' && (degree.includes('master') || degree.includes('phd'))) {
          return true;
        } else if (minimumDegree === 'phd' && degree.includes('phd')) {
          return true;
        }
        return false;
      });
      if (hasDegree) {
        score += educationWeight;
      }
      // Experience score
      const hasExperience = applicant.experience.some(exp => {
        // Simple parsing of years from duration (e.g., "2015-2020" => 5 years)
        const duration = exp.duration;
        if (duration.includes('-')) {
          const [start, end] = duration.split('-');
          const years = parseInt(end) - parseInt(start);
          return years >= minimumYears;
        }
        return false;
      });
      if (hasExperience) {
        score += experienceWeight;
      }
      // Skills score
      if (requiredSkills.length > 0) {
        const matchingSkills = applicant.skills.filter(skill => requiredSkills.some(req => skill.toLowerCase().includes(req.toLowerCase())));
        const skillsRatio = matchingSkills.length / requiredSkills.length;
        score += Math.round(skillsWeight * skillsRatio);
      } else {
        score += skillsWeight;
      }
      // Certifications score
      if (requiredCertifications.length > 0) {
        const matchingCerts = applicant.certifications.filter(cert => requiredCertifications.some(req => cert.toLowerCase().includes(req.toLowerCase())));
        const certsRatio = matchingCerts.length / requiredCertifications.length;
        score += Math.round(certificationsWeight * certsRatio);
      } else {
        score += certificationsWeight;
      }
      // Update the applicant's score
      dispatch(updateApplicationStatus({
        id: applicant.id,
        status: applicant.status,
        notes: applicant.notes,
        score
      }) as any);
      // Automatically shortlist candidates with scores above 70
      if (score >= 70 && applicant.status !== 'shortlisted') {
        dispatch(addToShortlist(applicant));
        dispatch(updateApplicationStatus({
          id: applicant.id,
          status: 'shortlisted',
          notes: `Automatically shortlisted with score: ${score}/100`
        }));
      }
    });
    toast.success('Shortlisting applied successfully');
  };
  const exportShortlist = () => {
    // Implement export functionality
    alert('Export functionality would be implemented here');
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Candidate Shortlisting
        </h1>
        <p className="text-gray-500">
          Define criteria and shortlist qualified candidates
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex items-center">
              <SlidersIcon size={18} className="text-blue-600 mr-2" />
              <h2 className="font-medium text-gray-900">
                Shortlisting Criteria
              </h2>
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
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Criteria Weights (Total: 100%)
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center">
                          <label htmlFor="educationWeight" className="text-sm text-gray-600">
                            Education
                          </label>
                          <span className="text-sm font-medium">
                            {educationWeight}%
                          </span>
                        </div>
                        <input type="range" id="educationWeight" min="0" max="100" value={educationWeight} onChange={e => setEducationWeight(parseInt(e.target.value))} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <label htmlFor="experienceWeight" className="text-sm text-gray-600">
                            Experience
                          </label>
                          <span className="text-sm font-medium">
                            {experienceWeight}%
                          </span>
                        </div>
                        <input type="range" id="experienceWeight" min="0" max="100" value={experienceWeight} onChange={e => setExperienceWeight(parseInt(e.target.value))} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <label htmlFor="skillsWeight" className="text-sm text-gray-600">
                            Skills
                          </label>
                          <span className="text-sm font-medium">
                            {skillsWeight}%
                          </span>
                        </div>
                        <input type="range" id="skillsWeight" min="0" max="100" value={skillsWeight} onChange={e => setSkillsWeight(parseInt(e.target.value))} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <label htmlFor="certificationsWeight" className="text-sm text-gray-600">
                            Certifications
                          </label>
                          <span className="text-sm font-medium">
                            {certificationsWeight}%
                          </span>
                        </div>
                        <input type="range" id="certificationsWeight" min="0" max="100" value={certificationsWeight} onChange={e => setCertificationsWeight(parseInt(e.target.value))} className="w-full" />
                      </div>
                    </div>
                    {educationWeight + experienceWeight + skillsWeight + certificationsWeight !== 100 && <p className="mt-2 text-sm text-red-600">
                        Total weight must equal 100% (currently:{' '}
                        {educationWeight + experienceWeight + skillsWeight + certificationsWeight}
                        %)
                      </p>}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Education Requirements
                    </h3>
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-600">
                        Minimum Degree Level
                      </label>
                      <select value={minimumDegree} onChange={e => setMinimumDegree(e.target.value as 'bachelor' | 'master' | 'phd')} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="phd">PhD/Doctorate</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Experience Requirements
                    </h3>
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-600">
                        Minimum Years of Experience
                      </label>
                      <input type="number" min="0" max="20" value={minimumYears} onChange={e => setMinimumYears(parseInt(e.target.value))} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Required Skills
                    </h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a required skill" className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button onClick={addSkill} className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700">
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {requiredSkills.map((skill, index) => <div key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center">
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="ml-1 text-blue-700 hover:text-blue-900">
                              &times;
                            </button>
                          </div>)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Required Certifications
                    </h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <input type="text" value={newCertification} onChange={e => setNewCertification(e.target.value)} placeholder="Add a required certification" className="flex-1 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button onClick={addCertification} className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700">
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {requiredCertifications.map((cert, index) => <div key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center">
                            {cert}
                            <button onClick={() => removeCertification(cert)} className="ml-1 text-blue-700 hover:text-blue-900">
                              &times;
                            </button>
                          </div>)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={saveCriteria} className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <SaveIcon size={16} className="mr-2" />
                      Save Criteria
                    </button>
                    <button onClick={applyShortlisting} disabled={!selectedJobId} className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                      <CheckSquareIcon size={16} className="mr-2" />
                      Apply
                    </button>
                  </div>
                </>}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div className="flex items-center">
                <CheckSquareIcon size={18} className="text-green-600 mr-2" />
                <h2 className="font-medium text-gray-900">
                  Shortlisted Candidates
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={exportShortlist} disabled={shortlistedCandidates.length === 0} className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
                  <DownloadIcon size={16} className="mr-1" />
                  Export
                </button>
              </div>
            </div>
            {selectedJobId ? jobApplications.length > 0 ? <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidate
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
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jobApplications.map(applicant => <tr key={applicant.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                <UserIcon size={20} />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {applicant.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {applicant.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {applicant.education[0]?.degree || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {applicant.education[0]?.institution || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {applicant.experience[0]?.title || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {applicant.experience[0]?.duration || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">
                              {applicant.score || 0}/100
                            </div>
                            <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                              <div className="bg-blue-600 h-1.5 rounded-full" style={{
                        width: `${applicant.score || 0}%`
                      }}></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${applicant.status === 'shortlisted' ? 'bg-green-100 text-green-800' : applicant.status === 'rejected' ? 'bg-red-100 text-red-800' : applicant.status === 'hired' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {applicant.status === 'shortlisted' ? <button onClick={() => {
                      dispatch(removeFromShortlist(applicant.id));
                      dispatch(updateApplicationStatus({
                        id: applicant.id,
                        status: 'pending'
                      }));
                    }} className="text-red-600 hover:text-red-900">
                                Remove
                              </button> : <button onClick={() => {
                      dispatch(addToShortlist(applicant));
                      dispatch(updateApplicationStatus({
                        id: applicant.id,
                        status: 'shortlisted'
                      }));
                    }} className="text-green-600 hover:text-green-900">
                                Shortlist
                              </button>}
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div> : <div className="text-center py-12">
                  <AlertCircleIcon size={40} className="mx-auto mb-2 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No applications found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are no applications for this job position yet.
                  </p>
                </div> : <div className="text-center py-12">
                <FilterIcon size={40} className="mx-auto mb-2 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Select a job position
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please select a job position to view and shortlist candidates
                </p>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};