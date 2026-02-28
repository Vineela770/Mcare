import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Building2, MapPin, Clock, Calendar,
  FileText, CheckCircle, XCircle, Briefcase, ExternalLink,
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import { applicationService } from '../../api/applicationService';

const getStatusIcon = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'shortlisted': return <CheckCircle className="w-5 h-5" />;
    case 'interview':   return <CheckCircle className="w-5 h-5" />;
    case 'rejected':    return <XCircle className="w-5 h-5" />;
    default:            return <Clock className="w-5 h-5" />;
  }
};

const getStatusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'under review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'shortlisted':  return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'interview':    return 'bg-green-100 text-green-700 border-green-200';
    case 'rejected':     return 'bg-red-100 text-red-700 border-red-200';
    default:             return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await applicationService.getApplicationDetails(id);
        setApp(data);
      } catch (err) {
        console.error('Failed to fetch application details:', err);
        setApp(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Sidebar />
        <div className="md:ml-64 min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading application details…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div>
        <Sidebar />
        <div className="md:ml-64 min-h-screen bg-gray-50 p-6">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
            <p className="text-gray-600 mb-6">The application you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/candidate/applications')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700"
            >
              Back to Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  const STEPS = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Decision'];
  const STEP_KEYS = ['applied', 'under review', 'shortlisted', 'interview', 'decision'];
  const currentStatus = (app.status || 'under review').toLowerCase();
  const currentIdx = STEP_KEYS.findIndex((s) => currentStatus.includes(s.split(' ')[0]));

  return (
    <div>
      <Sidebar />
      <div className="md:ml-64 min-h-screen bg-gray-50 p-4 pt-20 md:pt-6 md:p-6">

        {/* Back */}
        <button
          onClick={() => navigate('/candidate/applications')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Applications</span>
        </button>

        {/* Header card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {app.job_title || 'Job Application'}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                {app.company_name && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    {app.company_name}
                  </span>
                )}
                {app.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {app.location}
                  </span>
                )}
                {app.job_type && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 flex-shrink-0" />
                    {app.job_type}
                  </span>
                )}
              </div>
            </div>
            <div className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 self-start ${getStatusColor(app.status)}`}>
              {getStatusIcon(app.status)}
              <div>
                <div className="text-xs font-medium opacity-75">Status</div>
                <div className="font-bold">{app.status || 'Under Review'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Progress stepper */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Application Progress</h2>
              <div className="flex items-start gap-1">
                {STEPS.map((step, i) => {
                  const done = i <= (currentIdx === -1 ? 1 : currentIdx);
                  return (
                    <div key={step} className="flex-1 flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                        ${done ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {i + 1}
                      </div>
                      <span className={`text-xs text-center leading-tight ${done ? 'text-cyan-600 font-medium' : 'text-gray-400'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Job Description */}
            {app.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Job Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{app.description}</p>
              </div>
            )}

            {/* Requirements */}
            {app.requirements && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Requirements</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{app.requirements}</p>
              </div>
            )}

            {/* Benefits */}
            {app.benefits && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Benefits &amp; Perks</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{app.benefits}</p>
              </div>
            )}

            {/* Submission details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Your Submission</h2>
              <div className="space-y-4">
                {app.cover_letter_path && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm">Cover Letter</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                        {app.cover_letter_path}
                      </p>
                    </div>
                  </div>
                )}
                {app.availability && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm">Available to Join</h3>
                    <p className="text-gray-700 text-sm">{app.availability}</p>
                  </div>
                )}
                {!app.cover_letter_path && !app.availability && (
                  <p className="text-gray-500 text-sm">No additional submission details.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Application Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Applied On</div>
                    <div className="font-semibold text-gray-900 text-sm">{fmt(app.applied_at)}</div>
                  </div>
                </div>
                {app.job_type && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Job Type</div>
                      <div className="font-semibold text-gray-900 text-sm">{app.job_type}</div>
                    </div>
                  </div>
                )}
                {app.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="font-semibold text-gray-900 text-sm">{app.location}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/candidate/browse-jobs"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Browse More Jobs</span>
                </Link>
                <button
                  onClick={() => navigate('/candidate/applications')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>All My Applications</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
