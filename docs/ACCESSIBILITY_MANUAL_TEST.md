# Accessibility Manual Testing Checklist

Use this checklist to verify accessibility across representative pages. Test on multiple browsers and devices.

## Test Pages
- Home (/)
- Blog index (/blog/)
- A blog post (e.g., /blog/s1b1-what-is-emdr/)
- One EMDR topic page (e.g., /emdr/trauma-and-ptsd/)
- Fees (/fees/)
- Accessibility (/accessibility/)

## Keyboard Navigation
- [ ] Tab through all links and buttons in logical order (top to bottom, left to right)
- [ ] No keyboard traps: able to tab away from every element
- [ ] No positive tabindex values (tabindex > 0)
- [ ] No accesskey attributes
- [ ] Focus moves to mobile menu when open on narrow screens
- [ ] Blog filters/category buttons keyboard-operable (if present)

## Skip Link & Focus
- [ ] Press Tab from page load: skip link appears visually
- [ ] Skip link is keyboard-focusable
- [ ] Activating skip link jumps to main content (focus management visible)
- [ ] All interactive elements have visible focus indicators (3px outline in blue/sky colour)
- [ ] Focus state clearly distinguishes from hover state

## Mobile Navigation
- [ ] Navigation links are keyboard-accessible on mobile
- [ ] Navigation does not overlap logo or main content
- [ ] Links have sufficient tap target size (min 44×44px recommended)
- [ ] No unexpected scrolling when focusing elements

## Zoom & Reflow
- [ ] At 320px CSS width: no horizontal scroll, all content readable
- [ ] At 200% browser zoom: all content visible and usable, no overlaps
- [ ] Text remains readable at larger sizes
- [ ] Images scale appropriately without distortion

## Contrast
- [ ] All text meets WCAG AA contrast (4.5:1 for normal text, 3:1 for large text)
- [ ] Buttons and links have sufficient contrast against background
- [ ] Focus indicators are clearly visible against all backgrounds
- [ ] Hover states have sufficient contrast (no colour-only feedback)
- [ ] No information conveyed by colour alone (always include text or symbol)

## Images & Media
- [ ] All informative images have concise, meaningful alt text
- [ ] Decorative images have `alt=""` (e.g., background patterns, icons)
- [ ] Functional images (buttons with icons) have descriptive alt or aria-label
- [ ] YouTube videos have descriptive titles in iframe title attribute
- [ ] Embedded videos have captions (check or document availability)

## Reduced Motion
- [ ] Set `prefers-reduced-motion: reduce` in OS settings
- [ ] Animations/transitions are disabled or significantly reduced
- [ ] Page remains functional and usable without animation
- [ ] Motion is non-essential (does not convey required information)

## Forms & Controls
- [ ] Form labels are associated with inputs (not placeholder-only)
- [ ] Required fields are marked (with text, not icon/colour alone)
- [ ] Error messages are clear and linked to fields
- [ ] Buttons have descriptive text (not "Submit" or "Go" alone where context unclear)

## Color
- [ ] No information conveyed by colour alone
- [ ] Links are identifiable by underline or other marker, not just colour
- [ ] Error messages include text, not just red background
- [ ] UI components don't rely on colour to show state changes

## Screen Reader Smoke Test
**Tools:** NVDA (Windows, free) or JAWS (Windows), VoiceOver (macOS/iOS), TalkBack (Android)

- [ ] Page title is announced
- [ ] Landmarks are announced (banner, navigation, main, contentinfo/footer)
- [ ] Headings are announced in correct hierarchy (H1, H2, H3...)
- [ ] Lists are announced with item count
- [ ] Links have descriptive text (avoid "click here", "read more" without context)
- [ ] Button purposes are clear (not just icons)
- [ ] Images have alt text announced appropriately
- [ ] Form labels are announced with inputs
- [ ] Videos have captions or transcripts available

## Captions & Transcripts
- [ ] YouTube videos embedded on the page have captions available
- [ ] Captions are synchronized with audio
- [ ] Transcripts are provided for important video content (if not auto-generated)
- [ ] Transcripts link or location is clearly stated

## Specific Page Checks

### Home Page
- [ ] Hero video: iframe title is descriptive, no autoplay, captions available
- [ ] All buttons are keyboard-accessible
- [ ] EMDR service cards are announced as a list
- [ ] Blog post preview cards are accessible
- [ ] Professional credentials list has proper structure

### Blog Index & Post Pages
- [ ] Blog post title is an H1
- [ ] Post date and category are announced appropriately
- [ ] Author avatar has alt text
- [ ] Any embedded YouTube videos have descriptive titles
- [ ] "More posts" navigation is announced as navigation

### Fees Page
- [ ] Fee list is properly structured (list, not table)
- [ ] Prices are clearly associated with session lengths
- [ ] CTA button is keyboard-accessible and has visible focus

### Accessibility Page
- [ ] All sections are properly headed
- [ ] Contact links (email/phone) are functional
- [ ] Physical access information is clear and factual
- [ ] Procedure for reporting issues is clear

## Results
- **Date tested:** _______________
- **Tester:** _______________
- **Browsers/devices tested:** _______________
- **Issues found:** (Document and create issues)
- **Notes:** _______________

## Notes for Developers
- Do not suppress focus indicators without providing an accessible alternative
- Always test with keyboard-only navigation
- Use automated tools (axe-core, Lighthouse) as a starting point, but manual testing is essential
- Test with real assistive technology when possible
