import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types/database';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAuth();
  const isMe = user?.id === message.sender_id;

  return (
    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm break-words shadow-sm ${
          isMe
            ? 'bg-primary-600 text-white rounded-tr-sm'
            : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-tl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.message_text}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-primary-100' : 'text-neutral-400 dark:text-neutral-500'}`}>
          <span>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMe && (
            <span>
              {message.is_read ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
