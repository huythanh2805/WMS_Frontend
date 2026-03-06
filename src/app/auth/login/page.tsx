import AuthCard from '@/components/auth/auth-card';
import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <AuthCard mode="login">
        <LoginForm />
      </AuthCard>
    </div>
  );
}
