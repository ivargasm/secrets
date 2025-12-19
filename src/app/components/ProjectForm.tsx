"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/Store";
import { createProject, updateProject } from "@/app/lib/api";
import type { Project, ProjectCreate, ProjectUpdate } from "@/types/vault";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ProjectFormProps {
    mode: "create" | "edit";
    project?: Project;
    onClose: () => void;
}

export function ProjectForm({ mode, project, onClose }: ProjectFormProps) {
    const { url } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: project?.name || "",
        description: project?.description || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === "create") {
                const data: ProjectCreate = {
                    name: formData.name,
                    description: formData.description || undefined,
                };
                await createProject(url, data);
            } else if (project) {
                const data: ProjectUpdate = {
                    name: formData.name,
                    description: formData.description || undefined,
                };
                await updateProject(url, project.id, data);
            }

            onClose();
        } catch (error: unknown) {
            console.error("Error guardando proyecto:", error);
            const errorMessage = error instanceof Error ? error.message : "Error al guardar el proyecto";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "create" ? "Nuevo Proyecto" : "Editar Proyecto"}
                        </DialogTitle>
                        <DialogDescription>
                            {mode === "create"
                                ? "Crea un nuevo proyecto para organizar tus secretos"
                                : "Modifica el proyecto existente"}
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
                                placeholder="Mi Proyecto"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción (opcional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Descripción del proyecto..."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                rows={3}
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
