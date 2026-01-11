
import React, { useState } from 'react';
import { useAppState } from '../../store';

const AppSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useAppState();
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-8">App Customization</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Application Name</label>
          <input 
            type="text" 
            value={formData.appName} 
            onChange={e => setFormData({...formData, appName: e.target.value})}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">App Icon (Emoji)</label>
          <input 
            type="text" 
            value={formData.appIcon} 
            onChange={e => setFormData({...formData, appIcon: e.target.value})}
            className="mt-1 block w-8 rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 border text-center"
          />
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Enable Features</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">In-app Chat</span>
            <input type="checkbox" checked={formData.featuresEnabled.chat} onChange={e => setFormData({...formData, featuresEnabled: { ...formData.featuresEnabled, chat: e.target.checked }})} className="h-5 w-5 text-blue-600 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Financial Reports</span>
            <input type="checkbox" checked={formData.featuresEnabled.reports} onChange={e => setFormData({...formData, featuresEnabled: { ...formData.featuresEnabled, reports: e.target.checked }})} className="h-5 w-5 text-blue-600 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Payment Management</span>
            <input type="checkbox" checked={formData.featuresEnabled.payments} onChange={e => setFormData({...formData, featuresEnabled: { ...formData.featuresEnabled, payments: e.target.checked }})} className="h-5 w-5 text-blue-600 rounded" />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition">
          Update Application Settings
        </button>
      </form>
    </div>
  );
};

export default AppSettingsPage;
