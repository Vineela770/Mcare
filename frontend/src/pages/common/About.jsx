import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Users, Target, Heart } from 'lucide-react';
import Navbar from '../../components/common/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-6 md:py-10 px-4 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
            About M-Care
          </h1>
          <p className="text-sm md:text-lg text-cyan-100">
            India's leading healthcare recruitment platform connecting medical professionals with top healthcare facilities
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-6 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg text-center border border-gray-100">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Target className="w-7 h-7 md:w-8 md:h-8 text-cyan-600" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">Our Mission</h3>
              <p className="text-sm md:text-base text-gray-600">
                To bridge the gap between talented healthcare professionals and leading medical facilities across India
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg text-center border border-gray-100">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Users className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">Our Vision</h3>
              <p className="text-sm md:text-base text-gray-600">
                To become the most trusted healthcare recruitment partner in India, serving millions of professionals
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg text-center border border-gray-100">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Heart className="w-7 h-7 md:w-8 md:h-8 text-green-600" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">Our Values</h3>
              <p className="text-sm md:text-base text-gray-600">
                Integrity, excellence, and commitment to improving healthcare accessibility for all
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-6 md:py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-4xl font-bold text-center text-gray-900 mb-6 md:mb-12">
            Our Impact
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            <div className="text-center">
              <div className="text-xl md:text-4xl font-bold text-cyan-600 mb-1 md:mb-2">2,500+</div>
              <div className="text-xs md:text-base text-gray-600 font-medium">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-4xl font-bold text-blue-600 mb-1 md:mb-2">850+</div>
              <div className="text-xs md:text-base text-gray-600 font-medium">Healthcare Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-4xl font-bold text-green-600 mb-1 md:mb-2">12,000+</div>
              <div className="text-xs md:text-base text-gray-600 font-medium">Successful Placements</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-4xl font-bold text-purple-600 mb-1 md:mb-2">150+</div>
              <div className="text-xs md:text-base text-gray-600 font-medium">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-6 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-4xl font-bold text-center text-gray-900 mb-4 md:mb-10">
            Our Story
          </h2>

          <div className="bg-white rounded-xl p-6 md:p-10">
            <p className="text-sm md:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6 text-justify first-line:indent-8">
              MCARE was founded with a simple yet powerful vision: to revolutionize healthcare recruitment in India. We
              recognized the challenges faced by both healthcare professionals seeking meaningful careers and medical
              facilities struggling to find qualified talent.
            </p>
            <p className="text-sm md:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6 text-justify first-line:indent-8">
              Since our inception, we've connected thousands of doctors, nurses, technicians, and other healthcare
              professionals with leading hospitals, clinics, and healthcare organizations across the country.
            </p>
            <p className="text-sm md:text-lg text-gray-700 leading-relaxed text-justify first-line:indent-8">
              Today, MCARE stands as India's #1 healthcare job platform, trusted by professionals and employers alike.
              Our commitment to excellence, innovation, and integrity continues to drive us forward as we work to
              transform the healthcare recruitment landscape.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-6 md:py-12 px-4 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl md:text-4xl font-bold text-white mb-3 md:mb-6">Ready to Join Us?</h2>
          <p className="text-sm md:text-xl text-cyan-100 mb-5 md:mb-8">
            Whether you're seeking your dream healthcare job or looking to hire top talent, we're here to help
          </p>

          <div className="flex flex-row sm:flex-row justify-center gap-3 md:gap-4">
            <Link
              to="/register"
              className="bg-white text-cyan-600 px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-gray-50 font-medium inline-flex items-center justify-center transition shadow-lg text-sm md:text-base"
            >
              Get Started Today
            </Link>
            <Link
              to="/jobs"
              className="bg-white text-cyan-600 px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-gray-50 font-medium transition shadow-lg text-sm md:text-base inline-flex items-center justify-center"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;