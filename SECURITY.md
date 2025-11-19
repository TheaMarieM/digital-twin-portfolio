# Security Documentation

## Overview
This document outlines the security measures implemented in the AI chat system to protect against common vulnerabilities and ensure safe operation.

## Security Features Implemented

### 1. Rate Limiting

#### Chat API (`/api/chat`)
- **Request Limit**: 20 requests per minute per IP address
- **Message Length**: Maximum 500 characters per message
- **Session Limit**: Maximum 100 messages per session
- **Implementation**: Redis-based distributed rate limiting

#### RAG API (`/api/rag`)
- **Request Limit**: 30 requests per minute per IP address
- **Query Length**: Maximum 300 characters per query
- **Implementation**: In-memory rate limiting with periodic cleanup

#### Response Headers
```
X-RateLimit-Limit: Maximum requests allowed
X-RateLimit-Remaining: Remaining requests in current window
Retry-After: Seconds until rate limit resets (when exceeded)
```

### 2. Input Validation & Sanitization

#### Message/Query Validation
- Type checking (must be non-empty string)
- Length validation (prevents buffer overflow attacks)
- Minimum length requirement (3 characters for RAG queries)
- Pattern matching for suspicious content:
  - `<script>` tags
  - `javascript:` protocol
  - Event handlers (`onclick`, `onerror`, etc.)
  - `<iframe>` tags
  - `eval()` calls

#### Session ID Validation
- Must be 64-character hexadecimal string
- Generated using crypto.randomBytes(32) for high entropy
- Invalid IDs trigger new secure session generation

### 3. Content Filtering

#### Sensitive Information Filtering
- API keys and tokens: `[REDACTED]`
- Passwords: `password: [REDACTED]`
- Long alphanumeric strings (32+ chars): `[REDACTED]`

#### Prompt Injection Prevention
- Removes "ignore previous instructions" attempts
- Filters "you are now" system prompt overrides
- Strips `system:` prefix attempts

### 4. Security Headers

All API responses include:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Cache-Control: private, no-cache, no-store, must-revalidate
```

### 5. Session Management

#### Secure Session Handling
- Cryptographically secure session IDs (256-bit entropy)
- Session TTL: 24 hours (configurable via `SESSION_TTL_SECONDS`)
- Message history trimmed to last 20 messages
- Automatic session expiration in Redis

#### Session Tracking
- Message count per session tracked
- Remaining messages included in response metadata
- Session cleanup on expiration

### 6. Error Handling

#### Secure Error Messages
- Generic error messages to external users
- Detailed logs for administrators only
- No stack traces or internal paths exposed
- Rate limit errors include retry timing

#### API Error Responses
```json
{
  "error": "User-friendly error message",
  "retryAfter": 60  // Optional, for rate limits
}
```

### 7. Performance Optimizations

#### Caching (RAG API)
- Semantic cache with cosine similarity threshold (0.95)
- 100-item cache capacity
- 30-minute TTL with automatic cleanup
- Cache hit tracking and metrics

#### Response Time Tracking
```json
{
  "meta": {
    "cached": true,
    "latencyMs": 15,
    "messagesRemaining": 95,
    "requestsRemaining": 18
  }
}
```

## Environment Variables

### Required
```env
# Redis (for chat history and rate limiting)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# LLM Provider
LLM_PROVIDER=groq  # or "ollama"
GROQ_API_KEY=your_groq_key  # Required if using Groq
GROQ_MODEL=llama-3.3-70b-versatile

# RAG
OPENAI_API_KEY=your_openai_key
```

### Optional
```env
# Rate Limiting
MAX_HISTORY_MESSAGES=20
SESSION_TTL_SECONDS=86400  # 24 hours

# Ollama (if using local LLM)
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2
```

## Best Practices

### For Developers

1. **Never log sensitive data**: API keys, tokens, or user messages
2. **Validate all inputs**: Use provided validation functions
3. **Monitor rate limits**: Check Redis for abuse patterns
4. **Rotate API keys**: Regularly rotate all API keys
5. **Update dependencies**: Keep all packages up to date

### For Deployment

1. **Use HTTPS only**: Never expose API over HTTP
2. **Set strong CORS policies**: Limit origins in production
3. **Enable Redis persistence**: For rate limiting across restarts
4. **Monitor logs**: Set up alerts for suspicious patterns
5. **Use environment secrets**: Never commit .env files

### For Production

1. **Use Redis for rate limiting**: In-memory store won't work with multiple instances
2. **Set up CDN**: CloudFlare or similar for DDoS protection
3. **Enable request logging**: For audit and security analysis
4. **Implement IP blocking**: For persistent attackers
5. **Regular security audits**: Review logs and patterns weekly

## Attack Mitigation

### Implemented Protections

| Attack Type | Mitigation |
|-------------|------------|
| Rate Limiting Bypass | IP-based limits with Redis persistence |
| XSS (Cross-Site Scripting) | Input validation + content security headers |
| CSRF | SameSite cookies + Origin validation |
| SQL Injection | N/A (No SQL database used) |
| NoSQL Injection | Type validation + pattern matching |
| Prompt Injection | Content filtering + system prompt protection |
| DoS (Denial of Service) | Rate limiting + request size limits |
| Session Hijacking | Secure session IDs + TTL |
| Information Disclosure | Generic error messages + sensitive data redaction |

## Monitoring & Alerting

### Metrics to Monitor

1. **Rate Limit Hits**: Unusual spike may indicate attack
2. **Cache Hit Rate**: Should be >30% for normal usage
3. **Average Latency**: Sudden increase may indicate issues
4. **Error Rate**: Should be <1% under normal conditions
5. **Session Count**: Track concurrent active sessions

### Alert Thresholds

- Rate limit exceeded: >100 times per hour from single IP
- Error rate: >5% over 5-minute window
- Average latency: >2000ms sustained
- Cache miss rate: >90% (may indicate cache poisoning attempt)

## Security Updates

### Version History

- **v1.0.0** (2025-11-19): Initial security implementation
  - Rate limiting
  - Input validation
  - Content filtering
  - Security headers
  - Session management

### Planned Improvements

- [ ] IP geolocation blocking
- [ ] Machine learning-based anomaly detection
- [ ] Advanced prompt injection detection
- [ ] Request signature verification
- [ ] Multi-factor authentication for admin endpoints

## Incident Response

### In Case of Security Breach

1. **Immediate**: Rotate all API keys
2. **Within 1 hour**: Review logs for compromised sessions
3. **Within 4 hours**: Implement additional rate limits if needed
4. **Within 24 hours**: Conduct full security audit
5. **Within 1 week**: Update security documentation

### Contact

For security issues, please contact: magnomarithea157@gmail.com

## Compliance

This implementation follows:
- OWASP Top 10 security practices
- GDPR data protection principles (no PII stored)
- Industry standard rate limiting practices
- Secure session management guidelines

---

**Last Updated**: November 19, 2025
**Version**: 1.0.0
