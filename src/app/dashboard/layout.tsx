"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/Store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Key,
    Folder,
    Shield,
    FileText,
    LogOut,
    Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, userAuth, userValid, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const validateUser = async () => {
            await userValid();
        };
        validateUser();
    }, [userValid]);

    useEffect(() => {
        if (!userAuth && !user) {
            router.push("/auth/login");
        }
    }, [user, userAuth, router]);

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    const navItems = [
        {
            name: "Secretos",
            href: "/dashboard/secrets",
            icon: Key,
        },
        {
            name: "Proyectos",
            href: "/dashboard/projects",
            icon: Folder,
        },
        {
            name: "API Keys",
            href: "/dashboard/api-keys",
            icon: Shield,
        },
        {
            name: "Auditoría",
            href: "/dashboard/audit",
            icon: FileText,
        },
    ];

    if (!userAuth && !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
            >
                <div className="h-full px-3 py-4 overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5 px-3">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            🔐 Secret Manager
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <ul className="space-y-2 font-medium mt-12">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center p-2 rounded-lg transition-colors ${isActive
                                            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mr-3" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* User Info & Logout */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user?.username || "Usuario"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="ml-2"
                                title="Cerrar sesión"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`${sidebarOpen ? "lg:ml-64" : ""} transition-all`}>
                {/* Top Bar (Mobile) */}
                <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                {/* Page Content */}
                <main className="p-4 lg:p-8">{children}</main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
