# GA4 and GTM setup for Cosmetics Asia

The site implements privacy-first measurement. Google tags do not load until a visitor chooses **Allow analytics**. Advertising storage, advertising user data, and advertising personalization remain denied.

## Environment variables

Set the production variables in Cloudflare Pages:

- `VITE_GTM_ID=GTM-XXXXXXX` (preferred)
- `VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX` (direct GA4 fallback only)

When both exist, the site loads GTM and expects GA4 to be configured inside that container. Do not also load GA4 directly from another plugin or theme.

## GTM container

1. Create one Google tag for the GA4 Measurement ID.
2. Set `send_page_view` to `false`. The React app emits privacy-safe SPA page views itself.
3. Do not add an All Pages page-view trigger. Use the custom `page_view` event.
4. In the GA4 `page_view` event tag, map `page_location`, `page_path`, `page_title`, and `page_group` from data-layer variables with those exact names. Do not use the browser's Page URL variable for these fields.
5. Create GA4 event tags for the following data-layer events:
   - `page_view`
   - `view_landing_page`
   - `select_cta`
   - `start_quote`
   - `quote_option_selected`
   - `quote_step_completed`
   - `generate_lead`
   - `whatsapp_handoff`
   - `view_pricing`
   - `expand_faq`
6. Mark `generate_lead` as a GA4 key event only after testing.
7. Do not enable Enhanced Conversions, User-ID, Google Signals, remarketing audiences, or form-field variables for this healthcare-related site.

Allowed event parameters are deliberately limited to aggregate labels such as `source`, `position`, `option`, `step`, `section`, and `page_group`. Never add treatment names, provider names, case IDs, form answers, emails, phone numbers, notes, or other health/contact data.

## Verification

Use GTM Preview / Tag Assistant and check both paths:

- Choose **Essential only**: no request should be made to `googletagmanager.com` or `google-analytics.com`.
- Choose **Allow analytics**: GTM should load and a grouped `page_view` should appear. A treatment landing URL must be reported as `/lp/treatment-consultation`, not the treatment slug.

Legal requirements vary by market. The implementation minimizes data and honors choice, but the privacy notice and consent language should still be reviewed by counsel for the countries targeted.
