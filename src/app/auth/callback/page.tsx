"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { saveRefreshToken } from "@/app/actions/auth";
import { Loader2 } from "lucide-react";

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.6, staggerChildren: 0.14 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const circleVariants: Variants = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.4, 0.7, 0.4],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const refreshToken = searchParams.get("refreshToken");
    const isFirstTimeLogIn = searchParams.get("isFirstTimeLogIn");

    if (!refreshToken) {
      router.replace("/login");
      return;
    }

    const handleAuth = async () => {
      try {
        await saveRefreshToken(refreshToken);

        // delay nhỏ để animation có thời gian đẹp mắt
        await new Promise((resolve) => setTimeout(resolve, 1400));

        if (isFirstTimeLogIn === "true") {
          router.replace("/onboarding");
        } else {
          router.replace("/dashboard");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        // có thể thêm toast lỗi nếu bạn dùng sonner/toast
        router.replace("/login?error=auth_failed");
      }
    };

    handleAuth();
  }, [searchParams, router]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950  flex items-center justify-center overflow-hidden px-4">
      {/* Background animated circles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={circleVariants}
        animate="animate"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-md"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Logo / Brand (bạn có thể thay bằng logo thật) */}
        <motion.div
          className="mb-10"
          variants={itemVariants}
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-xl rounded-full" />
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-900/40 text-3xl font-bold">
              A
            </div>
          </div>
        </motion.div>

        {/* Main loading content */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-9 w-9 animate-spin text-indigo-400" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Đang đăng nhập...
            </h1>
          </div>

          <motion.p
            variants={itemVariants}
            className="text-slate-400 text-lg"
          >
            Vui lòng chờ một chút, chúng tôi đang chuẩn bị không gian của bạn
          </motion.p>

          {/* Progress line animation */}
          <div className="w-64 mx-auto h-1.5 bg-slate-800 rounded-full overflow-hidden mt-8">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2.8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        </motion.div>

        {/* Tiny security hint */}
        <motion.p
          variants={itemVariants}
          className="mt-16 text-xs text-slate-500"
        >
          Đang xác thực an toàn • Không làm mới trang
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}