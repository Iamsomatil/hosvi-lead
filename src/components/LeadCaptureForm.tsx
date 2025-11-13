import { useState, FormEvent } from 'react';
import { FormData, FormErrors, validateForm, validateField } from '../utils/validation';

interface LeadCaptureFormProps {
  utmParams: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content: string;
    utm_term: string;
  };
}

const WEBHOOK_URL = 'https://hook.us2.make.com/y7x8prtd3xm3ou47zwqkwelkod58gyoc';

// Service options - used in the form rendering
const SERVICES = ['Chiropractic', 'Med Spa'] as const;
const SUB_SERVICES = {
  'Chiropractic': ['Initial Consultation', 'Adjustment', 'Massage Therapy', 'Rehabilitation'],
  'Med Spa': ['Botox', 'Fillers', 'Laser Treatment', 'Facials']
} as const;

// Time slots - used in the form rendering
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
] as const;

// Cities - used in the form rendering
const CITIES = [
  'Tampa',
  'Orlando',
  'Miami',
  'Fort Lauderdale'
] as const;

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ utmParams }) => {
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    serviceType: '',
    subService: '',
    preferredTime: '',
    notes: '',
    whatsappOptIn: false,
    consent: false,
  });

  const handleFieldChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    // If service type changes, reset subService
    if (field === 'serviceType') {
      setFormData(prev => ({
        ...prev,
        serviceType: value as string,
        subService: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (field in formErrors) {
      setFormErrors(prev => ({
        ...prev,
        [field]: validateField(field, value)
      }));
    }
  };

  const handleBlur = <K extends keyof FormData>(field: K) => {
    const error = validateField(field, formData[field]);
    setFormErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setFormErrors({});
    
    // Include UTM params in the form data
    const formDataWithUTM = {
      ...formData,
      ...utmParams,
      source: 'landing_page'
    };

    const errors = validateForm(formDataWithUTM);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithUTM)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form. Please try again.');
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You!
            </h2>
            <p className="text-gray-600 mb-6">
              We've received your information and will contact you within 24 hours.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="lead-form" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Book Your Free Consultation
            </h2>
            <p className="text-gray-600">
              Fill out the form below and we'll contact you within 24 hours
            </p>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                onBlur={() => {
                  const error = validateField('firstName', formData.firstName);
                  setFormErrors(prev => ({
                    ...prev,
                    firstName: error
                  }));
                }}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John"
              />
              {formErrors.firstName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleFieldChange('lastName', e.target.value)}
                onBlur={() => {
                  const error = validateField('lastName', formData.lastName);
                  setFormErrors(prev => ({
                    ...prev,
                    lastName: error
                  }));
                }}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Doe"
              />
              {formErrors.lastName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
              )}
            </div>

            {/* Phone */}
            <div id="phone">
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
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
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
              <div className="mt-3">
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={formData.whatsappOptIn}
                    onChange={(e) =>
                      handleFieldChange("whatsappOptIn", e.target.checked)
                    }
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  Also contact me via WhatsApp
                </label>
              </div>
            </div>

            {/* Email */}
            <div id="email">
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
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
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
            <div id="city">
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
                    handleFieldChange("city", e.target.value)
                  }
                  onBlur={() => handleBlur("city")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                    formErrors.city ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select your city</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {formErrors.city && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.city}
                </p>
              )}
            </div>

            {/* Service Type */}
            <div id="serviceType">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Service Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICES.map((service) => (
                  <label
                    key={service}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      formData.serviceType === service ? 'ring-2 ring-blue-500 border-blue-500' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      value={service}
                      checked={formData.serviceType === service}
                      onChange={(e) =>
                        handleFieldChange("serviceType", e.target.value)
                      }
                      onBlur={() => handleBlur("serviceType")}
                      className="sr-only"
                    />
                    <div className={`flex items-center justify-center h-5 w-5 rounded-full border mr-3 ${
                      formData.serviceType === service 
                        ? 'border-blue-500 flex items-center justify-center' 
                        : 'border-gray-300'
                    }`}>
                      {formData.serviceType === service && (
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                      )}
                    </div>
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
              <div id="subService">
                <label
                  htmlFor="subService"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select a Specific Service *
                </label>
                <div className="relative">
                  <select
                    id="subService"
                    value={formData.subService}
                    onChange={(e) =>
                      handleFieldChange("subService", e.target.value)
                    }
                    onBlur={() => handleBlur("subService")}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                      formErrors.subService ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a {formData.serviceType} service</option>
                    {formData.serviceType && SUB_SERVICES[formData.serviceType as keyof typeof SUB_SERVICES]?.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {formErrors.subService && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.subService}
                  </p>
                )}
              </div>
            )}

            {/* Preferred Time */}
            <div id="preferredTime">
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
                    handleFieldChange("preferredTime", e.target.value)
                  }
                  onBlur={() => handleBlur("preferredTime")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                    formErrors.preferredTime ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a preferred time slot</option>
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
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
                rows={3}
                value={formData.notes}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional information or special requests..."
              />
            </div>

            {/* Consent */}
            <div className="pt-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) =>
                      handleFieldChange("consent", e.target.checked)
                    }
                    onBlur={() => handleBlur("consent")}
                    className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                      formErrors.consent ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="consent"
                    className="font-medium text-gray-700"
                  >
                    I agree to be contacted by phone, email, or text regarding my inquiry. *
                  </label>
                  <p className="text-gray-500">
                    Your information will be kept confidential and used solely for the purpose of responding to your request.
                  </p>
                  {formErrors.consent && (
                    <p className="mt-1 text-red-600">
                      {formErrors.consent}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadCaptureForm;
