DROP VIEW IF EXISTS public.user_profiles_safe;

CREATE VIEW public.user_profiles_safe 
WITH (security_invoker = true)
AS
SELECT 
  id, user_id, name, email, user_type, company_name, industry,
  company_description, target_audience, location, default_topics,
  role, background, posting_goals, linkedin_profile_url, 
  linkedin_username, linkedin_public_id, preferred_tone, post_frequency,
  linkedin_id, linkedin_verified, linkedin_verified_at,
  linkedin_profile_confirmed, linkedin_profile_data,
  linkedin_profile_edit_count, linkedin_profile_url_locked,
  onboarding_completed, subscription_plan, subscription_expires_at,
  posts_created_count, posts_scheduled_count, posts_published_count,
  last_active_at, last_post_date, daily_post_count, profile_last_scraped,
  phone_number, city, country, created_at, updated_at
FROM user_profiles;