/**
 * Simple in-memory rate limiter for API endpoints
 * For production, consider using Redis or a dedicated service
 */

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(
	identifier: string,
	maxRequests: number,
	windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
	const now = Date.now();
	const entry = rateLimitStore.get(identifier);

	// Clean up expired entries periodically
	if (Math.random() < 0.01) {
		// 1% chance to clean up
		for (const [key, value] of rateLimitStore.entries()) {
			if (value.resetTime < now) {
				rateLimitStore.delete(key);
			}
		}
	}

	if (!entry || entry.resetTime < now) {
		// Create new entry
		const resetAt = now + windowMs;
		rateLimitStore.set(identifier, {
			count: 1,
			resetTime: resetAt
		});

		return {
			allowed: true,
			remaining: maxRequests - 1,
			resetAt
		};
	}

	if (entry.count >= maxRequests) {
		return {
			allowed: false,
			remaining: 0,
			resetAt: entry.resetTime
		};
	}

	// Increment count
	entry.count++;
	rateLimitStore.set(identifier, entry);

	return {
		allowed: true,
		remaining: maxRequests - entry.count,
		resetAt: entry.resetTime
	};
}

/**
 * Get rate limit identifier from request
 */
export function getRateLimitIdentifier(request: Request): string {
	// Use IP address or user ID
	const forwarded = request.headers.get('x-forwarded-for');
	const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
	return `rate_limit:${ip}`;
}

/**
 * Rate limit configuration
 */
export const RATE_LIMITS = {
	auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
	api: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
	fileUpload: { maxRequests: 10, windowMs: 60 * 1000 } // 10 uploads per minute
};
