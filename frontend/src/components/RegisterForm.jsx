import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Upload } from 'lucide-react';
import { authService } from '../api/authService';

export function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    email: '',
    confirmEmail: '',
    password: '',
    phone: '',
    location: '',
    qualification: '',
    designation: '',
    role: '',
    // Added for file upload
    resume: null, 

    // Employer Organization Info
    organizationName: '',
    organizationCategory: '',
    numberOfBeds: '',
    organizationCity: '',
    organizationAddress: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle file input specifically
    if (name === 'resume') {
      setFormData((prev) => ({
        ...prev,
        resume: files[0],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'role' && {
        qualification: '',
        designation: '',
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.email !== formData.confirmEmail) {
      setError('Email and Confirm Email must match');
      return;
    }

    setLoading(true);

    try {
      /**
       * 🚀 Construct FormData object
       * Required for multipart/form-data requests (file uploads)
       */
      const data = new FormData();
      
      // Append all text and file fields to the FormData object
      Object.keys(formData).forEach((key) => {
        // Skip confirmEmail as it's only for frontend validation
        if (key !== 'confirmEmail' && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      await authService.register(data);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <select
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select</option>
          <option value="Mr">Mr</option>
          <option value="Miss">Miss</option>
          <option value="Others">Others</option>
        </select>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full pl-10 py-2 border rounded"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 py-2 border rounded"
            required
          />
        </div>
      </div>

      {/* Confirm Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Confirm Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            className="w-full pl-10 py-2 border rounded"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 py-2 border rounded"
            required
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full pl-10 py-2 border rounded"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full pl-10 py-2 border rounded"
          />
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium mb-1">Register As</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="" disabled>Select</option>
          <option value="candidate">Doctor</option>
          <option value="hr">Employee</option>
        </select>
      </div>

      {/* Doctor Qualification & Resume Upload */}
      {formData.role === 'candidate' && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Qualification</label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="" disabled>Select Qualification</option>
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

          {/* Added Resume Upload Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload Resume</label>
            <div className="relative">
              <input
                type="file"
                name="resume"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Employee Designation */}
      {formData.role === 'hr' && (
        <div>
          <label className="block text-sm font-medium mb-1">Designation</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" disabled>Select Designation</option>
            <option value="Nurse">Nurse</option>
            <option value="Technician">Technician</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      )}

      {/* Employer – Organization Information */}
      {formData.role === 'hr' && (
        <div className="space-y-4 border rounded-lg p-4 bg-cyan-50">
          <h3 className="font-semibold text-cyan-700">
            Organization Information
          </h3>

          <input
            type="text"
            name="organizationName"
            placeholder="Organization Name"
            value={formData.organizationName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          <select
            name="organizationCategory"
            value={formData.organizationCategory}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" disabled>Select Category</option>
            <option value="Hospital">Hospital</option>
            <option value="Clinic">Clinic</option>
            <option value="Diagnostic Center">Diagnostic Center</option>
            <option value="Nursing Home">Nursing Home</option>
          </select>

          <select
            name="numberOfBeds"
            value={formData.numberOfBeds}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" disabled>Number of Beds</option>
            <option value="1-10">1–10</option>
            <option value="11-50">11–50</option>
            <option value="51-100">51–100</option>
            <option value="100+">100+</option>
          </select>

          <input
            type="text"
            name="organizationCity"
            placeholder="Organization City"
            value={formData.organizationCity}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          <textarea
            name="organizationAddress"
            placeholder="Full Address"
            value={formData.organizationAddress}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows="3"
            required
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}