import React, { useState, useEffect } from "react";
import {
  Shield,
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Loader2,
  CheckCircle,
  MessageCircle,
  Calendar,
  X,
} from "lucide-react";
import { getUTMParams, trackEvent } from "./utils/utm";
import {
  validateForm,
  type FormData,
  type FormErrors,
} from "./utils/validation";

interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

const App: React.FC = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [utmParams, setUtmParams] = useState<UTMParams>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
  });

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    serviceType: "",
    subService: "",
    preferredTime: "",
    notes: "",
    whatsappOptIn: false,
    consent: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

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

  const cities = ["Tampa", "Orlando", "Miami", "Boca Raton", "Fort Lauderdale"];
  const timeSlots = ["Morning", "Afternoon", "Evening"];

  const chiropracticServices = [
    "Back/Neck Pain",
    "Injury Rehab",
    "Adjustment",
    "Other",
  ];

  const medSpaServices = [
    "Botox/Fillers",
    "Facial/Peel",
    "Laser Hair Removal",
    "Body Contouring",
    "Other",
  ];

  const getSubServices = () => {
    return formData.serviceType === "Chiropractic"
      ? chiropracticServices
      : medSpaServices;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset sub-service when service type changes
      ...(field === "serviceType" && { subService: "" }),
    }));

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload for CRM
      const payload = {
        ...formData,
        ...utmParams,
        timestamp: new Date().toISOString(),
        source: "landing_page",
      };

      // Send to CRM webhook (placeholder - replace with actual webhook URL)
      const webhookUrl =
        process.env.REACT_APP_LEAD_WEBHOOK_URL ||
        "https://hooks.zapier.com/hooks/catch/placeholder";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Track successful submission
        trackEvent("lead_submitted", {
          city: formData.city,
          serviceType: formData.serviceType,
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
        });

        setFormSubmitted(true);
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(
        "Something went wrong. Please try again or call us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Logo placeholder */}
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
      <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Get Relief Fast — Book a Free Consultation Today
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
            Same-week appointments for chiropractic and med spa treatments
            across Tampa, Orlando, Boca Raton, Miami & Fort Lauderdale.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Licensed Providers
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Flexible Scheduling
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Transparent Pricing
            </div>
          </div>

          <button
            onClick={scrollToForm}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Check Availability
          </button>
        </div>
      </section>

      {/* Trust/Risk Reversal Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Verified Clinics & Spas
              </h3>
              <p className="text-gray-600">
                All providers are licensed and thoroughly vetted for your
                safety.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Spam. Secure Submission.
              </h3>
              <p className="text-gray-600">
                Your information is encrypted and never shared with third
                parties.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                We'll call/text within 24 hours
              </h3>
              <p className="text-gray-600">
                Quick response guaranteed to get you scheduled fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {!formSubmitted ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Book Your Free Consultation
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll contact you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="(555) 123-4567"
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.phone}
                    </p>
                  )}

                  {/* WhatsApp Opt-in */}
                  <div className="mt-2">
                    <label className="flex items-center text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={formData.whatsappOptIn}
                        onChange={(e) =>
                          handleInputChange("whatsappOptIn", e.target.checked)
                        }
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      Also contact me via WhatsApp
                    </label>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="your@email.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    City *
                  </label>
                  <div className="relative">
                    <select
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                        formErrors.city ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select your city</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {formErrors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Service Type *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Chiropractic", "Med Spa"].map((service) => (
                      <label
                        key={service}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="serviceType"
                          value={service}
                          checked={formData.serviceType === service}
                          onChange={(e) =>
                            handleInputChange("serviceType", e.target.value)
                          }
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">{service}</span>
                      </label>
                    ))}
                  </div>
                  {formErrors.serviceType && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.serviceType}
                    </p>
                  )}
                </div>

                {/* Sub-Service */}
                {formData.serviceType && (
                  <div>
                    <label
                      htmlFor="subService"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Specific Service *
                    </label>
                    <div className="relative">
                      <select
                        id="subService"
                        value={formData.subService}
                        onChange={(e) =>
                          handleInputChange("subService", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                          formErrors.subService
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select specific service</option>
                        {getSubServices().map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {formErrors.subService && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.subService}
                      </p>
                    )}
                  </div>
                )}

                {/* Preferred Time */}
                <div>
                  <label
                    htmlFor="preferredTime"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Preferred Time *
                  </label>
                  <div className="relative">
                    <select
                      id="preferredTime"
                      value={formData.preferredTime}
                      onChange={(e) =>
                        handleInputChange("preferredTime", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                        formErrors.preferredTime
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select preferred time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {formErrors.preferredTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.preferredTime}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us more about your needs or preferences..."
                  />
                </div>

                {/* Consent */}
                <div>
                  <label className="flex items-start text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) =>
                        handleInputChange("consent", e.target.checked)
                      }
                      className={`mr-3 mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                        formErrors.consent ? "border-red-500" : ""
                      }`}
                    />
                    <span>
                      I agree to be contacted by text/phone/email about my
                      inquiry.
                      <span className="block text-xs text-gray-500 mt-1">
                        We respect your privacy. You can opt out anytime.
                      </span>
                    </span>
                  </label>
                  {formErrors.consent && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.consent}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Get My Free Consultation"
                  )}
                </button>

                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}

                {/* Hidden UTM fields */}
                <input
                  type="hidden"
                  name="utm_source"
                  value={utmParams.utm_source}
                />
                <input
                  type="hidden"
                  name="utm_medium"
                  value={utmParams.utm_medium}
                />
                <input
                  type="hidden"
                  name="utm_campaign"
                  value={utmParams.utm_campaign}
                />
                <input
                  type="hidden"
                  name="utm_content"
                  value={utmParams.utm_content}
                />
                <input
                  type="hidden"
                  name="utm_term"
                  value={utmParams.utm_term}
                />

                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </form>
            </div>
          ) : (
            /* Thank You State */
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Thank You!
              </h2>

              <p className="text-lg text-gray-600 mb-8">
                A coordinator will contact you within 24 hours to schedule your
                free consultation.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="https://wa.me/1234567890" // Replace with actual WhatsApp number
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </a>

                <a
                  href="https://calendly.com/hosvi" // Replace with actual Calendly link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Pick a Time Now
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@hosvi.com" className="hover:text-gray-900">
                  info@hosvi.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>hosvi.com</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 text-sm">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-gray-600 hover:text-gray-900 underline"
              >
                Privacy
              </button>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-gray-600 hover:text-gray-900 underline"
              >
                Terms
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowPrivacyModal(false)}
            />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Privacy & Terms
                  </h3>
                  <button
                    onClick={() => setShowPrivacyModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="text-sm text-gray-600 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Privacy Policy
                    </h4>
                    <p>
                      We collect and use your personal information solely to
                      connect you with qualified healthcare providers. Your
                      information is encrypted, secure, and never sold to third
                      parties. You can opt out of communications at any time.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Terms of Service
                    </h4>
                    <p>
                      By submitting this form, you agree to be contacted by
                      Hosvi or our partner providers via phone, text, or email
                      regarding your healthcare inquiry. Standard messaging
                      rates may apply.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Got it
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
