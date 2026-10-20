# Anonymous GA4 pre-deployment audit — 20 October 2026

Scope: repository code, generated production HTML and local browser/runtime tests.
No production deployment, Google collection requests or GA4 account changes.
GA4 dashboard configuration is not accessible in this workspace. The findings
about remotely enabled events below are conditional, not observed live traffic.

## Event and disclosure audit

| Mechanism | Tangata use / possible trigger | Data and disclosure risk | Action |
| --- | --- | --- | --- |
| Initial automatic pageview | Direct gtag config on each consented full document load | Normally uses document URL/title; config instead supplies `/p/NNN`, generic title and origin-only referrer | Keep `send_page_view: false` on every config. One explicit manual initial event is queued; no second site-code pageview exists. |
| History-based pageviews | No ClientRouter, ViewTransitions, pushState or replaceState in application code; navigation replaces the document | Remotely enabled history detection can collect real history URL/referrer independently of `send_page_view` | Disable **Page changes based on browser history events** in GA4. No SPA tracking code is needed. Browser test deliberately changes history and confirms our own code adds no event. |
| Outbound clicks | Real NHS, NICE, WHO, PubMed, social, professional-body, Maps and image-credit links | Enhanced `click` can contain `link_url`, `link_domain`, `link_id`, `link_classes`, `outbound`. NHS social-anxiety/insomnia and NICE PTSD guidance URLs reveal topics despite anonymous current-page context | Turn off automatic **Outbound clicks**. Keep useful generic `contact_click` events; if broader outbound counts are later needed, add an explicitly reviewed generic event without URL/text. No site-code automatic outbound event exists. |
| File downloads | `/resources/` links to `/audio/lightstream.mp3` with visible text `Download Lightstream MP3` | Enhanced `file_download` can include `file_name`, `file_extension`, `link_text`, `link_url`, `link_id`, `link_classes`. Identifies a therapy resource and potentially client interest | Turn off automatic **File downloads**. The download itself and playback remain available. If measuring use becomes useful, design a generic consented resource event separately; do not transmit the filename or text. |
| Forms | No `<form>` in any of the 22 generated HTML pages; contact uses links | If added/enabled: `form_start` / `form_submit` can disclose `form_id`, `form_name`, `form_destination`, and `form_submit_text` | Leave **Form interactions** off while unused. Review any future form before enabling measurement. No form tracking code is needed now. |
| Site search | No search feature, but arbitrary `?q=`, `?s=`, `?search=`, `?query=` or `?keyword=` can be supplied in a URL | Enhanced `view_search_results` can send `search_term` and configured additional query fields, even though our explicit page_location excludes queries | Leave **Site search** off. No useful site-search measurement is lost on the current site. |
| Video | Click-to-load YouTube privacy-enhanced iframe; embed URL has `autoplay=1`, not `enablejsapi=1` | GA enhanced video tracking requires JS API support; not intentionally enabled here. If activated remotely/later, `video_title`, `video_url` and provider/progress parameters can identify the EMDR video | Leave automatic **Video engagement** off unless explicitly reviewed. No player/API expansion here. Playing a video independently contacts YouTube and discloses its video ID, as the notice already explains. |
| Scroll / engagement | Scroll and automatic engagement may be enabled by GA4; no custom scroll tracking | Scroll adds `engagement_time_msec`; automatic engagement/session events include normal GA identifiers and page context. No topic-bearing link/file/form fields are needed | No blanket disable recommendation. Aggregate engagement remains useful if its context stays synthetic. Verify collected context against the approved configuration before enabling additional collection. |
| Custom and contact/conversion events | Only `page_view` and `contact_click` are emitted by site code | Contact sends only `contact_method` (`email`, `phone`, `contact_section`), synthetic `page_location`, generic `page_title`, origin-only `page_referrer`; no href, email, phone number or link text | Retain. A GA4 key-event designation can use `contact_click` without adding payload fields. Inspect remote created/modified events and Google tag destinations/rules; these are unknown locally. |
| Campaign parameters | Explicitly reported after consent: allowlisted social `campaign_source`, `organic_social` medium, validated `campaign_name` and `campaign_content` | Campaign/content validation permits `[a-z0-9_-]{1,64}`; it rejects punctuation/URLs but accepts semantic strings such as `grief-and-loss`. The full query, fragment, utm_term, gclid and arbitrary query fields are not explicitly copied by our code. Google tag automatic attribution is outside these command-level tests | Retain useful attribution using opaque existing codes (e.g. `social_launch_01`, `s1b1`). Never encode therapy topics or personal data. A server-maintained allowlist of issued campaign/content codes would be stronger than the current syntax check; do not invent that list or silently discard existing marketing codes. |
| Referrers | Explicit GA config/pageview/contact context uses `new URL(document.referrer).origin + '/'`, or empty string | Real referring path, query, credentials and fragment are removed. Origin can still identify a specialist/referral organisation. Google tag download uses `referrerPolicy: no-referrer`; this is not a sandbox for all later script requests | Retain origin-only attribution. No additional path handling needed. A domain allowlist or dropping origin would sacrifice source attribution and is not justified by this audit alone. |

Google's field/trigger definitions:
https://support.google.com/analytics/answer/9216061?hl=en

Manual pageview and independent history-event behaviour:
https://developers.google.com/analytics/devguides/collection/ga4/views

## Manual GA4 checks before release

In **Admin → Data streams → Tangata web stream → Enhanced measurement → settings**:

- Under Page views → advanced settings, turn **Page changes based on browser history events** off.
- Turn **Outbound clicks** and **File downloads** off because current real links/resources contain topic information.
- Leave **Site search**, **Form interactions**, and **Video engagement** off while not required/reviewed.
- Do not disable all analytics or automatically disable useful aggregate scroll/engagement measurement. Keep the code's single manual initial pageview and generic contact events.
- Review Google tag automatic event detection, event creation/modification rules, cross-domain measurement and additional destinations for raw URL/text capture or transformations that undo the synthetic context. Keep existing Google Signals/advertising restrictions.

No GA4 dashboard settings were read or changed. Local tests inspect the website's
queued gtag commands with Google scripts and all third-party requests blocked;
they cannot certify remotely generated Google events or actual GA processing.

## Privacy notice and release assessment

No further privacy-notice change was needed in this audit: the current wording
describes **our** explicit pageview/contact context and separately reported UTMs,
and explicitly avoids claiming the whole analytics dataset is anonymous.

The code is ready locally subject to passing checks, but the remote GA4 settings
above remain a pre-deployment condition. An opaque ID is visible in the source of
each public page, so it can be associated with the topic by a crawler. Google's
script runs in the real document after consent and can read its URL/title; there
is no technical isolation or guarantee against inference. Consent, persistent GA
identifiers, specialist referring origins and video activation also carry context.
The improvement minimises explicit URL/title disclosure rather than making all
visitor activity unidentifiable.

## Redirect

`public/_redirects` defines exactly:

```text
/emdr-therapy/ /emdr/ 301
/emdr-therapy /emdr/ 301
```

Astro copies this to `dist/_redirects`; Cloudflare Workers static assets parses
it into HTTP redirects before serving the 404 fallback. No Worker script, client
redirect, meta refresh, wildcard or change to other paths is introduced. No
previous repository redirect file existed. External dashboard rules are unchanged.

Reference: https://developers.cloudflare.com/workers/static-assets/redirects/

`tests/redirects.test.mjs` verifies the built artifact and optionally checks real
HTTP 301 responses, destination 200 and unaffected blog/unknown paths against
`wrangler dev --local --port 3001`, using `CLOUDFLARE_TEST_ORIGIN=http://127.0.0.1:3001`.
Astro preview alone does not process Cloudflare's `_redirects` file.

## Validation results

- `npm.cmd run build`: passed; 22 generated HTML pages, including untracked 404.
- Playwright `analytics`, `chromium` and `Mobile Chrome` projects: **77 passed**
  (15 analytics tests and 31 existing/extended accessibility/privacy tests on
  each desktop/mobile profile). All third-party browser requests blocked in the
  final run. A teardown race in intercepted local image requests was fixed by
  waiting for route handlers before closing analytics test contexts.
- `node --test tests/analytics-mapping.test.mjs tests/redirects.test.mjs` with
  `CLOUDFLARE_TEST_ORIGIN=http://127.0.0.1:3001`: **4 passed**, none skipped.
  Includes actual Cloudflare local runtime HTTP 301 -> 200 for both URL forms,
  blog still 200, and an unrelated unknown path still 404.
- Local Cloudflare tooling: Wrangler 4.151.3, downloaded transiently without
  changing package.json/package-lock.json or deploying. Started only after the
  final build for the passing HTTP check: rebuilding while Wrangler was watching
  had invalidated its local asset index on Windows, so it was restarted.
- `git diff --check`: passed. No commit, push, deployment, real Google collection
  traffic, or GA4 account/configuration change was performed.
