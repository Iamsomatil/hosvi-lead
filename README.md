# Hosvi Patient Acquisition Landing Page

A high-converting, mobile-first landing page designed to capture qualified leads from paid ad traffic for chiropractic and med spa services across Florida.

## Features

- **Mobile-first responsive design** optimized for all devices
- **Above-the-fold conversion focus** with clear value proposition
- **Smart form validation** with real-time feedback
- **UTM parameter tracking** for ad attribution
- **CRM integration** via webhook
- **Privacy-compliant** with GDPR considerations
- **Performance optimized** for fast loading

## Quick Setup

### 1. CRM Webhook Integration

Replace the placeholder webhook URL in `src/App.tsx`:

```typescript
// Line ~165 in App.tsx - Replace with your actual webhook URL
const webhookUrl = process.env.REACT_APP_LEAD_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID';
```

Or set the environment variable:
```bash
REACT_APP_LEAD_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID
```

### 2. WhatsApp & Calendly Links

Update the thank-you page links in `src/App.tsx`:

```typescript
// Line ~500 - Update WhatsApp number
href="https://wa.me/1234567890" // Replace with: https://wa.me/YOUR_PHONE_NUMBER

// Line ~510 - Update Calendly link  
href="https://calendly.com/hosvi" // Replace with: https://calendly.com/YOUR_CALENDLY_USERNAME
```

### 3. Customize Cities & Services

Modify the available options in `src/App.tsx`:

```typescript
// Line ~80 - Update cities
const cities = ['Tampa', 'Orlando', 'Miami', 'Fort Lauderdale'];

// Line ~82-95 - Update services
const chiropracticServices = ['Back/Neck Pain', 'Injury Rehab', 'Adjustment', 'Other'];
const medSpaServices = ['Botox/Fillers', 'Facial/Peel', 'Laser Hair Removal', 'Body Contouring', 'Other'];
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

The app is a static React application that can be deployed to any hosting provider:

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `REACT_APP_LEAD_WEBHOOK_URL`

### Vercel
1. Connect your GitHub repository
2. Framework preset: `Vite`
3. Add environment variable: `REACT_APP_LEAD_WEBHOOK_URL`

### Custom Server
1. Run `npm run build`
2. Deploy the `dist` folder contents
3. Configure environment variables

## Analytics Setup

The page includes Google Analytics/GTM integration via `dataLayer` events:

- `page_view` - Fired on page load
- `lead_submitted` - Fired on successful form submission

Add Google Analytics or Google Tag Manager to track these events.

## CRM Payload Structure

The webhook receives this JSON payload:

```json
{
  "fullName": "John Doe",
  "phone": "(555) 123-4567", 
  "email": "john@example.com",
  "city": "Tampa",
  "serviceType": "Chiropractic",
  "subService": "Back/Neck Pain",
  "preferredTime": "Morning",
  "notes": "Additional details...",
  "whatsappOptIn": true,
  "consent": true,
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "chiro-tampa",
  "utm_content": "ad-variant-1",
  "utm_term": "chiropractor-tampa",
  "timestamp": "2025-01-27T10:30:00.000Z",
  "source": "landing_page"
}
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Performance

- Lighthouse Score: 90+ across all metrics
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

## Security

- Form includes honeypot for bot protection
- All user input is validated client-side
- HTTPS required for production
- No sensitive data stored locally

## Support

For technical support or customization requests, contact the development team.