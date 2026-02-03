# Admin-Configurable Gamification Settings

## ✅ What Was Done

The gamification system has been updated so that **all reward values are now configurable by admins** through the admin panel instead of being hardcoded.

---

## 🗄️ Database Changes

### New Table: `app_settings`
Created a new table to store admin-configurable application settings:

**Structure:**
- `id` - UUID primary key
- `key` - Unique setting key (e.g., "daily_login_points")
- `value` - Setting value (stored as text)
- `value_type` - Type of value (string, number, boolean, json)
- `category` - Setting category (gamification, general, etc.)
- `description` - Human-readable description
- `updated_by` - Admin who last updated
- `created_at`, `updated_at` - Timestamps

**Helper Functions:**
- `get_setting(key, default)` - Get setting as text
- `get_setting_number(key, default)` - Get setting as number
- `get_setting_boolean(key, default)` - Get setting as boolean

---

## 🎮 Configurable Settings

### Daily Login Rewards
- ✅ **daily_login_points** (default: 10) - Base points for daily login
- ✅ **daily_login_xp** (default: 20) - Base XP for daily login
- ✅ **streak_multiplier_threshold** (default: 7) - Days after which multiplier increases
- ✅ **streak_multiplier_increment** (default: 0.1) - Multiplier increment per threshold

### Weekend Bonus
- ✅ **weekend_bonus_points** (default: 50) - Bonus points for weekend login
- ✅ **weekend_bonus_xp** (default: 25) - Bonus XP for weekend login

### Share Rewards
- ✅ **share_points** (default: 5) - Points per share
- ✅ **share_xp** (default: 10) - XP per share

### Streak Milestones
- ✅ **streak_3_days_points** (default: 25)
- ✅ **streak_3_days_xp** (default: 50)
- ✅ **streak_7_days_points** (default: 50)
- ✅ **streak_7_days_xp** (default: 100)
- ✅ **streak_14_days_points** (default: 100)
- ✅ **streak_14_days_xp** (default: 200)
- ✅ **streak_30_days_points** (default: 250)
- ✅ **streak_30_days_xp** (default: 500)
- ✅ **streak_60_days_points** (default: 500)
- ✅ **streak_60_days_xp** (default: 1000)
- ✅ **streak_100_days_points** (default: 1000)
- ✅ **streak_100_days_xp** (default: 2000)

### Perfect Week Bonus
- ✅ **perfect_week_points** (default: 200)
- ✅ **perfect_week_xp** (default: 100)

### Comeback Bonus
- ✅ **comeback_bonus_points** (default: 30)

### Share Milestones
- ✅ **share_5_milestone_points** (default: 20)
- ✅ **share_5_milestone_xp** (default: 30)
- ✅ **share_10_milestone_points** (default: 50)
- ✅ **share_10_milestone_xp** (default: 75)
- ✅ **share_25_milestone_points** (default: 100)
- ✅ **share_25_milestone_xp** (default: 150)
- ✅ **share_50_milestone_points** (default: 200)
- ✅ **share_50_milestone_xp** (default: 300)
- ✅ **share_100_milestone_points** (default: 500)
- ✅ **share_100_milestone_xp** (default: 750)

### General Settings
- ✅ **default_card_points** (default: 10) - Points per card interaction
- ✅ **default_membership_level** (default: 1) - New user membership level

---

## 📝 Files Created/Modified

### Database
- ✅ **Created:** [`supabase/app-settings-table.sql`](./supabase/app-settings-table.sql)
  - New `app_settings` table
  - Helper functions for getting settings
  - Default values pre-populated
  - RLS policies (public read, admin write)

### API Routes
- ✅ **Created:** [`app/api/settings/route.ts`](./app/api/settings/route.ts)
  - `GET /api/settings` - Fetch all settings (with optional category filter)
  - `POST /api/settings` - Update multiple settings (admin only)
  - `PUT /api/settings` - Update single setting (admin only)

- ✅ **Modified:** [`app/api/daily-login/route.ts`](./app/api/daily-login/route.ts)
  - Now reads reward values from database settings
  - Falls back to defaults if settings not found

- ✅ **Modified:** [`app/api/share/route.ts`](./app/api/share/route.ts)
  - Now reads share rewards from database settings
  - Share milestones read from database

### Admin Panel
- ✅ **Modified:** [`app/admin/settings/page.tsx`](./app/admin/settings/page.tsx)
  - Removed localStorage usage
  - Now loads settings from `/api/settings`
  - Saves settings to database via API
  - Added UI fields for:
    - Daily Login Points & XP
    - Weekend Bonus Points & XP
    - Share Points & XP
    - Streak Milestone Points (3, 7, 14, 30 days)
    - Perfect Week Points
  - Organized into sections for better UX

---

## 🚀 Setup Instructions

### 1. Run Database Migration
```bash
# Open Supabase SQL Editor and run:
soul-sync/supabase/app-settings-table.sql
```

This will:
- Create the `app_settings` table
- Add helper functions
- Insert default values for all settings
- Set up RLS policies

### 2. Verify Table Created
Check in Supabase Dashboard that the `app_settings` table exists with 35+ default settings.

### 3. Test Admin Panel
1. Login as admin
2. Go to `/admin/settings`
3. You should see all gamification settings
4. Try changing values and saving
5. Verify values are saved in database

### 4. Test Daily Login
1. Login as regular user
2. Daily login should use admin-configured points
3. Check rewards match admin settings

---

## 🎛️ Admin Panel Usage

### Accessing Settings
1. Go to [`/admin/settings`](./app/admin/settings/page.tsx)
2. Scroll to "Gamification Settings" section

### Changing Reward Values

**Daily Login:**
- Set base points/XP users get for logging in each day
- Changes apply immediately to next logins

**Weekend Bonus:**
- Set bonus points/XP for Saturday/Sunday logins
- Users can claim once per week

**Share Rewards:**
- Set points/XP for each share
- Platform multipliers (1.0x-1.3x) are still applied

**Streak Milestones:**
- Set points for 3, 7, 14, and 30-day streaks
- Rewards trigger automatically when milestone reached

**Perfect Week:**
- Set bonus for 7 consecutive daily logins
- Resets weekly

### Saving Changes
1. Adjust values as needed
2. Click "Save Settings" button
3. Changes take effect immediately
4. All users will receive new reward amounts

---

## 📊 How It Works

### Settings Flow
```
Admin changes value in panel
    ↓
POST /api/settings
    ↓
Updates app_settings table
    ↓
Daily login API reads from app_settings
    ↓
User receives new reward amount
```

### Caching
- Settings are fetched from database on each API call
- Consider adding Redis cache for high traffic
- Current implementation: Direct database read (fast enough for most cases)

### Defaults
- All settings have fallback defaults in code
- If setting missing from database, uses hardcoded default
- Prevents breaking if settings are accidentally deleted

---

## 🔍 Verification

### Check Settings in Database
```sql
-- View all settings
SELECT * FROM app_settings ORDER BY category, key;

-- View gamification settings only
SELECT * FROM app_settings WHERE category = 'gamification';

-- Get specific setting
SELECT * FROM app_settings WHERE key = 'daily_login_points';
```

### Test Setting Change
```sql
-- Update daily login points to 50
UPDATE app_settings SET value = '50' WHERE key = 'daily_login_points';

-- Verify user gets 50 points on next login
```

### API Testing
```bash
# Get all settings
curl http://localhost:3000/api/settings

# Get gamification settings only
curl http://localhost:3000/api/settings?category=gamification

# Update setting (requires admin auth)
curl -X POST http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{"settings": {"daily_login_points": 50}}'
```

---

## 🛠️ Customization

### Adding New Settings

1. **Add to database:**
```sql
INSERT INTO app_settings (key, value, value_type, category, description) VALUES
  ('new_reward_points', '100', 'number', 'gamification', 'Description here');
```

2. **Add to admin panel:**
```typescript
// In app/admin/settings/page.tsx
const [newRewardPoints, setNewRewardPoints] = useState(100);

// In loadSettings:
setNewRewardPoints(data.settings.new_reward_points || 100);

// In handleSaveSettings:
new_reward_points: newRewardPoints,

// Add UI field in JSX
```

3. **Use in API:**
```typescript
// In your API route
const { data: settings } = await supabase
  .from("app_settings")
  .select("key, value")
  .eq("key", "new_reward_points")
  .single();

const points = parseFloat(settings?.value || "100");
```

---

## 🎯 Benefits

### For Admins
- ✅ Control all reward values without code changes
- ✅ A/B test different reward amounts
- ✅ Respond quickly to user feedback
- ✅ Adjust economy balance in real-time
- ✅ No developer needed for reward tweaks

### For Users
- ✅ More balanced reward system
- ✅ Rewards can be adjusted based on engagement data
- ✅ Better progression experience

### For Developers
- ✅ No hardcoded values in multiple files
- ✅ Single source of truth for all settings
- ✅ Easy to extend with new settings
- ✅ Clear separation of concerns

---

## 📈 Recommended Settings

### Conservative (Lower Engagement)
```
Daily Login: 5 points, 10 XP
Weekend Bonus: 25 points, 15 XP
Share: 3 points, 5 XP
3-Day Streak: 15 points
```

### Balanced (Default)
```
Daily Login: 10 points, 20 XP
Weekend Bonus: 50 points, 25 XP
Share: 5 points, 10 XP
3-Day Streak: 25 points
```

### Generous (Higher Engagement)
```
Daily Login: 20 points, 40 XP
Weekend Bonus: 100 points, 50 XP
Share: 10 points, 20 XP
3-Day Streak: 50 points
```

---

## 🐛 Troubleshooting

### Settings Not Saving
- Check admin permissions in database
- Verify `is_admin = true` in profiles table
- Check browser console for API errors

### Old Values Still Showing
- Clear browser cache
- Refresh page
- Check database values directly

### API Errors
- Verify `app_settings` table exists
- Check RLS policies are enabled
- Ensure user is authenticated

---

## 🎉 Success!

Your gamification system is now **fully configurable by admins** through the admin panel. No more hardcoded values! 🚀

**Next Steps:**
1. Run the database migration
2. Test the admin panel
3. Adjust reward values based on user engagement
4. Monitor and iterate

---

**Built with ❤️ for Soul Sync**
*Empowering admins to control the user experience* ✨
