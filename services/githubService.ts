
import JSZip from 'jszip';
import { Octokit } from '@octokit/core';
import { UploadStatus } from '../types';
import type { StatusUpdate, FileForUpload } from '../types';

interface UploadParams {
  file: File;
  repoName: string;
  username: string;
  token: string;
  onStatusUpdate: (update: StatusUpdate) => void;
}

// Helper to read file as ArrayBuffer
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

// Main service function
export const uploadToGitHub = async ({ file, repoName, username, token, onStatusUpdate }: UploadParams): Promise<string> => {
  // Sanitize repo name to lowercase to avoid case-sensitivity issues
  const sanitizedRepoName = repoName.toLowerCase();
  
  const octokit = new Octokit({ auth: token });

  // Step 1: Unzip the file
  onStatusUpdate({ status: UploadStatus.PROCESSING, message: 'Reading and unzipping file...' });
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const zip = await JSZip.loadAsync(arrayBuffer);
  const filesForUpload: FileForUpload[] = [];

  const zipEntries = Object.values(zip.files).filter(entry => !entry.dir);
  for (const zipEntry of zipEntries) {
    const content = await zipEntry.async('base64');
    filesForUpload.push({ path: zipEntry.name, content });
  }

  if (filesForUpload.length === 0) {
    throw new Error('The ZIP file is empty or contains no files.');
  }

  // Step 2: Create the repository, initialized with a README
  onStatusUpdate({ status: UploadStatus.PROCESSING, message: `Creating new repository: ${sanitizedRepoName}...` });
  
  let repoUrl = '';
  try {
    const response = await octokit.request('POST /user/repos', {
      name: sanitizedRepoName,
      private: false,
      auto_init: true, // Let GitHub create the first commit
    });
    repoUrl = response.data.html_url;
  } catch(error: any) {
    if (error.status === 422) {
      throw new Error(`Repository '${sanitizedRepoName}' already exists or name is invalid.`);
    }
    throw new Error(`Failed to create repository: ${error.message}`);
  }

  // Step 3: Get the latest commit SHA and tree SHA from the main branch
  onStatusUpdate({ status: UploadStatus.PROCESSING, message: 'Fetching initial commit from new repository...' });
  const refData = await octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
    owner: username,
    repo: sanitizedRepoName,
    ref: 'heads/main',
  });

  const parentCommitSha = refData.data.object.sha;
  
  const commitData = await octokit.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', {
      owner: username,
      repo: sanitizedRepoName,
      commit_sha: parentCommitSha,
  });
  const baseTreeSha = commitData.data.tree.sha;

  // Step 4: Create a blob for each file.
  const treeItems = [];
  for (let i = 0; i < filesForUpload.length; i++) {
    const fileToUpload = filesForUpload[i];
    onStatusUpdate({
      status: UploadStatus.PROCESSING,
      message: `Uploading file ${i + 1}/${filesForUpload.length}: ${fileToUpload.path}`,
    });

    const blob = await octokit.request('POST /repos/{owner}/{repo}/git/blobs', {
      owner: username,
      repo: sanitizedRepoName,
      content: fileToUpload.content,
      encoding: 'base64',
    });
    
    treeItems.push({
      path: fileToUpload.path,
      mode: '100644' as const,
      type: 'blob' as const,
      sha: blob.data.sha,
    });
  }

  // Step 5: Create the Git tree, using the initial commit's tree as a base
  onStatusUpdate({ status: UploadStatus.PROCESSING, message: 'Building git tree from files...' });
  const tree = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
    owner: username,
    repo: sanitizedRepoName,
    base_tree: baseTreeSha,
    tree: treeItems,
  });

  // Step 6: Create the new commit with the initial commit as parent
  onStatusUpdate({ status: UploadStatus.PROCESSING, message: 'Creating new commit for uploaded files...' });
  const commit = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
    owner: username,
    repo: sanitizedRepoName,
    message: 'Initial commit from ZIP upload',
    tree: tree.data.sha,
    parents: [parentCommitSha],
  });
  
  // Step 7: Update the main branch to point to our new commit
  onStatusUpdate({ status: UploadStatus.PROCESSING, message: 'Finalizing main branch...' });
  await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
    owner: username,
    repo: sanitizedRepoName,
    ref: 'heads/main',
    sha: commit.data.sha,
  });

  return repoUrl;
};