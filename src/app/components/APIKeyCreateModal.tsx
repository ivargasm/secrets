"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/Store";
import { createAPIKey } from "@/app/lib/api";
import type { Project, APIKeyCreate, APIKeyCreateResponse } from "@/types/vault";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Copy, CheckCircle2, AlertTriangle } from "lucide-react";

interface APIKeyCreateModalProps {
    projects: Project[];
    onClose: () => void;
}

export function APIKeyCreateModal({ projects, onClose }: APIKeyCreateModalProps) {
    const { url } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [createdKey, setCreatedKey] = useState<APIKeyCreateResponse | null>(null);
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        project_id: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data: APIKeyCreate = {
                name: formData.name,
                project_id: formData.project_id ? parseInt(formData.project_id) : undefined,
            };
            const response = await createAPIKey(url, data);
            setCreatedKey(response);
        } catch (error: unknown) {
            console.error("Error creando API key:", error);
            const errorMessage = error instanceof Error ? error.message : "Error al crear la API key";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!createdKey) return;

        try {
            await navigator.clipboard.writeText(createdKey.api_key);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Error copiando al portapapeles:", error);
            alert("Error al copiar al portapapeles");
        }
    };

    // Si ya se creó la key, mostrar el resultado
    if (createdKey) {
        return (
            <Dialog open onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            API Key Creada
                        </DialogTitle>
                        <DialogDescription>
                            Guarda esta API key en un lugar seguro
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Advertencia */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                        ⚠️ Importante
                                    </p>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                        Esta es la única vez que verás esta API key. Cópiala ahora y guárdala en un lugar seguro.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* API Key */}
                        <div>
                            <Label className="mb-2 block">API Key</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={createdKey.api_key}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <Button
                                    type="button"
                                    onClick={handleCopy}
                                    disabled={copied}
                                    className="flex-shrink-0"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 mr-1" />
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

                        {/* Detalles */}
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Nombre:</span>{" "}
                                <span className="text-gray-600 dark:text-gray-400">{createdKey.name}</span>
                            </div>
                            {createdKey.project_id && (
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Proyecto:</span>{" "}
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {projects.find((p) => p.id === createdKey.project_id)?.name || "Desconocido"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={onClose}>Entendido</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // Formulario de creación
    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Nueva API Key</DialogTitle>
                        <DialogDescription>
                            Genera una nueva API key para tus aplicaciones
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Nombre <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Mi Aplicación"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Proyecto */}
                        <div className="space-y-2">
                            <Label htmlFor="project">Proyecto (opcional)</Label>
                            <Select
                                value={formData.project_id || "none"}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, project_id: value === "none" ? "" : value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sin proyecto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin proyecto</SelectItem>
                                    {projects.map((project) => (
                                        <SelectItem key={project.id} value={project.id.toString()}>
                                            {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Generando..." : "Generar API Key"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
