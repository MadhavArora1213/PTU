const { sendOTP, verifyOTP } = require('./services/emailService');
require('dotenv').config();

async function testOTP() {
  console.log('Testing OTP System...\n');
  
  const testEmail = 'test@example.com';
  
  try {
    // Test sending OTP
    console.log('1. Testing OTP generation and sending...');
    const result = await sendOTP(testEmail, 'en');
    
    if (result.success) {
      console.log('✅ OTP sent successfully!');
      console.log('Message:', result.message);
      console.log('Message ID:', result.messageId);
      
      if (result.developmentMode) {
        console.log('🔧 Development Mode: OTP logged to console');
        console.log('OTP:', result.otp);
        
        // Test OTP verification
        console.log('\n2. Testing OTP verification...');
        const verifyResult = await verifyOTP(testEmail, result.otp);
        
        if (verifyResult.success) {
          console.log('✅ OTP verification successful!');
          console.log('Message:', verifyResult.message);
        } else {
          console.log('❌ OTP verification failed:', verifyResult.message);
        }
      }
    } else {
      console.log('❌ OTP sending failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testOTP();