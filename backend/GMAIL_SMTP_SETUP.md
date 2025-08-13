# Gmail SMTP Setup Guide for ArthRakshak Email Service

## Overview
To enable actual email sending when Brevo API fails due to IP restrictions, we've configured Gmail SMTP as a fallback. Follow these steps to set up Gmail App Password.

## Step-by-Step Setup

### 1. Enable 2-Factor Authentication on Gmail
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the prompts to enable 2FA if not already enabled

### 2. Generate App Password
1. Go back to "Security" settings
2. Under "Signing in to Google", click on "App passwords"
3. Select "Mail" as the app
4. Select "Other (Custom name)" as the device
5. Enter "ArthRakshak Email Service" as the name
6. Click "Generate"
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### 3. Update .env File
Replace `your-gmail-app-password-here` in your `.env` file with the generated app password:

```env
# Gmail SMTP Fallback (when Brevo fails)
SMTP_USER=madhavarora132005@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

**Important**: Remove the spaces from the app password, so it becomes: `abcdefghijklmnop`

### 4. Test the Email Service
After updating the .env file, restart your server and test:

```bash
cd backend
node test-email-service.js
```

## How It Works

### Email Service Priority
1. **Primary**: Brevo API (if IP is whitelisted)
2. **Fallback**: Gmail SMTP (if app password is configured)
3. **Development**: Console logging (if no email service available)

### Current Status
- ✅ Brevo API configured (fails due to IP restrictions)
- ⚠️ Gmail SMTP configured (needs app password)
- ✅ Development mode working (shows OTP in console)

## Security Notes

### App Password Security
- App passwords are specific to applications
- They bypass 2FA for the specific app
- Can be revoked anytime from Google Account settings
- Should be kept secure and not shared

### Email Security
- All emails sent via HTTPS/TLS
- No sensitive data stored in email content
- OTP expires after 10 minutes
- Failed attempts are tracked

## Troubleshooting

### Common Issues

#### "Invalid credentials" error
- **Solution**: Ensure 2FA is enabled and app password is correct
- **Check**: Remove spaces from app password
- **Verify**: App password is for "Mail" application

#### "Less secure app access" error
- **Solution**: Use App Password instead of regular password
- **Note**: Google no longer supports "less secure apps"

#### Emails going to spam
- **Solution**: Add sender to contacts
- **Check**: SPF/DKIM records for domain (if using custom domain)

## Alternative Solutions

### If Gmail SMTP doesn't work:
1. **Brevo IP Whitelist**: Add your IP to Brevo authorized IPs
2. **Other SMTP Providers**: Configure SendGrid, Mailgun, etc.
3. **Development Mode**: Continue using console logging for testing

## Testing Commands

### Test Email Service
```bash
cd backend
node test-email-service.js
```

### Test Registration Flow
```bash
cd backend
npm start
# Then test registration via frontend or API
```

## Next Steps

1. Set up Gmail App Password following the guide above
2. Update the `.env` file with the app password
3. Restart the server
4. Test email functionality
5. (Optional) Add your IP to Brevo whitelist for primary email service

Once configured, your email service will automatically send real emails via Gmail SMTP when Brevo API is unavailable!