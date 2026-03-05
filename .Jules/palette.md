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

## 2025-03-04 - Tabs Accessibility
**Learning:** Custom Tabs components often lack the necessary attributes for screen readers to interpret them correctly. A `tablist` container, individual `tab` elements with `aria-selected` and `aria-controls`, and `tabpanel` elements with `aria-labelledby` are essential for semantic structure. Furthermore, keyboard accessibility requires proper `tabIndex` management and visible focus indicators. Generating unique IDs (using `useId`) is critical for robust associations between tabs and their panels.
**Action:** Always follow the WAI-ARIA authoring practices for tabs. Use `role="tablist"`, `role="tab"`, and `role="tabpanel"`. Maintain `aria-selected`, `aria-controls`, and `aria-labelledby` with dynamically generated unique IDs. Ensure keyboard users have visible focus styles (`focus-visible:ring-2`) and proper tab sequence (`tabIndex={0}` on selected tab and active panel, `-1` on unselected tabs).

## 2024-03-05 - Form Validation Accessibility in Input.tsx
**Learning:** Naive ID generation for form labels based on `label.toLowerCase()` causes duplicate ID conflicts when the same label (e.g., "Email") appears multiple times on a single page. Furthermore, error states were missing `aria-invalid` and `aria-describedby` connections, causing screen readers to silently fail at announcing errors.
**Action:** Use React's `useId()` for robust, globally unique ID generation in reusable components. Always link inputs to their respective error or helper text paragraphs using `aria-describedby` and ensure dynamic error messages use `aria-live="polite"` so they are announced upon validation failures without interrupting the user.
