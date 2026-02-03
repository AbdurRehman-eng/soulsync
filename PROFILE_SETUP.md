# Profile Images Setup Guide

This guide will help you set up the profile images storage bucket in Supabase.

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Create a bucket with these settings:
   - **Name**: `profile-images`
   - **Public bucket**: ✅ Yes (checked)
5. Click **Create bucket**

### Setting Up Policies

After creating the bucket, you need to set up the access policies:

1. Click on the `profile-images` bucket
2. Go to the **Policies** tab
3. Click **New Policy**
4. Create the following policies:

#### Policy 1: Public Read Access
- **Policy name**: `Public can view profile images`
- **Allowed operation**: SELECT
- **Target roles**: `public`
- **USING expression**: `bucket_id = 'profile-images'`

#### Policy 2: Authenticated Upload
- **Policy name**: `Authenticated users can upload profile images`
- **Allowed operation**: INSERT
- **Target roles**: `authenticated`
- **WITH CHECK expression**: `bucket_id = 'profile-images'`

#### Policy 3: Authenticated Update
- **Policy name**: `Authenticated users can update profile images`
- **Allowed operation**: UPDATE
- **Target roles**: `authenticated`
- **USING expression**: `bucket_id = 'profile-images'`

#### Policy 4: Authenticated Delete
- **Policy name**: `Authenticated users can delete profile images`
- **Allowed operation**: DELETE
- **Target roles**: `authenticated`
- **USING expression**: `bucket_id = 'profile-images'`

## Option 2: Using SQL Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the contents of `/supabase/profile-images-bucket.sql`
5. Click **Run**

## Verification

To verify the setup is working:

1. Log in to your Soul Sync app
2. Navigate to Profile page
3. Click the camera icon on your avatar
4. Select an image file (max 5MB)
5. The image should upload successfully and display immediately

## Troubleshooting

### Upload fails with "Permission denied"
- Check that all 4 policies are created correctly
- Verify the bucket is set to **public**
- Make sure you're logged in to the app

### Image doesn't display after upload
- Check browser console for errors
- Verify the bucket is set to **public**
- Try refreshing the page

### "Bucket not found" error
- Double-check the bucket name is exactly `profile-images`
- Verify the bucket was created successfully in Supabase dashboard

## Image Specifications

- **Max file size**: 5MB
- **Accepted formats**: All image types (JPEG, PNG, GIF, WebP, etc.)
- **Naming convention**: `{user_id}-{timestamp}.{extension}`
- **Storage location**: Supabase Storage `profile-images` bucket
