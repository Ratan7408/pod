# 🚀 Deployment Guide - ANIME INDIA Print-on-Demand

## 📋 Project Structure Overview

```
priya/
├── 📁 client/           # React Frontend (Vite)
│   ├── 📁 src/         # Source code
│   ├── 📁 public/      # Static assets
│   └── 📄 index.html   # Entry point
├── 📁 server/          # Express.js Backend
├── 📁 dist/            # Build output
│   └── 📁 public/      # Production files for hosting
└── 📁 uploads/         # User uploaded files
```

## 🎯 Frontend Deployment (Hostinger)

### Step 1: Build the Frontend
```bash
npm run build
```

### Step 2: Files to Upload to Hostinger
Upload ALL contents from `dist/public/` directory:

```
📁 Hostinger public_html/
├── 📄 index.html
├── 📁 assets/
│   ├── 📄 index-CNIvg1GD.js (1.7MB)
│   ├── 📄 index-swBMEHdt.css (120KB)
│   ├── 📄 index.es-E1nkmPJ7.js (147KB)
│   ├── 📄 html2canvas.esm-CBrSDip1.js (198KB)
│   ├── 📄 purify.es-CQJ0hv7W.js (21KB)
│   ├── 📄 Viewport image-B8bfqedJ.png (2.9MB)
│   ├── 📄 tshirt-front.png (1.6MB)
│   └── 📄 tshirt-back.png (1.9MB)
├── 📁 tshirts/
├── 📁 tshirts-showcase/
├── 📁 tshirts-new/
├── 📁 tshirt-colors/
├── 📁 oversized-colors/
├── 📁 models/
├── 📁 hoodie-colors/
├── 📁 cliparts/
├── 📄 tshirt-front.png
├── 📄 tshirt-back.png
└── 📄 hero-background.png
```

### Step 3: Hostinger Configuration

#### A. Upload Files
1. Log into Hostinger control panel
2. Go to "File Manager"
3. Navigate to `public_html` directory
4. Upload ALL files from `dist/public/`

#### B. Create .htaccess File
Create `.htaccess` in your Hostinger root directory:

```apache
RewriteEngine On

# Handle React Router - redirect all requests to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

### Step 4: Update API Configuration
Before deploying, update your AWS backend URL in:
- `client/src/lib/api.ts`
- `client/src/pages/AdminAddProduct.tsx`
- `client/src/pages/ProductsPage.tsx`
- `client/src/components/ProductsCatalog.tsx`

Replace `'https://your-aws-backend-url.com/api'` with your actual AWS backend domain.

## 🔧 Backend Deployment (AWS)

### AWS Services You'll Need:
1. **EC2** - For running the Express.js server
2. **RDS** - For PostgreSQL database
3. **S3** - For file storage (uploads)
4. **CloudFront** - For CDN
5. **Route 53** - For domain management
6. **Load Balancer** - For traffic distribution

### Backend Files to Deploy:
```
📁 server/
├── 📄 index.ts          # Main server file
├── 📁 routes/           # API routes
├── 📁 models/           # Database models
├── 📁 middleware/       # Express middleware
├── 📁 config/           # Configuration files
└── 📁 scripts/          # Database scripts
```

## 🔄 Deployment Workflow

### 1. Frontend First (Hostinger)
1. ✅ Build frontend: `npm run build`
2. ✅ Upload `dist/public/` contents to Hostinger
3. ✅ Add `.htaccess` file
4. ✅ Update API endpoints to point to AWS backend
5. ✅ Test frontend functionality

### 2. Backend Second (AWS)
1. ⏳ Set up EC2 instance
2. ⏳ Configure RDS database
3. ⏳ Deploy Express.js server
4. ⏳ Set up S3 for file storage
5. ⏳ Configure domain and SSL
6. ⏳ Update frontend API URLs

## 🚨 Important Notes

### Environment Variables Needed:
```bash
# Database
DATABASE_URL=your_postgresql_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name

# Email (for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password

# CORS (for frontend domain)
CORS_ORIGIN=https://your-hostinger-domain.com
```

### Security Checklist:
- ✅ HTTPS enabled on both frontend and backend
- ✅ CORS properly configured
- ✅ Environment variables secured
- ✅ Database credentials protected
- ✅ File uploads validated
- ✅ Rate limiting implemented

## 📞 Support

If you encounter issues:
1. Check browser console for frontend errors
2. Check server logs for backend errors
3. Verify API endpoints are accessible
4. Test database connections
5. Validate file uploads work

## 🎯 Next Steps

1. **Deploy Frontend to Hostinger** (Current task)
2. **Set up AWS infrastructure**
3. **Deploy Backend to AWS**
4. **Configure domain and SSL**
5. **Test full application**
6. **Monitor performance and errors** 