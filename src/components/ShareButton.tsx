import { useState, useRef, useEffect } from 'react';
import { Share2, Link as LinkIcon, Twitter, Linkedin, Facebook } from 'lucide-react';
import { useToast } from './ui/Toast';

interface ShareButtonProps {
  url?: string;
  title?: string;
  className?: string;
}

export function ShareButton({ url, title, className = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check this out!';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast('success', 'Link copied to clipboard');
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast('error', 'Failed to copy link');
    }
  };

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-sky-500',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-700',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-600',
    },
  ];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
        aria-label="Share"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-neutral-700 z-50 transform origin-top-right transition-all duration-200 ease-out animate-in fade-in zoom-in-95"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="p-1" role="none">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors group"
              role="menuitem"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center mr-3 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-600 transition-colors">
                <LinkIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
              </div>
              <span className="font-medium">Copy Link</span>
            </button>

            <div className="h-px bg-neutral-100 dark:bg-neutral-700 my-1 mx-2" />

            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg transition-colors group ${link.color}`}
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center mr-3 group-hover:bg-white dark:group-hover:bg-neutral-600 group-hover:shadow-sm transition-all">
                  <link.icon className="w-4 h-4" />
                </div>
                <span className="font-medium">Share on {link.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
