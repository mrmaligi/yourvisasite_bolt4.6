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
    fetchDocuments();
  }, [fetchDocuments]);

  const upload = async (file: File, categoryId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    setLoading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${user.id}/${fileName}`;

      // 1. Upload to Storage
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
            category_id: categoryId,
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type,
            status: 'pending',
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

  const remove = async (id: string, filePath: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    setLoading(true);
    try {
      // 1. Remove from Storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) {
        console.warn('Error removing from storage (might be already gone):', storageError);
      }

      // 2. Remove from DB
      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (dbError) throw dbError;

      setDocuments((prev) => prev.filter((d) => d.id !== id));
      return { error: null };
    } catch (err: any) {
      console.error('Error removing document:', err);
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  return { documents, upload, remove, loading, error, refresh: fetchDocuments };
}
