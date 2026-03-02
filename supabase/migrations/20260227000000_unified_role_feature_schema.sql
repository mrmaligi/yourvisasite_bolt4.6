-- Unified role-aware feature schema
-- Adds missing relational structures to support user, lawyer, and admin pages.

-- ---------------------------------------------------------------------------
-- Shared enums
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
    CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'done', 'blocked');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
    CREATE TYPE public.ticket_status AS ENUM ('open', 'in_review', 'resolved', 'closed');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'case_status') THEN
    CREATE TYPE public.case_status AS ENUM ('intake', 'active', 'waiting_client', 'submitted', 'closed');
  END IF;
END$$;

-- ---------------------------------------------------------------------------
-- User experience tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_at timestamptz,
  priority public.task_priority NOT NULL DEFAULT 'medium',
  status public.task_status NOT NULL DEFAULT 'todo',
  visa_id uuid REFERENCES public.visas(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  reminder_at timestamptz NOT NULL,
  channel text NOT NULL DEFAULT 'in_app',
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_step text NOT NULL DEFAULT 'welcome',
  completed_steps text[] NOT NULL DEFAULT '{}',
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.saved_lawyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lawyer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lawyer_id)
);

CREATE TABLE IF NOT EXISTS public.user_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_email text NOT NULL,
  referral_code text NOT NULL,
  status text NOT NULL DEFAULT 'invited',
  reward_points integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  converted_at timestamptz,
  UNIQUE (referrer_user_id, referred_email)
);

-- ---------------------------------------------------------------------------
-- Community + support
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.community_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  visibility text NOT NULL DEFAULT 'public',
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id uuid REFERENCES public.community_groups(id) ON DELETE SET NULL,
  title text NOT NULL,
  body text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_admin_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  subject text NOT NULL,
  category text NOT NULL,
  status public.ticket_status NOT NULL DEFAULT 'open',
  priority public.task_priority NOT NULL DEFAULT 'medium',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Lawyer practice tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lawyer_client_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  UNIQUE (lawyer_id, client_id)
);

CREATE TABLE IF NOT EXISTS public.lawyer_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visa_id uuid REFERENCES public.visas(id) ON DELETE SET NULL,
  title text NOT NULL,
  status public.case_status NOT NULL DEFAULT 'intake',
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lawyer_case_timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.lawyer_cases(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lawyer_availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  is_booked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS public.lawyer_marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  channel text NOT NULL,
  budget numeric(10,2) NOT NULL DEFAULT 0,
  starts_on date,
  ends_on date,
  status text NOT NULL DEFAULT 'draft',
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Admin operations tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.system_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audience text NOT NULL DEFAULT 'all',
  title text NOT NULL,
  body text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.integration_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider text NOT NULL,
  external_account_id text,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, provider)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_tasks_user_id ON public.user_tasks (user_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_status_due_at ON public.user_tasks (status, due_at);
CREATE INDEX IF NOT EXISTS idx_user_reminders_user_id ON public.user_reminders (user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_group_id ON public.community_posts (group_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments (post_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_requester_id ON public.support_tickets (requester_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_cases_lawyer_id ON public.lawyer_cases (lawyer_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_cases_client_id ON public.lawyer_cases (client_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_availability_slots_lawyer_id ON public.lawyer_availability_slots (lawyer_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_events_created_at ON public.admin_audit_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_integration_connections_owner_id ON public.integration_connections (owner_id);

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_client_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_case_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_connections ENABLE ROW LEVEL SECURITY;

-- users manage their own records
DROP POLICY IF EXISTS user_tasks_own_access ON public.user_tasks;
CREATE POLICY user_tasks_own_access ON public.user_tasks
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_reminders_own_access ON public.user_reminders;
CREATE POLICY user_reminders_own_access ON public.user_reminders
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_onboarding_progress_own_access ON public.user_onboarding_progress;
CREATE POLICY user_onboarding_progress_own_access ON public.user_onboarding_progress
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS saved_lawyers_own_access ON public.saved_lawyers;
CREATE POLICY saved_lawyers_own_access ON public.saved_lawyers
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_referrals_own_access ON public.user_referrals;
CREATE POLICY user_referrals_own_access ON public.user_referrals
  FOR ALL USING (auth.uid() = referrer_user_id)
  WITH CHECK (auth.uid() = referrer_user_id);

DROP POLICY IF EXISTS integration_connections_own_access ON public.integration_connections;
CREATE POLICY integration_connections_own_access ON public.integration_connections
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- community is readable by everyone authenticated; author manages their content
DROP POLICY IF EXISTS community_groups_read_all ON public.community_groups;
CREATE POLICY community_groups_read_all ON public.community_groups
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS community_posts_read_all ON public.community_posts;
CREATE POLICY community_posts_read_all ON public.community_posts
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS community_posts_author_manage ON public.community_posts;
CREATE POLICY community_posts_author_manage ON public.community_posts
  FOR ALL USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS community_comments_read_all ON public.community_comments;
CREATE POLICY community_comments_read_all ON public.community_comments
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS community_comments_author_manage ON public.community_comments;
CREATE POLICY community_comments_author_manage ON public.community_comments
  FOR ALL USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- support tickets requester + assigned admin can view
DROP POLICY IF EXISTS support_tickets_access ON public.support_tickets;
CREATE POLICY support_tickets_access ON public.support_tickets
  FOR SELECT USING (
    auth.uid() = requester_id
    OR auth.uid() = assigned_admin_id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS support_tickets_create_requester ON public.support_tickets;
CREATE POLICY support_tickets_create_requester ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS support_tickets_update_participants ON public.support_tickets;
CREATE POLICY support_tickets_update_participants ON public.support_tickets
  FOR UPDATE USING (
    auth.uid() = requester_id
    OR auth.uid() = assigned_admin_id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    auth.uid() = requester_id
    OR auth.uid() = assigned_admin_id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS support_ticket_messages_access ON public.support_ticket_messages;
CREATE POLICY support_ticket_messages_access ON public.support_ticket_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1
      FROM public.support_tickets t
      WHERE t.id = support_ticket_messages.ticket_id
        AND (
          t.requester_id = auth.uid()
          OR t.assigned_admin_id = auth.uid()
          OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
        )
    )
  )
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1
      FROM public.support_tickets t
      WHERE t.id = support_ticket_messages.ticket_id
        AND (
          t.requester_id = auth.uid()
          OR t.assigned_admin_id = auth.uid()
          OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
        )
    )
  );

-- lawyer managed resources
DROP POLICY IF EXISTS lawyer_client_links_lawyer_access ON public.lawyer_client_links;
CREATE POLICY lawyer_client_links_lawyer_access ON public.lawyer_client_links
  FOR ALL USING (auth.uid() = lawyer_id OR auth.uid() = client_id)
  WITH CHECK (auth.uid() = lawyer_id OR auth.uid() = client_id);

DROP POLICY IF EXISTS lawyer_cases_participant_access ON public.lawyer_cases;
CREATE POLICY lawyer_cases_participant_access ON public.lawyer_cases
  FOR ALL USING (auth.uid() = lawyer_id OR auth.uid() = client_id)
  WITH CHECK (auth.uid() = lawyer_id OR auth.uid() = client_id);

DROP POLICY IF EXISTS lawyer_case_timeline_events_participant_access ON public.lawyer_case_timeline_events;
CREATE POLICY lawyer_case_timeline_events_participant_access ON public.lawyer_case_timeline_events
  FOR ALL USING (
    EXISTS (
      SELECT 1
      FROM public.lawyer_cases c
      WHERE c.id = lawyer_case_timeline_events.case_id
        AND (c.lawyer_id = auth.uid() OR c.client_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.lawyer_cases c
      WHERE c.id = lawyer_case_timeline_events.case_id
        AND (c.lawyer_id = auth.uid() OR c.client_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS lawyer_availability_slots_lawyer_access ON public.lawyer_availability_slots;
CREATE POLICY lawyer_availability_slots_lawyer_access ON public.lawyer_availability_slots
  FOR ALL USING (auth.uid() = lawyer_id)
  WITH CHECK (auth.uid() = lawyer_id);

DROP POLICY IF EXISTS lawyer_marketing_campaigns_lawyer_access ON public.lawyer_marketing_campaigns;
CREATE POLICY lawyer_marketing_campaigns_lawyer_access ON public.lawyer_marketing_campaigns
  FOR ALL USING (auth.uid() = lawyer_id)
  WITH CHECK (auth.uid() = lawyer_id);

-- admin only resources
DROP POLICY IF EXISTS admin_audit_events_admin_only ON public.admin_audit_events;
CREATE POLICY admin_audit_events_admin_only ON public.admin_audit_events
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS system_notifications_admin_write_read_all ON public.system_notifications;
CREATE POLICY system_notifications_admin_write_read_all ON public.system_notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    OR audience IN ('all', 'users', 'lawyers', 'admins')
  )
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
