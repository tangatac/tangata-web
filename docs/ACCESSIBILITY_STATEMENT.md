# Accessibility Statement & Contract

**Last updated:** September 2026

## Commitment

Tangata Counselling is committed to ensuring digital accessibility of our website and services for all people, including those with disabilities. We aim to meet or exceed WCAG 2.2 level AA standards for web accessibility.

## Standards & Guidelines

### Web Accessibility Standards
- **Target:** WCAG 2.2 Level AA compliance
- **Scope:** All public-facing web pages (tangata-counselling.co.uk)
- **Timeline:** Ongoing; new features tested before release
- **Review cycle:** Manual accessibility audits quarterly; automated scanning on each build

### Key Principles (WCAG 2.2)
1. **Perceivable** — Information must be perceivable to users through their senses
   - Images have meaningful alt text
   - Video has captions and audio descriptions
   - Content is not solely conveyed by colour or sound
   - Text is readable and colour contrast meets AA standards (4.5:1 minimum)

2. **Operable** — All functionality must be operable by keyboard
   - All pages can be navigated using Tab, Shift+Tab, Enter, Space, and Arrow keys
   - No keyboard traps
   - Skip links allow users to bypass repetitive content
   - Links and buttons have visible focus indicators
   - Touch targets are min 44×44 CSS pixels

3. **Understandable** — Information and operation must be understandable
   - Content is written clearly
   - Language is set in HTML (lang="en-GB")
   - Page headings form a logical hierarchy
   - Form labels are associated with inputs
   - Error messages are clear

4. **Robust** — Content must work with assistive technology
   - Semantic HTML is used correctly
   - ARIA labels only enhance, not replace, semantic HTML
   - Screen readers can announce all page content
   - Text is preserved when CSS is disabled

## Scope & Implementation

### What is Included
- Homepage (/)
- Blog pages (/blog/ and individual posts)
- EMDR service pages (/emdr/*)
- Fees page (/fees/)
- Accessibility page (/accessibility/)
- Navigation, footer, and cross-page components
- Responsive design (tested at 320px, 768px, 1024px+ widths)

### Known Limitations & Workarounds
- **Homepage YouTube video:** Nick has manually confirmed that captions are embedded in the original video. Contact us if you have trouble accessing them.
- **Physical access (Fishponds location):** The counselling room requires climbing two flights of stairs and is not wheelchair accessible. Online counselling or alternative arrangements are available.
- **Third-party embeds:** Any embedded third-party content (e.g., scheduling tools, external links) is beyond Tangata Counselling's direct control, though we select partners with accessibility in mind.

## Accessibility Features

### Keyboard Navigation
- Complete keyboard navigation without mouse required
- Logical tab order: skip link → navigation → main content → footer
- Clear focus indicators (3px blue outline)
- No positive tabindex values (no overriding natural tab order)

### Visual Design
- Colour contrast: Text at least 4.5:1 against background (AA standard)
- Large text (18pt+) meets 3:1 contrast minimum
- Content reflows cleanly up to 200% zoom without horizontal scroll
- Responsive design works at all viewport sizes from 320px width

### Media
- Images have concise alt text describing content or function
- Decorative images are marked as such (aria-hidden or alt="")
- YouTube videos use youtube-nocookie embed with descriptive titles
- No autoplay; users control when media plays

### Motion & Animation
- Animations respect user's `prefers-reduced-motion` setting
- Essential information is not conveyed only through motion
- Animations are smooth (60fps) and not distracting

### Assistive Technology Support
- Proper semantic HTML (landmarks: banner, navigation, main, contentinfo)
- ARIA labels used sparingly to enhance semantics, not replace them
- Form fields have associated labels
- Headings form a logical outline

## Testing & Validation

### Automated Testing
- Weekly: Lighthouse Accessibility audit (minimum 90/100)
- On each build: axe-core scanning for WCAG violations
- Continuous monitoring via axe DevTools

### Manual Testing
- Quarterly: Full keyboard navigation audit
- Quarterly: Screen reader testing (NVDA/JAWS on Windows, VoiceOver on macOS)
- Quarterly: Zoom (200%) and narrow viewport (320px) testing
- Before each release: Smoke test with new features

### Tools Used
- axe-core (automated scanning)
- Lighthouse (browser-based audit)
- Playwright + axe (regression testing)
- NVDA / JAWS / VoiceOver (assistive technology)
- WebAIM Contrast Checker (colour compliance)
- Wave Browser Extension (quick audits)

### Frequency & Schedule
- **Automated:** Continuous (on commit/build)
- **Manual:** Quarterly full audit + spot checks before releases
- **Community feedback:** Addressed within 5 working days
- **Major feature additions:** Full accessibility audit before launch

## Contact & Feedback

### Reporting Accessibility Issues
If you encounter a barrier on the Tangata Counselling website or in our online services:

**Email:** nick@tangata-counselling.co.uk  
**Phone:** 07988 136267  

Please include:
1. The page or feature affected
2. What you were trying to do
3. What went wrong or made it difficult
4. Your browser, device, and any assistive technology used

We'll investigate and respond within 5 working days.

### Requesting Information in Different Formats
We can provide information in:
- Large print
- Braille
- Audio (recorded or synthesized)
- Electronic text (Word, PDF, HTML)
- Plain language summary
- British Sign Language (BSL) video

Contact us with your needs.

## Legal & Standards References

- **WCAG 2.2:** https://www.w3.org/WAI/WCAG22/quickref/
- **Web Content Accessibility Guidelines 2.2** Level AA standard
- **Equality Act 2010** (UK): Public sector and private service providers have legal obligations to make reasonable adjustments and ensure non-discrimination

## Changes & Updates

This statement will be reviewed:
- When new features are added
- After quarterly audits
- In response to community feedback
- At minimum annually

Last reviewed: September 2026

---

## Commitment to Continuous Improvement

Accessibility is an ongoing journey. We are committed to:
- Staying current with WCAG updates and best practices
- Seeking feedback from people with disabilities
- Testing with real assistive technology users
- Training our team on accessibility principles
- Making reasonable adjustments for individual needs

If you need support or have suggestions, please get in touch.

**Tangata Counselling**  
Bristol, UK  
nick@tangata-counselling.co.uk
