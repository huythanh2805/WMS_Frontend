"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "@/libs/auth-schema";
import { toast } from "sonner";

interface LoginFormProps {
  onSubmit?: (data: LoginData) => Promise<void>; // Optional override
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const router = useRouter();
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const handleSubmit = async (data: LoginData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Đăng nhập thất bại");
      const { accessToken } = await res.json();
      // Lưu accessToken vào state (như Zustand hoặc Context)
      // Ví dụ: useAuthStore.getState().setAccessToken(accessToken);
      toast.success("Đăng nhập thành công!");
      router.push("/onboarding?sstep=1"); // Hoặc /dashboard
    } catch (err) {
      toast.error("Email hoặc mật khẩu sai");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit || handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}