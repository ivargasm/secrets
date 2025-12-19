"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/Store";
import { getAPIKeys, getProjects, deactivateAPIKey } from "@/app/lib/api";
import type { APIKey, Project } from "@/types/vault";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Shield, XCircle } from "lucide-react";
import { APIKeyCreateModal } from "@/app/components/APIKeyCreateModal";

export default function APIKeysPage() {
    const { url } = useAuthStore();
    const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [keysData, projectsData] = await Promise.all([
                    getAPIKeys(url),
                    getProjects(url),
                ]);
                setApiKeys(keysData);
                setProjects(projectsData);
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [url]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [keysData, projectsData] = await Promise.all([
                getAPIKeys(url),
                getProjects(url),
            ]);
            setApiKeys(keysData);
            setProjects(projectsData);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (id: number) => {
        if (!confirm("¿Estás seguro de desactivar esta API key?")) return;

        try {
            await deactivateAPIKey(url, id);
            await loadData();
        } catch (error: unknown) {
            console.error("Error desactivando API key:", error);
            const errorMessage = error instanceof Error ? error.message : "Error al desactivar la API key";
            alert(errorMessage);
        }
    };

    const handleCreateClose = () => {
        setShowCreateModal(false);
        loadData();
    };

    const getProjectName = (projectId?: number) => {
        if (!projectId) return "Sin proyecto";
        const project = projects.find((p) => p.id === projectId);
        return project?.name || "Desconocido";
    };

    return (
        <div className="space-y-6 mt-16">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        API Keys
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Genera y gestiona API keys para tus aplicaciones
                    </p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva API Key
                </Button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
                </div>
            ) : apiKeys.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        No hay API keys. Genera tu primera API key.
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Proyecto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Último uso</TableHead>
                                <TableHead>Creada</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {apiKeys.map((apiKey) => (
                                <TableRow key={apiKey.id}>
                                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                            {getProjectName(apiKey.project_id)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {apiKey.is_active ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                Activa
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                                                Inactiva
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-gray-500 dark:text-gray-400">
                                        {apiKey.last_used
                                            ? new Date(apiKey.last_used).toLocaleString()
                                            : "Nunca"}
                                    </TableCell>
                                    <TableCell className="text-gray-500 dark:text-gray-400">
                                        {new Date(apiKey.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {apiKey.is_active && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeactivate(apiKey.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Desactivar
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <APIKeyCreateModal projects={projects} onClose={handleCreateClose} />
            )}
        </div>
    );
}
