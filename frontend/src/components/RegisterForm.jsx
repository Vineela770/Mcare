import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin } from 'lucide-react';
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
    const { name, value } = e.target;

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
      await authService.register(formData);
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
          <option value="Dr">Dr</option>
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
      {/* Dynamic Role Heading */}
      {formData.role && (
        <div className="mb-5">
          <h3 className="text-xl font-medium text-gray-900 border-b border-gray-200 pb-2">
            {formData.role === 'candidate'
              ? 'Doctor Registration'
              : 'Employer Registration'}
          </h3>
        </div>
      )}


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
      


      {/* Doctor Qualification */}
      {formData.role === 'candidate' && (
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
        <div className="space-y-6">

        {/* Section Heading */}
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
          Organization Information
        </h2>


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
