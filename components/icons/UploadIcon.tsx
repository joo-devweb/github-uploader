
import React from 'react';

export default function UploadIcon({ className }: { className?: string }): React.ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h18v-3.75m-18 0V12a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 12v5.25"
      />
    </svg>
  );
}
