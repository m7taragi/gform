import { NextResponse } from 'next/server';

// Basic in-memory rate limiting mechanism for API Routes
// Note: In a production Edge environment (like Vercel), use Upstash Redis for shared global state.
const rateLimitMap = new Map();

export default function proxy(request) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
  
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const currentWindow = Math.floor(Date.now() / 60000); // 1-minute window
    const key = `ip:${ip}:window:${currentWindow}`;
    
    const requestCount = rateLimitMap.get(key) || 0;
    
    // Strict limit: Max 60 API calls per minute per IP to prevent bot scraping
    if (requestCount >= 60) {
      return new NextResponse(
        JSON.stringify({ error: 'Too Many Requests - Security Rate Limit Exceeded' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    rateLimitMap.set(key, requestCount + 1);
  }

  // Inject security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};


