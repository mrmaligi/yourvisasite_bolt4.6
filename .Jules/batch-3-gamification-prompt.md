================================================================================
BATCH 3: GAMIFICATION & ENGAGEMENT (Pages 21-30)
Project: yourvisasite_bolt4.6
================================================================================

Create 10 gamification and engagement feature pages for the VisaBuild platform.

PAGES TO CREATE:

--- PAGE 21: Achievements ---
File: src/pages/user/gamification/Achievements.tsx
Path: /user/achievements
Description: Badge and achievement system
Features:
- Achievement categories (Explorer, Contributor, Expert, etc.)
- Locked/unlocked badge display
- Progress bars for in-progress achievements
- Achievement details modal
- Rarity indicators (common, rare, epic, legendary)
- Share achievements
- Total points display

--- PAGE 22: Leaderboard ---
File: src/pages/community/Leaderboard.tsx
Path: /community/leaderboard
Description: Community contributor rankings
Features:
- Weekly/monthly/all-time tabs
- Category filters (tracker, forum, referrals)
- Top 100 users display
- User rank card
- Prize/reward indicators
- Anonymous opt-out option
- Country filters

--- PAGE 23: DailyChallenges ---
File: src/pages/user/gamification/DailyChallenges.tsx
Path: /user/challenges
Description: Daily visa-related challenges
Features:
- 3 new challenges daily
- Challenge types (quiz, tracker submit, forum post)
- Progress tracking
- Streak bonuses
- Reward points
- Challenge history
- Difficulty levels

--- PAGE 24: StreakTracker ---
File: src/pages/user/gamification/StreakTracker.tsx
Path: /user/streaks
Description: Login and activity streaks
Features:
- Current streak display (large number)
- Calendar heatmap of activity
- Streak milestones (7, 30, 100, 365 days)
- Streak freeze tokens
- Streak recovery options
- Push notification reminders
- Streak leaderboard

--- PAGE 25: RewardsStore ---
File: src/pages/user/gamification/RewardsStore.tsx
Path: /user/rewards
Description: Points redemption store
Features:
- Points balance display
- Reward categories (discounts, features, merchandise)
- Redeemable items grid
- Points cost display
- Purchase/Redeem flow
- Redemption history
- Limited-time offers

--- PAGE 26: ReferralDashboard ---
File: src/pages/user/gamification/ReferralDashboard.tsx
Path: /user/referrals-advanced
Description: Advanced referral tracking
Features:
- Referral link generator
- Referral statistics (clicks, signups, purchases)
- Tiered rewards display
- Referred users list
- Earnings breakdown
- Payout history
- Referral leaderboard

--- PAGE 27: CommunityGoals ---
File: src/pages/community/CommunityGoals.tsx
Path: /community/goals
Description: Shared community milestones
Features:
- Active community goals
- Progress bars toward goals
- User contribution to goals
- Goal history
- Reward unlocks
- Goal suggestions
- Celebration animations

--- PAGE 28: ExpertStatus ---
File: src/pages/user/gamification/ExpertStatus.tsx
Path: /user/expert-status
Description: Community expert badges
Features:
- Expertise areas
- Contribution statistics
- Helpful answer count
- Upvote/downvote ratio
- Expert badge display
- Expert privileges info
- Maintain expert status requirements

--- PAGE 29: Contributions ---
File: src/pages/user/gamification/Contributions.tsx
Path: /user/contributions
Description: User contribution history
Features:
- Contribution timeline
- Types of contributions (tracker, forum, reviews)
- Contribution stats
- Impact metrics
- Contribution export
- Contribution badges
- Thank you notes received

--- PAGE 30: Milestones ---
File: src/pages/user/gamification/Milestones.tsx
Path: /user/milestones
Description: Personal journey milestones
Features:
- Visa journey timeline
- Milestone cards (first login, first document, first booking)
- Upcoming milestones
- Milestone sharing
- Photo/memory upload for milestones
- Milestone reflections
- Anniversary celebrations

TECHNICAL REQUIREMENTS:
1. Use TypeScript with proper interfaces
2. Use existing UI components
3. Use Recharts for statistics
4. Implement Framer Motion for animations
5. Add confetti/celebration effects
6. Use local storage for streak tracking
7. Add SEO meta tags
8. Make all pages responsive
9. Add to App.tsx with lazy loading

DATABASE REQUIREMENTS:
- user_achievements: unlocked achievements
- user_streaks: streak data
- user_points: points transactions
- daily_challenges: challenge definitions
- challenge_completions: user completions
- community_goals: goal definitions
- goal_progress: user contributions to goals

COMPONENTS TO CREATE:
- Badge component with rarity styling
- ProgressRing component
- Confetti celebration component
- StreakCalendar component
- PointsDisplay component

================================================================================
