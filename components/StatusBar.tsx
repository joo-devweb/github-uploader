
import React from 'react';
import { UploadStatus } from '../types';
import SpinnerIcon from './icons/SpinnerIcon';

interface StatusBarProps {
  status: UploadStatus;
  message: string;
  githubUrl: string | null;
}

const statusStyles = {
  [UploadStatus.IDLE]: {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300'
  },
  [UploadStatus.PROCESSING]: {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300'
  },
  [UploadStatus.SUCCESS]: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300'
  },
  [UploadStatus.ERROR]: {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300'
  }
};

export default function StatusBar({ status, message, githubUrl }: StatusBarProps): React.ReactNode {
  const styles = statusStyles[status];
  
  return (
    <div>
       <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
        <div className={`p-4 rounded-md border ${styles.borderColor} ${styles.bgColor} ${styles.textColor}`}>
            <div className="flex items-center">
                 {status === UploadStatus.PROCESSING && <SpinnerIcon className="w-5 h-5 mr-3 animate-spin" />}
                <div className="flex-1">
                    <p className="text-sm font-medium">
                        {message}
                    </p>
                    {status === UploadStatus.SUCCESS && githubUrl && (
                        <a 
                            href={githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-green-900 hover:underline mt-1 block"
                        >
                            View Repository on GitHub &rarr;
                        </a>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
