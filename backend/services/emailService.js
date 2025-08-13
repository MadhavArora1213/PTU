const crypto = require('crypto');
const db = require('../config/database');
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Initialize Brevo (Sendinblue)
let emailServiceReady = false;
let brevoApiInstance;

try {
  if (process.env.BREVO_API_KEY) {
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
    brevoApiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    emailServiceReady = true;
    console.log('Brevo email service initialized successfully');
  } else {
    console.log('Brevo API key not configured - running in development mode');
  }
} catch (error) {
  console.log('Brevo initialization failed:', error.message);
}

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in database
const storeOTP = async (email, otp) => {
  try {
    // Delete any existing OTP for this email
    await db.query('DELETE FROM otp_verifications WHERE email = $1', [email]);
    
    // Store new OTP
    const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);
    await db.query(
      'INSERT INTO otp_verifications (email, otp_code, expires_at) VALUES ($1, $2, $3)',
      [email, otp, expiresAt]
    );
    
    return true;
  } catch (error) {
    console.error('Error storing OTP:', error);
    return false;
  }
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  try {
    const result = await db.query(
      'SELECT * FROM otp_verifications WHERE email = $1 AND otp_code = $2 AND expires_at > NOW() AND is_verified = FALSE',
      [email, otp]
    );
    
    if (result.rows.length === 0) {
      // Check if OTP exists but is expired or already used
      const expiredResult = await db.query(
        'SELECT * FROM otp_verifications WHERE email = $1 AND otp_code = $2',
        [email, otp]
      );
      
      if (expiredResult.rows.length > 0) {
        return { success: false, message: 'OTP has expired or already been used' };
      }
      
      // Increment failed attempts
      await db.query(
        'UPDATE otp_verifications SET attempts = attempts + 1 WHERE email = $1',
        [email]
      );
      
      return { success: false, message: 'Invalid OTP' };
    }
    
    // Mark OTP as verified
    await db.query(
      'UPDATE otp_verifications SET is_verified = TRUE WHERE email = $1 AND otp_code = $2',
      [email, otp]
    );
    
    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, message: 'Error verifying OTP' };
  }
};

// Send OTP email
const sendOTPEmail = async (email, otp, language = 'en') => {
  try {
    // Email templates in different languages
    const templates = {
      en: {
        subject: 'ArthRakshak - Email Verification Code',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2E8B57;">ArthRakshak Email Verification</h2>
            <p>Hello,</p>
            <p>Thank you for registering with ArthRakshak. Please use the following verification code to complete your registration:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #2E8B57; font-size: 32px; margin: 0;">${otp}</h1>
            </div>
            <p>This code will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
            <p>Best regards,<br>ArthRakshak Team</p>
          </div>
        `
      },
      hi: {
        subject: 'ArthRakshak - ईमेल सत्यापन कोड',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2E8B57;">ArthRakshak ईमेल सत्यापन</h2>
            <p>नमस्ते,</p>
            <p>ArthRakshak के साथ पंजीकरण के लिए धन्यवाद। कृपया अपना पंजीकरण पूरा करने के लिए निम्नलिखित सत्यापन कोड का उपयोग करें:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #2E8B57; font-size: 32px; margin: 0;">${otp}</h1>
            </div>
            <p>यह कोड ${process.env.OTP_EXPIRY_MINUTES || 10} मिनट में समाप्त हो जाएगा।</p>
            <p>यदि आपने इस सत्यापन का अनुरोध नहीं किया है, तो कृपया इस ईमेल को अनदेखा करें।</p>
            <p>सादर,<br>ArthRakshak टीम</p>
          </div>
        `
      }
    };

    const template = templates[language] || templates.en;
    
    if (!emailServiceReady) {
      // Development mode - just log the OTP
      console.log(`\n=== DEVELOPMENT MODE - EMAIL SERVICE ===`);
      console.log(`OTP for ${email}: ${otp}`);
      console.log(`Subject: ${template.subject}`);
      console.log(`Note: Brevo not configured. OTP logged to console.`);
      console.log(`=======================================\n`);
      
      return { success: true, messageId: 'dev-mode', note: 'Brevo not configured. OTP logged to console.' };
    }

    // Use Brevo to send email
    const sendSmtpEmail = {
      to: [{ email }],
      sender: { email: process.env.SENDER_EMAIL, name: 'ArthRakshak' },
      subject: template.subject,
      htmlContent: template.htmlContent
    };
    const result = await brevoApiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('OTP email sent successfully via Brevo:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('Error sending OTP email:', error);
    
    // For development/testing, just log the OTP and continue
    console.log(`\n=== DEVELOPMENT MODE - EMAIL FAILED ===`);
    console.log(`OTP for ${email}: ${otp}`);
    console.log(`Please use this OTP to continue registration`);
    console.log(`=======================================\n`);
    
    // Return success so the registration flow continues
    return { success: true, messageId: 'dev-mode', otp: otp };
  }
};

// Send welcome/registration success email
const sendWelcomeEmail = async (email, name, language = 'en') => {
  try {
    // Email templates in different languages
    const templates = {
      en: {
        subject: 'Welcome to ArthRakshak - Registration Successful!',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2E8B57; margin: 0; font-size: 28px;">🎉 Welcome to ArthRakshak!</h1>
              </div>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear ${name},</p>
              
              <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                Congratulations! Your registration with ArthRakshak has been completed successfully. We're excited to have you join our community of financially empowered individuals.
              </p>
              
              <div style="background-color: #f0f8f0; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2E8B57;">
                <h3 style="color: #2E8B57; margin: 0 0 15px 0; font-size: 18px;">🚀 What's Next?</h3>
                <ul style="color: #333; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Complete your profile to get personalized financial recommendations</li>
                  <li>Explore our financial calculators (EMI, SIP, and more)</li>
                  <li>Take financial literacy quizzes to earn points</li>
                  <li>Chat with our AI financial assistant</li>
                  <li>Set up your financial goals and track progress</li>
                </ul>
              </div>
              
              <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #007bff;">
                <h3 style="color: #007bff; margin: 0 0 15px 0; font-size: 18px;">💡 Pro Tips</h3>
                <ul style="color: #333; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>Enable notifications to stay updated on financial tips</li>
                  <li>Regularly check the fraud alerts section</li>
                  <li>Use our voice assistant for quick financial queries</li>
                  <li>Connect with our financial therapist for personalized guidance</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #2E8B57; color: white; padding: 15px 30px; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">
                  🎯 Start Your Financial Journey Today!
                </div>
              </div>
              
              <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                If you have any questions or need assistance, feel free to reach out to our support team. We're here to help you achieve your financial goals!
              </p>
              
              <p style="font-size: 16px; color: #333; margin-top: 25px;">
                Best regards,<br>
                <strong style="color: #2E8B57;">The ArthRakshak Team</strong><br>
                <em style="color: #666; font-size: 14px;">Your Partner in Financial Wellness</em>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>This email was sent to ${email}. If you didn't create an account, please ignore this email.</p>
            </div>
          </div>
        `
      },
      hi: {
        subject: 'ArthRakshak में आपका स्वागत है - पंजीकरण सफल!',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2E8B57; margin: 0; font-size: 28px;">🎉 ArthRakshak में आपका स्वागत है!</h1>
              </div>
              
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">प्रिय ${name},</p>
              
              <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
                बधाई हो! ArthRakshak के साथ आपका पंजीकरण सफलतापूर्वक पूरा हो गया है। हमें खुशी है कि आप वित्तीय रूप से सशक्त व्यक्तियों के हमारे समुदाय में शामिल हुए हैं।
              </p>
              
              <div style="background-color: #f0f8f0; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2E8B57;">
                <h3 style="color: #2E8B57; margin: 0 0 15px 0; font-size: 18px;">🚀 आगे क्या करें?</h3>
                <ul style="color: #333; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>व्यक्तिगत वित्तीय सुझाव पाने के लिए अपनी प्रोफ़ाइल पूरी करें</li>
                  <li>हमारे वित्तीय कैलकुलेटर (EMI, SIP, और अधिक) का अन्वेषण करें</li>
                  <li>अंक अर्जित करने के लिए वित्तीय साक्षरता प्रश्नोत्तरी लें</li>
                  <li>हमारे AI वित्तीय सहायक से चैट करें</li>
                  <li>अपने वित्तीय लक्ष्य निर्धारित करें और प्रगति ट्रैक करें</li>
                </ul>
              </div>
              
              <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #007bff;">
                <h3 style="color: #007bff; margin: 0 0 15px 0; font-size: 18px;">💡 प्रो टिप्स</h3>
                <ul style="color: #333; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li>वित्तीय सुझावों पर अपडेट रहने के लिए नोटिफिकेशन सक्षम करें</li>
                  <li>नियमित रूप से फ्रॉड अलर्ट सेक्शन देखें</li>
                  <li>त्वरित वित्तीय प्रश्नों के लिए हमारे वॉयस असिस्टेंट का उपयोग करें</li>
                  <li>व्यक्तिगत मार्गदर्शन के लिए हमारे वित्तीय चिकित्सक से जुड़ें</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #2E8B57; color: white; padding: 15px 30px; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px;">
                  🎯 आज ही अपनी वित्तीय यात्रा शुरू करें!
                </div>
              </div>
              
              <p style="font-size: 14px; color: #666; line-height: 1.6; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                यदि आपके कोई प्रश्न हैं या सहायता की आवश्यकता है, तो कृपया हमारी सहायता टीम से संपर्क करने में संकोच न करें। हम आपके वित्तीय लक्ष्यों को प्राप्त करने में आपकी सहायता के लिए यहाँ हैं!
              </p>
              
              <p style="font-size: 16px; color: #333; margin-top: 25px;">
                सादर,<br>
                <strong style="color: #2E8B57;">ArthRakshak टीम</strong><br>
                <em style="color: #666; font-size: 14px;">वित्तीय कल्याण में आपका साझीदार</em>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>यह ईमेल ${email} पर भेजा गया था। यदि आपने खाता नहीं बनाया है, तो कृपया इस ईमेल को अनदेखा करें।</p>
            </div>
          </div>
        `
      }
    };

    const template = templates[language] || templates.en;
    
    if (!emailServiceReady) {
      // Development mode - just log the email
      console.log(`\n=== DEVELOPMENT MODE - WELCOME EMAIL ===`);
      console.log(`Welcome email for ${name} (${email})`);
      console.log(`Subject: ${template.subject}`);
      console.log(`Note: Brevo not configured. Welcome email logged to console.`);
      console.log(`=======================================\n`);
      
      return { success: true, messageId: 'dev-mode', note: 'Brevo not configured. Welcome email logged to console.' };
    }

    // Use Brevo to send email
    const sendSmtpEmail = {
      to: [{ email }],
      sender: { email: process.env.SENDER_EMAIL, name: 'ArthRakshak' },
      subject: template.subject,
      htmlContent: template.htmlContent
    };
    const result = await brevoApiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Welcome email sent successfully via Brevo:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    
    // For development/testing, just log and continue
    console.log(`\n=== DEVELOPMENT MODE - WELCOME EMAIL FAILED ===`);
    console.log(`Welcome email for ${name} (${email}) failed to send`);
    console.log(`Error: ${error.message}`);
    console.log(`=======================================\n`);
    
    // Return success so the registration flow continues
    return { success: true, messageId: 'dev-mode', note: 'Welcome email failed but registration completed' };
  }
};

// Send OTP and store in database
const sendOTP = async (email, language = 'en') => {
  try {
    const otp = generateOTP();
    
    // Store OTP in database first (this should always work)
    const stored = await storeOTP(email, otp);
    if (!stored) {
      return { success: false, message: 'Failed to store OTP in database' };
    }
    
    // Try to send email (this might fail in development)
    const emailResult = await sendOTPEmail(email, otp, language);
    
    // Always return success if OTP is stored, regardless of email status
    if (emailResult.messageId === 'dev-mode') {
      return {
        success: true,
        message: 'OTP generated successfully. Check console for OTP (Development Mode)',
        messageId: emailResult.messageId,
        developmentMode: true,
        otp: otp // Include OTP in development mode
      };
    }
    
    return {
      success: true,
      message: emailResult.success ? 'OTP sent successfully to your email' : 'OTP generated (check console)',
      messageId: emailResult.messageId || 'dev-mode'
    };
  } catch (error) {
    console.error('Error in sendOTP:', error);
    return { success: false, message: 'Failed to generate OTP' };
  }
};

// Clean expired OTPs (should be called periodically)
const cleanExpiredOTPs = async () => {
  try {
    await db.query('DELETE FROM otp_verifications WHERE expires_at < NOW()');
    console.log('Expired OTPs cleaned successfully');
  } catch (error) {
    console.error('Error cleaning expired OTPs:', error);
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  cleanExpiredOTPs,
  generateOTP,
  sendWelcomeEmail
};
