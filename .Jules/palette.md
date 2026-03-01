## 2024-05-22 - Login Page Accessibility
**Learning:** Common pattern of icon-only buttons (password toggle) lacking accessible names and custom toggle groups (user type selection) missing semantic state.
**Action:** Audit all icon-only buttons for `aria-label` and ensure custom selection components use `aria-pressed` or `role="radio"`/`aria-checked` to communicate state to screen readers.

## 2026-02-22 - Toast Accessibility
**Learning:** Toast notifications were completely inaccessible to screen readers. Adding `role`, `aria-live`, and `aria-atomic` is crucial for feedback.
**Action:** Ensure all notification components in the future use `role="alert"` (errors) or `role="status"` (info) and proper live region attributes.

## 2026-02-23 - Loading State Accessibility
**Learning:** Loading spinners used across the app (especially in Suspense fallbacks) were purely visual, leaving screen reader users unaware of content loading.
**Action:** Always include `role="status"` and a visually hidden text label (e.g., "Loading...") in loading components to ensure status is announced.

## 2024-10-24 - Interactive Star Ratings Accessibility
**Learning:** Custom interactive star ratings (like ReviewForm) are often just grouped buttons. They need `role="radiogroup"` on the container and `role="radio"` with `aria-checked` on individual stars to function correctly for screen readers.
**Action:** When building or auditing custom rating components, treat them semantically as radio button groups. Include clear `aria-label`s on both the interactive and display-only versions.
