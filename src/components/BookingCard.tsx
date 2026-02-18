import { Calendar, Clock, Scale, User, Video, CheckCircle, FileText } from 'lucide-react';
import { Card, CardBody } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { BookingWithDetails } from '../hooks/useBookings';

interface BookingCardProps {
  booking: BookingWithDetails;
  userType: 'user' | 'lawyer';
  onCancel?: (id: string) => void;
  onConfirm?: (id: string) => void;
  onComplete?: (id: string) => void;
  onJoin?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onAcceptTakeover?: (id: string) => void;
  onRejectTakeover?: (id: string) => void;
}

const statusVariant = {
  pending: 'warning' as const,
  confirmed: 'info' as const,
  completed: 'success' as const,
  cancelled: 'default' as const,
};

export function BookingCard({
  booking,
  userType,
  onCancel,
  onConfirm,
  onComplete,
  onJoin,
  onReschedule,
  onAcceptTakeover,
  onRejectTakeover
}: BookingCardProps) {
  const isPast = booking.start_time ? new Date(booking.start_time) < new Date() : false;
  const showJoin = booking.status === 'confirmed' && !isPast; // Simplified logic for join button

  // Format date and time
  const startTime = booking.start_time ? new Date(booking.start_time) : new Date(booking.created_at); // Fallback
  const endTime = new Date(startTime.getTime() + booking.duration_minutes * 60000);

  const dateStr = startTime.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const timeStr = `${startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;

  return (
    <Card className="hover:border-primary-200 transition-colors duration-200 overflow-hidden">

      {/* Takeover Request Banner */}
      {userType === 'user' && booking.file_takeover_status === 'requested' && (
        <div className="bg-amber-50 border-b border-amber-100 p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-amber-800">
             <FileText className="w-4 h-4" />
             <span className="font-semibold">File Access Requested:</span>
             <span>This lawyer has requested access to view your documents.</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
             {onRejectTakeover && (
                <Button size="sm" variant="outline" className="flex-1 sm:flex-none border-amber-200 hover:bg-amber-100 text-amber-900" onClick={() => onRejectTakeover(booking.id)}>
                   Reject
                </Button>
             )}
             {onAcceptTakeover && (
                <Button size="sm" className="flex-1 sm:flex-none bg-amber-600 hover:bg-amber-700 text-white border-transparent" onClick={() => onAcceptTakeover(booking.id)}>
                   Accept Access
                </Button>
             )}
          </div>
        </div>
      )}

      {/* Access Granted Banner */}
      {userType === 'user' && booking.file_takeover_status === 'accepted' && (
         <div className="bg-emerald-50 border-b border-emerald-100 p-1.5 flex items-center justify-center text-xs font-medium text-emerald-700">
             <CheckCircle className="w-3 h-3 mr-1.5" />
             Document access granted
         </div>
      )}

      <CardBody className="p-0">
        <div className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${userType === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-secondary-100 text-secondary-600'}`}>
              {userType === 'user' ? <Scale className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                {userType === 'user' ? booking.lawyer_name || 'Unknown Lawyer' : booking.user_name || 'Unknown Client'}
              </p>
              <p className="text-xs text-neutral-500">
                {userType === 'user' ? booking.lawyer_jurisdiction : booking.user_phone || 'No phone'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
             <Badge variant={statusVariant[booking.status]}>{booking.status}</Badge>
             <span className="text-sm font-semibold text-neutral-900">
               ${(booking.total_price_cents / 100).toFixed(0)}
             </span>
          </div>
        </div>

        <div className="p-4 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span>{timeStr}</span>
            </div>
            {booking.notes && (
              <div className="w-full sm:w-auto mt-2 sm:mt-0 p-2 bg-white rounded border border-neutral-200 text-xs italic text-neutral-500 max-w-md">
                "{booking.notes}"
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            {/* User Actions */}
            {userType === 'user' && (
              <>
                {booking.status === 'confirmed' && showJoin && onJoin && (
                  <Button size="sm" onClick={() => onJoin(booking.id)}>
                    <Video className="w-4 h-4 mr-1.5" />
                    Join Call
                  </Button>
                )}
                {(booking.status === 'pending' || booking.status === 'confirmed') && !isPast && onReschedule && (
                   <Button variant="secondary" size="sm" onClick={() => onReschedule(booking.id)}>
                     Reschedule
                   </Button>
                )}
                {(booking.status === 'pending' || booking.status === 'confirmed') && !isPast && onCancel && (
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onCancel(booking.id)}>
                    Cancel
                  </Button>
                )}
              </>
            )}

            {/* Lawyer Actions */}
            {userType === 'lawyer' && (
              <>
                {booking.status === 'pending' && onConfirm && (
                  <Button size="sm" onClick={() => onConfirm(booking.id)}>
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Confirm
                  </Button>
                )}
                {booking.status === 'confirmed' && !isPast && onComplete && (
                   <Button size="sm" variant="secondary" onClick={() => onComplete(booking.id)}>
                     Mark Complete
                   </Button>
                )}
                 {(booking.status === 'pending' || booking.status === 'confirmed') && !isPast && onCancel && (
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onCancel(booking.id)}>
                    Cancel
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
