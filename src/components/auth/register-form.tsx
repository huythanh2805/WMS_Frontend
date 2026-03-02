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

interface RegisterFormProps {
  onSubmit?: (data: RegisterData) => Promise<void>;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const router = useRouter();
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const handleSubmit = async (data: RegisterData) => {
    try {
      const res = await axiosAuth.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        email: data.email,
        password: data.password,
      });
      console.log("Res", res);
      console.log("Response from register API:", res.data);
      toast.success("Đăng ký thành công!");
      router.push("/onboarding?sstep=1");
    } catch (err: any) {
      console.log("Error during registration:", err);
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