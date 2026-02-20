import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Eye, TrendingUp, Clock, MapPin, Building2, Send } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Sidebar from '../../components/common/Sidebar';

const CandidateDashboard = () => {
  // ✅ Data synchronization remains intact for global consistency
  const { user, token, setUser } = useAuth(); 
  const [userName, setUserName] = useState(''); 
  const [stats, setStats] = useState({
    applied: 0,
    shortlisted: 0,
    interviews: 0,
    profileViews: 0,
    skillPercentage: 0, // ✅ Updated by backend logic
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/candidate/dashboard-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();

        if (response.ok && data.success) {
          setUserName(data.userName); 

          // ✅ Keep global Auth state synced so Sidebar stays updated
          if (setUser) {
            setUser(prev => ({ 
              ...prev, 
              full_name: data.userName,
              profile_photo_url: data.profileData?.profile_photo_url 
            }));
          }

          setStats({
            applied: data.stats.jobsApplied,
            shortlisted: data.stats.shortlisted,
            interviews: data.stats.interviews,
            profileViews: data.stats.profileViews,
            skillPercentage: data.stats.skillPercentage, 
          });

          const formattedApps = data.recentApplications.map(app => ({
            id: app.id,
            title: app.title,
            company: app.company_name,
            location: app.location || 'Remote/Office', 
            appliedDate: new Date(app.applied_at).toLocaleDateString(),
            status: app.status,
            logo: '🏥'
          }));

          setRecentApplications(formattedApps);
        }
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token, setUser]);

  const statCards = [
    { label: 'Jobs Applied', value: stats.applied, icon: Send, color: 'cyan', link: '/candidate/applications' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: FileText, color: 'blue', link: '/candidate/applications' },
    { label: 'Interviews', value: stats.interviews, icon: TrendingUp, color: 'green', link: '/candidate/applications' },
    { label: 'Profile Views', value: stats.profileViews, icon: Eye, color: 'purple', link: '/candidate/profile' },
  ];

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s?.includes('review')) return 'bg-yellow-100 text-yellow-700';
    if (s?.includes('shortlisted')) return 'bg-blue-100 text-blue-700';
    if (s?.includes('interview')) return 'bg-green-100 text-green-700';
    if (s?.includes('rejected')) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar className="fixed h-full" skillPercentage={stats.skillPercentage || 0} userName={userName || "Manoj"} />
        <div className="ml-64 w-full flex items-center justify-center">
          <div className="text-cyan-600 font-medium animate-pulse">Syncing with MCARE Database...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        className="fixed h-full" 
        skillPercentage={stats.skillPercentage} 
        userName={userName} 
      />
      
      <div className="flex-1 ml-64 p-8">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userName || user?.full_name || 'Manoj'}!
            </h1>
            <p className="text-gray-600 mt-2">Track your job applications and manage your healthcare career</p>
          </div>
          
          {/* ✅ FIXED: Removed the profile completion bar div from the top right */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-50 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
                <div className="text-xs font-medium text-green-500 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> +12%
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-8 mb-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Ready to Find Your Next Role?</h3>
              <p className="text-cyan-50 opacity-90">Browse thousands of healthcare jobs matched to your skills</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/candidate/browse-jobs"
                className="bg-white text-cyan-700 px-8 py-3 rounded-xl hover:bg-gray-50 font-bold transition-colors shadow-sm"
              >
                Browse Jobs
              </Link>
              <Link
                to="/candidate/resume"
                className="bg-cyan-500 bg-opacity-30 backdrop-blur-md text-white border border-white border-opacity-30 px-8 py-3 rounded-xl hover:bg-opacity-40 font-bold transition-all"
              >
                Update Resume
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              <Link to="/candidate/applications" className="text-cyan-600 hover:text-cyan-700 font-bold text-sm">
                View All →
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentApplications.length > 0 ? (
                recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-cyan-200 hover:bg-cyan-50 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-2xl">
                        {app.logo}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{app.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center"><Building2 className="w-4 h-4 mr-1 text-gray-400" />{app.company}</span>
                          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400" />{app.location}</span>
                          <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400" />{app.appliedDate}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">You haven't applied for any jobs yet.</p>
                  <Link to="/candidate/browse-jobs" className="text-cyan-600 font-bold text-sm mt-2 inline-block">Start applying now</Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {[
                { to: "/candidate/browse-jobs", label: "Browse Jobs", sub: "Find new opportunities", icon: Briefcase, color: "cyan" },
                { to: "/candidate/resume", label: "My Resume", sub: "Update your profile", icon: FileText, color: "blue" },
                { to: "/candidate/saved-jobs", label: "Saved Jobs", sub: "View bookmarked jobs", icon: FileText, color: "purple" }
              ].map((item, i) => (
                <Link key={i} to={item.to} className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                  <div className={`w-12 h-12 bg-${item.color}-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-500`} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;