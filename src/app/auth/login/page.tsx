"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/Store";
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    const router = useRouter();
    const { url, loginUser, userValid, userAuth, user } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        const validateUser = async () => {
            await userValid();
        };
        validateUser();
    }, [userValid]);

    useEffect(() => {
        if ((userAuth || user)) {
            router.push('/dashboard');
        }
    }, [user, userAuth, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await loginUser(email, password, url);
            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-900">

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <form onSubmit={handleLogin}>
                <Card className="w-full max-w-md shadow-lg bg-white dark:bg-gray-800">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">Iniciar sesión</CardTitle>
                        <CardDescription className="text-center text-gray-500 dark:text-gray-400">
                            Ingresa tus credenciales para acceder
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                                Correo electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                                    Contraseña
                                </Label>
                                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline dark:text-blue-400">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-gray-500 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-primary/90 text-white">
                            Iniciar sesión
                        </Button>
                    </CardContent>
                    {/* CardFooter removido - Registro deshabilitado para uso personal */}
                </Card>

            </form>
        </div>
    );
}
