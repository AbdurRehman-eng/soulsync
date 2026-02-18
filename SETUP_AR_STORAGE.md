# AR Storage Setup Guide

Follow these steps to set up Supabase Storage for AR assets:

## Step 1: Create the Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `ar-assets`
   - **Public bucket**: ✅ **CHECK THIS** (very important!)
   - **File size limit**: 50 MB
   - Click **Create bucket**

## Step 2: Set Up Storage Policies

Go to **Storage** > **Policies** and add these policies for the `ar-assets` bucket:

### Policy 1: Public Read Access
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'ar-assets');
```

### Policy 2: Admin Upload Access
```sql
CREATE POLICY "Admin upload access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ar-assets' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
```

### Policy 3: Admin Delete Access
```sql
CREATE POLICY "Admin delete access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'ar-assets' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
```

## Step 3: Create Database Tables

Run this SQL in **SQL Editor**:

```sql
-- AR Assets table
CREATE TABLE IF NOT EXISTS ar_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('animal', 'tree', 'object', 'decoration')),
  model_url TEXT NOT NULL,
  thumbnail_url TEXT,
  scale DECIMAL DEFAULT 1.0,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AR World Music table
CREATE TABLE IF NOT EXISTS ar_world_music (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AR World Sessions (optional - for tracking)
CREATE TABLE IF NOT EXISTS ar_world_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assets_shown TEXT[],
  music_id UUID REFERENCES ar_world_music(id),
  session_duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ar_assets_active ON ar_assets(is_active);
CREATE INDEX IF NOT EXISTS idx_ar_assets_type ON ar_assets(type);
CREATE INDEX IF NOT EXISTS idx_ar_music_active ON ar_world_music(is_active);
```

## Step 4: Add AR Categories (Optional)

```sql
INSERT INTO content_categories (name, slug, display_name, emoji, description, color, gradient_from, gradient_to, sort_order, is_active)
VALUES
  ('AR World', 'ar-world', 'AR World', '🌍', 'Explore animals in AR', '#0ea5e9', '#0ea5e9', '#06b6d4', 1, true),
  ('AR Games', 'ar-games', 'AR Games', '🎮', 'Play interactive AR games', '#a855f7', '#a855f7', '#3b82f6', 2, true)
ON CONFLICT (slug) DO NOTHING;
```

## Step 5: Test the Setup

1. Go to `/admin/ar-assets` in your app
2. Try uploading a GLB file
3. If successful, the file should appear in Storage bucket
4. Visit `/ar-world` to see it rendered

## Troubleshooting

### Issue: "Failed to upload model file"
- Check that bucket is PUBLIC
- Verify you're logged in as admin
- Check browser console for errors

### Issue: Models not loading (400 errors)
- Verify bucket is PUBLIC
- Check storage policies are created
- Verify file URL in database matches storage

### Issue: "Bucket not found"
- Create the `ar-assets` bucket
- Make sure name is exactly `ar-assets`

### How to Verify Setup

1. **Check bucket exists**: Storage > should see `ar-assets` bucket
2. **Check bucket is public**: Click bucket > Settings > "Public bucket" should be ON
3. **Check policies**: Storage > Policies > should see 3 policies for `ar-assets`
4. **Check tables**: SQL Editor > run `SELECT * FROM ar_assets;` should work

## CORS Configuration (If needed)

If you still have CORS issues, add this to your Supabase project:

1. Go to **Settings** > **API**
2. Under **CORS**, add your domain
3. Or use `*` for development (not recommended for production)
