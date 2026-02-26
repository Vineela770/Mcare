import { useState, useEffect } from 'react';
import { 
  Upload, Save, FileText, Briefcase, Plus, Trash2, 
  UserCircle, MapPin, CheckCircle, GraduationCap, 
  Eye, Download, Edit3, Loader2 
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/useAuth';

const Resume = () => {
  const { token } = useAuth();
  
  // Data States
  const [resumeFile, setResumeFile] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [summary, setSummary] = useState(''); 
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [isEditingSummary, setIsEditingSummary] = useState(false); // ✅ Added state for edit button
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Form States
  const [isCurrentJob, setIsCurrentJob] = useState(false);
  const [experienceForm, setExperienceForm] = useState({ 
    title: '', company: '', location: '', startDate: '', endDate: '', description: '' 
  });
  
  const [educationForm, setEducationForm] = useState({
    degree: '', school: '', location: '', endDate: ''
  });

  // 📊 Calculate Score Automatically
  useEffect(() => {
    let score = 0;
    // 1. Resume (30%)
    if (resumeFile || selectedFile) score += 30;
    
    // 2. Summary (20%) - ✅ FIX: Synchronized with backend >= 3 chars threshold
    if (summary && summary.trim().length >= 3) score += 20;
    
    // 3. Experience (25%)
    if (experiences.length > 0) score += 25;
    
    // 4. Education (25%)
    if (education.length > 0) score += 25;
    
    setProfileCompletion(score);
  }, [resumeFile, selectedFile, summary, experiences, education]);

  // 📂 Fetch profile data from backend
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_BASE}/api/candidate/dashboard-stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.profileData) {
          const p = data.profileData;
          setSummary(p.professional_summary || '');
          setExperiences(typeof p.experience === 'string' ? JSON.parse(p.experience) : p.experience || []);
          setEducation(typeof p.education === 'string' ? JSON.parse(p.education) : p.education || []);
          
          if (p.resume_url) {
            setResumeFile({ name: p.resume_url.split('/').pop(), url: p.resume_url });
          }
        }
      } catch (err) {
        console.error("❌ Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchResumeData();
  }, [token]);

  // 🛠️ Sync all changes to Database
  const syncWithBackend = async (file = null) => {
    try {
      const formData = new FormData();
      if (file) formData.append('resume', file);
      formData.append('summary', summary);
      formData.append('experience', JSON.stringify(experiences));
      formData.append('education', JSON.stringify(education)); 

      // ✅ UPDATED URL: Changed from /resume to /profile to match clean routes
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE}/api/candidate/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      const data = await response.json();
      if (data.success) setIsEditingSummary(false); // ✅ Auto-lock summary on save
      return data.success;
    } catch (error) {
      console.error("❌ Sync Error:", error);
      return false;
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) return;
    const success = await syncWithBackend(selectedFile);
    if (success) {
      setResumeFile({ name: selectedFile.name });
      setShowUploadModal(false);
      setSelectedFile(null); 
      setSuccessMessage('Resume updated successfully!');
      setShowSuccessModal(true);
    }
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    const finalExperience = { 
      ...experienceForm, 
      id: Date.now(), 
      endDate: isCurrentJob ? 'Present' : experienceForm.endDate 
    };
    setExperiences([...experiences, finalExperience]);
    setExperienceForm({ title: '', company: '', location: '', startDate: '', endDate: '', description: '' });
    setIsCurrentJob(false);
    setShowExperienceModal(false);
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    const finalEducation = { ...educationForm, id: Date.now() };
    setEducation([...education, finalEducation]);
    setEducationForm({ degree: '', school: '', location: '', endDate: '' });
    setShowEducationModal(false);
  };

  const showSuccess = (msg) => { 
    setSuccessMessage(msg); 
    setShowSuccessModal(true); 
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 italic font-bold text-cyan-600">
      Syncing with MCARE...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar skillPercentage={profileCompletion} />
      
      <div className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Resume</h1>
        </div>

        {/* 📊 Profile Completion Bar - FULL WIDTH */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white text-2xl font-bold">Profile Completion</h3>
              <p className="text-cyan-50 opacity-90">Complete all sections to reach 100%</p>
            </div>
            <div className="text-6xl font-black text-white">{profileCompletion}%</div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-white/10">
            <div className="bg-white h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ width: `${profileCompletion}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            
            {/* 1. Resume Document */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resume Document</h2>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
                    <FileText className="text-red-500 w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{resumeFile ? resumeFile.name : "No Resume Uploaded"}</h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">PDF DOCUMENT</p>
                  </div>
                </div>
                <button onClick={() => setShowUploadModal(true)} className="flex items-center space-x-2 text-cyan-600 font-bold text-sm bg-white px-5 py-2.5 rounded-xl border border-cyan-100 hover:bg-cyan-50 transition-all shadow-sm">
                  <Upload size={16} />
                  <span>Replace Resume</span>
                </button>
              </div>
            </div>

            {/* 2. Professional Summary Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Professional Summary</h2>
                {/* ✅ Edit button logic */}
                <button 
                  onClick={() => setIsEditingSummary(!isEditingSummary)}
                  className={`p-2 rounded-lg transition-colors ${isEditingSummary ? 'bg-cyan-600 text-white shadow-md' : 'text-cyan-600 hover:bg-cyan-50'}`}
                >
                  <Edit3 size={18} />
                </button>
              </div>
              <textarea 
                value={summary} 
                onChange={(e) => setSummary(e.target.value)} 
                readOnly={!isEditingSummary}
                rows="4" 
                placeholder="Click the pencil icon to edit your professional summary..."
                className={`w-full p-4 border rounded-xl outline-none transition-all font-medium ${
                  isEditingSummary 
                  ? 'bg-white border-cyan-500 ring-2 ring-cyan-100 text-gray-900' 
                  : 'bg-gray-50 border-gray-100 text-gray-600 cursor-not-allowed'
                }`}
              />
              {isEditingSummary && <p className="text-[10px] text-cyan-600 mt-2 font-bold animate-pulse">● Editing Mode Active</p>}
            </div>

            {/* 3. Work Experience Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
                <button onClick={() => setShowExperienceModal(true)} className="text-cyan-600 font-bold flex items-center text-sm hover:underline">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Experience
                </button>
              </div>
              <div className="space-y-8">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-8 border-l-2 border-cyan-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{exp.title}</h3>
                        <p className="text-cyan-600 font-bold text-sm mt-0.5">{exp.company}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-2 tracking-wide">
                          {exp.startDate} - {exp.endDate} • {exp.location}
                        </p>
                      </div>
                      <button onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                    {exp.description && <p className="text-sm text-gray-500 mt-4 leading-relaxed font-medium">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Education Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Education</h2>
                <button onClick={() => setShowEducationModal(true)} className="text-cyan-600 font-bold flex items-center text-sm hover:underline">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Education
                </button>
              </div>
              <div className="space-y-8">
                {education.map((edu) => (
                  <div key={edu.id} className="relative pl-8 border-l-2 border-cyan-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{edu.degree}</h3>
                        <p className="text-cyan-600 font-bold text-sm mt-0.5">{edu.school}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-2 tracking-wide">
                          {edu.endDate} • {edu.location}
                        </p>
                      </div>
                      <button onClick={() => setEducation(education.filter(e => e.id !== edu.id))} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <button onClick={() => setShowExperienceModal(true)} className="w-full flex items-center p-4 bg-cyan-50/50 rounded-xl hover:bg-cyan-50 transition-all group border border-cyan-50">
                  <Briefcase className="mr-4 text-cyan-600" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">Experience</p>
                    <p className="text-[11px] text-gray-500">Add or edit</p>
                  </div>
                </button>
                <button onClick={() => setShowEducationModal(true)} className="w-full flex items-center p-4 bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-all group border border-blue-50">
                  <GraduationCap className="mr-4 text-blue-600" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">Education</p>
                    <p className="text-[11px] text-gray-500">Add or edit</p>
                  </div>
                </button>
                {/* Trigger summary edit */}
                <button onClick={() => setIsEditingSummary(true)} className="w-full flex items-center p-4 bg-purple-50/50 rounded-xl hover:bg-purple-50 transition-all group border border-purple-50">
                  <UserCircle className="mr-4 text-purple-600" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">Edit Summary</p>
                    <p className="text-[11px] text-gray-500">Update bio</p>
                  </div>
                </button>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button onClick={async () => { const s = await syncWithBackend(); if(s) { setSuccessMessage('Profile synced with database!'); setShowSuccessModal(true); } }} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-95">
                  <Save className="w-5 h-5 mr-2" /> Save All Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* EXPERIENCE MODAL */}
        {showExperienceModal && (
          <Modal isOpen={showExperienceModal} onClose={() => setShowExperienceModal(false)} title="Add Work Experience">
            <form onSubmit={handleAddExperience} className="space-y-4">
              <input required placeholder="Job Title *" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" value={experienceForm.title} onChange={e => setExperienceForm({...experienceForm, title: e.target.value})} />
              <input required placeholder="Hospital/Clinic *" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" value={experienceForm.company} onChange={e => setExperienceForm({...experienceForm, company: e.target.value})} />
              <input required placeholder="Location (City, State) *" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" value={experienceForm.location} onChange={e => setExperienceForm({...experienceForm, location: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-1">Start Date *</label>
                  <input required type="date" className="p-3 border w-full rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" value={experienceForm.startDate} onChange={e => setExperienceForm({...experienceForm, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 block mb-1">End Date</label>
                  <input disabled={isCurrentJob} type="date" className="p-3 border w-full rounded-xl disabled:bg-gray-100 outline-none focus:ring-2 focus:ring-cyan-500" value={experienceForm.endDate} onChange={e => setExperienceForm({...experienceForm, endDate: e.target.value})} />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-1">
                <input type="checkbox" id="curr" checked={isCurrentJob} onChange={(e) => setIsCurrentJob(e.target.checked)} className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500" />
                <label htmlFor="curr" className="text-sm text-gray-600 font-bold">I currently work here</label>
              </div>

              <textarea placeholder="Briefly describe your responsibilities..." rows="3" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" value={experienceForm.description} onChange={e => setExperienceForm({...experienceForm, description: e.target.value})} />
              <button type="submit" className="w-full py-4 bg-cyan-600 text-white font-bold rounded-xl shadow-md hover:bg-cyan-700 transition-all">Add Experience</button>
            </form>
          </Modal>
        )}

        {/* EDUCATION MODAL */}
        {showEducationModal && (
          <Modal isOpen={showEducationModal} onClose={() => setShowEducationModal(false)} title="Add Education">
            <form onSubmit={handleAddEducation} className="space-y-4">
              <input required placeholder="Degree (e.g. MBBS, MD) *" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" value={educationForm.degree} onChange={e => setEducationForm({...educationForm, degree: e.target.value})} />
              <input required placeholder="University/College *" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" value={educationForm.school} onChange={e => setEducationForm({...educationForm, school: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Location (City) *" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" value={educationForm.location} onChange={e => setEducationForm({...educationForm, location: e.target.value})} />
                <input required placeholder="Year of Completion *" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-cyan-500" value={educationForm.endDate} onChange={e => setEducationForm({...educationForm, endDate: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-cyan-600 text-white font-bold rounded-xl shadow-md hover:bg-cyan-700 transition-all">Add Education</button>
            </form>
          </Modal>
        )}

        {/* SUCCESS MODAL */}
        {showSuccessModal && (
          <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Success">
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <p className="font-bold text-gray-900 text-xl">{successMessage}</p>
              <button onClick={() => setShowSuccessModal(false)} className="w-full mt-8 py-4 bg-cyan-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">Done</button>
            </div>
          </Modal>
        )}

        {/* UPLOAD MODAL */}
        {showUploadModal && (
          <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Replace Resume">
            <div className="space-y-6 text-center">
              <div className="border-2 border-dashed border-gray-200 p-12 rounded-2xl bg-gray-50 hover:border-cyan-400 transition-colors cursor-pointer">
                <input type="file" accept=".pdf" id="up-file" className="hidden" onChange={e => setSelectedFile(e.target.files[0])} />
                <label htmlFor="up-file" className="cursor-pointer font-bold text-cyan-600 flex flex-col items-center">
                    <Upload className="w-12 h-12 mb-3" /> 
                    <span className="text-lg">Click to select PDF</span>
                </label>
                {selectedFile && <p className="mt-4 text-green-600 font-bold">{selectedFile.name}</p>}
              </div>
              <button onClick={handleUploadResume} disabled={!selectedFile} className="w-full py-4 bg-cyan-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all active:scale-95">Confirm Upload</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Resume;