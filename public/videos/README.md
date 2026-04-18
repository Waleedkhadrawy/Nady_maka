# Background Video Instructions

To add the background video from makkahyard.com:

## Steps:
1. Visit https://makkahyard.com
2. Right-click on the background video and save it
3. Convert the video to MP4 format if needed
4. Name the file `hero-background.mp4`
5. Place it in this `/public/videos/` directory

## Video Specifications:
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 or higher
- **Duration**: 10-30 seconds (will be looped)
- **File size**: Under 10MB for optimal loading
- **Audio**: Not needed (video will be muted)

## Alternative:
If you have access to cPanel, you can:
1. Upload the video file directly to the `/public/videos/` folder
2. Ensure the filename is exactly `hero-background.mp4`

## Current Status:
✅ VideoPlayer component created with modal support
✅ CSS styling for interactive video thumbnails
✅ Support for both YouTube and local videos
⏳ Waiting for original videos from makkahyard.com

## Required Videos:
1. `hero-background.mp4` - Background video for hero section
2. `facility-tour.mp4` - Tour of facilities
3. YouTube links for tutorial videos

Once the video files are added, the website will automatically use them.

## Instructions for cPanel Upload:
1. Login to cPanel for makkahyard.com
2. Go to File Manager
3. Navigate to public_html/videos/ (or equivalent)
4. Download the existing videos
5. Upload them to this React project's /public/videos/ folder
6. Update video URLs in HomePage.js if needed