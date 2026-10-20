# Anonymous GA4 page context

## Registry and maintenance

`src/data/analytics-pages.json` is the source of truth: explicit immutable numeric
`id`, canonical trailing-slash `route`, and internal reporting `name`. It covers
all 21 current generated content pages, including resources and legal pages.
Draft posts are not generated and have no ID yet. The 404 page is not tracked.

Allocate the next unused ID when publishing a page. Never sort-and-renumber,
derive IDs from filenames, reuse a retired ID, or assign a new ID on every build.
For a renamed route representing the same page, keep its ID. Preserve retired
entries for historical decoding; adapt the coverage test to distinguish retired
entries if that becomes necessary. Names can be edited without changing IDs.
Synthetic `/p/NNN` URLs are analytics labels, not new public website routes.

The component resolves the route at build time. A missing ID fails the build
for content pages. Only that page's ID is embedded in HTML; the complete registry
and real reporting names are not bundled or copied into `dist`.

## Marketing Tracker handoff

Recommended: maintain an access-restricted `Page map` tab in the existing tracker
spreadsheet with columns `id`, `landingPage`, `name`, `route`. Transfer the registry
through an authenticated/manual process when pages are published. `landingPage`
is `/p/` plus `id`, for example `/p/002`. Import IDs as text to retain leading zeros.
Apps Script can join `landingPage` results to that sheet locally, without sending
names or routes back to GA4. For `landingPagePlusQueryString`, remove any query
before lookup; tolerate a trailing slash. Keep unknown IDs and `(not set)` visibly
unmatched rather than silently defaulting them to Home.

For automated synchronization, have Apps Script read the JSON through an
authenticated private repository API, with read credentials in Script Properties,
and cache it in the private mapping tab. Do not publish a JSON endpoint on the
website or include the registry in event parameters, custom dimensions or GTM.
No spreadsheet, credentials, tracker script or external account was changed here.

## Privacy review and boundaries

This local change retains consent-only Google loading, production-host gating,
origin-only referrers and one manual initial pageview. Explicit `config`,
`page_view` and `contact_click` page context uses the synthetic URL and a generic
title, excluding the real pathname, query and fragment. The Google script request
also has `referrerPolicy: no-referrer`. Validated campaign UTM values remain
separately reported as before; use opaque campaign/content codes, never personal
information or therapy topics. A syntactic allowlist alone cannot enforce that.

The provider remains Google Analytics (Google LLC), for consented marketing and
contact-use measurement. Existing GA and preference cookies and their lifetimes
are unchanged. The privacy notice now describes the synthetic page identifiers.

An opaque page ID is not a cryptographic anonymity guarantee. The ID is visible
in each public page's source and could be associated with the topic by a crawler.
Google's script executes in the real document after consent and can read its URL
and title. This change controls our explicit event payloads, not all behaviour
of a remotely configured third-party script.

Before release, check the targeted GA4 settings in `GA4_PREDEPLOY_AUDIT.md`.
Disable history pageviews and topic-bearing automatic outbound/download events;
leave unused search/form/video collection off. Useful aggregate scroll/engagement
need not be disabled indiscriminately. Remote settings were not read or changed.

Tests block all third-party requests and examine the commands queued by our code;
they do not claim to validate Google's remotely configured collection behaviour.
Separate Search Console indexing and existing click-to-load YouTube behaviour
are unaffected. The policy's restrictions on sensitive content still apply.

## Historical EMDR route

`public/_redirects` now defines HTTP 301 redirects for both `/emdr-therapy/` and
`/emdr-therapy` to `/emdr/`. Astro copies the file into `dist`, where Cloudflare
Workers static assets applies it before the configured 404 fallback. Other paths
and external Cloudflare dashboard rules are unchanged. See the pre-deployment
audit for the runtime test and remaining release checks.

## Local validation

Run `npm run build`, `node --test tests/analytics-mapping.test.mjs tests/redirects.test.mjs`, and
`npm run test:analytics`. On PowerShell installations that block npm.ps1, use
`npm.cmd` instead. The analytics suite serves the production build locally while
intercepting the production hostname and blocking every third-party request.

The suites check five distinct page IDs, reload/navigation stability, explicit
pageview/contact payloads, consent, four non-production hosts, sanitized referrers,
unmapped-route 404s, redirect artifacts and optional Cloudflare HTTP behaviour.
The audit records the current run's test results and privacy findings.
