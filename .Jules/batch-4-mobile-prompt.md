================================================================================
BATCH 4: MOBILE-FIRST EXPERIENCE (Pages 31-40)
Project: yourvisasite_bolt4.6
================================================================================

Create 10 mobile-optimized pages and PWA features for the VisaBuild platform.

PAGES TO CREATE:

--- PAGE 31: MobileDashboard ---
File: src/pages/mobile/MobileDashboard.tsx
Path: /mobile/dashboard
Description: Optimized mobile dashboard
Features:
- Bottom navigation bar
- Swipeable cards
- Pull-to-refresh
- Quick action FAB (floating action button)
- Gesture-based navigation
- Touch-optimized buttons (44px minimum)
- Offline indicator

--- PAGE 32: QuickActions ---
File: src/pages/mobile/QuickActions.tsx
Path: /mobile/quick
Description: One-tap quick actions
Features:
- Grid of quick actions
- Customizable action buttons
- Most-used actions
- Recent actions
- Action categories
- Long-press options
- Widget support

--- PAGE 33: OfflineMode ---
File: src/pages/mobile/OfflineMode.tsx
Path: /mobile/offline
Description: Offline content access
Features:
- Offline content library
- Download management
- Sync status indicators
- Offline document viewer
- Queued actions (sync when online)
- Storage usage display
- Clear offline data option

--- PAGE 34: PushSettings ---
File: src/pages/mobile/PushSettings.tsx
Path: /mobile/notifications
Description: Push notification preferences
Features:
- Push permission management
- Notification categories toggle
- Quiet hours settings
- Vibration patterns
- Notification sounds
- Priority levels
- Per-visa notification settings

--- PAGE 35: MobileScanner ---
File: src/pages/mobile/MobileScanner.tsx
Path: /mobile/scan
Description: Camera-optimized document scan
Features:
- Full-screen camera interface
- Auto-capture on document detection
- Multi-page scanning
- Flash toggle
- Focus controls
- Real-time edge detection
- Instant preview

--- PAGE 36: VoiceInput ---
File: src/pages/mobile/VoiceInput.tsx
Path: /mobile/voice
Description: Voice command interface
Features:
- Voice search
- Voice form filling
- Voice commands ("go to dashboard", "show my visas")
- Voice-to-text notes
- Multi-language support
- Voice feedback
- Command suggestions

--- PAGE 37: BiometricAuth ---
File: src/pages/mobile/BiometricAuth.tsx
Path: /mobile/biometric
Description: Face/fingerprint login
Features:
- Biometric setup
- Enable/disable biometric login
- Fallback PIN/password
- Security info
- Device compatibility check
- Biometric status indicator

--- PAGE 38: WidgetConfig ---
File: src/pages/mobile/WidgetConfig.tsx
Path: /mobile/widgets
Description: Home screen widget settings
Features:
- Widget size options
- Widget content selection
- Preview widget
- Update frequency
- Dark/light theme
- Transparent background option
- iOS/Android specific settings

--- PAGE 39: DataSaver ---
File: src/pages/mobile/DataSaver.tsx
Path: /mobile/data-saver
Description: Low-bandwidth mode
Features:
- Data saver toggle
- Image quality settings
- Auto-download on WiFi only
- Data usage statistics
- Compression options
- Background sync settings
- Data warning alerts

--- PAGE 40: AppShortcuts ---
File: src/pages/mobile/AppShortcuts.tsx
Path: /mobile/shortcuts
Description: iOS/Android app shortcuts
Features:
- Shortcut configuration
- 3D Touch/quick actions
- Deep link management
- Shortcut preview
- Default shortcuts
- Custom shortcut creation
- Shortcut analytics

TECHNICAL REQUIREMENTS:
1. Use TypeScript with proper interfaces
2. Use Capacitor/Cordova APIs for native features
3. Touch-optimized UI (44px minimum touch targets)
4. Swipe gesture support
5. PWA manifest updates for new features
6. Service worker updates for offline
7. Mobile-specific CSS (safe areas, notches)
8. Hardware API integration (camera, haptics, biometrics)

PWA MANIFEST UPDATES:
- Add shortcuts array
- Update icons for different sizes
- Add screenshots for app stores
- Update theme colors

SERVICE WORKER:
- Cache strategies for offline pages
- Background sync for queued actions
- Push notification handling

COMPONENTS TO CREATE:
- BottomNav component
- PullToRefresh component
- FloatingActionButton component
- SwipeableCard component
- OfflineIndicator component

================================================================================
