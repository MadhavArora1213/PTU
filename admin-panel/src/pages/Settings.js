import React, { useState } from 'react';
import { Save, Shield, Bell, Globe, Database } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    appName: 'Fraud Protection App',
    appVersion: '1.0.0',
    maintenanceMode: false,
    
    // Security Settings
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireTwoFactor: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    
    // Language Settings
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'hi', 'pa'],
    
    // Database Settings
    backupFrequency: 'daily',
    dataRetentionDays: 365,
    
    // Education Module Settings
    maxTutorialAttempts: 3,
    quizPassingScore: 70,
    enableProgressTracking: true,
    
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In real implementation, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Icon className="h-5 w-5 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, type = 'text', value, onChange, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        {...props}
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const CheckboxField = ({ label, checked, onChange }) => (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
      />
      <label className="ml-2 block text-sm text-gray-700">
        {label}
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your application settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingSection title="General Settings" icon={Globe}>
          <InputField
            label="Application Name"
            value={settings.appName}
            onChange={(value) => handleChange('general', 'appName', value)}
          />
          <InputField
            label="Application Version"
            value={settings.appVersion}
            onChange={(value) => handleChange('general', 'appVersion', value)}
          />
          <CheckboxField
            label="Maintenance Mode"
            checked={settings.maintenanceMode}
            onChange={(value) => handleChange('general', 'maintenanceMode', value)}
          />
        </SettingSection>

        <SettingSection title="Security Settings" icon={Shield}>
          <InputField
            label="Session Timeout (minutes)"
            type="number"
            value={settings.sessionTimeout}
            onChange={(value) => handleChange('security', 'sessionTimeout', parseInt(value))}
          />
          <InputField
            label="Max Login Attempts"
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(value) => handleChange('security', 'maxLoginAttempts', parseInt(value))}
          />
          <CheckboxField
            label="Require Two-Factor Authentication"
            checked={settings.requireTwoFactor}
            onChange={(value) => handleChange('security', 'requireTwoFactor', value)}
          />
        </SettingSection>

        <SettingSection title="Notification Settings" icon={Bell}>
          <CheckboxField
            label="Email Notifications"
            checked={settings.emailNotifications}
            onChange={(value) => handleChange('notifications', 'emailNotifications', value)}
          />
          <CheckboxField
            label="Push Notifications"
            checked={settings.pushNotifications}
            onChange={(value) => handleChange('notifications', 'pushNotifications', value)}
          />
          <CheckboxField
            label="SMS Notifications"
            checked={settings.smsNotifications}
            onChange={(value) => handleChange('notifications', 'smsNotifications', value)}
          />
        </SettingSection>

        <SettingSection title="Database Settings" icon={Database}>
          <SelectField
            label="Backup Frequency"
            value={settings.backupFrequency}
            onChange={(value) => handleChange('database', 'backupFrequency', value)}
            options={[
              { value: 'hourly', label: 'Hourly' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' }
            ]}
          />
          <InputField
            label="Data Retention (days)"
            type="number"
            value={settings.dataRetentionDays}
            onChange={(value) => handleChange('database', 'dataRetentionDays', parseInt(value))}
          />
        </SettingSection>

        <SettingSection title="Education Module" icon={Globe}>
          <InputField
            label="Max Tutorial Attempts"
            type="number"
            value={settings.maxTutorialAttempts}
            onChange={(value) => handleChange('education', 'maxTutorialAttempts', parseInt(value))}
          />
          <InputField
            label="Quiz Passing Score (%)"
            type="number"
            value={settings.quizPassingScore}
            onChange={(value) => handleChange('education', 'quizPassingScore', parseInt(value))}
          />
          <CheckboxField
            label="Enable Progress Tracking"
            checked={settings.enableProgressTracking}
            onChange={(value) => handleChange('education', 'enableProgressTracking', value)}
          />
        </SettingSection>

      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
        >
          <Save className="h-5 w-5 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default Settings;