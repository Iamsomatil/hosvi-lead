import React, { useEffect, useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  X 
} from 'lucide-react';
import { getUTMParams, trackEvent } from './utils/utm';
import LeadCaptureForm from './components/LeadCaptureForm';

interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

const App: React.FC = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [utmParams, setUtmParams] = useState<UTMParams>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  });

  useEffect(() => {
    // Capture UTM parameters on mount
    const params = getUTMParams();
    setUtmParams(params);

    // Track page view
    trackEvent("page_view", {
      page: "landing",
      utm_source: params.utm_source,
      utm_medium: params.utm_medium,
      utm_campaign: params.utm_campaign,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">Hosvi</div>
            </div>
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Privacy & Terms
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Get Relief Fast — Book a Free Consultation Today
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Same-day appointments available. Expert care from licensed professionals.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Licensed Practitioners</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Same-Day Appointments</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Free Initial Consultation</span>
            </div>
          </div>
          
          <a 
            href="#lead-form" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200"
          >
            Book Your Free Consultation
          </a>
        </div>
      </section>

      {/* Lead Capture Form Section */}
      <section id="lead-form" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeadCaptureForm utmParams={utmParams} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <h3 className="text-white text-xl font-bold">Hosvi</h3>
              <p className="text-gray-300 text-base">
                Providing quality healthcare services with compassion and expertise.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Services</h4>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#services" className="text-base text-gray-300 hover:text-white">Chiropractic Care</a></li>
                    <li><a href="#services" className="text-base text-gray-300 hover:text-white">Med Spa</a></li>
                    <li><a href="#services" className="text-base text-gray-300 hover:text-white">Wellness Programs</a></li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Contact</h4>
                  <ul className="mt-4 space-y-4">
                    <li className="flex">
                      <MapPin className="h-6 w-6 text-gray-300 mr-2" />
                      <span className="text-base text-gray-300">123 Health St, City, State 12345</span>
                    </li>
                    <li className="flex">
                      <Phone className="h-6 w-6 text-gray-300 mr-2" />
                      <span className="text-base text-gray-300">(555) 123-4567</span>
                    </li>
                    <li className="flex">
                      <Mail className="h-6 w-6 text-gray-300 mr-2" />
                      <span className="text-base text-gray-300">info@hosvi.com</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Hosvi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Privacy Policy</h3>
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        We respect your privacy and are committed to protecting your personal data. 
                        We will only use your information to process your appointment and provide 
                        you with the best possible service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;