import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface UserMenuProps {
  variant?: 'default' | 'light';
}

export function UserMenu({ variant = 'default' }: UserMenuProps) {
  const { user, profile, role, signOut, isLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'lawyer') return '/lawyer';
    return '/dashboard';
  };

  const isLight = variant === 'light';

  if (isLoading) {
    return <div className="w-8 h-8 bg-navy-500 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link to="/login">
        <Button size="sm" variant={isLight ? 'accent' : 'primary'}>Sign In</Button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-2.5 px-3 py-1.5 transition-all duration-200 ${
          isLight 
            ? 'hover:bg-navy-700 text-white' 
            : 'hover:bg-neutral-100 text-neutral-700'
        }`}
      >
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-8 h-8 object-cover ring-2 ring-gold-500" />
        ) : (
          <div className="w-8 h-8 bg-gold-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className={`text-sm font-medium max-w-[120px] truncate hidden md:block ${
          isLight ? 'text-white' : 'text-neutral-700'
        }`}>
          {profile?.full_name || 'User'}
        </span>
        
        {role && role !== 'user' && (
          <span className={`hidden md:block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${
            role === 'admin'
              ? 'bg-gold-500 text-white'
              : 'bg-navy-400 text-white'
          }`}>
            {role}
          </span>
        )}
        
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
          isLight ? 'text-navy-200' : 'text-neutral-400'
        } ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 py-2 z-40 animate-fade-in">
            <div className="px-4 py-2.5 border-b border-neutral-200 mb-1">
              <p className="text-sm font-semibold text-navy-700 truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-neutral-400 truncate">{user.email}</p>
            </div>
            
            <Link
              to={getDashboardPath()}
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-navy-50 transition-colors mx-1.5"
            >
              <LayoutDashboard className="w-4 h-4 text-neutral-400" />
              Dashboard
            </Link>
            
            <div className="border-t border-neutral-200 mt-1 pt-1 mx-1.5">
              <button
                onClick={() => { setDropdownOpen(false); signOut(); }}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
