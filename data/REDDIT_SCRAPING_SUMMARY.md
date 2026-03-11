# Reddit Scraping Data Summary - March 11, 2026

## Overnight Scraping Session

**Duration:** 11:30 PM - 5:04 AM AEDT (5.5 hours)  
**Frequency:** Every 10 minutes  
**Total Runs:** ~35 scrapes  
**Estimated Entries Collected:** 700-900+ visa timeline posts

---

## Data Sources

### Subreddits Scraped:
- r/AusVisa
- r/immigration
- r/Australia
- r/Visa
- r/AusFinance
- r/ImmigrationAU
- r/Visas
- r/migration
- r/IWantOut
- r/WorkingHoliday
- r/ExpatFIRE
- r/AskAnAustralian
- r/sydney
- r/melbourne
- r/Perth
- r/AusImmigration
- r/VisaAdvice
- r/Expats

---

## Visa Types Collected

| Visa Subclass | Description | Sample Data Points |
|---------------|-------------|-------------------|
| 189 | Skilled Independent | Processing times ~180-220 days |
| 190 | Skilled Nominated | State nominated, varying by state |
| 491 | Skilled Work Regional | ~280-300 days |
| 820/801 | Partner Visa | ~350-400 days |
| 482 | Temporary Skill Shortage | ~40-50 days |
| 500 | Student Visa | ~25-30 days |
| 485 | Graduate Visa | ~35-45 days |
| 186 | Employer Nomination Scheme | ~380-400 days |
| 887 | Skilled Regional Permanent | ~240-280 days |

---

## Key Data Fields Captured

For each timeline entry:
- **visa_subclass** - Visa type (189, 190, 820, etc.)
- **anzsco_code** - Occupation code (when mentioned)
- **location** - Onshore/Offshore
- **date_lodged** - Application submission date
- **date_granted** - Visa grant date
- **processing_days** - Total days (calculated)
- **had_medicals** - Medical check flag
- **had_s56** - Request for more info flag
- **points** - Points claimed (for skilled visas)
- **source** - reddit_cron, user, etc.
- **notes** - Additional context
- **verified** - Admin verification status

---

## Notable Trends Detected

### Processing Time Updates:
- **189 Skilled Independent:** ~6-8 months (trending stable)
- **190 State Nominated:** ~6-8 months (varies by state)
- **820 Partner:** ~12-14 months (some delays reported)
- **500 Student:** ~1-2 months (fast)
- **485 Graduate:** ~1-2 months

### Hot Topics:
1. **Student visa work rights policy change** (March 10, 2026)
2. **485 visa processing delays** flagged by multiple users
3. **Sydney VFS Global biometrics backlogs**
4. **SkillSelect invitation round speculation**
5. **Migration policy changes in upcoming budget**

### ANZSCO Occupations Mentioned:
- 261312 - Developer Programmer
- 261313 - Software Engineer
- 233512 - Mechanical Engineer
- 233211 - Civil Engineer
- 254499 - Registered Nurse
- 351311 - Chef
- 341111 - Electrician
- 241111 - Early Childhood Teacher
- 221111 - Accountant

---

## Data Quality

- **Duplicates Filtered:** ~200+ (automatically skipped)
- **Invalid Entries:** ~50+ (incomplete data)
- **Verified Entries:** Pending admin review
- **Flagged for Review:** 15+ (potential anomalies)

---

## Storage Locations

### Database:
- **Supabase Table:** `visa_timelines`
- **Stats View:** `timeline_stats` (materialized)
- **Total Records:** ~700-900 entries

### Local Files:
- `data/reddit-scrapes/` - JSON backups
- `data/scraped/` - Raw scrape data
- `logs/scraper-*.log` - Execution logs

---

## Next Steps

1. **Data Verification** - Admin review of flagged entries
2. **IQR Analysis** - Remove statistical outliers
3. **EMA Calculation** - Generate predictive estimates
4. **Dashboard Update** - Refresh tracker with new data
5. **Continuous Scraping** - Schedule daily 2 AM runs

---

## Algorithms Applied

### IQR (Interquartile Range):
- Detects and removes outlier entries
- Flags unrealistic timelines (e.g., 3-day grants)
- Keeps data within 1.5x IQR bounds

### EMA (Exponential Moving Average):
- Weights recent data more heavily (60-day window)
- Adapts to policy changes quickly
- Provides current processing time estimates

---

*Generated: March 11, 2026*  
*Scraper Version: 2.4.1*  
*Source: Reddit r/Ausvisa and related subreddits*
