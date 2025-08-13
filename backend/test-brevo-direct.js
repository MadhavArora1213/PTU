const dotenv = require('dotenv');
dotenv.config();

async function testBrevoDirectly() {
  console.log('🧪 Testing Brevo API directly...\n');
  
  try {
    console.log('1. Loading Brevo package...');
    const brevo = require('@getbrevo/brevo');
    console.log('✅ Brevo package loaded successfully');
    
    console.log('2. Configuring API client...');
    const defaultClient = brevo.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    console.log('✅ API key configured');
    
    console.log('3. Creating TransactionalEmailsApi instance...');
    const apiInstance = new brevo.TransactionalEmailsApi();
    console.log('✅ API instance created');
    
    console.log('4. Preparing test email...');
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = 'Test Email from ArthRakshak';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2E8B57;">ArthRakshak Test Email</h2>
        <p>This is a test email to verify Brevo integration.</p>
        <p>If you receive this email, the integration is working correctly!</p>
        <p>Best regards,<br>ArthRakshak Team</p>
      </div>
    `;
    sendSmtpEmail.sender = {
      name: process.env.BREVO_SENDER_NAME || 'ArthRakshak',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@arthrakshak.com'
    };
    sendSmtpEmail.to = [{ 
      email: 'test@example.com',
      name: 'Test User'
    }];
    
    console.log('5. Sending test email...');
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent successfully!');
    console.log('Result:', result);
    
    console.log('\n🎉 Brevo API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Brevo API test failed:', error.message);
    console.error('Error details:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
if (require.main === module) {
  testBrevoDirectly()
    .then(() => {
      console.log('\n✨ Test execution completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { testBrevoDirectly };