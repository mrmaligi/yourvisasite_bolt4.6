import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { UserDocument } from '../types/database';

export function useDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!user) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (fetchError) throw fetchError;
      setDocuments(data || []);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setLoading(false);
    }
  }, [user, fetchDocuments]);

  const uploadDocument = async (file: File) => {
    if (!user) return { data: null, error: new Error('Not authenticated') };

    setLoading(true);
    try {
      // Path: documents/{userId}/{filename}
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${user.id}/${timestamp}_${sanitizedName}`;

      // 1. Upload to Storage
      // Using 'documents' bucket as per prompt "Supabase DB has: ... storage bucket documents"
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Insert into DB
      const { data, error: insertError } = await supabase
        .from('user_documents')
        .insert([
          {
            user_id: user.id,
            file_name: file.name,
            file_path: filePath,
          },
        ])
        .select()
        .single();

      if (insertError) {
        // Cleanup storage if DB insert fails
        await supabase.storage.from('documents').remove([filePath]);
        throw insertError;
      }

      setDocuments((prev) => [data, ...prev]);
      return { data, error: null };
    } catch (err: any) {
      console.error('Error uploading document:', err);
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (doc: UserDocument) => {
    if (!user) return { error: new Error('Not authenticated') };

    setLoading(true);
    try {
      // 1. Remove from Storage
      if (doc.file_path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([doc.file_path]);

        if (storageError) {
          console.warn('Error removing from storage (might be already gone):', storageError);
        }
      }

      // 2. Remove from DB
      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', doc.id)
        .eq('user_id', user.id);

      if (dbError) throw dbError;

      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      return { error: null };
    } catch (err: any) {
      console.error('Error removing document:', err);
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const getDocumentUrl = async (path: string) => {
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, 300); // 5 minutes
    return data?.signedUrl;
  };

  return {
    documents,
    uploadDocument,
    deleteDocument,
    getDocumentUrl,
    loading,
    error,
    refresh: fetchDocuments
  };
}
