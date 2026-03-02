import { supabase } from './supabase';

export const BUCKETS = {
  LAWYER_CREDENTIALS: 'lawyer-credentials',
  DOCUMENTS: 'documents',
} as const;

export interface UploadOptions {
  bucket: string;
  path: string;
  file: File;
  onProgress?: (progress: number) => void;
}

export const validateFile = (file: File, options: { maxSizeMB?: number; allowedTypes?: string[] } = {}) => {
  const maxSize = (options.maxSizeMB || 10) * 1024 * 1024; // Default 10MB
  const allowedTypes = options.allowedTypes || ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${options.maxSizeMB || 10}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Allowed types: ' + allowedTypes.join(', '));
  }
  return true;
};

export const uploadFile = async ({ bucket, path, file, onProgress }: UploadOptions) => {
  try {
    // 1. Create a signed upload URL
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) throw error;
    if (!data?.signedUrl) throw new Error('Failed to create upload URL');

    // 2. Upload using XMLHttpRequest to track progress
    return new Promise<{ path: string; fullPath: string }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', data.signedUrl);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ path, fullPath: `${bucket}/${path}` });
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during upload'));
      };

      xhr.send(file);
    });

  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getFileUrl = async (bucket: string, path: string, expiresIn = 300) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
};

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
  return true;
};
