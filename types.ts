
export enum UploadStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface StatusUpdate {
  status: UploadStatus;
  message: string;
}

export interface FileForUpload {
  path: string;
  content: string; // Base64 encoded content
}
