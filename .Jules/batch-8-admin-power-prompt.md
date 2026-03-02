================================================================================
BATCH 8: ADMIN POWER TOOLS (Pages 71-80)
Project: yourvisasite_bolt4.6
================================================================================

Create 10 advanced admin feature pages for the VisaBuild platform.

PAGES TO CREATE:

--- PAGE 71: SystemHealth ---
File: src/pages/admin/performance/SystemHealth.tsx
Path: /admin/system
Description: System status dashboard
Features:
- Service status indicators
- Database health
- API response times
- Storage usage
- Error rate graphs
- Uptime statistics
- Alert configuration

--- PAGE 72: DatabaseBrowser ---
File: src/pages/admin/DatabaseBrowser.tsx
Path: /admin/database
Description: Direct database explorer
Features:
- Table list
- Row browser with pagination
- Search/filter rows
- Edit rows inline
- Export table data
- Schema viewer
- Query builder (basic)

--- PAGE 73: QueryRunner ---
File: src/pages/admin/QueryRunner.tsx
Path: /admin/queries
Description: SQL query interface
Features:
- SQL editor with syntax highlighting
- Query history
- Save favorite queries
- Results table display
- Export results
- Query performance metrics
- Read-only safety mode

--- PAGE 74: CacheManager ---
File: src/pages/admin/performance/CacheManager.tsx
Path: /admin/cache
Description: Cache management UI
Features:
- Cache statistics
- Cache keys list
- Clear cache by pattern
- TTL management
- Cache warming
- Hit/miss ratios
- Cache size monitoring

--- PAGE 75: RateLimiter ---
File: src/pages/admin/performance/RateLimiter.tsx
Path: /admin/rate-limits
Description: API rate limiting config
Features:
- Endpoint list with limits
- Adjust rate limits
- Per-user vs global limits
- Whitelist/blacklist
- Rate limit analytics
- Burst configuration
- Limit violation logs

--- PAGE 76: FeatureFlags ---
File: src/pages/admin/performance/FeatureFlags.tsx
Path: /admin/features
Description: Feature toggle management
Features:
- Feature flag list
- Enable/disable toggles
- User segment targeting
- Percentage rollout
- A/B test assignment
- Feature flag history
- Scheduled flag changes

--- PAGE 77: ABTesting ---
File: src/pages/admin/performance/ABTesting.tsx
Path: /admin/ab-tests
Description: A/B test configuration
Features:
- Create new tests
- Variant configuration
- Traffic split control
- Conversion goals
- Test results dashboard
- Statistical significance
- Winner declaration

--- PAGE 78: MigrationTool ---
File: src/pages/admin/MigrationTool.tsx
Path: /admin/migrations
Description: Database migration UI
Features:
- Migration status list
- Run pending migrations
- Rollback migrations
- Migration history
- Migration details view
- Dry-run mode
- Migration scheduling

--- PAGE 79: BackupManager ---
File: src/pages/admin/performance/BackupManager.tsx
Path: /admin/backups
Description: Backup/restore interface
Features:
- Backup schedule configuration
- Manual backup trigger
- Backup list with timestamps
- Restore from backup
- Download backups
- Backup verification
- Retention policy

--- PAGE 80: LogViewer ---
File: src/pages/admin/performance/LogViewer.tsx
Path: /admin/logs
Description: Real-time log streaming
Features:
- Real-time log tail
- Log level filtering
- Search logs
- Log color coding
- Export logs
- Log retention info
- Error alerting

TECHNICAL REQUIREMENTS:
1. Use TypeScript with proper interfaces
2. SQL editor component ( Monaco Editor or CodeMirror)
3. Real-time data updates (WebSockets or polling)
4. Charts for metrics (Recharts)
5. Administrative access controls
6. Audit logging for all admin actions
7. Confirmation dialogs for destructive actions

DATABASE REQUIREMENTS:
- admin_actions: audit log
- feature_flags: feature toggles
- ab_tests: test configuration
- cache_stats: cache metrics
- system_logs: application logs

SECURITY REQUIREMENTS:
- Admin-only access (strict role check)
- Additional authentication for destructive actions
- Read-only mode options
- Activity logging
- IP restrictions (optional)

COMPONENTS TO CREATE:
- SQLEditor component
- LogStream component
- MetricCard component
- StatusIndicator component
- MigrationRow component

================================================================================
