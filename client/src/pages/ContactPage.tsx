import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, ArrowRight } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  orderNumber: string;
  inquiryType: string;
  message: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  orderNumber?: string;
  inquiryType?: string;
  message?: string;
  general?: string;
}

const validateForm = (data: ContactFormData): ContactFormErrors => {
  const errors: ContactFormErrors = {};

  if (!data.name || data.name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.inquiryType) {
    errors.inquiryType = "Please select an inquiry type";
  }

  if (!data.message || data.message.length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return errors;
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    orderNumber: '',
    inquiryType: 'general',
    message: ''
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulate API call since we can't use axios in this environment
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        orderNumber: '',
        inquiryType: 'general',
        message: ''
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setErrors({ general: 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 py-4 px-4" style={{ paddingTop: '5rem' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Made more compact */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📞 Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our anime products? Need support with your order? We're here to help! 🎌
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Message sent successfully! We'll get back to you as soon as possible.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information - Made more compact */}
          <div>
            <div className="h-full bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden relative">
              {/* Background Image */}
              <div
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{
                  backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 1000\"%3E%3Cpath d=\"M0,0h1000v1000H0V0z\" fill=\"%23000\"/>%3Cg fill=\"%23111\"%3E%3Cpath d=\"M100,200h800v100H100V200z\"/>%3Cpath d=\"M200,400h600v100H200V400z\"/>%3Cpath d=\"M150,600h700v100H150V600z\"/>%3C/g%3E%3C/svg%3E')"
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>

              <div className="relative z-10 p-5">
                <div className="mb-5">
                  <h2 className="text-lg font-bold">
                    <span className="text-red-400">ANIME</span>
                    <span className="text-white ml-1">INDIA POD</span> Support
                  </h2>
                  <p className="text-gray-300 mt-1 text-sm">
                    We aim to respond to all inquiries within 24 hours. 🚀
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm">📧 Email</h3>
                      <p className="text-gray-300 text-xs">support@animeindiapod.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm">📱 Phone</h3>
                      <p className="text-gray-300 text-xs">+91 123 456 7890</p>
                      <p className="text-gray-400 text-xs mt-1">Mon-Fri 9 AM - 6 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm">🏢 Address</h3>
                      <p className="text-gray-300 text-xs">
                        123 Anime Street<br />
                        Mumbai, Maharashtra 400001<br />
                        India 🇮🇳
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MessageSquare className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm">🌐 Social Media</h3>
                      <div className="flex space-x-2 mt-1">
                        <a href="#" className="text-gray-300 hover:text-red-400 transition-colors text-xs">📷 IG</a>
                        <a href="#" className="text-gray-300 hover:text-red-400 transition-colors text-xs">📺 YT</a>
                        <a href="#" className="text-gray-300 hover:text-red-400 transition-colors text-xs">🐦 TW</a>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-3 mt-4">
                    <h3 className="font-medium text-red-400 mb-2 text-sm">⏰ Business Hours</h3>
                    <div className="text-xs text-gray-300 space-y-1">
                      <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border border-red-100 overflow-hidden">
              <div className="p-5">
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-gray-800">💬 Send us a message</h2>
                  <p className="text-gray-600 mt-1 text-sm">
                    Fill out the form below and we'll get back to you as soon as possible!
                  </p>
                  <div className="h-1 w-16 bg-red-600 rounded-full mt-2"></div>
                </div>

                <div className="space-y-4">
                  {errors.general && (
                    <div className="text-red-600 text-sm mb-2">{errors.general}</div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                        👤 Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        className="w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                        📧 Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-semibold text-gray-700 mb-1">
                      📦 Order ID (if applicable)
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. AI-12345"
                      className="w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🏷️ Inquiry Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'general', label: '💬 General Question', emoji: '💬' },
                        { value: 'order', label: '📦 Order Status', emoji: '📦' },
                        { value: 'design', label: '🎨 Design Help', emoji: '🎨' },
                        { value: 'return', label: '↩️ Returns & Refunds', emoji: '↩️' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="inquiryType"
                            value={option.value}
                            checked={formData.inquiryType === option.value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                          />
                          <span className="text-gray-700 text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.inquiryType && <p className="text-red-500 text-xs mt-1">{errors.inquiryType}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                      💭 Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="How can we help you with your anime merchandise needs? Please be as detailed as possible..."
                      className="w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none text-sm"
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-semibold px-6 py-2 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 text-sm"
                    >
                      <span>{isSubmitting ? '⏳ Sending...' : '🚀 Send Message'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section - Made more compact */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-3">🤔 Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1 text-sm">📦 How long does shipping take?</h4>
              <p className="text-gray-600 text-xs">We usually ship within 2-3 business days. Delivery takes 5-7 days within India.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1 text-sm">🎨 Can I customize my anime designs?</h4>
              <p className="text-gray-600 text-xs">Absolutely! Use our customization tool or contact us for special requests.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1 text-sm">↩️ What's your return policy?</h4>
              <p className="text-gray-600 text-xs">Easy 7-day returns for defective products. Custom items have different terms.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1 text-sm">💳 What payment methods do you accept?</h4>
              <p className="text-gray-600 text-xs">We accept UPI, cards, net banking, and cash on delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}