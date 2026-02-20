import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Modal from "../../components/common/Modal";

const API_URL = "http://localhost:3000/api/hr";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  /* =========================
     FETCH APPLICATIONS
  ========================= */
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API_URL}/applications`);
      setApplications(res.data);
    } catch (error) {
      console.error("Fetch Applications Error:", error);
    }
  };

  /* =========================
     UPDATE STATUS
  ========================= */
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/applications/${id}`, {
        status: newStatus,
      });

      // Update locally (faster UI)
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };

  /* =========================
     FILTER APPLICATIONS
  ========================= */
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (filterStatus === "all") return true;
      return app.status?.toLowerCase() === filterStatus;
    });
  }, [applications, filterStatus]);

  /* =========================
     STATUS BADGE
  ========================= */
  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-50 text-yellow-600",
      Shortlisted: "bg-green-50 text-green-600",
      Interview: "bg-blue-50 text-blue-600",
      Rejected: "bg-red-50 text-red-600",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[status] || styles.Pending
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Applications
        </h1>

        {/* ================= FILTER BUTTONS ================= */}
        <div className="mb-6 flex space-x-3">
          {["all", "pending", "shortlisted", "interview", "rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filterStatus === status
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6">Candidate</th>
                <th className="text-left py-4 px-6">Job</th>
                <th className="text-left py-4 px-6">Experience</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="text-left py-4 px-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-semibold">
                        {app.candidate_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {app.location}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {app.job_title}
                    </td>

                    <td className="py-4 px-6">
                      {app.experience}
                    </td>

                    <td className="py-4 px-6">
                      {getStatusBadge(app.status)}
                    </td>

                    <td className="py-4 px-6 space-x-2">

                      {/* View */}
                      <button
                        onClick={() => {
                          setSelectedApplication(app);
                          setShowDetailsModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Shortlist & Reject */}
                      {app.status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(app.id, "Shortlisted")
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleStatusUpdate(app.id, "Rejected")
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= DETAILS MODAL ================= */}
        {showDetailsModal && selectedApplication && (
          <Modal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title="Application Details"
          >
            <div className="space-y-3">
              <p><b>Name:</b> {selectedApplication.candidate_name}</p>
              <p><b>Email:</b> {selectedApplication.email}</p>
              <p><b>Phone:</b> {selectedApplication.phone}</p>
              <p><b>Qualification:</b> {selectedApplication.qualification}</p>
              <p><b>Experience:</b> {selectedApplication.experience}</p>
              <p><b>Status:</b> {selectedApplication.status}</p>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
};

export default Applications;