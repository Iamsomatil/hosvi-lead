/**
 * Form Validation Utilities
 * 
 * This module handles client-side form validation for the lead capture form.
 */

export interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  serviceType: string;
  subService: string;
  preferredTime: string;
  notes: string;
  whatsappOptIn: boolean;
  consent: boolean;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation - accepts various US phone number formats
 */
const PHONE_REGEX = /^[+]?[1]?[\s.-]?[(]?[2-9][0-8][0-9][)]?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/;

/**
 * Validate individual form fields
 */
const validators = {
  firstName: (value: string): string | undefined => {
    if (!value?.trim()) {
      return 'First name is required';
    }
    if (value.trim().length < 2) {
      return 'First name must be at least 2 characters';
    }
    return undefined;
  },

  lastName: (value: string): string | undefined => {
    if (!value?.trim()) {
      return 'Last name is required';
    }
    if (value.trim().length < 2) {
      return 'Last name must be at least 2 characters';
    }
    return undefined;
  },

  phone: (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Phone number is required';
    }
    // Remove all non-digits to check length
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      return 'Phone number must be at least 10 digits';
    }
    if (!PHONE_REGEX.test(value)) {
      return 'Please enter a valid US phone number';
    }
    return undefined;
  },

  email: (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Email address is required';
    }
    if (!EMAIL_REGEX.test(value)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  },

  city: (value: string): string | undefined => {
    if (!value) {
      return 'Please select a city';
    }
    return undefined;
  },

  serviceType: (value: string): string | undefined => {
    if (!value) {
      return 'Please select a service type';
    }
    return undefined;
  },

  subService: (value: string): string | undefined => {
    if (!value) {
      return 'Please select a specific service';
    }
    return undefined;
  },

  preferredTime: (value: string): string | undefined => {
    if (!value) {
      return 'Please select a preferred time';
    }
    return undefined;
  },

  consent: (value: boolean): string | undefined => {
    if (!value) {
      return 'You must agree to be contacted to proceed';
    }
    return undefined;
  }
};

/**
 * Validate entire form and return errors object
 * @param formData - The form data to validate
 * @returns Object containing field errors (empty if valid)
 */
export const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  // Validate required fields
  errors.firstName = validators.firstName(formData.firstName);
  errors.lastName = validators.lastName(formData.lastName);
  errors.phone = validators.phone(formData.phone);
  errors.email = validators.email(formData.email);
  errors.city = validators.city(formData.city);
  errors.serviceType = validators.serviceType(formData.serviceType);
  errors.subService = validators.subService(formData.subService);
  errors.preferredTime = validators.preferredTime(formData.preferredTime);
  errors.consent = validators.consent(formData.consent);

  // Remove undefined errors
  Object.keys(errors).forEach(key => {
    if (errors[key] === undefined) {
      delete errors[key];
    }
  });

  return errors;
};

/**
 * Validate a single field
 * @param fieldName - Name of the field to validate
 * @param value - Value to validate
 * @returns Error message or undefined if valid
 */
export const validateField = <K extends keyof FormData>(
  fieldName: K,
  value: FormData[K]
): string | undefined => {
  const validator = validators[fieldName as keyof typeof validators];
  if (!validator) return undefined;
  
  // Type assertion to handle the different possible value types
  if (typeof value === 'boolean') {
    return (validator as (val: boolean) => string | undefined)(value);
  } else {
    return (validator as (val: string) => string | undefined)(value as string);
  }
};

/**
 * Format phone number for display (US format)
 * @param phoneNumber - Raw phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }
  
  return phoneNumber; // Return as-is if doesn't match expected patterns
};