import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Video, Phone } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    const res = await fetch("http://localhost:5000/api/interviews");
    const data = await res.json();
    setInterviews(data);
  };

  const filteredInterviews = interviews.filter(
    i => filter === 'all' || i.status === filter
  );

  const getTypeIcon = (type) => {
    if (type === 'Video Call') return <Video className="w-5 h-5" />;
    if (type === 'Phone') return <Phone className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
            <p className="text-gray-600 mt-2">
              Schedule and manage candidate interviews
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex space-x-4">
          {['upcoming', 'completed', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Interviews List */}
        <div className="space-y-4">
          {filteredInterviews.map(interview => (
            <div
              key={interview.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">

                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {interview.candidate_name}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {interview.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {interview.position}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{interview.interview_date}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{interview.interview_time}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      {getTypeIcon(interview.interview_type)}
                      <span>{interview.interview_type}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{interview.interviewer}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <a
                    href={interview.location}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm text-center"
                  >
                    Join Interview
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Interviews;
