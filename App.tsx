
import React, { useState, useCallback } from 'react';
import { UploadStatus } from './types';
import type { StatusUpdate } from './types';
import { uploadToGitHub } from './services/githubService';
import FileUpload from './components/FileUpload';
import RepoInput from './components/RepoInput';
import CredentialsInput from './components/CredentialsInput';
import StatusBar from './components/StatusBar';
import GithubIcon from './components/icons/GithubIcon';
import SpinnerIcon from './components/icons/SpinnerIcon';

export default function App(): React.ReactNode {
  const [file, setFile] = useState<File | null>(null);
  const [repoName, setRepoName] = useState('');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<UploadStatus>(UploadStatus.IDLE);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to start.');
  const [githubUrl, setGithubUrl] = useState<string | null>(null);

  const handleStatusUpdate = useCallback((update: StatusUpdate) => {
    setStatus(update.status);
    setStatusMessage(update.message);
  }, []);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !repoName || !token || !username) {
      handleStatusUpdate({
        status: UploadStatus.ERROR,
        message: 'Please provide credentials, select a file, and enter a repository name.',
      });
      return;
    }
    
    setGithubUrl(null);
    setStatus(UploadStatus.PROCESSING);

    try {
      const url = await uploadToGitHub({
        file,
        repoName,
        username,
        token,
        onStatusUpdate: handleStatusUpdate,
      });
      setGithubUrl(url);
      handleStatusUpdate({
        status: UploadStatus.SUCCESS,
        message: 'Successfully created repository and uploaded files!',
      });
    } catch (error) {
      console.error(error);
      handleStatusUpdate({
        status: UploadStatus.ERROR,
        message: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    }
  };
  
  const isProcessing = status === UploadStatus.PROCESSING;
  const canSubmit = file && repoName && username && token && !isProcessing;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <header className="p-6 bg-primary text-white flex items-center gap-4 border-b-4 border-accent">
          <GithubIcon className="w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold">GitHub ZIP Uploader</h1>
            <p className="text-gray-300">Upload and unzip a project directly to a new repository.</p>
          </div>
        </header>

        <main className="p-6 md:p-8">
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 mb-6 rounded-md" role="alert">
            <p className="font-bold">Important Notice: Fine-Grained Token Permissions</p>
            <p className="text-sm mt-1">
              For this app to work correctly, please ensure your Personal Access Token has the following <span className="font-semibold">repository permissions</span> for the selected user/organization:
            </p>
            <ul className="list-disc list-inside text-sm mt-2">
              <li><span className="font-semibold">Contents:</span> Read and write</li>
              <li><span className="font-semibold">Administration:</span> Read and write (to create repositories)</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <CredentialsInput 
              username={username}
              onUsernameChange={setUsername}
              token={token}
              onTokenChange={setToken}
              disabled={isProcessing}
            />
            <FileUpload onFileSelect={handleFileSelect} disabled={isProcessing} />
            <RepoInput value={repoName} onChange={setRepoName} disabled={isProcessing} />
            
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <SpinnerIcon className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Create Repository & Upload Files'
              )}
            </button>
          </form>
        </main>
        
        <footer className="p-6 bg-gray-50 border-t border-gray-200">
           <StatusBar status={status} message={statusMessage} githubUrl={githubUrl} />
        </footer>
      </div>
       <p className="text-center text-gray-500 text-xs mt-4">
        &copy;2025 Di Buat untuk Mempermudah Pengguna. Hak cipta Dilindungi ❤️by NA
      </p>
    </div>
  );
}