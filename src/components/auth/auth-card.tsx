'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { toast } from 'sonner';

interface AuthCardProps {
  mode: 'login' | 'register';
  children: React.ReactNode;
}

export default function AuthCard({ mode, children }: AuthCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      // Redirect đến NestJS Google OAuth endpoint
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
      // Hoặc dùng NextAuth: signIn("google", { callbackUrl: "/onboarding" });
    } catch (err) {
      toast.error('Không thể kết nối với Google');
      setLoading(false);
    }
  };

  const switchModeText =
    mode === 'login'
      ? 'Chưa có tài khoản? Đăng ký'
      : 'Đã có tài khoản? Đăng nhập';
  const switchModeLink = mode === 'login' ? '/auth/register' : '/auth/login';

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
        </CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Chào mừng quay lại!'
            : 'Tạo tài khoản mới để bắt đầu.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Children: Form login hoặc register */}
        {children}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Separator className="my-4" />
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogle}
          disabled={loading}
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          {mode === 'login' ? 'Đăng nhập với Google' : 'Đăng ký với Google'}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          {switchModeText}
          <Link
            href={switchModeLink}
            className="ml-1 font-medium text-primary hover:underline"
          >
            tại đây
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
