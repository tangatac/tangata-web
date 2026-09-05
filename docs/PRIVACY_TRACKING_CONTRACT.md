# Privacy & Tracking Development Contract

Privacy by design is a project constraint for Tangata. New features require a privacy review before implementation when they introduce third-party runtime requests, cookies, localStorage, sessionStorage, IndexedDB, persistent identifiers, analytics, telemetry, advertising, remarketing, user-submitted personal data, externally hosted embeds, booking, payment, newsletter, chat or form providers.

Third-party and tracking logic must be centralised in shared configuration, layouts or components rather than scattered through page content. Non-essential storage or access technologies must not run before any legally required consent. The privacy notice must be updated before a new use of personal data begins.

Analytics events must never contain sensitive or form content, names, email addresses, counselling information or personal data in event payloads or URLs. Future event names must describe generic actions only, such as `contact_click` or `booking_click`.

Advertising pixels and behavioural remarketing require a separate explicit review and must never be introduced incidentally.

Every new third-party service must document its purpose, provider, activation condition, data and storage implications, and the relevant privacy-notice change before release. This contract is a development control, not a claim of legal certification.