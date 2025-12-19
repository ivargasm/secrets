"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/Store";
import { getSecret } from "@/app/lib/api";
import type { SecretDetail } from "@/types/vault";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface SecretViewModalProps {
    secretId: number;
    onClose: () => void;
}

export function SecretViewModal({ secretId, onClose }: SecretViewModalProps) {
    const { url } = useAuthStore();
    const [secret, setSecret] = useState<SecretDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [showValue, setShowValue] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loadSecret = async () => {
            try {
                setLoading(true);
                const data = await getSecret(url, secretId);
                setSecret(data);
            } catch (error) {
                console.error("Error cargando secreto:", error);
                alert("Error al cargar el secreto");
                onClose();
            } finally {
                setLoading(false);
            }
        };
        
        loadSecret();
    }, [secretId, url, onClose]);

    const handleCopy = async () => {
        if (!secret) return;

        try {
            await navigator.clipboard.writeText(secret.value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Error copiando al portapapeles:", error);
            alert("Error al copiar al portapapeles");
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Ver Secreto</DialogTitle>
                    <DialogDescription>
                        Visualiza el valor descifrado del secreto
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="py-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
                    </div>
                ) : secret ? (
                    <div className="space-y-4 py-4">
                        {/* Nombre */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nombre
                            </p>
                            <p className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                {secret.key}
                            </p>
                        </div>

                        {/* Valor */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Valor
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowValue(!showValue)}
                                    >
                                        {showValue ? (
                                            <>
                                                <EyeOff className="h-4 w-4 mr-1" />
                                                Ocultar
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="h-4 w-4 mr-1" />
                                                Mostrar
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCopy}
                                        disabled={copied}
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                                                Copiado
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4 mr-1" />
                                                Copiar
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <div className="relative">
                                <p className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded break-all">
                                    {showValue ? secret.value : "•".repeat(Math.min(secret.value.length, 50))}
                                </p>
                            </div>
                        </div>

                        {/* Descripción */}
                        {secret.description && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Descripción
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {secret.description}
                                </p>
                            </div>
                        )}

                        {/* Advertencia de seguridad */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                ⚠️ <strong>Advertencia:</strong> Asegúrate de estar en un lugar seguro antes de mostrar el valor del secreto.
                            </p>
                        </div>
                    </div>
                ) : null}

                <DialogFooter>
                    <Button onClick={onClose}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
