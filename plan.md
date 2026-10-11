# BetterUs Implementation Plan

**Status:** Ready for implementation  
**Date:** October 11, 2026  
**Design sources:** `design/elegance_athletic/DESIGN.md` and the seven `screen.png` files under `design/`  
**Explicitly ignored:** every generated `code.html`

## 1. Implementation Goal

Replace the current task demo with the complete BetterUs mobile experience:

- Four-step onboarding.
- Home, Progress, and Profile tabs.
- Add Weight, Change Date, and Add Measurements modal flows.
- Convex-backed profile and date-indexed tracking data.
- TanStack Form for every editable form.
- The Elegance Athletic visual theme from the supplied designs.
- Safe-area, keyboard, accessibility, and cross-platform behavior for iOS and Android.

The screenshots are the visual reference, but product requirements and real data behavior take priority over decorative or unsupported content.

## 2. Decisions Made

### 2.1 Do not add React Native Paper

React Native Paper is not planned. The screenshots use Material-inspired patterns, but the visual system is heavily customized: bespoke typography, unusually large radii, berry surfaces, custom tab styling, and custom chart cards. Paper would add another theme and component layer that we would mostly override.

Instead:

- Keep NativeWind as the styling system.
- Expand the existing `src/components/ui/` primitives.
- Encode the supplied palette, typography, spacing, radii, and shadows as shared tokens.
- Use standard React Native accessibility semantics and press states.
- Use Expo Router's native-stack modal presentations rather than Paper portals and dialogs.

### 2.2 Do not add another icon library

`@expo/vector-icons` is already installed and SDK-compatible. Use `MaterialCommunityIcons` from that package to match the source designs. No duplicate icon package is needed.

### 2.3 Add only focused dependencies

Planned dependency additions:

```bash
pnpm expo install expo-secure-store react-native-svg
pnpm add @expo-google-fonts/epilogue @expo-google-fonts/plus-jakarta-sans
```

Purpose:

- `expo-secure-store`: persist the current Convex user ID on the device.
- `react-native-svg`: build charts matching the supplied visuals without adopting a large chart framework.
- Google font packages: provide Epilogue and Plus Jakarta Sans exactly as specified by the design system.

No calendar, date, bottom-sheet, state-management, or charting package is planned. The required behavior is small enough to implement with focused helpers and existing Expo APIs.

### 2.4 Use Expo Router JavaScript tabs

Use the stable `Tabs` layout from Expo Router, not unstable native tabs. JavaScript tabs allow the supplied berry icon/label styling, dimensions, borders, and safe-area behavior to be reproduced consistently across iOS and Android.

### 2.5 Use Expo Router form-sheet routes for modals

Create three route-backed modal sheets:

- Add/edit weight.
- Change date.
- Add/edit Sunday measurements.

Configure them with `presentation: "formSheet"`, suitable detents, a visible grabber where supported, and in-content headings/actions for Android compatibility. This avoids adding a third-party bottom-sheet library and preserves system dismissal behavior.

## 3. Design Translation

### 3.1 Keep from the supplied designs

- Warm blush page background and white floating cards.
- Deep plum text and berry primary actions.
- Epilogue headlines and numeric metrics.
- Plus Jakarta Sans body text and controls.
- Pill buttons, segmented controls, chips, and selectors.
- Large rounded cards with soft borders and subtle warm shadows.
- Four-segment onboarding progress header.
- Selected measurement cards and unit controls.
- Home date card, weight card, and Sunday measurement card.
- Progress range selector and line-chart presentation.
- Profile identity card, unit preference card, and tracked-measurement chips.
- Three-tab bottom navigation.

### 3.2 Intentionally remove or replace

Do not include any of the following from the generated designs:

- Synced, syncing, auto-synced, saved-to-cloud, or similar labels.
- Notification or bell icons.
- Excess top whitespace beyond the actual safe-area inset and standard screen spacing.
- Streak counts, streak badges, or “Top 5% streak” claims.
- “All on track” claims.
- Consistency percentages.
- Combined-metric claims that mix weight and circumference values.
- Calorie, hydration, metabolism, or nutrition language.
- Target weight or target-line features not represented in the schema.
- “Mindful Progress” stock-photo card.
- “Gentle Body Journey” progress card.
- Quick Log floating bar.
- “Privacy & Data Vault” marketing copy.
- Custom measurement creation; the product has a fixed list.
- Avatar upload; initials are sufficient for this version.
- Decorative content that cannot be derived honestly from stored data.

### 3.3 Product-correct replacements

- Replace “Target Areas” with “Measurements” or “Tracked measurements.”
- Replace generated body-metric claims with real values from Convex.
- Replace the home design's single date card with a compact week strip and data dots, while retaining its visual style.
- Show the Sunday measurement card only for a selected Sunday.
- Hide chart cards when no data exists and show a useful empty state instead.
- Keep motivational copy short and static only where it helps comprehension; do not present invented insights.

## 4. Shared Design System

### 4.1 Tokens

Extend `tailwind.config.js` with named tokens based on `design/elegance_athletic/DESIGN.md`:

- Colors: background, surfaces, primary berry, supporting pinks, plum text, outlines, error, and success.
- Font families: Epilogue and Plus Jakarta Sans.
- Font sizes and line heights from the design file.
- Radius scale from 8px through full-pill.
- App gutter and 8px spacing rhythm.
- Reusable low and high elevation shadows with platform-specific shadow/elevation values.

Keep all design values centralized. Screens should not scatter raw hex colors or arbitrary radii.

### 4.2 Fonts and startup

- Load required font weights in the root layout with `useFonts`.
- Hold the splash screen until fonts and the local user ID are ready.
- Update `app.json` branding from Tracker to BetterUs.
- Update splash and Android adaptive-icon background colors to the blush theme where existing assets remain legible.
- Continue using Continuous Native Generation; do not create or edit `ios/` or `android/` directories.

### 4.3 Shared UI primitives

Restyle or add:

- `AppScreen`: safe-area-aware screen container with optional scrolling.
- `AppText`: typography variants for headings, body, labels, and metric values.
- `AppButton`: primary, secondary, ghost, destructive, loading, and icon-only variants.
- `AppTextInput`: label, helper/error text, prefix/suffix, numeric mode, and success state.
- `AppCard`: shared surface, border, radius, and elevation.
- `AppIcon`: typed wrapper over MaterialCommunityIcons.
- `ProgressHeader`: back action, four progress segments, and step label.
- `SegmentedControl`: accessible unit and date-range selector.
- `SelectionCard`: gender and measurement selection.
- `MetricValue`: large value plus compact unit.
- `EmptyState`, `InlineError`, and `LoadingState`.
- `ModalHeader`: title, close action, and optional destructive action.

All touch targets should be at least 44 points, and selected/error states must not rely on color alone.

## 5. Safe Areas, Keyboard, and Layout

- Keep `SafeAreaProvider` at the application root.
- Every full-screen route uses `SafeAreaView` from `react-native-safe-area-context`.
- Main tab screens apply top/left/right insets; the tab navigator owns the bottom inset.
- Onboarding screens apply all edges and keep their primary action reachable on short devices.
- Modal content handles bottom insets inside the sheet.
- Form screens use a keyboard-aware layout with scrollable content and a visible primary action.
- Do not reproduce screenshot whitespace literally; use safe-area inset plus the 20px design gutter.
- Validate on a small iPhone-size viewport, a large iPhone-size viewport, and Android with gesture navigation.

## 6. Route Structure

Planned Expo Router structure:

```text
src/app/
  _layout.tsx
  index.tsx

  (onboarding)/
    _layout.tsx
    username.tsx
    profile.tsx
    units.tsx
    measurements.tsx

  (tabs)/
    _layout.tsx
    index.tsx
    progress.tsx
    profile.tsx

  profile/
    edit.tsx
    units.tsx
    measurements.tsx

  (modals)/
    weight.tsx
    date.tsx
    measurements.tsx
```

`src/app/index.tsx` becomes a lightweight routing gate:

1. Load the locally stored user ID.
2. If absent, replace with onboarding.
3. If present, query Convex for the user.
4. If valid, replace with the tabs.
5. If missing or invalid, clear the local ID and restart onboarding.

## 7. Local User Session

- Store only the Convex user ID in `expo-secure-store` under a versioned key.
- Use asynchronous SecureStore APIs.
- Do not enable biometric authentication.
- Treat the value as device continuity, not strong authentication.
- Expose session state through a small React context/provider: loading, user ID, set user ID, and clear user ID.
- Never display “synced” language when SecureStore or Convex operations complete.

## 8. Convex Backend Work

Before editing Convex code, re-read `convex/_generated/ai/guidelines.md`.

### 8.1 Shared validators and helpers

Add internal helpers for:

- Username normalization and validation.
- ISO logical-date validation.
- User-timezone “today” calculation.
- Sunday validation.
- Finite positive numeric validation.
- Duplicate-free preference validation.
- Weight conversion between kg and lb.
- Measurement conversion between cm and inches.
- Display rounding at the API boundary without rewriting stored data.
- Central daily-record upsert and empty-record cleanup.

### 8.2 User API

Implement:

- `users.checkUsernameAvailability`
- `users.create`
- `users.get`
- `users.updateProfile`
- `users.updateUnits`
- `users.updateMeasurementPreferences`

`users.create` performs the final indexed uniqueness check inside the mutation so concurrent onboarding attempts cannot create duplicate usernames.

### 8.3 Daily-record API

Implement:

- `dailyRecords.getByDate`
- `dailyRecords.listRange`
- `dailyRecords.listProgress`
- `dailyRecords.setWeight`
- `dailyRecords.removeWeight`
- `dailyRecords.setMeasurements`
- `dailyRecords.removeMeasurement`

Read queries return values converted to the user's current preferences. Stored records retain the exact value and unit entered at the time.

Queries must use `by_userId_and_date`, remain bounded, and include validators and return validators. All writes use central helpers so there is at most one daily record per user/date.

## 9. Onboarding Implementation

Use one onboarding draft provider so Back navigation preserves values. Create the Convex user only on the final step.

### 9.1 Username

- Match the screenshot's overall hierarchy and handle field.
- Remove the generated collage/banner and avatar-related footer.
- Use TanStack Form validation.
- Normalize to lowercase.
- Debounce availability checks by roughly 350ms.
- Show neutral, checking, available, invalid, and taken states.
- Recheck availability during final user creation.

### 9.2 Name and gender

- Keep the two-column selection-card design.
- Remove calorie, hydration, and metabolism copy.
- Keep name validation and concise helper text.
- Use the four approved gender choices.

### 9.3 Units

- Keep the two large segmented controls.
- Remove target-weight previews and fake “Live” content.
- Keep a short note explaining that preferences can change without rewriting historical values.

### 9.4 Measurements

- Keep the two-column selectable-card grid.
- Include all twelve approved measurement types, including separate relaxed and flexed biceps.
- Remove “Custom Area.”
- Require at least one selection.
- Keep the selection count.
- Submit the complete onboarding draft, persist the returned user ID, and replace navigation with Home.

## 10. Main Tabs

### 10.1 Home

Build a focused dashboard with:

- Compact title/header without notifications or streak badges.
- A seven-day horizontal date selector centered on the selected date.
- Previous/next controls and a Change action opening the date modal.
- A dot under dates that have data.
- Future dates disabled.
- Weight card showing the converted value or an empty prompt.
- Add/Edit Weight action opening the weight sheet.
- Sunday Measurements card only when the selected date is Sunday.
- Add/Edit Measurements action opening the measurements sheet.

Remove “All on track,” consistency, motivational photo, and invented trend content. A trend badge may appear only when it is calculated from real adjacent data.

### 10.2 Progress

Keep the source design's chart style while simplifying the content:

- Range selector: 7 days, 30 days, 90 days, 1 year.
- Weight chart when weight data exists.
- One chart or compact chart card for each selected measurement with data.
- Latest value and actual change over the selected range.
- Missing dates remain gaps, never zeroes.
- Units and axes follow current preferences.
- Empty state when no progress data exists.

Use a custom `react-native-svg` line chart:

- Responsive width measured from the card.
- Scaled x/y coordinates from the actual range.
- Grid lines, path, points, end-point emphasis, and optional tooltip.
- Accessible textual summary outside the SVG.
- No target lines until target data exists in the product model.

### 10.3 Profile

Keep:

- Initials avatar.
- Fixed username.
- Name and gender.
- Edit Profile action.
- Units card and Edit Units action.
- Tracked Measurements card, chips, and Edit Measurements action.

Remove streaks, the journey completion card, version marketing, and “Data Vault” language.

Profile edit routes reuse the onboarding form controls but load existing Convex values and save only the edited section.

## 11. Missing Modal Designs

All three sheets use the same white/blush surfaces, berry primary actions, plum typography, rounded controls, and safe-area treatment as the supplied screens.

### 11.1 Add/Edit Weight sheet

- Title reflects Add or Edit state.
- Show the selected logical date.
- Large decimal numeric input.
- Unit segmented control defaults to the current preference.
- When editing, initialize with the currently displayed converted value and preferred unit.
- Save with TanStack Form.
- If a value already exists, offer a clearly separated Remove Weight action.
- Preserve entered values after backend errors.

### 11.2 Change Date sheet

- Month header with previous/next month controls.
- Seven-column calendar grid.
- Selected date uses a solid berry circle.
- Dates containing data show a dot.
- Future dates are disabled.
- Include a Today shortcut.
- Selecting a date updates Home and dismisses the sheet.
- Generate calendar dates locally; query Convex only for the bounded visible month.

### 11.3 Add/Edit Measurements sheet

- Full-height form sheet for keyboard space.
- Show the selected Sunday.
- Render only currently selected measurement preferences.
- Decimal numeric field for each measurement.
- One measurement-unit selector for the entry session, defaulting to current preference.
- Permit partial measurement entry.
- Pre-fill existing values converted to the current preference.
- Save all edited values in one Convex mutation.
- Allow individual values to be cleared; clean up an empty daily record.
- Backend rejects non-Sunday dates even if client navigation is manipulated.

## 12. State and Data Flow

- URL/search parameters carry selected dates into modal routes.
- Home owns the selected logical date.
- Convex queries remain the source of truth after saves.
- Avoid mirroring server data into global client state.
- Use local component state only for draft input, open/close interactions, and chart selection.
- Query range data once per Progress range and derive individual chart series with memoization.
- Preference changes naturally re-run converted queries.

## 13. Offline and Error Behavior

- Keep network detection, but replace the current full-screen task-specific message.
- If initial data cannot load, show a retryable themed error state.
- If cached data is visible while offline, keep it visible and disable mutations with a concise offline message.
- Do not call this state “not synced” or show sync indicators.
- Every mutation exposes an inline error and leaves the user's form values intact.

## 14. Cleanup

After the replacement screens and APIs are connected:

- Delete task demo components and hooks.
- Delete `convex/tasks.ts`.
- Remove the temporary `tasks` table from `convex/schema.ts` only after the task code is gone.
- Replace unused starter images where required for the final app icon/splash work.
- Remove dead Tailwind classes and unused imports.
- Do not retain generated `code.html` logic or dependencies.

## 15. Implementation Order

1. Install the approved focused dependencies with pnpm/Expo install.
2. Add design tokens, fonts, branded startup, and shared UI primitives.
3. Implement date, unit-conversion, measurement metadata, and formatting utilities with tests.
4. Implement Convex user and daily-record APIs and deploy once to the known dev deployment.
5. Add SecureStore session provider and root routing gate.
6. Build and connect all four onboarding screens.
7. Build the custom tab layout and Home screen.
8. Build the Weight, Date, and Measurements sheets.
9. Build Progress charts and range handling.
10. Build Profile and its three edit routes.
11. Add loading, empty, offline, and error states.
12. Remove the task demo and temporary schema.
13. Run full verification and visual refinement against every supplied screenshot.

## 16. Verification

### Automated and static checks

Run before completion:

```bash
pnpm lint
pnpm typecheck
pnpm dlx expo-doctor
pnpm convex dev --once
```

Add focused tests for:

- Username normalization and validation.
- Username uniqueness race handling.
- kg/lb and cm/in conversions.
- Repeated preference switches without data drift.
- ISO date parsing and user-timezone today calculation.
- Sunday validation.
- Daily-record upsert and empty-record deletion.
- Calendar grid generation and future-date disabling.
- Chart handling of empty, single-point, and gapped series.

### Manual flow checks

- Complete onboarding on iOS and Android.
- Navigate backward and forward without losing onboarding drafts.
- Relaunch and restore the same profile.
- Add, edit, and remove today's weight.
- Select a historical date with a data dot.
- Add partial measurements on a Sunday.
- Confirm non-Sunday measurement writes are rejected.
- Switch kg to lb and cm to inches and verify history/charts update.
- Edit name, gender, units, and measurements.
- Deselect and reselect a measurement without losing history.
- Check keyboard behavior and safe areas on small and large devices.
- Confirm no sync labels or notification icons exist anywhere.

## 17. Definition of Done

- All seven supplied screens are represented by functional app routes with the approved simplifications.
- All three missing modal flows are implemented in the same theme.
- All data comes from Convex; no fabricated metrics or claims appear.
- Current unit preferences convert historical entries without rewriting them.
- The application respects safe areas and keyboard constraints on iOS and Android.
- TanStack Form powers all user-editable forms.
- The task demo and temporary task schema are removed.
- Lint, typecheck, Expo Doctor, and Convex deployment checks pass.
- No commit or push is performed without an explicit request.

## 18. Documentation References

- Expo SDK 57 reference: https://docs.expo.dev/versions/v57.0.0/
- Expo Router tabs: https://docs.expo.dev/router/advanced/tabs/
- Expo Router modals and form sheets: https://docs.expo.dev/router/advanced/modals/
- Expo SecureStore for SDK 57: https://docs.expo.dev/versions/v57.0.0/sdk/securestore/
- Expo Font for SDK 57: https://docs.expo.dev/versions/v57.0.0/sdk/font/
- Safe-area context for SDK 57: https://docs.expo.dev/versions/v57.0.0/sdk/safe-area-context/
- React Native SVG for SDK 57: https://docs.expo.dev/versions/v57.0.0/sdk/svg/
