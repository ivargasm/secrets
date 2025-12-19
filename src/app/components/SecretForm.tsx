"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/Store";
import { createSecret, updateSecret } from "@/app/lib/api";
import type { Secret, Project, SecretCreate, SecretUpdate } from "@/types/vault";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Eye, EyeOff } from "lucide-react";

interface SecretFormProps {
    mode: "create" | "edit";
    secret?: Secret;
    projects: Project[];
    onClose: () => void;
}

export function SecretForm({ mode, secret, projects, onClose }: SecretFormProps) {
    const { url } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [showValue, setShowValue] = useState(false);

    const [formData, setFormData] = useState({
        key: secret?.key || "",
        value: "",
        description: secret?.description || "",
        project_id: secret?.project_id?.toString() || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === "create") {
                const data: SecretCreate = {
                    key: formData.key,
                    value: formData.value,
                    description: formData.description || undefined,
                    project_id: formData.project_id ? parseInt(formData.project_id) : undefined,
                };
                await createSecret(url, data);
            } else if (secret) {
                const data: SecretUpdate = {
                    description: formData.description || undefined,
                    project_id: formData.project_id ? parseInt(formData.project_id) : undefined,
                };

                // Solo incluir value si se modificó
                if (formData.value) {
                    data.value = formData.value;
                }

                await updateSecret(url, secret.id, data);
            }

            onClose();
        } catch (error: unknown) {
            console.error("Error guardando secreto:", error);
            const errorMessage = error instanceof Error ? error.message : "Error al guardar el secreto";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "create" ? "Nuevo Secreto" : "Editar Secreto"}
                        </DialogTitle>
                        <DialogDescription>
                            {mode === "create"
                                ? "Crea un nuevo secreto cifrado"
                                : "Modifica el secreto existente"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <Label htmlFor="key">
                                Nombre <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="key"
                                placeholder="API_KEY_PRODUCTION"
                                value={formData.key}
                                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                disabled={mode === "edit"}
                                required
                                pattern="[a-zA-Z0-9_-]+"
                                title="Solo letras, números, guiones y guiones bajos"
                            />
                            {mode === "edit" && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    El nombre no se puede modificar
                                </p>
                            )}
                        </div>

                        {/* Valor */}
                        <div className="space-y-2">
                            <Label htmlFor="value">
                                Valor {mode === "create" && <span className="text-red-500">*</span>}
                            </Label>
                            <div className="relative">
                                <Textarea
                                    id="value"
                                    placeholder={
                                        mode === "edit"
                                            ? "Dejar vacío para mantener el valor actual"
                                            : "sk-1234567890abcdef..."
                                    }
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    required={mode === "create"}
                                    className={`pr-10 font-mono text-sm ${!showValue ? 'password-field' : ''}`}
                                    rows={3}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2"
                                    onClick={() => setShowValue(!showValue)}
                                >
                                    {showValue ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
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

                        {/* Descripción */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción (opcional)</Label>
                            <Textarea
                                id="description"
                                placeholder="API key para el servicio de pagos..."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                rows={2}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Guardando..." : mode === "create" ? "Crear" : "Guardar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
