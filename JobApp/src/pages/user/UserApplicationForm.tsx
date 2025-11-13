import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeftIcon, PlusIcon, TrashIcon, UploadIcon, CheckCircleIcon } from 'lucide-react';
import { fetchJobById } from '../../store/slices/jobsSlice';
import { RootState } from '../../store/store';
import { createApplication, fetchApplications  } from "../../store/slices/applicationsSlice";
import { AppDispatch } from "../../store/store";

// Mock function to simulate file upload
const mockFileUpload = (file: File): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`/uploads/${file.name}`);
    }, 1000);
  });
};
const applicationSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    year: z.string().min(1, 'Year is required')
  })).min(1, 'At least one education entry is required'),
  experience: z.array(z.object({
    title: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company is required'),
    duration: z.string().min(1, 'Duration is required'),
    description: z.string().min(1, 'Description is required')
  })),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  certifications: z.array(z.string()),
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters')
});
type ApplicationFormData = z.infer<typeof applicationSchema>;
export const UserApplicationForm: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    currentJob,
    isLoading: jobLoading
  } = useSelector((state: RootState) => state.jobs);
  const {
    user
  } = useSelector((state: RootState) => state.userAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors
    }
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      education: [{
        degree: '',
        institution: '',
        year: ''
      }],
      experience: [{
        title: '',
        company: '',
        duration: '',
        description: ''
      }],
      skills: [''],
      certifications: [''],
      coverLetter: ''
    }
  });
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation
  } = useFieldArray({
    control,
    name: 'education'
  });
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience
  } = useFieldArray({
    control,
    name: 'experience'
  });
  /*const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill
  } = useFieldArray({
    control,
    name: 'skills'
  });
  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification
  } = useFieldArray({
    control,
    name: 'certifications'
  });*/
  const skills = watch('skills');
  const certifications = watch('certifications');
  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id) as any);
    }
  }, [dispatch, id]);
  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setValue('skills', [...skills,newSkill]);
      setNewSkill('');
    }
  };
  const handleAddCertification = () => {
    if (newCertification && !certifications.includes(newCertification)) {
      setValue('certifications',[...certifications,newCertification]);
      setNewCertification('');
    }
  };
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };
const onSubmit = async (data: ApplicationFormData) => {
  if (!resumeFile) {
    toast.error("Please upload your resume");
    return;
  }

  if (!id) {
    toast.error("Job ID is missing");
    return;
  }

  setIsSubmitting(true);

  try {
    const resumeUrl = await mockFileUpload(resumeFile);

    // ✅ Always get the authenticated user's info
    const userEmail = user?.email || localStorage.getItem("userEmail") || data.email;
    const applicantName = user?.fullName || data.fullName;

    // ✅ Create new application with all expected fields
    const newApplication = {
      jobId: id,
      applicantName,
      email: userEmail,
      phone: data.phone,
      resume: resumeUrl,
      coverLetter: data.coverLetter,
      education: data.education,
      experience: data.experience,
      skills: data.skills,
      certifications: data.certifications,
      status: "pending", // important
      appliedAt: new Date().toISOString(), // important
    };

    // ✅ Save application via Redux thunk (localStorage included)
    await dispatch(createApplication(newApplication)).unwrap();

    // ✅ Reload the list so it appears under "My Applications"
    await dispatch(fetchApplications()).unwrap();

    toast.success("Application submitted successfully!");
    navigate("/user/applications");
  } catch (error) {
    console.error(error);
    toast.error("Failed to submit application. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  if (jobLoading) {
    return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
  }
  if (!currentJob) {
    return <div className="text-center py-12">
        <p className="text-gray-500">Job not found</p>
        <button onClick={() => navigate('/user/jobs')} className="mt-4 text-blue-600 hover:underline">
          Back to Jobs
        </button>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex items-center">
        <button onClick={() => navigate(`/user/jobs/${id}`)} className="mr-4 p-1 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Apply for {currentJob.title}
          </h1>
          <p className="text-gray-500">{currentJob.department}</p>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name*
                  </label>
                  <input id="fullName" type="text" className={`mt-1 block w-full rounded-md border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} {...register('fullName')} />
                  {errors.fullName && <p className="mt-1 text-sm text-red-600">
                      {errors.fullName.message}
                    </p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email*
                  </label>
                  <input id="email" type="email" className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} {...register('email')} />
                  {errors.email && <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number*
                  </label>
                  <input id="phone" type="tel" className={`mt-1 block w-full rounded-md border ${errors.phone ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} {...register('phone')} />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>}
                </div>
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                    Resume/CV* (PDF, DOC, DOCX)
                  </label>
                  <div className="mt-1 flex items-center">
                    <label className="flex-1 flex items-center justify-center px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                      <UploadIcon size={18} className="mr-2" />
                      {resumeFile ? resumeFile.name : 'Upload Resume'}
                      <input id="resume" type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                    </label>
                  </div>
                  {!resumeFile && <p className="mt-1 text-sm text-gray-500">
                      Please upload your resume (required)
                    </p>}
                </div>
              </div>
            </div>
            {/* Education */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Education*
                </h2>
                <button type="button" onClick={() => appendEducation({
                degree: '',
                institution: '',
                year: ''
              })} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <PlusIcon size={16} className="mr-1" />
                  Add Education
                </button>
              </div>
              <div className="space-y-4">
                {educationFields.map((field, index) => <div key={field.id} className="border rounded-md p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Degree/Qualification
                        </label>
                        <input type="text" className={`mt-1 block w-full rounded-md border ${errors.education?.[index]?.degree ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="e.g. Bachelor of Science" {...register(`education.${index}.degree`)} />
                        {errors.education?.[index]?.degree && <p className="mt-1 text-sm text-red-600">
                            {errors.education[index]?.degree?.message}
                          </p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Institution
                        </label>
                        <input type="text" className={`mt-1 block w-full rounded-md border ${errors.education?.[index]?.institution ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="e.g. Makerere University" {...register(`education.${index}.institution`)} />
                        {errors.education?.[index]?.institution && <p className="mt-1 text-sm text-red-600">
                            {errors.education[index]?.institution?.message}
                          </p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Year of Completion
                        </label>
                        <input type="text" className={`mt-1 block w-full rounded-md border ${errors.education?.[index]?.year ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="e.g. 2018" {...register(`education.${index}.year`)} />
                        {errors.education?.[index]?.year && <p className="mt-1 text-sm text-red-600">
                            {errors.education[index]?.year?.message}
                          </p>}
                      </div>
                    </div>
                    {educationFields.length > 1 && <div className="mt-2 flex justify-end">
                        <button type="button" onClick={() => removeEducation(index)} className="inline-flex items-center text-sm text-red-600 hover:text-red-800">
                          <TrashIcon size={16} className="mr-1" />
                          Remove
                        </button>
                      </div>}
                  </div>)}
              </div>
            </div>
            {/* Experience */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Work Experience
                </h2>
                <button type="button" onClick={() => appendExperience({
                title: '',
                company: '',
                duration: '',
                description: ''
              })} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <PlusIcon size={16} className="mr-1" />
                  Add Experience
                </button>
              </div>
              <div className="space-y-4">
                {experienceFields.map((field, index) => <div key={field.id} className="border rounded-md p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Job Title
                        </label>
                        <input type="text" className={`mt-1 block w-full rounded-md border ${errors.experience?.[index]?.title ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="e.g. Project Manager" {...register(`experience.${index}.title`)} />
                        {errors.experience?.[index]?.title && <p className="mt-1 text-sm text-red-600">
                            {errors.experience[index]?.title?.message}
                          </p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Company/Organization
                        </label>
                        <input type="text" className={`mt-1 block w-full rounded-md border ${errors.experience?.[index]?.company ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="e.g. ABC Corporation" {...register(`experience.${index}.company`)} />
                        {errors.experience?.[index]?.company && <p className="mt-1 text-sm text-red-600">
                            {errors.experience[index]?.company?.message}
                          </p>}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Duration
                      </label>
                      <input type="text" className={`mt-1 block w-full rounded-md border ${errors.experience?.[index]?.duration ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="e.g. 2018-2022" {...register(`experience.${index}.duration`)} />
                      {errors.experience?.[index]?.duration && <p className="mt-1 text-sm text-red-600">
                          {errors.experience[index]?.duration?.message}
                        </p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea rows={3} className={`mt-1 block w-full rounded-md border ${errors.experience?.[index]?.description ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="Describe your responsibilities and achievements" {...register(`experience.${index}.description`)} />
                      {errors.experience?.[index]?.description && <p className="mt-1 text-sm text-red-600">
                          {errors.experience[index]?.description?.message}
                        </p>}
                    </div>
                    {experienceFields.length > 1 && <div className="mt-2 flex justify-end">
                        <button type="button" onClick={() => removeExperience(index)} className="inline-flex items-center text-sm text-red-600 hover:text-red-800">
                          <TrashIcon size={16} className="mr-1" />
                          Remove
                        </button>
                      </div>}
                  </div>)}
              </div>
            </div>
            {/* Skills */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Skills*
              </h2>
              <div className="mb-4">
                <div className="flex">
                  <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill" className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
                  <button type="button" onClick={handleAddSkill} className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700">
                    Add
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => skill && <div key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                        {skill}
                        <button type="button" onClick={() => removeSkill(index)} className="ml-1 text-blue-700 hover:text-blue-900">
                          &times;
                        </button>
                      </div>)}
              </div>
              {errors.skills && <p className="mt-1 text-sm text-red-600">
                  {errors.skills.message}
                </p>}
            </div>
            {/* Certifications */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Certifications (if any)
              </h2>
              <div className="mb-4">
                <div className="flex">
                  <input type="text" value={newCertification} onChange={e => setNewCertification(e.target.value)} placeholder="Add a certification" className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
                  <button type="button" onClick={handleAddCertification} className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700">
                    Add
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, index) => cert && <div key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                        {cert}
                        <button type="button" onClick={() => removeCertification(index)} className="ml-1 text-purple-700 hover:text-purple-900">
                          &times;
                        </button>
                      </div>)}
              </div>
            </div>
            {/* Cover Letter */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Cover Letter*
              </h2>
              <textarea rows={6} className={`mt-1 block w-full rounded-md border ${errors.coverLetter ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="Explain why you are interested in this position and why you are the best candidate..." {...register('coverLetter')} />
              {errors.coverLetter && <p className="mt-1 text-sm text-red-600">
                  {errors.coverLetter.message}
                </p>}
            </div>
            {/* Submit */}
            <div className="flex justify-end">
              <button type="button" onClick={() => navigate(`/user/jobs/${id}`)} className="mr-4 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 flex items-center">
                {isSubmitting ? <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </> : <>
                    <CheckCircleIcon size={18} className="mr-2" />
                    Submit Application
                  </>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>;
};