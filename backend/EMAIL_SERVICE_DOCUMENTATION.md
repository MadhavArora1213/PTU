# ArthRakshak Email Service Documentation

## Overview
The ArthRakshak email service provides comprehensive email functionality using Brevo (formerly SendinBlue) as the primary email service provider, with robust fallback mechanisms and multi-language support.

## Features Implemented

### ✅ Core Email Functionality
- **OTP Email Service**: Send verification codes for user registration
- **Welcome Email Service**: Send registration success emails with onboarding information
- **Multi-language Support**: English and Hindi email templates
- **Database Integration**: OTP storage, verification, and cleanup
- **Robust Error Handling**: Graceful fallbacks when email service is unavailable

### ✅ Email Service Providers
1. **Primary**: Brevo API (via axios HTTP requests)
2. **Fallback**: SMTP via nodemailer (Gmail)
3. **Development Mode**: Console logging for testing

### ✅ Security Features
- OTP expiration (configurable, default 10 minutes)
- Failed attempt tracking
- IP-based security (Brevo feature)
- Secure API key management

## Email Templates

### OTP Verification Email
**English Template:**
- Subject: "ArthRakshak - Email Verification Code"
- Professional design with clear OTP display
- Expiration time information
- Security notice

**Hindi Template:**
- Subject: "ArthRakshak - ईमेल सत्यापन कोड"
- Localized content in Hindi
- Same security features as English version

### Welcome Email
**English Template:**
- Subject: "Welcome to ArthRakshak - Registration Successful!"
- Comprehensive onboarding information
- Feature highlights and next steps
- Professional design with call-to-action

**Hindi Template:**
- Subject: "ArthRakshak में आपका स्वागत है - पंजीकरण सफल!"
- Fully localized Hindi content
- Same structure and features as English version

## Configuration

### Environment Variables
```env
# Brevo Configuration
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=noreply@arthrakshak.com
BREVO_SENDER_NAME=ArthRakshak

# SMTP Fallback (Optional)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# OTP Settings
OTP_EXPIRY_MINUTES=10
```

### Database Tables
The service uses the following database table:
```sql
CREATE TABLE otp_verifications (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Functions

### Core Functions

#### `sendOTP(email, language)`
- Generates and sends OTP verification email
- Stores OTP in database with expiration
- Returns success status and message ID
- Supports English ('en') and Hindi ('hi') languages

#### `verifyOTP(email, otp)`
- Verifies OTP against database
- Marks OTP as used after successful verification
- Tracks failed attempts
- Returns verification result

#### `sendWelcomeEmail(email, name, language)`
- Sends comprehensive welcome email after registration
- Includes onboarding information and feature highlights
- Supports multi-language templates
- Non-blocking (registration continues even if email fails)

#### `cleanExpiredOTPs()`
- Removes expired OTP records from database
- Should be called periodically for maintenance

## Integration with Registration Flow

### Registration Process
1. User submits registration form
2. System sends OTP via `sendOTP()`
3. User enters OTP for verification
4. System verifies OTP via `verifyOTP()`
5. Upon successful verification, user account is created
6. System sends welcome email via `sendWelcomeEmail()`
7. Registration complete

### Auth Controller Integration
```javascript
// Send OTP
const result = await sendOTP(email, language || 'en');

// Verify OTP
const otpResult = await verifyOTP(email, otp);

// Send welcome email (non-blocking)
try {
  await sendWelcomeEmail(user.email, user.name, language || 'en');
} catch (emailError) {
  console.error('Welcome email failed (non-blocking):', emailError);
}
```

## Error Handling & Fallbacks

### Brevo API Failures
- IP restrictions (401 Unauthorized)
- API key issues
- Network connectivity problems
- Rate limiting

### Fallback Strategy
1. **Primary**: Brevo API via axios
2. **Secondary**: SMTP via nodemailer (if configured)
3. **Development**: Console logging with OTP display

### Non-blocking Email Sending
- Registration process continues even if emails fail
- Welcome emails are sent asynchronously
- Errors are logged but don't block user registration

## Testing

### Test Scripts
- `test-email-service.js`: Comprehensive email service testing
- `test-brevo-direct.js`: Direct Brevo API testing

### Test Coverage
- OTP generation and verification
- Welcome email sending
- Multi-language support
- Error handling and fallbacks
- Database integration

## Security Considerations

### OTP Security
- 6-digit random OTP generation
- Configurable expiration time
- Single-use OTPs (marked as verified after use)
- Failed attempt tracking

### API Security
- Secure API key storage in environment variables
- IP-based access control (Brevo feature)
- HTTPS-only communication

### Email Security
- Sender verification
- Professional email templates
- No sensitive data in email content
- Clear unsubscribe information

## Monitoring & Maintenance

### Logging
- Comprehensive error logging
- Success/failure tracking
- Development mode console output
- API response logging

### Maintenance Tasks
- Regular OTP cleanup via `cleanExpiredOTPs()`
- Monitor email delivery rates
- Update IP whitelist in Brevo dashboard
- Review and update email templates

## Troubleshooting

### Common Issues

#### 401 Unauthorized Error
- **Cause**: IP address not whitelisted in Brevo
- **Solution**: Add IP to authorized list in Brevo dashboard
- **Fallback**: Service automatically falls back to development mode

#### Email Not Received
- **Check**: Spam/junk folders
- **Verify**: Sender email domain configuration
- **Fallback**: Development mode shows OTP in console

#### Database Connection Issues
- **Check**: Database connection string
- **Verify**: OTP table exists and has correct schema
- **Monitor**: Database connection logs

## Future Enhancements

### Planned Features
- Email templates for password reset
- Email templates for account notifications
- Advanced analytics and reporting
- A/B testing for email templates
- Additional language support

### Performance Optimizations
- Email queue implementation
- Batch email processing
- Template caching
- Database connection pooling

## Conclusion

The ArthRakshak email service provides a robust, scalable, and user-friendly email solution with comprehensive error handling, multi-language support, and seamless integration with the registration flow. The service is production-ready with proper fallback mechanisms to ensure user registration is never blocked by email service issues.