-- Harden unified role-aware schema added in 20260227000000
-- Focus: least-privilege grants, role validation, and safer RLS for public/admin resources.

-- ---------------------------------------------------------------------------
-- Helper: updated_at trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Ensure updated_at is managed automatically where present
DROP TRIGGER IF EXISTS trg_user_tasks_touch_updated_at ON public.user_tasks;
CREATE TRIGGER trg_user_tasks_touch_updated_at
BEFORE UPDATE ON public.user_tasks
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_user_onboarding_progress_touch_updated_at ON public.user_onboarding_progress;
CREATE TRIGGER trg_user_onboarding_progress_touch_updated_at
BEFORE UPDATE ON public.user_onboarding_progress
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_community_posts_touch_updated_at ON public.community_posts;
CREATE TRIGGER trg_community_posts_touch_updated_at
BEFORE UPDATE ON public.community_posts
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_community_comments_touch_updated_at ON public.community_comments;
CREATE TRIGGER trg_community_comments_touch_updated_at
BEFORE UPDATE ON public.community_comments
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_support_tickets_touch_updated_at ON public.support_tickets;
CREATE TRIGGER trg_support_tickets_touch_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_lawyer_cases_touch_updated_at ON public.lawyer_cases;
CREATE TRIGGER trg_lawyer_cases_touch_updated_at
BEFORE UPDATE ON public.lawyer_cases
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_lawyer_marketing_campaigns_touch_updated_at ON public.lawyer_marketing_campaigns;
CREATE TRIGGER trg_lawyer_marketing_campaigns_touch_updated_at
BEFORE UPDATE ON public.lawyer_marketing_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_integration_connections_touch_updated_at ON public.integration_connections;
CREATE TRIGGER trg_integration_connections_touch_updated_at
BEFORE UPDATE ON public.integration_connections
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Community memberships for private-group access control
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.community_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_community_group_members_group_user
  ON public.community_group_members (group_id, user_id);

ALTER TABLE public.community_group_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS community_group_members_self_or_admin ON public.community_group_members;
CREATE POLICY community_group_members_self_or_admin ON public.community_group_members
  FOR ALL USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Replace overly broad community group read policy with private-group-aware policy.
DROP POLICY IF EXISTS community_groups_read_all ON public.community_groups;
CREATE POLICY community_groups_read_access ON public.community_groups
  FOR SELECT USING (
    visibility = 'public'
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.community_group_members m
      WHERE m.group_id = community_groups.id
        AND m.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ---------------------------------------------------------------------------
-- Admin notifications: split read vs write policies
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS system_notifications_admin_write_read_all ON public.system_notifications;

DROP POLICY IF EXISTS system_notifications_read_authenticated ON public.system_notifications;
CREATE POLICY system_notifications_read_authenticated ON public.system_notifications
  FOR SELECT USING (
    is_active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at >= now())
    AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS system_notifications_admin_write ON public.system_notifications;
CREATE POLICY system_notifications_admin_write ON public.system_notifications
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS system_notifications_admin_update ON public.system_notifications;
CREATE POLICY system_notifications_admin_update ON public.system_notifications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

DROP POLICY IF EXISTS system_notifications_admin_delete ON public.system_notifications;
CREATE POLICY system_notifications_admin_delete ON public.system_notifications
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ---------------------------------------------------------------------------
-- Role integrity for cross-profile references
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ensure_profile_role(expected_role text, profile_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  actual_role text;
BEGIN
  SELECT role INTO actual_role FROM public.profiles WHERE id = profile_id;
  IF actual_role IS NULL THEN
    RAISE EXCEPTION 'Profile % does not exist', profile_id;
  END IF;

  IF actual_role <> expected_role THEN
    RAISE EXCEPTION 'Profile % has role %, expected %', profile_id, actual_role, expected_role;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_saved_lawyer_roles()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.ensure_profile_role('user', NEW.user_id);
  PERFORM public.ensure_profile_role('lawyer', NEW.lawyer_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_saved_lawyers_validate_roles ON public.saved_lawyers;
CREATE TRIGGER trg_saved_lawyers_validate_roles
BEFORE INSERT OR UPDATE ON public.saved_lawyers
FOR EACH ROW
EXECUTE FUNCTION public.validate_saved_lawyer_roles();

CREATE OR REPLACE FUNCTION public.validate_lawyer_case_roles()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.ensure_profile_role('lawyer', NEW.lawyer_id);
  PERFORM public.ensure_profile_role('user', NEW.client_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lawyer_cases_validate_roles ON public.lawyer_cases;
CREATE TRIGGER trg_lawyer_cases_validate_roles
BEFORE INSERT OR UPDATE ON public.lawyer_cases
FOR EACH ROW
EXECUTE FUNCTION public.validate_lawyer_case_roles();

-- ---------------------------------------------------------------------------
-- Replace broad authenticated grant with explicit per-table grants
-- ---------------------------------------------------------------------------
REVOKE ALL ON public.user_tasks FROM authenticated;
REVOKE ALL ON public.user_reminders FROM authenticated;
REVOKE ALL ON public.user_onboarding_progress FROM authenticated;
REVOKE ALL ON public.saved_lawyers FROM authenticated;
REVOKE ALL ON public.user_referrals FROM authenticated;
REVOKE ALL ON public.community_groups FROM authenticated;
REVOKE ALL ON public.community_posts FROM authenticated;
REVOKE ALL ON public.community_comments FROM authenticated;
REVOKE ALL ON public.community_group_members FROM authenticated;
REVOKE ALL ON public.support_tickets FROM authenticated;
REVOKE ALL ON public.support_ticket_messages FROM authenticated;
REVOKE ALL ON public.lawyer_client_links FROM authenticated;
REVOKE ALL ON public.lawyer_cases FROM authenticated;
REVOKE ALL ON public.lawyer_case_timeline_events FROM authenticated;
REVOKE ALL ON public.lawyer_availability_slots FROM authenticated;
REVOKE ALL ON public.lawyer_marketing_campaigns FROM authenticated;
REVOKE ALL ON public.admin_audit_events FROM authenticated;
REVOKE ALL ON public.system_notifications FROM authenticated;
REVOKE ALL ON public.integration_connections FROM authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_reminders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_onboarding_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_lawyers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_referrals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_groups TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_comments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_group_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_ticket_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lawyer_client_links TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lawyer_cases TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lawyer_case_timeline_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lawyer_availability_slots TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lawyer_marketing_campaigns TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_audit_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integration_connections TO authenticated;
