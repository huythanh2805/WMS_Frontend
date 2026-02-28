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
import { useEffect } from "react"
import { setAccessToken } from "@/libs/tokenStorage"
import { Button } from "@/components/ui/button"

export default function Dasboard() {
  useEffect(() => {
    axiosAuth.post("/auth/refresh")
      .then(response => {
        console.log("RefreshToken:", response);
        setAccessToken(response.data.accessToken);
      })
      .catch(error => {
        console.error("API Error:", error);
      });
  }, [])
  function handleTestApi() {
    axiosAuth.get("/user")
      .then(response => {
        console.log("API Response:", response);
      })
      .catch(error => {
        console.error("API Error:", error);
      });
  }
  return (
    // <SidebarProvider
    //   style={
    //     {
    //       "--sidebar-width": "calc(var(--spacing) * 72)",
    //       "--header-height": "calc(var(--spacing) * 12)",
    //     } as React.CSSProperties
    //   }
    // >
      
    //   <AppSidebar variant="inset" />
    //   <SidebarInset>
    //     <SiteHeader />
    //     <div className="flex flex-1 flex-col">
    //       <div className="@container/main flex flex-1 flex-col gap-2">
    //         <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    //           <SectionCards />
    //           <div className="px-4 lg:px-6">
    //             <ChartAreaInteractive />
    //           </div>
    //           <DataTable data={data} />
    //         </div>
    //       </div>
    //     </div>
    //   </SidebarInset>
    // </SidebarProvider>
    <Button onClick={handleTestApi}>Get user</Button>
    
  )
}
