const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

async function testGmailSMTP() {
  console.log('🧪 Testing Gmail SMTP Configuration\n');
  
  try {
    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('❌ SMTP credentials not configured');
      console.log('📝 Please follow the setup guide in GMAIL_SMTP_SETUP.md');
      return;
    }
    
    if (process.env.SMTP_PASS === 'your-gmail-app-password-here') {
      console.log('❌ Gmail App Password not set');
      console.log('📝 Please replace "your-gmail-app-password-here" with your actual Gmail App Password');
      console.log('📖 Follow the guide in GMAIL_SMTP_SETUP.md to generate an App Password');
      return;
    }
    
    console.log('✅ SMTP credentials found');
    console.log(`📧 SMTP User: ${process.env.SMTP_USER}`);
    console.log(`🔑 SMTP Pass: ${process.env.SMTP_PASS.substring(0, 4)}****`);
    
    // Create transporter
    console.log('\n🔧 Creating Gmail SMTP transporter...');
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    // Verify connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ Gmail SMTP connection verified successfully!');
    
    // Send test email
    console.log('\n📤 Sending test OTP email...');
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    const mailOptions = {
      from: `"ArthRakshak" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to yourself for testing
      subject: 'ArthRakshak - Test OTP Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E8B57;">🧪 ArthRakshak Test Email</h2>
          <p>This is a test email to verify Gmail SMTP integration.</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2E8B57; font-size: 32px; margin: 0;">Test OTP: ${testOTP}</h1>
          </div>
          <p>If you receive this email, Gmail SMTP is working correctly!</p>
          <p>✅ Email service is ready for production use.</p>
          <p>Best regards,<br>ArthRakshak Team</p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📬 Check your inbox: ${process.env.SMTP_USER}`);
    
    console.log('\n🎉 Gmail SMTP Setup Complete!');
    console.log('📧 Your email service is now ready to send real emails.');
    console.log('🔄 The system will automatically use Gmail SMTP when Brevo API fails.');
    
  } catch (error) {
    console.error('❌ Gmail SMTP test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Authentication Error Solutions:');
      console.log('1. Ensure 2-Factor Authentication is enabled on your Gmail account');
      console.log('2. Generate a new App Password for "Mail" application');
      console.log('3. Update SMTP_PASS in .env file with the App Password (remove spaces)');
      console.log('4. Restart the server after updating .env');
      console.log('\n📖 Follow the detailed guide in GMAIL_SMTP_SETUP.md');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n🌐 Network Error: Check your internet connection');
    } else {
      console.log('\n🔍 Error Details:', error);
    }
  }
}

// Run the test
if (require.main === module) {
  testGmailSMTP()
    .then(() => {
      console.log('\n✨ Test execution completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { testGmailSMTP };