
import React from 'react';

interface CredentialsInputProps {
  username: string;
  onUsernameChange: (value: string) => void;
  token: string;
  onTokenChange: (value: string) => void;
  disabled: boolean;
}

export default function CredentialsInput({ 
  username, 
  onUsernameChange, 
  token, 
  onTokenChange, 
  disabled 
}: CredentialsInputProps): React.ReactNode {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="github-username" className="block text-sm font-medium text-gray-700 mb-1">
          1. GitHub Username
        </label>
        <input
          type="text"
          id="github-username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g., octocat"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        />
      </div>
      <div>
         <label htmlFor="github-token" className="block text-sm font-medium text-gray-700 mb-1">
          GitHub Personal Access Token
        </label>
        <input
          type="password"
          id="github-token"
          value={token}
          onChange={(e) => onTokenChange(e.target.value)}
          disabled={disabled}
          placeholder="github_pat..."
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
        />
      </div>
    </div>
  );
}