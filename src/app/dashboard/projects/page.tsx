"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/Store";
import { getProjects, deleteProject } from "@/app/lib/api";
import type { Project } from "@/types/vault";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Folder } from "lucide-react";
import { ProjectForm } from "@/app/components/ProjectForm";

export default function ProjectsPage() {
    const { url } = useAuthStore();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setLoading(true);
                const data = await getProjects(url);
                setProjects(data);
            } catch (error) {
                console.error("Error cargando proyectos:", error);
            } finally {
                setLoading(false);
            }
        };
        
        loadProjects();
    }, [url]);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await getProjects(url);
            setProjects(data);
        } catch (error) {
            console.error("Error cargando proyectos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

        try {
            await deleteProject(url, id);
            await loadProjects();
        } catch (error: unknown) {
            console.error("Error eliminando proyecto:", error);
            const errorMessage = error instanceof Error ? error.message : "Error al eliminar el proyecto";
            alert(errorMessage);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingProject(null);
        loadProjects();
    };

    return (
        <div className="space-y-6 mt-16">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Proyectos
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Organiza tus secretos por proyectos
                    </p>
                </div>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Proyecto
                </Button>
            </div>

            {/* Projects Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                    <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        No hay proyectos. Crea tu primer proyecto.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            <Folder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            {project.name}
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            {project.description || "Sin descripción"}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Creado: {new Date(project.created_at).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(project)}
                                            title="Editar"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(project.id)}
                                            title="Eliminar"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <ProjectForm
                    mode={editingProject ? "edit" : "create"}
                    project={editingProject || undefined}
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
}
