const dotenv = require('dotenv');
const { sendOTP, verifyOTP, sendWelcomeEmail } = require('./services/emailService');

// Load environment variables
dotenv.config();

async function testEmailService() {
  console.log('🧪 Testing ArthRakshak Email Service with Brevo\n');
  
  // Test email
  const testEmail = 'test@example.com';
  const testName = 'Test User';
  const testLanguage = 'en';
  
  try {
    console.log('📧 Testing OTP Email Service...');
    console.log('================================');
    
    // Test 1: Send OTP
    console.log(`1. Sending OTP to ${testEmail}...`);
    const otpResult = await sendOTP(testEmail, testLanguage);
    console.log('OTP Result:', otpResult);
    
    if (otpResult.success) {
      console.log('✅ OTP sent successfully!');
      
      // In development mode, we can get the OTP from the result
      if (otpResult.developmentMode && otpResult.otp) {
        console.log(`🔑 Development OTP: ${otpResult.otp}`);
        
        // Test 2: Verify OTP
        console.log('\n2. Testing OTP verification...');
        const verifyResult = await verifyOTP(testEmail, otpResult.otp);
        console.log('Verify Result:', verifyResult);
        
        if (verifyResult.success) {
          console.log('✅ OTP verified successfully!');
        } else {
          console.log('❌ OTP verification failed:', verifyResult.message);
        }
      } else {
        console.log('📝 Check your email for the OTP (Production mode)');
      }
    } else {
      console.log('❌ Failed to send OTP:', otpResult.message);
    }
    
    console.log('\n📧 Testing Welcome Email Service...');
    console.log('===================================');
    
    // Test 3: Send Welcome Email
    console.log(`3. Sending welcome email to ${testName} (${testEmail})...`);
    const welcomeResult = await sendWelcomeEmail(testEmail, testName, testLanguage);
    console.log('Welcome Email Result:', welcomeResult);
    
    if (welcomeResult.success) {
      console.log('✅ Welcome email sent successfully!');
    } else {
      console.log('❌ Failed to send welcome email');
    }
    
    console.log('\n🌐 Testing Multi-language Support...');
    console.log('====================================');
    
    // Test 4: Hindi Language Support
    console.log('4. Testing Hindi language support...');
    const hindiOtpResult = await sendOTP('hindi-test@example.com', 'hi');
    console.log('Hindi OTP Result:', hindiOtpResult);
    
    const hindiWelcomeResult = await sendWelcomeEmail('hindi-test@example.com', 'हिंदी उपयोगकर्ता', 'hi');
    console.log('Hindi Welcome Result:', hindiWelcomeResult);
    
    console.log('\n🔧 Email Service Configuration Status:');
    console.log('======================================');
    console.log('Brevo API Key:', process.env.BREVO_API_KEY ? '✅ Configured' : '❌ Not configured');
    console.log('Brevo Sender Email:', process.env.BREVO_SENDER_EMAIL || 'Not set');
    console.log('Brevo Sender Name:', process.env.BREVO_SENDER_NAME || 'Not set');
    console.log('OTP Expiry Minutes:', process.env.OTP_EXPIRY_MINUTES || '10 (default)');
    
    console.log('\n🎉 Email Service Test Completed!');
    console.log('=================================');
    
  } catch (error) {
    console.error('❌ Email service test failed:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
if (require.main === module) {
  testEmailService()
    .then(() => {
      console.log('\n✨ Test execution completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { testEmailService };