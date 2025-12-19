"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/Store";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { userAuth, userValid } = useAuthStore();

    useEffect(() => {
        const checkAuth = async () => {
            await userValid();
            if (!userAuth) {
                router.push("/auth/login");
            }
        };
        checkAuth();
    }, [userAuth, router, userValid]);

    return userAuth ? children : null;
}