// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Danh sách route
const publicRoutes = ['/', '/auth/login', '/auth/register'];
const protectedRoutes = ['/dashboard', '/onboarding'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lấy cookie refreshToken từ request
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublic = publicRoutes.includes(pathname) || pathname.startsWith('/auth/');
  const isProtected = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Trường hợp 1: Người dùng truy cập protected route mà KHÔNG có refreshToken
  if (isProtected && !refreshToken) {
    // Redirect về login, có thể thêm ?redirect= để quay lại sau khi login
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Trường hợp 2: Người dùng đã login (có refreshToken) mà truy cập trang public/auth
//   if (refreshToken && (isPublic || pathname.startsWith('/auth/'))) {
//     const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard';
//     return NextResponse.redirect(new URL(redirectTo, request.url));
//   }

  // Trường hợp bình thường: cho đi tiếp
  return NextResponse.next();
}

// Chỉ chạy middleware cho các route liên quan (tối ưu performance)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};