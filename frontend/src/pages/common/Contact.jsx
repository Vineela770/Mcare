import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Modal from '../../components/common/Modal';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccessModal(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-8 md:py-12 px-4 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            Get In Touch
          </h1>
          <p className="text-sm md:text-lg text-white/90">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-4 md:space-y-5">
              {[
                {
                  icon: <Phone className="w-6 h-6 text-white" />,
                  bg: "bg-gradient-to-r from-emerald-500 to-teal-600",
                  title: "Phone",
                  lines: ["+91 1800-123-4567", "Mon-Fri, 9AM-6PM"],
                },
                {
                  icon: <Mail className="w-6 h-6 text-white" />,
                  bg: "bg-gradient-to-r from-emerald-500 to-teal-600",
                  title: "Email",
                  lines: ["support@mcare.com", "careers@mcare.com"],
                },
                {
                  icon: <MapPin className="w-6 h-6 text-white" />,
                  bg: "bg-gradient-to-r from-emerald-500 to-teal-600",
                  title: "Office",
                  lines: ["123 Healthcare Plaza", "Bangalore, Karnataka 560001"],
                },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className={`w-11 h-11 md:w-12 md:h-12 ${item.bg} rounded-lg flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">
                        {item.title}
                      </h3>
                      {item.lines.map((line, i) => (
                        <p key={i} className="text-sm md:text-base text-gray-600">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-4 md:mb-5">
                  <MessageSquare className="w-7 h-7 md:w-8 md:h-8 text-emerald-700" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Send us a Message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-700 to-emerald-500 text-white
                              font-medium py-2 px-4 text-sm
                              md:font-semibold md:py-3 md:px-6 md:text-base
                              rounded-lg hover:from-teal-800 hover:to-emerald-600
                              transition-all duration-200 shadow-md hover:shadow-lg
                              flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 md:py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-6 md:mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 md:space-y-5">
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                How do I create an account?
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Click on the "Register" button in the navigation bar and fill out the registration form.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                Is MCARE free to use?
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Yes! Job seekers can create accounts, browse jobs, and apply for positions completely free.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 md:p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                How long does it take to hear back from employers?
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Typically, you can expect to hear back within 1-2 weeks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Message Sent!"
        >
          <div className="text-center py-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
            </div>
            <p className="text-base md:text-lg text-gray-900 mb-2">
              Thank you for your message!
            </p>
            <p className="text-sm md:text-base text-gray-600">
              We will get back to you soon.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-6 px-6 py-2 text-sm md:text-base bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Contact;