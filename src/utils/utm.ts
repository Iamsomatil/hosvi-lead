/**
 * UTM Parameter Utilities
 * 
 * This module handles capturing and tracking UTM parameters from the URL
 * for attribution and analytics purposes.
 */

export interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

/**
 * Extract UTM parameters from the current URL
 * @returns UTMParams object with all UTM values (empty strings if not found)
 */
export const getUTMParams = (): UTMParams => {
  const searchParams = new URLSearchParams(window.location.search);
  
  return {
    utm_source: searchParams.get('utm_source') || '',
    utm_medium: searchParams.get('utm_medium') || '',
    utm_campaign: searchParams.get('utm_campaign') || '',
    utm_content: searchParams.get('utm_content') || '',
    utm_term: searchParams.get('utm_term') || ''
  };
};

/**
 * Track events to Google Analytics via dataLayer
 * @param eventName - Name of the event to track
 * @param eventData - Additional data to send with the event
 */
export const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  // Check if dataLayer exists (Google Analytics / GTM)
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...eventData,
      timestamp: new Date().toISOString()
    });
  }
  
  // Console log for development/debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, eventData);
  }
};

/**
 * Store UTM parameters in sessionStorage for persistence across page reloads
 * @param params - UTM parameters to store
 */
export const storeUTMParams = (params: UTMParams): void => {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('hosvi_utm_params', JSON.stringify(params));
    } catch (error) {
      console.warn('Failed to store UTM parameters:', error);
    }
  }
};

/**
 * Retrieve stored UTM parameters from sessionStorage
 * @returns UTMParams object or null if not found
 */
export const getStoredUTMParams = (): UTMParams | null => {
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('hosvi_utm_params');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to retrieve stored UTM parameters:', error);
      return null;
    }
  }
  return null;
};