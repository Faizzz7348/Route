# Vercel Deployment Configuration

## Environment Variables

Make sure to add these environment variables in your Vercel project settings:

### Database
- `DATABASE_URL` - Your PostgreSQL connection string (e.g., Neon, Supabase, or other PostgreSQL provider)

### ImgBB API
- `IMGBB_API_KEY` - Your ImgBB API key for image uploads

### Optional
- `NODE_ENV` - Set to "production" (usually auto-set by Vercel)

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Add Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required environment variables listed above

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

## Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`
- **Framework Preset**: Other

## API Routes

All API routes are handled by the Express server:
- `/api/*` routes are proxied to the serverless function
- Frontend routes are served from the static build

## Notes

- The Express backend runs as a Vercel serverless function
- Frontend is served as static files from `dist/public`
- PostgreSQL database should be hosted on a service like Neon, Supabase, or similar
- ImgBB is used for image hosting (no local storage needed)

## Troubleshooting

If you encounter issues:
1. Check Vercel build logs for errors
2. Verify all environment variables are set correctly
3. Ensure DATABASE_URL is accessible from Vercel's region
4. Check that IMGBB_API_KEY is valid

## Custom Domain

To add a custom domain:
1. Go to Project Settings > Domains
2. Add your domain
3. Configure DNS records as instructed by Vercel
