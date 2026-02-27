import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, DollarSign, Clock, Calendar, FileText, CheckCircle, XCircle, Mail, Phone, Download, ExternalLink, Briefcase, Users } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchApplicationDetail = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      
      const mockApplications = {
  1: {
    id: 1,
    title: 'Senior Registered Nurse',
    company: 'Manhattan Hospital',
    location: 'New York, NY',
    appliedDate: '2024-01-05',
    status: 'Under Review',
    salary: '$75,000 - $95,000',
    jobType: 'Full-time',
    experience: '5+ years',
    deadline: '2024-02-15',
    description:
      'We are seeking an experienced Senior Registered Nurse to join our dynamic healthcare team...',
    responsibilities: [
      'Provide direct patient care',
      'Mentor junior nurses',
      'Maintain patient records',
    ],
    requirements: [
      'Valid RN License',
      'BSN required',
      '5+ years experience',
    ],
    benefits: [
      'Health insurance',
      '401(k)',
      'Paid leave',
    ],
    coverLetter: 'Dear Hiring Manager,\n\nI am excited to apply...',
    expectedSalary: '$85,000',
    availability: 'Immediate',
    resumeUrl: '/resumes/john-doe-resume.pdf',
    timeline: [
      { date: '2024-01-05', status: 'Application Submitted', icon: 'sent', completed: true },
      { date: '2024-01-06', status: 'Under Review', icon: 'review', completed: true },
      { date: '', status: 'Interview Scheduled', icon: 'interview', completed: false },
      { date: '', status: 'Final Decision', icon: 'decision', completed: false },
    ],
    hrContact: {
      name: 'Sarah Johnson',
      title: 'HR Manager',
      email: 'sarah.johnson@manhattanhospital.com',
      phone: '+1 (212) 555-0123',
    },
  },

  2: {
    id: 2,
    title: 'Physical Therapist',
    company: 'Wellness Rehab',
    location: 'Los Angeles, CA',
    appliedDate: '2024-01-03',
    status: 'Shortlisted',
    salary: '$65,000 - $85,000',
    jobType: 'Full-time',
    experience: '3+ years',
    deadline: '2024-02-10',
    description:
      'We are looking for a licensed Physical Therapist to help patients recover mobility.',
    responsibilities: [
      'Evaluate patient conditions',
      'Design therapy programs',
      'Monitor progress',
    ],
    requirements: [
      'PT License',
      'DPT Degree',
      'Rehab experience',
    ],
    benefits: [
      'Flexible hours',
      'Insurance',
      'Paid holidays',
    ],
    coverLetter: 'Dear Team,\n\nI am applying for the Physical Therapist role...',
    expectedSalary: '$75,000',
    availability: '2 Weeks',
    resumeUrl: '/resumes/john-doe-resume.pdf',
    timeline: [
      { date: '2024-01-03', status: 'Application Submitted', icon: 'sent', completed: true },
      { date: '2024-01-05', status: 'Shortlisted', icon: 'review', completed: true },
      { date: '', status: 'Interview Scheduled', icon: 'interview', completed: false },
    ],
    hrContact: {
      name: 'Emily Carter',
      title: 'Recruiter',
      email: 'emily@wellnessrehab.com',
      phone: '+1 (310) 555-8899',
    },
  },

  3: {
    id: 3,
    title: 'Lab Technician',
    company: 'HealthCare Labs',
    location: 'Chicago, IL',
    appliedDate: '2023-12-28',
    status: 'Interview',
    salary: '$45,000 - $55,000',
    jobType: 'Full-time',
    experience: '2+ years',
    deadline: '2024-01-30',
    description:
      'Seeking a Lab Technician to perform diagnostic tests and maintain lab equipment.',
    responsibilities: [
      'Conduct lab tests',
      'Maintain equipment',
      'Record results',
    ],
    requirements: [
      'Lab certification',
      'Attention to detail',
    ],
    benefits: [
      'Bonuses',
      'Medical insurance',
    ],
    coverLetter: 'Dear Hiring Team,\n\nI am excited to interview...',
    expectedSalary: '$50,000',
    availability: 'Immediate',
    resumeUrl: '/resumes/john-doe-resume.pdf',
    timeline: [
      { date: '2023-12-28', status: 'Application Submitted', icon: 'sent', completed: true },
      { date: '2024-01-02', status: 'Interview Scheduled', icon: 'interview', completed: true },
    ],
    hrContact: {
      name: 'Robert Mills',
      title: 'Lab Manager',
      email: 'robert@healthlabs.com',
      phone: '+1 (312) 555-6677',
    },
  },

  4: {
    id: 4,
    title: 'Medical Assistant',
    company: 'City Medical',
    location: 'Houston, TX',
    appliedDate: '2023-12-20',
    status: 'Rejected',
    salary: '$40,000 - $50,000',
    jobType: 'Full-time',
    experience: '1+ years',
    deadline: '2024-01-10',
    description:
      'Medical Assistant role supporting physicians and patient care.',
    responsibilities: [
      'Patient intake',
      'Maintain records',
      'Assist doctors',
    ],
    requirements: [
      'Medical Assistant certification',
    ],
    benefits: [
      'Paid leave',
    ],
    coverLetter: 'Thank you for considering my application...',
    expectedSalary: '$45,000',
    availability: 'Immediate',
    resumeUrl: '/resumes/john-doe-resume.pdf',
    timeline: [
      { date: '2023-12-20', status: 'Application Submitted', icon: 'sent', completed: true },
      { date: '2023-12-28', status: 'Rejected', icon: 'decision', completed: true },
    ],
    hrContact: {
      name: 'Linda Brown',
      title: 'HR Lead',
      email: 'linda@citymedical.com',
      phone: '+1 (713) 555-9988',
    },
  },
};

setApplication(mockApplications[id] || null);
setLoading(false);

    };

    fetchApplicationDetail();
  }, [id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Under Review': return <Clock className="w-6 h-6" />;
      case 'Shortlisted': return <FileText className="w-6 h-6" />;
      case 'Interview': return <CheckCircle className="w-6 h-6" />;
      case 'Rejected': return <XCircle className="w-6 h-6" />;
      default: return <Clock className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Shortlisted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Interview': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTimelineIcon = (icon) => {
    switch (icon) {
      case 'sent': return <CheckCircle className="w-5 h-5" />;
      case 'review': return <FileText className="w-5 h-5" />;
      case 'interview': return <Users className="w-5 h-5" />;
      case 'decision': return <CheckCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div>
        <Sidebar />
        <div className="ml-64 min-h-screen bg-gray-50 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading application details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div>
        <Sidebar />
        <div className="ml-64 min-h-screen bg-gray-50 p-6">
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

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/candidate/applications')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Applications</span>
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{application.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">{application.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>{application.location}</span>
                </div>
              </div>
            </div>
            <div className={`flex items-center space-x-3 px-6 py-3 rounded-xl border-2 ${getStatusColor(application.status)}`}>
              {getStatusIcon(application.status)}
              <div>
                <div className="text-xs font-medium opacity-75">Application Status</div>
                <div className="font-bold text-lg">{application.status}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Application Progress</h2>
              <div className="space-y-6">
                {application.timeline.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {getTimelineIcon(item.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {item.status}
                        </h3>
                        {item.date && (
                          <span className="text-sm text-gray-500">{item.date}</span>
                        )}
                      </div>
                      <p className={`text-sm ${item.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{application.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
              <ul className="space-y-3">
                {application.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-3">
                {application.requirements.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
              <ul className="space-y-3">
                {application.benefits.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Your Application */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Application</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cover Letter</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{application.coverLetter}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Expected Salary</h3>
                    <p className="text-gray-700">{application.expectedSalary}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
                    <p className="text-gray-700">{application.availability}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Resume</h3>
                  <a
                    href={application.resumeUrl}
                    className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Salary Range</div>
                    <div className="font-semibold text-gray-900">{application.salary}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Job Type</div>
                    <div className="font-semibold text-gray-900">{application.jobType}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Experience Required</div>
                    <div className="font-semibold text-gray-900">{application.experience}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Applied On</div>
                    <div className="font-semibold text-gray-900">{application.appliedDate}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Application Deadline</div>
                    <div className="font-semibold text-gray-900">{application.deadline}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* HR Contact */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
              <h3 className="font-bold text-gray-900 mb-4">HR Contact</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-semibold text-gray-900">{application.hrContact.name}</div>
                  <div className="text-sm text-gray-600">{application.hrContact.title}</div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-cyan-600" />
                  <a href={`mailto:${application.hrContact.email}`} className="text-cyan-600 hover:text-cyan-700">
                    {application.hrContact.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-cyan-600" />
                  <a href={`tel:${application.hrContact.phone}`} className="text-cyan-600 hover:text-cyan-700">
                    {application.hrContact.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={application.resumeUrl}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
                <button
                  onClick={() => window.open(`mailto:${application.hrContact.email}`, '_blank')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact HR</span>
                </button>
                <Link
                  to={`/candidate/browse-jobs`}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Similar Jobs</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
