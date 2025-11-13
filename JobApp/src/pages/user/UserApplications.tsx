import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BriefcaseIcon,
  EyeIcon,
  AlertCircleIcon,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchApplications } from "../../store/slices/applicationsSlice";

export const UserApplications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, isLoading } = useSelector(
    (state: RootState) => state.applications
  );
  const { user } = useSelector((state: RootState) => state.userAuth);

  const [userApplications, setUserApplications] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  useEffect(() => {
    if (applications && user?.email) {
      // ✅ Filter applications by logged-in user's email
      const filtered = applications.filter(
        (app) => app.email === user.email
      );
      setUserApplications(filtered);
    }
  }, [applications, user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center text-yellow-800 bg-yellow-100 px-2.5 py-1 rounded-full text-xs font-medium">
            <ClockIcon size={14} className="mr-1" />
            Under Review
          </span>
        );
      case "shortlisted":
        return (
          <span className="flex items-center text-green-800 bg-green-100 px-2.5 py-1 rounded-full text-xs font-medium">
            <CheckCircleIcon size={14} className="mr-1" />
            Shortlisted
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center text-red-800 bg-red-100 px-2.5 py-1 rounded-full text-xs font-medium">
            <XCircleIcon size={14} className="mr-1" />
            Not Selected
          </span>
        );
      case "hired":
        return (
          <span className="flex items-center text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full text-xs font-medium">
            <BriefcaseIcon size={14} className="mr-1" />
            Hired
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600">
          Track the status of your job applications
        </p>
      </div>

      {userApplications.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {application.jobTitle || "Untitled Job"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {application.department || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {application.appliedAt
                          ? new Date(application.appliedAt).toLocaleDateString()
                          : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {application.updatedAt
                          ? new Date(application.updatedAt).toLocaleDateString()
                          : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/user/applications/${application.id}`}
                        className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                      >
                        <EyeIcon size={16} className="mr-1" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircleIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No applications yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven’t applied for any jobs yet. Browse available positions and
            submit your application.
          </p>
          <Link
            to="/user/jobs"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <BriefcaseIcon size={18} className="mr-2" />
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
};
