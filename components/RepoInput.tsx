
import React from 'react';

interface RepoInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export default function RepoInput({ value, onChange, disabled }: RepoInputProps): React.ReactNode {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitize input to match GitHub repo naming rules (alphanumeric, hyphens, underscores, periods)
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9-._]/g, '');
    onChange(sanitizedValue);
  };
    
  return (
    <div>
      <label htmlFor="repo-name" className="block text-sm font-medium text-gray-700 mb-1">
        3. New Repository Name
      </label>
      <input
        type="text"
        id="repo-name"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        placeholder="e.g., my-awesome-project"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        required
      />
    </div>
  );
}