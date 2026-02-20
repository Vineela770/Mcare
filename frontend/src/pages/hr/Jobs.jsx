import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Users,
  Eye,
  Edit2,
  Trash2,
  Clock,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);

  // ✅ Fetch Jobs from Backend
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: "DELETE",
      });
      fetchJobs();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredJobs =
    filter === "all"
      ? jobs
      : jobs.filter((job) => job.status === filter);

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800",
    };
    return styles[status] || styles.active;
  };

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Jobs
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all your job postings
            </p>
          </div>

          <Link
            to="/hr/post-job"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium"
          >
            + Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">
              Total Jobs
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {jobs.length}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">
              Active
            </div>
            <div className="text-3xl font-bold text-green-600">
              {jobs.filter((j) => j.status === "active").length}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">
              Closed
            </div>
            <div className="text-3xl font-bold text-red-600">
              {jobs.filter((j) => j.status === "closed").length}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">
              Total Applicants
            </div>
            <div className="text-3xl font-bold text-cyan-600">
              {jobs.reduce(
                (sum, job) => sum + (job.applicants || 0),
                0
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex space-x-4">
          {["all", "active", "closed", "draft"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === status
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() +
                  status.slice(1)}
              </button>
            )
          )}
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {job.applicants} Applicants
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Deadline: {job.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowJobDetails(true);
                    }}
                    className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => deleteJob(job.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white max-w-2xl w-full rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">
              Job Details
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <strong>Title:</strong> {selectedJob.title}
              </div>
              <div>
                <strong>Department:</strong>{" "}
                {selectedJob.department}
              </div>
              <div>
                <strong>Location:</strong>{" "}
                {selectedJob.location}
              </div>
              <div>
                <strong>Positions:</strong>{" "}
                {selectedJob.positions}
              </div>
              <div>
                <strong>Applicants:</strong>{" "}
                {selectedJob.applicants}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                {selectedJob.status}
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() =>
                  setShowJobDetails(false)
                }
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
