# Nginx Configuration for Subdomain-Based Routing

## Production Configuration

This configuration enables wildcard subdomain routing for stores while maintaining the main domain for the admin/marketing site.

### Required: Wildcard SSL Certificate

You must have a wildcard SSL certificate for `*.shelfmerch.in` before deploying this configuration.

### Nginx Configuration

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name *.shelfmerch.in shelfmerch.in;
    return 301 https://$host$request_uri;
}

# HTTPS Server - Main domain (admin/marketing site)
server {
    listen 443 ssl http2;
    server_name shelfmerch.in www.shelfmerch.in;

    ssl_certificate /path/to/ssl/shelfmerch.in.crt;
    ssl_certificate_key /path/to/ssl/shelfmerch.in.key;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Root and index
    root /path/to/frontend/build;
    index index.html;

    # API routes - proxy to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;  # CRITICAL: Preserve Host header for tenant resolution
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# HTTPS Server - Wildcard subdomains (storefronts)
server {
    listen 443 ssl http2;
    server_name *.shelfmerch.in;

    ssl_certificate /path/to/ssl/wildcard.shelfmerch.in.crt;
    ssl_certificate_key /path/to/ssl/wildcard.shelfmerch.in.key;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Root and index
    root /path/to/frontend/build;
    index index.html;

    # API routes - proxy to backend
    # CRITICAL: Host header must be preserved for tenant resolution
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;  # CRITICAL: Preserve Host header (e.g., merch.shelfmerch.in)
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend routes - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Key Points

1. **Wildcard SSL Certificate Required**: `*.shelfmerch.in`
2. **Host Header Preservation**: `proxy_set_header Host $host;` is CRITICAL - backend uses this for tenant resolution
3. **Trust Proxy**: Backend must have `app.set('trust proxy', 1)` (already implemented)
4. **SPA Routing**: `try_files $uri $uri/ /index.html;` ensures React Router works on direct refresh

### DNS Configuration

Ensure your DNS has:
- `A` record: `shelfmerch.in` → server IP
- `A` record: `*.shelfmerch.in` → server IP (wildcard)

Or use CNAME:
- `CNAME` record: `*.shelfmerch.in` → `shelfmerch.in`

### Testing After Deployment

```bash
# Test subdomain routing
curl -H "Host: merch.shelfmerch.in" https://shelfmerch.in/api/health

# Test main domain
curl https://shelfmerch.in/api/health

# Test redirect (should 301)
curl -I https://shelfmerch.in/store/merch/products
# Should return: Location: https://merch.shelfmerch.in/products
```

### Troubleshooting

**Issue: Subdomain not resolving tenant**
- Check DNS: `dig merch.shelfmerch.in`
- Verify Nginx config: `nginx -t`
- Check Host header: Add `add_header X-Debug-Host $host always;` to location block
- Verify backend logs show correct hostname

**Issue: 404 on page refresh**
- Ensure `try_files $uri $uri/ /index.html;` is in location /
- Check frontend build includes index.html
- Verify route is not caught by a more specific location block

**Issue: API calls failing**
- Verify `proxy_set_header Host $host;` is set
- Check backend `trust proxy` is enabled
- Verify CORS allows wildcard subdomains

