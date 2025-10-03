# AFI Application Form - Troubleshooting Guide

## HTTP Connectivity Issues

### Problem: Empty Reply from Server / Socket Hang Up

**Symptoms:**
- `curl: (52) Empty reply from server`
- Node.js HTTP requests fail with `ECONNRESET`
- TCP connections work but HTTP requests fail
- Applications start successfully and listen on ports

**Root Cause:** Proxifier Software Interference

**Solution:**
1. **Disable Proxifier**: Exit or disable Proxifier application completely
2. **Clear DNS Cache**: Run `ipconfig /flushdns` in cmd.exe
3. **Restart Network Stack**: Run `netsh winsock reset` (requires admin)
4. **Test in Browser**: Open http://localhost:5000/api/v1/health directly

**Prevention:**
- Configure Proxifier to exclude localhost/127.0.0.1 traffic
- Add proxy rules to bypass local development ports (3000-9000)
- Use process exclusions for node.exe in Proxifier settings

### Alternative Testing Methods

When command line tools fail:
1. **Browser Testing**: Always works regardless of proxy settings
2. **PowerShell**: Sometimes works when Git Bash fails
3. **Postman/Insomnia**: GUI tools often bypass proxy issues

### Development Environment Notes

**Recommended Setup:**
- Use WSL2 for development to avoid Windows networking issues
- Configure proxy software to exclude development ports
- Consider Docker Desktop for containerized development

**Port Configuration:**
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- API Documentation: http://localhost:5000/api/docs

## Docker Services Status Check

```bash
# Check all containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Test database connectivity
docker exec afi_postgres_dev pg_isready -h localhost -p 5432

# Test Redis
docker exec afi_redis_dev redis-cli -a afi_redis_pass ping

# Check service logs
docker logs afi_minio_dev --tail 10
```

## Application Logs

**Backend Logs Location:**
- Console output shows startup and request logs
- Check for "Nest application successfully started" message

**Frontend Logs Location:**
- Console output shows Next.js startup status
- Look for "Ready in X.Xs" message

## Common Issues

1. **Port Already in Use**: Kill existing Node.js processes
2. **Database Connection**: Ensure Docker containers are running
3. **Environment Variables**: Check .env file configuration
4. **NPM Dependencies**: Run `npm install` if modules are missing