"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axiosAuth from "@/axios/instant";
import { AxiosError } from "axios";


export default function InvitationVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("/");
  // Giả lập API call - bạn thay bằng API thật của bạn
  const verifyInvitationToken = async (token: string) => {
    // Ví dụ delay 1.8s để thấy animation đẹp
    await new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      const res = await axiosAuth(`/invitation/verify`, {
        method: "post",
        data: { token }
      });
      console.log({ res })
      return {
        success: true,
        message: "Tham gia nhóm thành công!",
        redirectTo: "/dashboard",
      };

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      throw new Error(err.response?.data?.message || "Token sai hoặc hết hạn")
    }
  };
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Không tìm thấy token xác thực trong link");
      return;
    }

    let isMounted = true;

    const verify = async () => {
      setStatus("loading");
      try {
        const result = await verifyInvitationToken(token);
        if (isMounted) {
          setStatus("success");
          setMessage(result.message);
          setRedirectUrl(result.redirectTo || "/dashboard");
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus("error");
          setMessage(err.message || "Xác thực thất bại. Link có thể đã hết hạn.");
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleRedirect = () => {
    router.push(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 rounded-full border-4 border-indigo-500/30 border-t-indigo-400 shadow-2xl"
                />
                <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-indigo-400 animate-pulse" />
              </div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-3"
              >
                Đang xác thực lời mời...
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-slate-400 text-center max-w-sm"
              >
                Vui lòng chờ một chút, chúng tôi đang kiểm tra lời mời của bạn
              </motion.p>

              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-10 text-sm text-indigo-300/70"
              >
                Đừng đóng trang này nhé ✦
              </motion.div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Card className="bg-slate-900/60 border-indigo-500/30 backdrop-blur-xl shadow-2xl shadow-indigo-500/20">
                <CardHeader className="text-center pb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                    className="mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-20 h-20 text-emerald-400" />
                  </motion.div>
                  <CardTitle className="text-3xl bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                    Chào mừng bạn!
                  </CardTitle>
                  <CardDescription className="text-lg text-slate-300 mt-2">
                    {message}
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-center text-slate-400">
                  <Sparkles className="inline-block w-5 h-5 mr-2 text-yellow-300 animate-pulse" />
                  Bạn đã được thêm vào nhóm / dự án thành công
                </CardContent>

                <CardFooter className="flex justify-center pt-6">
                  <Button
                    size="lg"
                    onClick={handleRedirect}
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/30 transition-all duration-300 group"
                  >
                    <span>Tiếp tục đến trang chính</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Card className="bg-slate-900/70 border-red-500/30 backdrop-blur-xl shadow-2xl shadow-red-500/10">
                <CardHeader className="text-center pb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                    className="mx-auto mb-4"
                  >
                    <XCircle className="w-20 h-20 text-red-400" />
                  </motion.div>
                  <CardTitle className="text-3xl text-red-300">Có lỗi xảy ra</CardTitle>
                  <CardDescription className="text-lg text-slate-300 mt-3">
                    {message}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex justify-center gap-4 pt-6">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-slate-600 hover:bg-slate-800"
                  >
                    Quay lại
                  </Button>
                  <Button
                    onClick={() => window.location.href = "/"}
                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                  >
                    Về trang chủ
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {status === "idle" && !token && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-400"
            >
              <h2 className="text-2xl mb-4">Không có thông tin token</h2>
              <p>Vui lòng sử dụng đúng link trong email mời</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}