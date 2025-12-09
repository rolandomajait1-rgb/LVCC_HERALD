# 📊 Monitoring Setup - La Verdad Herald

## Quick Setup

### 1. Install Test Dependencies
```bash
cd tests
npm install
```

### 2. Configure URLs
Edit these files with your actual URLs:
- `tests/smoke-test.js` - Update `baseURL`
- `tests/performance-monitor.js` - Update `baseURL` and `frontendURL`

### 3. Run Tests
```bash
# Windows
RUN_TESTS.bat

# Manual
cd tests
npm run smoke          # Critical functionality
npm run performance    # Response times
npm run generate-data  # Create test data
```

## Automated Monitoring

### Daily Health Check
Add to cron/task scheduler:
```bash
# Run every hour
0 * * * * cd /path/to/tests && npm run smoke
```

### Performance Tracking
```bash
# Run every 6 hours
0 */6 * * * cd /path/to/tests && npm run performance >> performance.log
```

## Monitoring Dashboards

### Simple Uptime Monitor
- **Uptime Robot**: https://uptimerobot.com (free)
- **Pingdom**: https://pingdom.com
- **StatusCake**: https://statuscake.com

### Performance Monitoring
- **Google PageSpeed Insights**: Test frontend performance
- **GTmetrix**: Comprehensive performance analysis
- **WebPageTest**: Detailed performance metrics

## Alert Thresholds

### Critical Alerts
- Site down (HTTP 5xx errors)
- Response time > 5 seconds
- Authentication failures

### Warning Alerts  
- Response time > 2 seconds
- High error rate (>5%)
- Database connection issues

## Log Monitoring

### Backend Logs (Laravel)
```bash
# Monitor error logs
tail -f backend/storage/logs/laravel.log | grep ERROR
```

### Frontend Errors
- Browser console errors
- JavaScript exceptions
- Network failures

## Database Monitoring

### Key Metrics
- Connection count
- Query response time
- Disk usage
- Memory usage

### MySQL Monitoring
```sql
-- Check slow queries
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Slow_queries';

-- Check connections
SHOW STATUS LIKE 'Connections';
SHOW STATUS LIKE 'Threads_connected';
```

## Quick Health Check URLs

Test these endpoints manually:
- `GET /api/health` - Health check
- `GET /api/articles` - Articles list
- `GET /api/categories` - Categories
- `POST /api/login` - Authentication

## Performance Targets

### Response Times
- API endpoints: < 500ms
- Page loads: < 3 seconds
- Search: < 1 second
- Image uploads: < 5 seconds

### Availability
- Uptime: > 99.5%
- Error rate: < 1%
- Success rate: > 99%