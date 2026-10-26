# Instagram gallery

The Club page contains a six-image gallery and a link to @bethnalgreenbc. Until an authorised feed is configured, it shows existing local gym photos, explicitly labelled as gym photos rather than recent Instagram posts.

## Connection still required

Confirm account-owner access and Business/Creator status. Choose an authorised feed provider or a server-side Meta integration with the owner. No provider subscription or account authorisation has been created by this change.

Set VITE_INSTAGRAM_FEED_URL to a public HTTPS cache endpoint returning JSON:

```json
{"posts":[{"permalink":"https://www.instagram.com/p/POST_ID/","image":"https://example.com/image.jpg","caption":"Post description"}]}
```

The endpoint must allow the website origin via CORS. It must fetch and refresh media through an authorised integration on the server, manage token renewal and refresh expiring media URLs. Do not expose tokens in client code or VITE variables. For reels use a thumbnail image. The browser displays up to six valid posts and links each to Instagram; it falls back to local gym photos on missing configuration, empty data, failed image loads or fetch errors. It requests the cache on page mount; freshness depends on the configured service.

Local build verified; actual Instagram updates remain unverified until connected.

## Behold handover

The gallery now accepts Behold JSON feeds directly, including optimized medium images and reel thumbnails. No Behold account or feed has been created yet.

Account handler route: create a club-owned free account at https://behold.so/, connect @bethnalgreenbc as a Basic source (requires Business or Creator account), create a JSON feed with six posts and send only its public feeds.behold.so URL back. Set that URL as VITE_INSTAGRAM_FEED_URL, restart the local preview and verify real posts before deployment.

Alternative: Phoenix creates a Behold account and uses Sources > Add source > Basic source to obtain a unique authorisation link. Send that link to the Instagram handler, who can authorise without a Behold login. A real link cannot be generated until the Behold account is created.

Checked 26 October 2026: free plan permits six posts, daily refresh and 1,200 feed requests per month. Feed pauses at the free quota; local-photo fallback remains available. No paid plan has been purchased. Docs: https://behold.so/docs/getting-started/ and https://behold.so/docs/json-feeds/ ; pricing: https://behold.so/pricing/.

## Connected 26 October 2026

Behold confirms @bethnalgreenbc connected. Created free JSON feed `Bethnal Green website`: https://feeds.behold.so/9bh5zUip8FaswKNUkO68 . Public URL saved in content.js, with VITE_INSTAGRAM_FEED_URL available as an override. Initial response returned username bethnalgreenbc and six posts. Email verification banner was still present in the dashboard; account holder should complete it. No paid plan purchased.
