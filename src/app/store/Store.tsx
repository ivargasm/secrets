import { create } from 'zustand';
import { login, fetchUser, logout, register } from "../lib/api";
import { redirect } from 'next/navigation';

interface AuthState {
    user: { id: string; username: string; email: string; role: string } | null;
    setUser: (user: AuthState['user']) => void;
    logout: () => void;
    url: string;
    loginUser: (email: string, password: string, ur:string) => Promise<void>;
    userAuth: boolean
    userValid: () => Promise<void>;
    registerUser: (username: string, email: string, password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    userAuth: false,
    url: 'https://secrets.ivargasm.com',
    setUser: (user) => set({ user }),
    loginUser: async (email, password) => {
        const data = await login(email, password, useAuthStore.getState().url);
        if (!data) {
            return;
        }
        const user_data = await fetchUser(useAuthStore.getState().url)
        if (!user_data) {
            return;
        }
        set({ userAuth: true });
        set({ user: user_data });
    },
    userValid: async () => {
        const data = await fetchUser(useAuthStore.getState().url);
        if (!data) {
            set({ userAuth: false, user: null });  // Asegurar que se limpie el estado
            return;
        }
        set({ userAuth: true, user: data });
    },
    // 📌 Cerrar sesión
    logout: async() => {
        try {
            const data = await logout(useAuthStore.getState().url);
            if (!data) {
                return;
            }
            set({ user: null, userAuth: false});
            redirect("/login");
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    },
    registerUser: async (username, email, password) => {
        const success = await register(username, email, password, useAuthStore.getState().url);
        if (!success) {
            return false;
        }
        return success;
    },
    
}));
