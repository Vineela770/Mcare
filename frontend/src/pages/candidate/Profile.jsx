import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Camera, Upload, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/useAuth';

const Profile = () => {
    // ✅ Destructured setUser to update global state for persistent Sidebar image
    const { user, token, setUser } = useAuth(); 
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null); 
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        location: '',
        dateOfBirth: '',
        gender: '',
        experience: '',
        specialization: '',
        certifications: '',
        languages: '',
        availability: '',
        expectedSalary: '',
        highestQualification: '',
        additionalQualification: '',
        noticePeriod: '',
        preferredCity: '',
        currentCity: '',
        interestedInTeaching: false,
        profilePhotoUrl: '' 
    });

    // 🛠️ 1. LOAD DATA FROM BACKEND WHEN PAGE OPENS
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/api/candidate/dashboard-stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (response.ok && data.success && data.profileData) {
                    const p = data.profileData;
                    setFormData({
                        fullName: data.userName || user?.name || '',
                        email: p.email || user?.email || '',
                        phone: p.phone_number || '',
                        location: p.location || '',
                        // Format date to YYYY-MM-DD for the date input
                        dateOfBirth: p.dob ? new Date(p.dob).toISOString().split('T')[0] : '',
                        gender: p.gender || '',
                        experience: p.years_of_experience || '',
                        specialization: p.specialization || '',
                        certifications: p.certifications || '',
                        languages: p.languages || '',
                        availability: p.availability || '',
                        expectedSalary: p.expected_salary || '',
                        highestQualification: p.highest_qualification || '',
                        additionalQualification: p.additional_qualification || '',
                        noticePeriod: p.notice_period || '',
                        preferredCity: p.preferred_city || '',
                        currentCity: p.current_city || '',
                        interestedInTeaching: p.teaching_interest || false,
                        profilePhotoUrl: p.profile_photo_url || '' 
                    });

                    // Sync AuthContext if photo exists in DB but not in state
                    if (p.profile_photo_url && setUser) {
                        setUser(prev => ({ ...prev, profile_photo_url: p.profile_photo_url }));
                    }
                }
            } catch (error) {
                console.error("❌ Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfileData();
    }, [token, setUser, user?.email, user?.name]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    // 🖼️ Photo Upload Logic
    const handlePhotoUpload = async () => {
        if (selectedFile) {
            const data = new FormData();
            data.append('photo', selectedFile); 

            try {
                const response = await fetch('http://localhost:3000/api/candidate/profile', {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: data
                });

                const result = await response.json();
                
                if (result.success && result.photoPath) {
                    setSuccessMessage('Profile picture updated successfully!');
                    setShowSuccessModal(true);
                    setShowPhotoModal(false); 
                    setSelectedFile(null);
                    setPhotoPreview(null); // ✅ Clear temporary preview

                    // 🚀 Update global Auth state so Sidebar updates too
                    if (setUser) {
                        setUser(prev => ({
                            ...prev,
                            profile_photo_url: result.photoPath
                        }));
                    }

                    setFormData(prev => ({...prev, profilePhotoUrl: result.photoPath}));
                } else {
                    alert("Failed to upload: " + (result.message || "Unknown error"));
                }
            } catch (error) {
                console.error('❌ Upload error:', error);
            }
        }
    };

    // 🛠️ 2. SEND DATA TO BACKEND ON SAVE
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/candidate/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone_number: formData.phone,
                    location: formData.location,
                    highest_qualification: formData.highestQualification,
                    additional_qualification: formData.additionalQualification,
                    gender: formData.gender,
                    years_of_experience: formData.experience,
                    specialization: formData.specialization,
                    certifications: formData.certifications,
                    languages: formData.languages,
                    availability: formData.availability,
                    expected_salary: formData.expectedSalary,
                    notice_period: formData.noticePeriod,
                    preferred_city: formData.preferredCity,
                    current_city: formData.currentCity,
                    teaching_interest: formData.interestedInTeaching,
                    dob: formData.dateOfBirth
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSuccessMessage('Profile settings saved successfully!');
                setShowSuccessModal(true);
            } else {
                alert(result.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("❌ Error saving profile:", error);
            alert("Server error. Please try again later.");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 italic font-bold text-cyan-600">
            Syncing Manoj's Profile...
        </div>
    );

    return (
        <div className="text-left">
            <Sidebar />
            <div className="ml-64 min-h-screen bg-gray-50 p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    {/* Profile Picture Section */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                                    {/* ✅ THE FINAL FIX: Using a key and a cache-busting timestamp */}
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : formData.profilePhotoUrl ? (
                                        <img 
                                            key={`${formData.profilePhotoUrl}-${new Date().getTime()}`}
                                            src={`http://localhost:3000${formData.profilePhotoUrl}?t=${new Date().getTime()}`} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error("Image failed to load at:", e.target.src);
                                                e.target.src = `https://ui-avatars.com/api/?name=${formData.fullName}&background=0D8ABC&color=fff`;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                                            {formData.fullName?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setShowPhotoModal(true)} className="absolute bottom-0 right-0 bg-white border-2 border-gray-200 rounded-full p-2 hover:bg-gray-50 shadow-sm">
                                    <Camera className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{formData.fullName || 'User'}</h3>
                                <p className="text-gray-600">{formData.email || 'user@example.com'}</p>
                                <button
                                    onClick={() => setShowPhotoModal(true)}
                                    className="mt-2 text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                                >
                                    Change Profile Picture
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4 inline mr-1" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-1" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-1" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Highest Qualification
                                </label>
                                <select
                                    name="highestQualification"
                                    value={formData.highestQualification}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="">Select Qualification</option>
                                    <option value="MBBS">MBBS</option>
                                    <option value="MD">MD</option>
                                    <option value="MS">MS</option>
                                    <option value="BDS">BDS</option>
                                    <option value="MDS">MDS</option>
                                    <option value="BHMS">BHMS</option>
                                    <option value="BAMS">BAMS</option>
                                    <option value="DM">DM</option>
                                    <option value="MCh">MCh</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Qualification
                                </label>
                                <input
                                    type="text"
                                    name="additionalQualification"
                                    value={formData.additionalQualification}
                                    onChange={handleChange}
                                    placeholder="Type Your Additional Qualification"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>

                            {/* Professional Information */}
                            <div className="md:col-span-2 mt-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Professional Information</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                                <input
                                    type="text"
                                    name="certifications"
                                    value={formData.certifications}
                                    onChange={handleChange}
                                    placeholder="e.g., RN, BSN, ACLS"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                                <input
                                    type="text"
                                    name="languages"
                                    value={formData.languages}
                                    onChange={handleChange}
                                    placeholder="e.g., English, Spanish"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="">Select Availability</option>
                                    <option value="immediate">Immediate</option>
                                    <option value="2-weeks">2 Weeks Notice</option>
                                    <option value="1-month">1 Month Notice</option>
                                    <option value="flexible">Flexible</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary</label>
                                <input
                                    type="text"
                                    name="expectedSalary"
                                    value={formData.expectedSalary}
                                    onChange={handleChange}
                                    placeholder="e.g., $75,000 - $95,000"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3 my-5">
                            <input
                                type="checkbox"
                                name="interestedInTeaching"
                                checked={formData.interestedInTeaching}
                                onChange={handleChange}
                                className="h-4 w-4 text-cyan-600 rounded"
                            />
                            <label className="text-sm font-medium text-gray-700">
                                Interested in Teaching Positions in Medical Colleges
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notice Period
                            </label>
                            <select
                                name="noticePeriod"
                                value={formData.noticePeriod}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="">Select Notice Period</option>
                                <option value="Immediate">Immediate</option>
                                <option value="15 Days">15 Days</option>
                                <option value="30 Days">30 Days</option>
                                <option value="60 Days">60 Days</option>
                            </select>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred City
                            </label>
                            <select
                                name="preferredCity"
                                value={formData.preferredCity}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="">Select Your Preferred City</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Mumbai">Mumbai</option>
                            </select>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current City
                            </label>
                            <select
                                name="currentCity"
                                value={formData.currentCity}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="">Select Your Current City</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Mumbai">Mumbai</option>
                            </select>
                        </div>

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end space-x-4">
                            <button
                                type="button"
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 font-bold transition-all shadow-md active:scale-95"
                            >
                                <Save className="w-5 h-5" />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Photo Upload Modal */}
                {showPhotoModal && (
                    <Modal
                        isOpen={showPhotoModal}
                        onClose={() => setShowPhotoModal(false)}
                        title="Change Profile Picture"
                    >
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2 font-bold">Upload a new profile picture</p>
                                <p className="text-sm text-gray-500 mb-4">JPG, PNG or GIF, max 5MB</p>
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="photo-upload"
                                />
                                <label
                                    htmlFor="photo-upload"
                                    className="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 cursor-pointer font-bold transition-colors"
                                >
                                    Choose File
                                </label>
                                {selectedFile && (
                                    <div className="mt-4 p-2 bg-green-50 rounded-lg flex items-center justify-center space-x-2">
                                        <CheckCircle size={16} className="text-green-600" />
                                        <p className="text-sm text-green-700 font-bold truncate max-w-[200px]">
                                            {selectedFile.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setShowPhotoModal(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePhotoUpload}
                                    disabled={!selectedFile}
                                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 font-bold shadow-md active:scale-95"
                                >
                                    Upload Photo
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <Modal
                        isOpen={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        title="Success"
                    >
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <p className="text-xl font-bold text-gray-900 mb-2">{successMessage}</p>
                            <p className="text-gray-500 text-sm mb-8">Your profile settings have been synchronized.</p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
                            >
                                Great
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default Profile;