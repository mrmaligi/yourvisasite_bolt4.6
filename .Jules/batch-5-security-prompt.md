================================================================================
BATCH 5: SECURITY & COMPLIANCE (Pages 41-50)
Project: yourvisasite_bolt4.6
================================================================================

Create 10 security and compliance feature pages for the VisaBuild platform.

PAGES TO CREATE:

--- PAGE 41: SecurityCenter ---
File: src/pages/security/SecurityCenter.tsx
Path: /security/center
Description: Centralized security dashboard
Features:
- Security score/overview
- Recent security events
- Recommended actions
- Security checklist
- Breach monitoring status
- 2FA status
- Last password change

--- PAGE 42: AuditLog ---
File: src/pages/security/AuditLog.tsx
Path: /security/audit
Description: Personal security audit log
Features:
- Chronological activity log
- Filter by activity type
- Export audit log
- Suspicious activity alerts
- IP address tracking
- Device information
- Failed login attempts

--- PAGE 43: DeviceManagement ---
File: src/pages/security/DeviceManagement.tsx
Path: /security/devices
Description: Manage connected devices
Features:
- List of connected devices
- Device details (OS, browser, location)
- Last active timestamp
- Remote logout
- Device naming
- Trusted devices
- New device alerts

--- PAGE 44: SessionHistory ---
File: src/pages/security/SessionHistory.tsx
Path: /security/sessions
Description: Active and past sessions
Features:
- Current active sessions
- Session duration
- Location/IP info
- Terminate session button
- Session history
- Concurrent session limits
- Suspicious session alerts

--- PAGE 45: DataExport ---
File: src/pages/security/DataExport.tsx
Path: /security/export
Description: GDPR data export
Features:
- Request data export
- Select data categories
- Export format options (JSON, PDF)
- Download links (expiring)
- Export history
- Delete after download option
- Estimated size

--- PAGE 46: DataRetention ---
File: src/pages/security/DataRetention.tsx
Path: /security/retention
Description: Data retention settings
Features:
- Retention policy overview
- Custom retention periods
- Auto-delete settings
- Archive options
- Retention by data type
- Compliance explanations
- Apply/confirm changes

--- PAGE 47: PrivacyCenter ---
File: src/pages/security/PrivacyCenter.tsx
Path: /security/privacy
Description: Privacy controls hub
Features:
- Privacy settings overview
- Third-party sharing controls
- Marketing preferences
- Analytics opt-out
- Cookie preferences
- Data processing info
- Privacy rights (GDPR/CCPA)

--- PAGE 48: EncryptionKeys ---
File: src/pages/security/EncryptionKeys.tsx
Path: /security/keys
Description: Document encryption management
Features:
- Encryption status overview
- Key management
- Re-encryption options
- Recovery key setup
- Key rotation history
- Encrypted document list
- Decrypt/encrypt actions

--- PAGE 49: BackupCodes ---
File: src/pages/security/BackupCodes.tsx
Path: /security/backup
Description: 2FA backup codes
Features:
- Generate new backup codes
- View/download codes
- Codes remaining count
- Usage history
- Regenerate warnings
- Secure storage tips
- Used code indicator

--- PAGE 50: EmergencyAccess ---
File: src/pages/security/EmergencyAccess.tsx
Path: /security/emergency
Description: Emergency contact access
Features:
- Emergency contact setup
- Access permissions
- Time-limited access
- Access notifications
- Revoke access
- Emergency contact instructions
- Activity log for emergency access

TECHNICAL REQUIREMENTS:
1. Use TypeScript with proper interfaces
2. Maximum security for sensitive pages
3. Additional authentication for critical actions
4. Audit logging for all security changes
5. Encryption for sensitive data display
6. Rate limiting for security endpoints
7. Clear privacy policy links

DATABASE REQUIREMENTS:
- security_audit_log: security events
- user_devices: device information
- user_sessions: session tracking
- data_exports: export requests
- backup_codes: 2FA backup codes
- emergency_access: emergency contact setup

SECURITY CONSIDERATIONS:
- Require password re-entry for sensitive changes
- Email confirmations for critical actions
- Time delays for destructive actions
- Immutable audit logs

COMPONENTS TO CREATE:
- SecurityScore component
- DeviceCard component
- AuditLogEntry component
- DataCategorySelector component

================================================================================
