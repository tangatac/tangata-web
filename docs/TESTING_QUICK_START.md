# Quick Start: Accessibility Testing

## Run Tests

```bash
# Start the dev server first (in one terminal)
npm run dev

# In another terminal, run accessibility tests
npm run test:a11y
```

## View Test Results

After tests complete, open the HTML report:
```bash
npx playwright show-report
```

## Debug a Failing Test

```bash
npm run test:debug
```

This opens the Playwright Inspector with step-by-step execution.

## Test Specific Page

Edit `tests/accessibility.spec.js` and modify the `BASE_URL` or add a `test.only()` block:

```javascript
test.only('Home page - axe accessibility scan', async ({ page }) => {
  // This test will run in isolation
});
```

## Manual Testing Checklist

See `docs/ACCESSIBILITY_MANUAL_TEST.md` for:
- Keyboard navigation steps
- Screen reader testing procedures
- Zoom and contrast verification
- Page-specific test cases

## Key Files

| File | Purpose |
|------|---------|
| `tests/accessibility.spec.js` | Automated test suite (20+ tests) |
| `playwright.config.js` | Test configuration |
| `src/pages/accessibility/index.astro` | Public accessibility page |
| `docs/ACCESSIBILITY_STATEMENT.md` | Legal & commitment statement |
| `docs/ACCESSIBILITY_MANUAL_TEST.md` | Manual testing guide |
| `docs/ACCESSIBILITY_COMPLETION_REPORT.md` | Full audit report |

## Key Changes Made

✅ **Skip link** - First tab stops at `#main-content`  
✅ **Main landmark** - Content wrapped in `<main id="main-content">`  
✅ **Video accessibility** - Removed autoplay, improved titles  
✅ **Alt text audit** - 100% coverage on all images  
✅ **Keyboard navigation** - Full keyboard operability verified  
✅ **Contrast** - 4.5:1 minimum on all text (WCAG AA)  
✅ **Reflow** - Works at 320px and 200% zoom  
✅ **Focus indicators** - 3px sky blue outline on all interactive elements  

## Issues to Watch

- YouTube video captions depend on video creator (auto-generated available)
- Physical Fishponds location is not wheelchair accessible (noted on Accessibility page)
- Test environment must have dev server running (`npm run dev`)

## Continuous Integration

To add accessibility tests to your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run accessibility tests
  run: npm run test:a11y
```

Make sure dev server starts before tests run.

## Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Accessibility Statement](docs/ACCESSIBILITY_STATEMENT.md)
- [Manual Testing Guide](docs/ACCESSIBILITY_MANUAL_TEST.md)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [Playwright Testing](https://playwright.dev/docs/intro)
