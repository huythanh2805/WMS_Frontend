"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveRefreshToken } from "@/app/actions/auth";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  console.log("this is auth callback page")
  useEffect(() => {
    const refreshToken = searchParams.get("refreshToken");
    const isFirstTimeLogIn = searchParams.get("isFirstTimeLogIn");

    if (!refreshToken) {
      router.push("/login");
      return;
    }

    const handleAuth = async () => {
      await saveRefreshToken(refreshToken);

      if (isFirstTimeLogIn === "true") {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    };

    handleAuth();
  }, [searchParams, router]);

  return <div>Logging you in...</div>;
}
export default function Page() {
  return (
    <Suspense fallback={<div>...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}