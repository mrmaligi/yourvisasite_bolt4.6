## 2024-05-22 - Login Page Accessibility
**Learning:** Common pattern of icon-only buttons (password toggle) lacking accessible names and custom toggle groups (user type selection) missing semantic state.
**Action:** Audit all icon-only buttons for `aria-label` and ensure custom selection components use `aria-pressed` or `role="radio"`/`aria-checked` to communicate state to screen readers.
