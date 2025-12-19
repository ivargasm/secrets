"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/Store";
import ProtectedRoute from "../components/ProtectedRoutes";

export default function ProfilePage() {
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    return (
        <ProtectedRoute>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white text-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Perfil del Usuario</h2>
                <p><strong>Nombre:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Rol:</strong> {user?.role}</p>
                <button
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>
            </div>
            
        </ProtectedRoute>
    );
}
