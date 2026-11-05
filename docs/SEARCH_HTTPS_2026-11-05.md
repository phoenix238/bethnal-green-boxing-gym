# Search icon and HTTPS review, 5 November 2026

Added square PNG, ICO and Apple touch icons from the existing club logo, preserving aspect ratio on black. Canonical and Open Graph URL use https://bethnalgreenboxingclub.com/. Added robots.txt and a root-only sitemap; hash routes are not separate indexed URLs.

18 existing tests and production build passed. HTTP returned 200 without redirect; HTTPS returned 200 with normal certificate validation. Cloudflare Always Use HTTPS still needs authenticated dashboard access and redirect verification. Search Console reindexing remains pending owner access. These checks are not a full security audit.
