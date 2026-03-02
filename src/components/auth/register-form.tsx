"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "@/libs/auth-schema";
import { toast } from "sonner";
import axiosAuth from "@/axios/instant";
import axios from "axios";
import { User } from "@/types/user";
import { useUserStore } from "@/stores/userStore";

interface RegisterFormProps {
  onSubmit?: (data: RegisterData) => Promise<void>;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { setUser } = useUserStore();
  const router = useRouter();
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const handleSubmit = async (data: RegisterData) => {
    try {
      // Register
      const registerRes = await axiosAuth.post(`/auth/register`, {
        email: data.email,
        password: data.password,
      });
      // Get user profile
      const accessToken = registerRes.data.accessToken;
      const profileRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const me: User = profileRes.data.data;
      setUser(me);
      toast.success("Đăng ký thành công!");
      router.push("/onboarding");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Đăng ký thất bại");
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xác nhận mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          Đăng ký
        </Button>
      </form>
    </Form>
  );
}