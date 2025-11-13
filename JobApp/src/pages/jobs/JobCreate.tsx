import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { PlusIcon, TrashIcon, ArrowLeftIcon } from 'lucide-react';
import { createJob } from '../../store/slices/jobsSlice';
const jobSchema = z.object({
  title: z.string().min(3, 'Job title is required and must be at least 3 characters'),
  department: z.string().min(2, 'Department is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  qualifications: z.array(z.string().min(1, 'Qualification cannot be empty')).min(1, 'At least one qualification is required'),
  responsibilities: z.array(z.string().min(1, 'Responsibility cannot be empty')).min(1, 'At least one responsibility is required'),
  deadline: z.string().min(1, 'Application deadline is required'),
  status: z.enum(['draft', 'published'])
});
type JobFormData = z.infer<typeof jobSchema>;
export const JobCreate: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      department: '',
      description: '',
      qualifications: [''],
      responsibilities: [''],
      deadline: '',
      status: 'draft'
    }
  });
  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification
  } = useFieldArray({
    control,
    name: 'qualifications'
  });
  const {
    fields: responsibilityFields,
    append: appendResponsibility,
    remove: removeResponsibility
  } = useFieldArray({
    control,
    name: 'responsibilities'
  });
  
  /*const onSubmit = (data: JobFormData) => {
    dispatch(createJob(data));
    toast.success('Job posting created successfully!');
    navigate('/jobs');
  };*/
  const onSubmit = async (data: JobFormData) => {
  try {
    await dispatch(createJob(data) as any).unwrap();
    toast.success('Job posting created successfully!');
    navigate('/jobs');
  } catch (err) {
    toast.error('Failed to create job posting.');
  }
};

  return <div className="space-y-6">
      <div className="flex items-center">
        <button onClick={() => navigate('/jobs')} className="mr-4 p-1 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Job Posting
          </h1>
          <p className="text-gray-500">
            Create a new job posting for candidates to apply
          </p>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title*
                </label>
                <input type="text" id="title" className={`mt-1 block w-full rounded-md border ${errors.title ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="e.g. District Health Officer" {...register('title')} />
                {errors.title && <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>}
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department*
                </label>
                <input type="text" id="department" className={`mt-1 block w-full rounded-md border ${errors.department ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="e.g. Health Department" {...register('department')} />
                {errors.department && <p className="mt-1 text-sm text-red-600">
                    {errors.department.message}
                  </p>}
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Job Description*
              </label>
              <textarea id="description" rows={4} className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="Provide a detailed description of the job role and requirements" {...register('description')}></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>}
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Qualifications*
                </label>
                <button type="button" onClick={() => appendQualification('')} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <PlusIcon size={16} className="mr-1" />
                  Add Qualification
                </button>
              </div>
              <div className="mt-2 space-y-3">
                {qualificationFields.map((field, index) => <div key={field.id} className="flex items-center">
                    <input type="text" className={`block w-full rounded-md border ${errors.qualifications?.[index] ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="e.g. Bachelor's degree in relevant field" {...register(`qualifications.${index}`)} />
                    {qualificationFields.length > 1 && <button type="button" onClick={() => removeQualification(index)} className="ml-2 p-1 text-gray-500 hover:text-red-600">
                        <TrashIcon size={18} />
                      </button>}
                  </div>)}
                {errors.qualifications && typeof errors.qualifications === 'object' && 'message' in errors.qualifications && <p className="mt-1 text-sm text-red-600">
                      {errors.qualifications.message as string}
                    </p>}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Responsibilities*
                </label>
                <button type="button" onClick={() => appendResponsibility('')} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <PlusIcon size={16} className="mr-1" />
                  Add Responsibility
                </button>
              </div>
              <div className="mt-2 space-y-3">
                {responsibilityFields.map((field, index) => <div key={field.id} className="flex items-center">
                    <input type="text" className={`block w-full rounded-md border ${errors.responsibilities?.[index] ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} placeholder="e.g. Develop and implement health programs" {...register(`responsibilities.${index}`)} />
                    {responsibilityFields.length > 1 && <button type="button" onClick={() => removeResponsibility(index)} className="ml-2 p-1 text-gray-500 hover:text-red-600">
                        <TrashIcon size={18} />
                      </button>}
                  </div>)}
                {errors.responsibilities && typeof errors.responsibilities === 'object' && 'message' in errors.responsibilities && <p className="mt-1 text-sm text-red-600">
                      {errors.responsibilities.message as string}
                    </p>}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                  Application Deadline*
                </label>
                <input type="date" id="deadline" className={`mt-1 block w-full rounded-md border ${errors.deadline ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`} {...register('deadline')} />
                {errors.deadline && <p className="mt-1 text-sm text-red-600">
                    {errors.deadline.message}
                  </p>}
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status*
                </label>
                <select id="status" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" {...register('status')}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                {errors.status && <p className="mt-1 text-sm text-red-600">
                    {errors.status.message}
                  </p>}
              </div>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
            <button type="button" onClick={() => navigate('/jobs')} className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
              {isSubmitting ? 'Saving...' : 'Save Job Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};