"use client"
import axiosAuth from "@/axios/instant";
import { setAccessToken } from "@/libs/tokenStorage";
import { useEffect } from "react";

type Props = {}

function SetUpPage({ }: Props) {
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
    return (
        <div>SetUpPage</div>
    )
}

export default SetUpPage