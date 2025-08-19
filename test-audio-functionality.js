/**
 * Audio Functionality Test Script
 * Tests the unified audio system implementation
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const testConfig = {
  audioBasePath: './frontend/assets',
  supportedLanguages: ['en', 'hi', 'pa'],
  audioTypes: ['employment', 'investment', 'banking', 'quiz'],
  expectedFiles: {
    employment: ['intro.mp3', 'job_posting.mp3', 'application.mp3', 'fee_request.mp3', 'scam_revealed.mp3', 'results.mp3'],
    investment: ['intro.mp3', 'fake_platform.mp3', 'investment.mp3', 'fake_returns.mp3', 'social_proof.mp3', 'withdrawal_trap.mp3', 'scam_revealed.mp3', 'results.mp3'],
    banking: ['bank1_en.mp3', 'bank2_en.mp3', 'bank3_en.mp3', 'bank4_en.mp3', 'bank5_en.mp3'],
    quiz: ['ponzi1_en.mp3', 'ponzi2_en.mp3', 'ponzi3_en.mp3', 'ponzi4_en.mp3', 'ponzi5_en.mp3']
  }
};

class AudioFunctionalityTester {
  constructor() {
    this.results = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      errors: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  test(description, testFn) {
    this.results.totalTests++;
    try {
      const result = testFn();
      if (result) {
        this.results.passedTests++;
        this.log(`${description} - PASSED`, 'success');
      } else {
        this.results.failedTests++;
        this.log(`${description} - FAILED`, 'error');
      }
    } catch (error) {
      this.results.failedTests++;
      this.results.errors.push({ test: description, error: error.message });
      this.log(`${description} - ERROR: ${error.message}`, 'error');
    }
  }

  checkDirectoryExists(dirPath) {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  }

  checkFileExists(filePath) {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  }

  testAudioAssetStructure() {
    this.log('Testing Audio Asset Directory Structure...', 'info');
    
    // Test base directory
    this.test('Base audio directory exists', () => {
      return this.checkDirectoryExists(testConfig.audioBasePath);
    });

    // Test language-specific directories for employment and investment
    testConfig.supportedLanguages.forEach(lang => {
      this.test(`Employment audio directory exists for ${lang}`, () => {
        return this.checkDirectoryExists(path.join(testConfig.audioBasePath, 'employment', lang));
      });

      this.test(`Investment audio directory exists for ${lang}`, () => {
        return this.checkDirectoryExists(path.join(testConfig.audioBasePath, lang));
      });

      this.test(`Banking audio directory exists for ${lang}`, () => {
        return this.checkDirectoryExists(path.join(testConfig.audioBasePath, 'banking', lang));
      });

      this.test(`Quiz audio directory exists for ${lang}`, () => {
        return this.checkDirectoryExists(path.join(testConfig.audioBasePath, 'quiz', lang));
      });
    });
  }

  testAudioFiles() {
    this.log('Testing Audio File Availability...', 'info');

    // Test employment fraud audio files
    testConfig.supportedLanguages.forEach(lang => {
      testConfig.expectedFiles.employment.forEach(file => {
        this.test(`Employment audio file exists: ${lang}/${file}`, () => {
          const filePath = path.join(testConfig.audioBasePath, 'employment', lang, file);
          return this.checkFileExists(filePath);
        });
      });
    });

    // Test investment fraud audio files
    testConfig.supportedLanguages.forEach(lang => {
      testConfig.expectedFiles.investment.forEach(file => {
        this.test(`Investment audio file exists: ${lang}/${file}`, () => {
          const filePath = path.join(testConfig.audioBasePath, lang, file);
          return this.checkFileExists(filePath);
        });
      });
    });

    // Test banking quiz audio files
    testConfig.supportedLanguages.forEach(lang => {
      for (let i = 1; i <= 5; i++) {
        this.test(`Banking audio file exists: ${lang}/bank${i}_${lang}.mp3`, () => {
          const filePath = path.join(testConfig.audioBasePath, 'banking', lang, `bank${i}_${lang}.mp3`);
          return this.checkFileExists(filePath);
        });
      }
    });

    // Test ponzi quiz audio files
    testConfig.supportedLanguages.forEach(lang => {
      for (let i = 1; i <= 5; i++) {
        this.test(`Ponzi quiz audio file exists: ${lang}/ponzi${i}_${lang}.mp3`, () => {
          const filePath = path.join(testConfig.audioBasePath, 'quiz', lang, `ponzi${i}_${lang}.mp3`);
          return this.checkFileExists(filePath);
        });
      }
    });
  }

  testUnifiedAudioContext() {
    this.log('Testing Unified Audio Context Implementation...', 'info');

    // Test if UnifiedAudioContext file exists
    this.test('UnifiedAudioContext.js file exists', () => {
      return this.checkFileExists('./frontend/context/UnifiedAudioContext.js');
    });

    // Test if audio context is properly structured
    this.test('UnifiedAudioContext has proper structure', () => {
      const contextPath = './frontend/context/UnifiedAudioContext.js';
      if (!this.checkFileExists(contextPath)) return false;

      const content = fs.readFileSync(contextPath, 'utf-8');
      
      // Check for essential components
      const hasCreateContext = content.includes('createContext');
      const hasUseContext = content.includes('useContext');
      const hasAudioAssets = content.includes('audioAssets');
      const hasPlayAudio = content.includes('playAudio');
      const hasStopAudio = content.includes('stopAudio');
      const hasUnifiedAudioProvider = content.includes('UnifiedAudioProvider');

      return hasCreateContext && hasUseContext && hasAudioAssets && 
             hasPlayAudio && hasStopAudio && hasUnifiedAudioProvider;
    });
  }

  testScreenIntegrations() {
    this.log('Testing Screen Integrations...', 'info');

    const screens = [
      'EmploymentFraudSimulation.js',
      'InvestmentFraudSimulation.js',
      'BankingQuizScreen.js',
      'public/PonziQuizScreen.js'
    ];

    screens.forEach(screen => {
      this.test(`${screen} uses UnifiedAudio`, () => {
        const screenPath = `./frontend/screens/${screen}`;
        if (!this.checkFileExists(screenPath)) return false;

        const content = fs.readFileSync(screenPath, 'utf-8');
        return content.includes('useUnifiedAudio') && content.includes('UnifiedAudio');
      });
    });

    // Test App.js has UnifiedAudioProvider
    this.test('App.js includes UnifiedAudioProvider', () => {
      const appPath = './frontend/App.js';
      if (!this.checkFileExists(appPath)) return false;

      const content = fs.readFileSync(appPath, 'utf-8');
      return content.includes('UnifiedAudioProvider');
    });
  }

  generateReport() {
    this.log('='.repeat(60), 'info');
    this.log('AUDIO FUNCTIONALITY TEST REPORT', 'info');
    this.log('='.repeat(60), 'info');
    this.log(`Total Tests: ${this.results.totalTests}`, 'info');
    this.log(`Passed: ${this.results.passedTests}`, 'success');
    this.log(`Failed: ${this.results.failedTests}`, 'error');
    this.log(`Success Rate: ${((this.results.passedTests / this.results.totalTests) * 100).toFixed(1)}%`, 'info');

    if (this.results.errors.length > 0) {
      this.log('', 'info');
      this.log('ERRORS ENCOUNTERED:', 'error');
      this.results.errors.forEach((error, index) => {
        this.log(`${index + 1}. ${error.test}: ${error.error}`, 'error');
      });
    }

    this.log('', 'info');
    if (this.results.failedTests === 0) {
      this.log('🎉 ALL TESTS PASSED! Audio system is working correctly.', 'success');
    } else if (this.results.failedTests < this.results.totalTests * 0.1) {
      this.log('✨ MOSTLY SUCCESSFUL! Minor issues detected.', 'warning');
    } else {
      this.log('🔧 ISSUES DETECTED! Audio system needs attention.', 'error');
    }
    this.log('='.repeat(60), 'info');
  }

  runAllTests() {
    this.log('Starting Audio Functionality Tests...', 'info');
    this.log('', 'info');

    this.testAudioAssetStructure();
    this.testAudioFiles();
    this.testUnifiedAudioContext();
    this.testScreenIntegrations();

    this.generateReport();
  }
}

// Run the tests
const tester = new AudioFunctionalityTester();
tester.runAllTests();