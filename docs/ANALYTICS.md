# Visit tracking — prepared, not activated

No account settings or live site were changed. The initial live HTML inspection on 28 October 2026 found no Cloudflare, Google Analytics or Plausible tag; this does not rule out server-side traffic statistics.

Cloudflare Web Analytics is the proposed starting point for visits, page views, referrers, countries, devices and performance. Create/select the domain in Cloudflare Web Analytics after the owner authorizes activation. Use manual installation and set its public 32-character token as VITE_CLOUDFLARE_ANALYTICS_TOKEN in the production build environment. Do not combine automatic injection and manual installation. Local development and builds without a token do not load the beacon. Previewing a configured production build will send visits: avoid that until activation is approved.

Before publishing: confirm dashboard access, choose manual versus automatic installation, review the visitor privacy notice against the selected configuration, deploy only with explicit permission, and verify real beacon requests and dashboard data. Tracking starts when enabled; it cannot recover past visitor sessions.

The site uses hash routes. Do not promise per-tab reports until #/wellness and other navigation have been tested against the dashboard. Cloudflare documents SPA navigation support, but hash-route reporting needs verification. Booking, WhatsApp, email and Dr Alix outbound clicks are not custom events in this implementation; completed bookings must be measured through Cal.com or a separately agreed integration. Do not send names, email addresses, medical details or booking form contents into analytics.

References:
- https://developers.cloudflare.com/web-analytics/
- https://developers.cloudflare.com/web-analytics/get-started/web-analytics-spa/
