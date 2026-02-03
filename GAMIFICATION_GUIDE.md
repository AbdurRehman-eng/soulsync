# Soul Sync - Enhanced Gamification System

## 🎮 Overview

Soul Sync now features a **fully gamified PWA** experience with comprehensive reward systems, including:

- ✅ **Daily Login Rewards** with streak tracking and multipliers
- ✅ **Bonus Reward Events** (Weekend bonuses, Perfect Week, Mood Variety)
- ✅ **Streak Milestones** with visual badges and increasing rewards
- ✅ **Sharing Rewards** with social media integration and referral tracking
- ✅ **User Levels & XP System** (25 levels from Seeker to Immortal)
- ✅ **Achievements** (30+ achievements across 5 categories)
- ✅ **Badges** (12+ collectible badges)
- ✅ **Daily Challenges** with bonus point multipliers
- ✅ **Comprehensive Analytics** and progress visualization

---

## 📊 Database Schema

### New Tables Created

#### 1. **Enhanced Profiles**
New fields added to `profiles` table:
- `level` - Current user level (1-25)
- `xp` - Experience points
- `total_shares` - Lifetime share count
- `referral_code` - Unique referral code for sharing
- `referred_by` - User who referred this user
- `total_referrals` - Number of users referred
- `consecutive_logins` - Days logged in consecutively
- `last_login_date` - Last login date (for streak tracking)
- `weekend_bonus_claimed_this_week` - Weekend bonus eligibility
- `perfect_week_eligible` - Perfect week bonus eligibility

#### 2. **Levels** (`levels`)
Define 25 user levels with:
- Level number, name, and icon
- XP required to reach
- Points reward on level up
- Perks unlocked at each level

#### 3. **Achievements** (`achievements`)
30+ achievements across categories:
- **Streak** - Login streaks (3, 7, 14, 30, 60, 100 days)
- **Social** - Sharing and referrals
- **Content** - Card completions and mood logging
- **Milestone** - Point totals and level milestones
- **Special** - Early Bird, Night Owl, Weekend Warrior, Perfect Week

#### 4. **User Achievements** (`user_achievements`)
Track user progress on achievements:
- Progress counter
- Completion status
- Completion timestamp

#### 5. **Badges** (`badges`)
12+ collectible badges:
- Newcomer, First Sync
- Streak badges (3, 7, 30 days)
- Social Butterfly, Content Creator
- Level badges (5, 10)
- Referral Master, Weekend Warrior
- Perfect Week

#### 6. **User Badges** (`user_badges`)
Track badges earned by users with timestamps

#### 7. **Daily Challenges** (`daily_challenges`)
3 random challenges generated daily:
- Mood Sync
- Share Cards
- Complete Tasks
- Chat with Soul Buddy
- Maintain Streak
- Quiz Perfect Score

Each with XP/Points rewards and multipliers

#### 8. **User Daily Challenges** (`user_daily_challenges`)
Track user progress on daily challenges

#### 9. **Bonus Events** (`bonus_events`)
Special recurring and limited-time events:
- Weekend Warrior Bonus (1.5x multiplier)
- Perfect Week Bonus (2x multiplier)
- Mood Explorer Bonus (1.3x multiplier)
- Social Surge, Content Sprint
- Holiday Specials

#### 10. **Share Tracking** (`share_tracking`)
Track all shares with:
- Platform (Facebook, Twitter, WhatsApp, Instagram, Copy Link)
- Referral code
- Timestamp

#### 11. **XP Transactions** (`xp_transactions`)
Audit log of all XP gains with source tracking

#### 12. **Points Transactions** (`points_transactions`)
Audit log of all point gains with multipliers

#### 13. **Leaderboard Snapshots** (`leaderboard_snapshots`)
Daily/weekly/monthly leaderboard caching

---

## 🎯 API Routes

### 1. `/api/gamification`
**GET** - Fetch comprehensive user gamification stats
- Profile with level info
- Current/next level details
- XP progress
- Achievements (completed & in-progress)
- Badges earned
- Daily challenges
- Active bonus events
- Recent XP/Points transactions

**POST** - Award XP/Points and check for level ups and achievements

### 2. `/api/daily-login`
**POST** - Process daily login and award rewards
- Base daily reward: 10 points + 20 XP
- Streak multiplier increases every 7 days
- Weekend bonus: +50 points if eligible
- Streak milestones: 3, 7, 14, 30, 60, 100 days
- Perfect week bonus: Login 7 days straight
- Comeback bonus: After streak broken
- Automatic badge awards
- Level up detection and rewards

**GET** - Check daily login status

### 3. `/api/share`
**POST** - Track share and award rewards
- Base: +5 points + 10 XP per share
- Platform multipliers:
  - Instagram: 1.3x
  - Facebook/Twitter: 1.2x
  - WhatsApp: 1.1x
  - Copy Link: 1.0x
- Social Surge bonus event multiplier
- Share milestone bonuses (5, 10, 25, 50, 100 shares)
- Achievement progress tracking
- Badge unlocks

**GET** - Get share statistics and referral data

### 4. `/api/daily-challenges`
**GET** - Fetch today's challenges (auto-generates if none exist)

**POST** - Update challenge progress and award completion rewards
- Points reward with multiplier (1.5x - 2.0x)
- XP reward with multiplier

### 5. `/api/bonus-events`
**GET** - Fetch active bonus events with eligibility check

**POST** - Claim bonus event rewards

---

## 🎨 UI Components

### Level System
1. **`XPBar`** - Animated progress bar showing XP to next level
2. **`LevelBadge`** - Visual badge displaying current level with icon
3. **`LevelUpModal`** - Celebratory modal with confetti when leveling up

### Achievements & Badges
4. **`AchievementCard`** - Display achievement with progress and rarity
5. **`BadgeCard`** - Display badge with hover tooltip

### Sharing
6. **`EnhancedShareButton`** - Social media share button with platform selection
   - Facebook, Twitter, WhatsApp, Instagram, Copy Link
   - Live reward notifications
   - Multiplier indicators

### Existing Enhanced
7. **`RewardPopup`** - Enhanced with new reward types
8. **`StreakBadge`** - Enhanced with milestone indicators

---

## 📱 Pages

### `/rewards` - Comprehensive Rewards Dashboard
- **Overview Tab**
  - Level progress with XP bar
  - Current/longest streak
  - Total points, XP, achievements, shares
  - Recent achievements and badges

- **Achievements Tab**
  - All achievements with progress bars
  - Rarity indicators (Common, Rare, Epic, Legendary)
  - Completion status

- **Badges Tab**
  - Badge collection grid
  - Hover for details
  - Earned dates

- **History Tab**
  - Recent XP gains
  - Recent point gains
  - Multiplier indicators

---

## 🎮 Gamification Flow

### Daily Login Flow
1. User opens app
2. Check last_login_date
3. If different from today:
   - Calculate streak (consecutive or broken)
   - Check for weekend bonus eligibility
   - Award base login rewards with streak multiplier
   - Check for streak milestones (3, 7, 14, 30, 60, 100)
   - Award milestone bonuses
   - Check for perfect week (7 consecutive)
   - Update profile
   - Show reward popup
4. Log all transactions

### Sharing Flow
1. User clicks share button
2. Platform selection modal opens
3. User selects platform
4. Track share in database
5. Calculate rewards:
   - Base: 5 points + 10 XP
   - Apply platform multiplier
   - Apply bonus event multiplier (if active)
6. Update total_shares counter
7. Check for share milestones (5, 10, 25, 50, 100)
8. Update achievement progress
9. Award badge if milestone reached
10. Show reward notification
11. Open share dialog or copy link

### Achievement Progress
Automatically tracked on:
- Daily logins (streak_days)
- Shares (total_shares)
- Points earned (total_points)
- Cards completed (cards_completed)
- Moods logged (moods_logged)
- Chat messages (chat_messages)
- Referrals (referrals)
- Level reached (level_reached)

### Level Up Flow
1. User earns XP from any source
2. System calculates new XP total
3. Check levels table for new level
4. If level increased:
   - Update profile.level
   - Award level up points reward
   - Show LevelUpModal with:
     - Old vs New level animation
     - Points bonus
     - Perks unlocked
     - Confetti effect
5. Check for level achievements

### Daily Challenges
1. User opens app
2. Fetch today's challenges (auto-generated if none)
3. Display 3 challenges with progress
4. User completes actions (mood sync, share, complete cards, chat, maintain streak)
5. Update challenge progress in real-time
6. When challenge complete:
   - Award points with multiplier
   - Award XP with multiplier
   - Show completion animation

### Bonus Events
**Weekend Warrior**
- Active: Saturday & Sunday
- Eligibility: Once per week
- Reward: +50 points + 25 XP
- Multiplier: 1.5x on all actions

**Perfect Week**
- Requirement: Login every day for 7 days
- Reward: +200 points + 100 XP
- Multiplier: 2x
- Resets weekly

**Mood Variety**
- Requirement: Log 5 different moods in a week
- Reward: +75 points + 40 XP
- Multiplier: 1.3x

---

## 🔧 Implementation Checklist

### Backend Setup
- [x] Run `gamification-enhancement.sql` in Supabase SQL Editor
- [x] Verify all tables created
- [x] Check RLS policies enabled
- [x] Test database functions (add_xp, add_points, calculate_level)

### API Routes
- [x] `/api/gamification` - Working
- [x] `/api/daily-login` - Working
- [x] `/api/share` - Working
- [x] `/api/daily-challenges` - Working
- [x] `/api/bonus-events` - Working

### UI Components
- [x] XPBar component
- [x] LevelBadge component
- [x] LevelUpModal component
- [x] AchievementCard component
- [x] BadgeCard component
- [x] EnhancedShareButton component

### Pages
- [x] `/rewards` dashboard page

### Integration Points
- [ ] Call `/api/daily-login` on app load in main layout
- [ ] Integrate EnhancedShareButton in card components
- [ ] Display daily challenges on homepage
- [ ] Show active bonus events in header
- [ ] Add XP/Level display to user profile section

---

## 🚀 Quick Start

### 1. Database Setup
```sql
-- Run in Supabase SQL Editor (in order):
1. First run: schema.sql (if not already done)
2. Then run: gamification-enhancement.sql
```

### 2. Environment Variables
No additional env vars needed (uses existing Supabase config)

### 3. Test the System

#### Test Daily Login
```javascript
// Should award points and XP on first login of the day
const response = await fetch('/api/daily-login', { method: 'POST' });
const data = await response.json();
console.log(data.rewards); // Array of rewards earned
```

#### Test Sharing
```javascript
const response = await fetch('/api/share', {
  method: 'POST',
  body: JSON.stringify({
    cardId: 'card-uuid',
    platform: 'twitter'
  })
});
const data = await response.json();
console.log(data.pointsReward, data.xpReward, data.multiplier);
```

#### Test Gamification Stats
```javascript
const response = await fetch('/api/gamification');
const data = await response.json();
console.log(data.profile.level, data.profile.xp);
console.log(data.achievements);
console.log(data.badges);
```

### 4. Navigate to Rewards Page
Visit `/rewards` to see the full dashboard

---

## 📈 Reward Scaling

### Points by Source
| Source | Base Points | Multiplier | Total |
|--------|-------------|------------|-------|
| Daily Login | 10 | 1.0 + (streak/7 * 0.1) | 10-30+ |
| Share Card | 5 | Platform (1.0-1.3) + Event | 5-13 |
| Complete Card | Varies | Card-specific | 5-50 |
| Streak Milestone | 25-1000 | 1.0 | 25-1000 |
| Achievement | 20-600 | 1.0 | 20-600 |
| Level Up | 50-2500 | 1.0 | 50-2500 |
| Daily Challenge | 15-30 | 1.5-2.0 | 22-60 |
| Bonus Event | 50-200 | 1.0 | 50-200 |

### XP by Source
| Source | Base XP |
|--------|---------|
| Daily Login | 20 |
| Share Card | 10 |
| Complete Card | 10-50 |
| Achievement | 50-2000 |
| Daily Challenge | 30-60 |
| Bonus Event | 25-100 |

### Level XP Requirements
| Level | Name | XP Required | Reward |
|-------|------|-------------|--------|
| 1 | Seeker 🌱 | 0 | - |
| 2 | Believer ✨ | 100 | 50 pts |
| 3 | Faithful 🙏 | 250 | 75 pts |
| 5 | Blessed 🌟 | 800 | 150 pts |
| 10 | Legendary 👑 | 4000 | 500 pts |
| 15 | Guardian 🛡️ | 12000 | 1200 pts |
| 20 | Divine ✝️ | 30000 | 2500 pts |
| 25 | Immortal 👼 | 70000 | 5000 pts |

---

## 🎯 Future Enhancements

### Potential Additions
1. **Leaderboards** - Weekly/monthly competition
2. **Teams/Guilds** - Group challenges
3. **NFT Badges** - Blockchain collectibles
4. **Seasonal Events** - Christmas, Easter, etc.
5. **PvP Challenges** - Friend competitions
6. **Trading System** - Trade badges/items
7. **Custom Avatars** - Unlock with achievements
8. **Exclusive Content** - Level-gated cards
9. **Merchandise Rewards** - Physical items for high achievers
10. **Charity Integration** - Donate points to causes

---

## 📝 Notes

### Performance Considerations
- Daily challenges are auto-generated (3 per day)
- Leaderboard snapshots should be cached
- Consider Redis for real-time multipliers
- Batch achievement checks for efficiency

### Security
- All RLS policies are enabled
- Users can only modify their own data
- Admins can manage events and challenges
- Referral codes are unique and indexed

### Analytics
Track these metrics:
- Daily active users with streaks
- Average level by cohort
- Achievement completion rates
- Most shared cards
- Referral conversion rates
- Event participation rates

---

## 🐛 Troubleshooting

### Issue: Level not updating
**Solution:** Check if `calculate_level()` function exists and XP transactions are being logged

### Issue: Achievements not unlocking
**Solution:** Run `check_achievements()` manually or ensure background job is running

### Issue: Duplicate daily login rewards
**Solution:** Check `last_login_date` is being updated correctly

### Issue: Share tracking not working
**Solution:** Verify CORS settings and check browser console for errors

---

## 📞 Support

For issues or questions:
1. Check database logs in Supabase Dashboard
2. Review API endpoint responses
3. Check browser console for errors
4. Verify all migrations ran successfully

---

## 🎉 Success Metrics

A successfully implemented gamification system will show:
- ✅ Users logging in daily (high retention)
- ✅ Increased sharing (viral growth)
- ✅ Achievement completion (engagement)
- ✅ Level progression (long-term engagement)
- ✅ Active bonus event participation
- ✅ Daily challenge completion
- ✅ Referral signups (organic growth)

---

**Built with ❤️ for Soul Sync**

*Keep the faith, earn the rewards, grow together* 🙏✨
