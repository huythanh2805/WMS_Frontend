"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"
import axiosAuth from "@/axios/instant"
import { setAccessToken } from "@/libs/tokenStorage"
import { useUserStore } from "@/stores/userStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { fetchUserInfomation } from "@/utils/auth"

export default function Dasboard() {
  const { user, setUser } = useUserStore()
  const router = useRouter();
  console.log({ user })
  // when user login success with google, we will get user infomation in first loading
  useEffect(() => {
    if (!user) {
      fetchUserInfomation({ setUser });
    }
  }, [user]);
  // Handle logout
  const handleLogOut = async () => {
    await axiosAuth.get("/auth/logout")
    setAccessToken("")
    setUser(null)
    router.replace("/");
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >

      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
