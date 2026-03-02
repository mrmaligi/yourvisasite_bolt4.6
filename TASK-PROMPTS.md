# VisaBuild — All 50 Task Prompts for Jules

> Auto-generated task prompts. Each one is a self-contained Jules session prompt.
> Status tracked in SPRINT-STATUS.md

---

## SCHEMA REFERENCE (include in every prompt)

```
visas: id(uuid), subclass(text UNIQUE), name(text), country(text), category(visa_category enum: work/family/student/visitor/humanitarian/business/other), official_url(text), summary(text), processing_fee_description(text), is_active(bool), cost_aud(text), processing_time_range(text), duration(text), key_requirements(text), created_at, updated_at

visa_premium_content: id(uuid), visa_id(uuid FK→visas), step_number(int), title(text), body(text), document_category(text), document_explanation(text), document_example_url(text), created_at, updated_at

profiles: id(uuid), user_id(uuid FK→auth.users), role(user_role enum: user/lawyer/admin), full_name(text), phone(text), avatar_url(text), created_at, updated_at

document_categories: id(uuid), name(text), description(text), icon(text), sort_order(int), created_at

user_documents: id(uuid), user_id(uuid), category_id(uuid FK→document_categories), file_name(text), file_path(text), file_size(bigint), mime_type(text), status(document_status enum: pending/verified/rejected), notes(text), created_at, updated_at

user_visa_purchases: id(uuid), user_id(uuid), visa_id(uuid FK→visas), stripe_payment_id(text), amount_cents(int), purchased_at(timestamptz)

bookings: id(uuid), user_id(uuid), lawyer_id(uuid), scheduled_at(timestamptz), duration_minutes(int), price_cents(int), status(booking_status enum: pending/confirmed/completed/cancelled), notes(text), created_at

tracker_entries: id(uuid), visa_id(uuid FK→visas), submitted_by(uuid), submitter_role(text), application_date(date), decision_date(date), processing_days(int), outcome(tracker_outcome enum: approved/refused/withdrawn), weight(numeric), created_at, is_flagged(bool), flag_reason(text)

tracker_stats: id(uuid), visa_id(uuid FK→visas), weighted_avg_days(numeric), median_days(numeric), p25_days(numeric), p75_days(numeric), total_entries(int), last_refreshed(timestamptz)

lawyer.profiles: id(uuid), profile_id(uuid FK→profiles), bar_number(text), jurisdiction(text), practice_areas(text[]), years_experience(int), bio(text), hourly_rate_cents(int), is_verified(bool), verification_status(verification_status enum: pending/approved/rejected), verified_at(timestamptz)

lawyer.consultation_slots: id(uuid), lawyer_id(uuid), start_time(timestamptz), end_time(timestamptz), is_booked(bool)

news_articles: id(uuid), title(text), slug(text), body(text), excerpt(text), author_id(uuid), category(text), is_published(bool), published_at(timestamptz), created_at, updated_at

notification_preferences: id(uuid), user_id(uuid), email_enabled(bool), push_enabled(bool), sms_enabled(bool)

platform_settings: id(uuid), key(text UNIQUE), value(text), created_at, updated_at

Supabase Auth: auth.users (managed by Supabase)
Storage buckets: documents (private), lawyer-credentials (private), avatars (public) — TO BE CREATED
```
