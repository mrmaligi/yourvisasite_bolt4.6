@@ .. @@
 import { Link, useNavigate } from 'react-router-dom';
 import { Menu, X, User, LogOut, Settings, FileText, Calendar, Shield } from 'lucide-react';
 import { useAuth } from '../hooks/useAuth';
+import { SubscriptionStatus } from './SubscriptionStatus';
 import { supabase } from '../lib/supabase';
 
@@ .. @@
               <div className="flex items-center space-x-4">
+                <SubscriptionStatus />
                 <div className="relative">
                   <button
                     onClick={() => setIsProfileOpen(!isProfileOpen)}