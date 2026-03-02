import { useState, type DragEvent, type ChangeEvent, useId } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMb?: number;
  uploading?: boolean;
  progress?: number;
  className?: string;
  compact?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMb = 10,
  uploading = false,
  progress = 0,
  className = '',
  compact = false,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputId = useId();
  const errorId = `${inputId}-error`;

  const validate = (file: File): boolean => {
    setError(null);
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File size exceeds ${maxSizeMb}MB limit`);
      return false;
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, JPG, and PNG files are accepted');
      return false;
    }
    return true;
  };

  const handleFile = (file: File) => {
    if (validate(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={inputId}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative block border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 min-h-[44px]
          ${dragOver ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'}
          ${uploading ? 'pointer-events-none opacity-60' : 'active:scale-[0.99]'}
          ${compact ? 'p-3 flex items-center justify-center gap-2' : 'p-8'}
          focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2
        `}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="sr-only"
        />
        {compact ? (
            <>
                <Upload className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-500 font-medium">Drop file or click to upload</span>
            </>
        ) : (
            <>
                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-neutral-700">
                Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                PDF, JPG, PNG up to {maxSizeMb}MB
                </p>
            </>
        )}
      </label>

      {selectedFile && !error && (
        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
          <File className="w-5 h-5 text-neutral-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-700 truncate">{selectedFile.name}</p>
            <p className="text-xs text-neutral-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>
          {uploading ? (
            <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : (
            <button
              type="button"
              aria-label="Remove file"
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
              className="p-1 rounded hover:bg-neutral-200"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          )}
        </div>
      )}

      {error && (
        <div id={errorId} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-700" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
