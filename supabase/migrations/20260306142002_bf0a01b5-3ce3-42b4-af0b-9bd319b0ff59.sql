SELECT cron.schedule(
  'campaign-auto-post-cron',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://ufjzmcorbghvljrzoozw.supabase.co/functions/v1/campaign-auto-post',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmanptY29yYmdodmxqcnpvb3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDEwMDgsImV4cCI6MjA4ODA3NzAwOH0.4BHzooTli-FA4gMkK86CcKi3vhiiS8EUd0mQqTPea24"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);