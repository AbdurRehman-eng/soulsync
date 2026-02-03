// ============================================
// Database Types
// ============================================

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  membership_level: number;
  points: number;
  current_streak: number;
  longest_streak: number;
  last_login: string | null;
  last_mood_sync: string | null;
  preferred_theme: string;
  is_admin: boolean;
  created_at: string;
  // Enhanced gamification fields
  level?: number;
  xp?: number;
  total_shares?: number;
  referral_code?: string;
  referred_by?: string;
  total_referrals?: number;
  consecutive_logins?: number;
  last_login_date?: string;
  weekend_bonus_claimed_this_week?: boolean;
  perfect_week_eligible?: boolean;
}

export interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  gradient_from: string;
  gradient_to: string;
  text_primary: string;
  text_secondary: string;
  accent_color: string;
  active_icon_color: string;
  button_bg: string;
  button_text: string;
  card_bg: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export type CardType =
  | "verse"
  | "devotional"
  | "article"
  | "quiz"
  | "game"
  | "task"
  | "journal"
  | "ad"
  | "prayer"
  | "motivational";

export interface Card {
  id: string;
  type: CardType;
  title: string;
  subtitle: string | null;
  content: CardContent;
  thumbnail_url: string | null;
  background_url: string | null;
  min_membership_level: number;
  points_reward: number;
  is_active: boolean;
  is_pinned: boolean;
  pin_position: number | null;
  pin_start: string | null;
  pin_end: string | null;
  publish_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Relations
  moods?: CardMood[];
}

export interface CardContent {
  // For verses
  verse_text?: string;
  verse_reference?: string;
  // For devotionals/articles
  body?: string;
  author?: string;
  read_time?: number;
  // For prayers
  prayer_text?: string;
  // For motivational
  quote?: string;
  quote_author?: string;
  // For tasks
  description?: string;
  // For journal
  prompt?: string;
  // For ads
  url?: string;
  // Common
  image_url?: string;
}

export interface CardMood {
  card_id: string;
  mood_id: string;
  weight: number;
  mood?: Mood;
}

export interface MoodLog {
  id: string;
  user_id: string;
  mood_id: string;
  logged_at: string;
  mood?: Mood;
}

export interface CardInteraction {
  id: string;
  user_id: string;
  card_id: string;
  interaction_type: "view" | "like" | "share" | "complete";
  created_at: string;
}

export interface DailyFeed {
  id: string;
  user_id: string;
  card_id: string;
  position: number;
  feed_date: string;
  created_at: string;
  card?: Card;
}

export interface Quiz {
  id: string;
  card_id: string;
  difficulty: "easy" | "medium" | "hard";
  time_limit: number | null;
  instructions: string | null;
  created_at: string;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string | null;
  points: number;
  sort_order: number;
  created_at: string;
}

export interface Game {
  id: string;
  card_id: string;
  html_content: string;
  difficulty: "easy" | "medium" | "hard";
  instructions: string | null;
  max_score: number | null;
  created_at: string;
}

export interface Task {
  id: string;
  card_id: string;
  task_type: "daily" | "weekly" | "challenge";
  description: string | null;
  points_reward: number;
  expires_at: string | null;
  sort_order: number;
  created_at: string;
  // Relations
  cards?: {
    id: string;
    title: string;
    type: string;
  };
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  status: "pending" | "completed";
  completed_at: string | null;
  created_at: string;
  task?: Task;
}

export interface Reward {
  id: string;
  type: "daily_login" | "streak" | "milestone" | "share" | "task";
  name: string;
  description: string | null;
  points: number;
  message: string | null;
  icon: string | null;
  trigger_value: number | null;
  is_active: boolean;
  created_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  claimed_at: string;
  reward?: Reward;
}

export interface MembershipPlan {
  id: string;
  stripe_price_id: string | null;
  name: string;
  level: number;
  price: number;
  interval: "month" | "year";
  features: string[];
  is_active: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  plan_id: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  plan?: MembershipPlan;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// ============================================
// UI Types
// ============================================

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  gradientFrom: string;
  gradientTo: string;
  activeIconColor: string;
}

export interface FeedState {
  cards: Card[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

export interface MoodState {
  currentMood: Mood | null;
  isSynced: boolean;
  availableMoods: Mood[];
  loading: boolean;
}

export interface UserState {
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface GamificationState {
  points: number;
  streak: number;
  pendingReward: Reward | null;
  showRewardPopup: boolean;
}

// ============================================
// Enhanced Gamification Types
// ============================================

export interface Level {
  id: number;
  level_number: number;
  name: string;
  xp_required: number;
  points_reward: number;
  badge_icon: string | null;
  perks: string[];
  created_at: string;
}

export type AchievementCategory = "streak" | "social" | "content" | "milestone" | "special";
export type AchievementRequirementType =
  | "streak_days"
  | "total_shares"
  | "total_points"
  | "cards_completed"
  | "moods_logged"
  | "chat_messages"
  | "referrals"
  | "level_reached"
  | "special";
export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  category: AchievementCategory;
  name: string;
  description: string | null;
  requirement_type: AchievementRequirementType;
  requirement_value: number | null;
  xp_reward: number;
  points_reward: number;
  badge_icon: string | null;
  rarity: AchievementRarity;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  achievement?: Achievement;
}

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  requirement_text: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export type ChallengeType =
  | "mood_sync"
  | "share_card"
  | "complete_task"
  | "chat_message"
  | "streak_maintain"
  | "quiz_perfect";

export interface DailyChallenge {
  id: string;
  challenge_date: string;
  challenge_type: ChallengeType;
  title: string;
  description: string | null;
  requirement_count: number;
  xp_reward: number;
  points_reward: number;
  multiplier: number;
  icon: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserDailyChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  challenge?: DailyChallenge;
}

export type BonusEventType =
  | "weekend_bonus"
  | "perfect_week"
  | "mood_variety"
  | "social_surge"
  | "content_sprint"
  | "holiday_special";

export interface BonusEvent {
  id: string;
  event_type: BonusEventType;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  multiplier: number;
  bonus_points: number;
  bonus_xp: number;
  requirements: Record<string, any>;
  icon: string | null;
  is_active: boolean;
  created_at: string;
}

export type SharePlatform =
  | "facebook"
  | "twitter"
  | "whatsapp"
  | "instagram"
  | "copy_link"
  | "other";

export interface ShareTracking {
  id: string;
  user_id: string;
  card_id: string;
  platform: SharePlatform;
  referral_code: string | null;
  shared_at: string;
}

export type TransactionSource =
  | "daily_login"
  | "streak"
  | "share"
  | "complete"
  | "achievement"
  | "level_up"
  | "challenge"
  | "bonus_event"
  | "referral"
  | "milestone";

export interface XPTransaction {
  id: string;
  user_id: string;
  amount: number;
  source: TransactionSource;
  source_id: string | null;
  description: string | null;
  created_at: string;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  amount: number;
  source: TransactionSource;
  source_id: string | null;
  description: string | null;
  multiplier: number;
  created_at: string;
}

export type LeaderboardType = "all_time" | "weekly" | "monthly";

export interface LeaderboardSnapshot {
  id: string;
  snapshot_date: string;
  leaderboard_type: LeaderboardType;
  rankings: any[];
  created_at: string;
}

export interface UserGamificationStats {
  id: string;
  username: string | null;
  display_name: string | null;
  level: number;
  xp: number;
  points: number;
  current_streak: number;
  longest_streak: number;
  total_shares: number;
  total_referrals: number;
  achievements_count: number;
  badges_count: number;
  current_level_number: number;
  current_level_name: string;
  next_level_xp: number | null;
  created_at: string;
}

export interface AchievementProgress extends UserAchievement {
  name: string;
  description: string | null;
  category: AchievementCategory;
  rarity: AchievementRarity;
  requirement_type: AchievementRequirementType;
  requirement_value: number | null;
  xp_reward: number;
  points_reward: number;
  badge_icon: string | null;
  progress_percentage: number;
}

// ============================================
// Enhanced Gamification UI State
// ============================================

export interface EnhancedGamificationState extends GamificationState {
  level: number;
  xp: number;
  achievements: UserAchievement[];
  badges: UserBadge[];
  dailyChallenges: UserDailyChallenge[];
  activeBonusEvents: BonusEvent[];
  recentXPGains: XPTransaction[];
  levelUpPending: boolean;
  achievementsPending: Achievement[];
}
