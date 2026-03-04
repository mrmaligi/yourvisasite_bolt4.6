## 2024-05-22 - Login Page Accessibility
**Learning:** Common pattern of icon-only buttons (password toggle) lacking accessible names and custom toggle groups (user type selection) missing semantic state.
**Action:** Audit all icon-only buttons for `aria-label` and ensure custom selection components use `aria-pressed` or `role="radio"`/`aria-checked` to communicate state to screen readers.

## 2026-02-22 - Toast Accessibility
**Learning:** Toast notifications were completely inaccessible to screen readers. Adding `role`, `aria-live`, and `aria-atomic` is crucial for feedback.
**Action:** Ensure all notification components in the future use `role="alert"` (errors) or `role="status"` (info) and proper live region attributes.

## 2026-02-23 - Loading State Accessibility
**Learning:** Loading spinners used across the app (especially in Suspense fallbacks) were purely visual, leaving screen reader users unaware of content loading.
**Action:** Always include `role="status"` and a visually hidden text label (e.g., "Loading...") in loading components to ensure status is announced.

## 2025-03-03 - Toggle Button Accessibility
**Learning:** Found an accessibility issue pattern with custom grouped buttons like the `ThemeToggle`. Custom groups lacking `role="group"` and `aria-label`s fail to announce their context to screen readers, and individual buttons acting as pseudo-radios need `aria-pressed` to indicate state. Focus indicators on un-styled custom buttons are often forgotten but are critical for keyboard navigation.
**Action:** Next time I encounter a custom button group used for toggling state, I will implement `role="group"`, set appropriate `aria-label` or `aria-labelledby`, add `aria-pressed` to the individual buttons, and ensure focus styles are visible (e.g. `focus-visible:ring-2`).
