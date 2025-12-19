"use client";

import { useState } from "react";
import { useAuthStore } from "@/app/store/Store";
import { createSecret } from "@/app/lib/api";
import type { Project, SecretCreate } from "@/types/vault";
import { Button } from "@/components/ui/button";
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
import { Upload, FileText, AlertCircle } from "lucide-react";

interface BulkImportModalProps {
    projects: Project[];
    onClose: () => void;
}

export function BulkImportModal({ projects, onClose }: BulkImportModalProps) {
    const { url } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [envText, setEnvText] = useState("");
    const [projectId, setProjectId] = useState("");
    const [results, setResults] = useState<{
        success: number;
        failed: number;
        errors: string[];
    } | null>(null);

    const parseEnvText = (text: string): { key: string; value: string }[] => {
        const lines = text.split("\n");
        const secrets: { key: string; value: string }[] = [];

        for (const line of lines) {
            const trimmed = line.trim();

            // Ignorar líneas vacías y comentarios
            if (!trimmed || trimmed.startsWith("#")) continue;

            // Buscar patrón KEY=value
            const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
            if (match) {
                const [, key, value] = match;
                // Remover comillas si existen
                const cleanValue = value.replace(/^["']|["']$/g, "");
                secrets.push({ key, value: cleanValue });
            }
        }

        return secrets;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setEnvText(text);
        };
        reader.readAsText(file);
    };

    const handleImport = async () => {
        if (!envText.trim()) {
            alert("Por favor ingresa o carga secretos");
            return;
        }

        setLoading(true);
        const secrets = parseEnvText(envText);

        if (secrets.length === 0) {
            alert("No se encontraron secretos válidos. Usa el formato: KEY=value");
            setLoading(false);
            return;
        }

        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        for (const secret of secrets) {
            try {
                const data: SecretCreate = {
                    key: secret.key,
                    value: secret.value,
                    project_id: projectId && projectId !== "none" ? parseInt(projectId) : undefined,
                };
                await createSecret(url, data);
                success++;
            } catch (error: unknown) {
                failed++;
                const errorMessage = error instanceof Error ? error.message : "Error desconocido";
                errors.push(`${secret.key}: ${errorMessage}`);
            }
        }

        setResults({ success, failed, errors });
        setLoading(false);
    };

    // Si ya se importó, mostrar resultados
    if (results) {
        return (
            <Dialog open onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Resultados de Importación</DialogTitle>
                        <DialogDescription>
                            {results.success} secretos importados correctamente
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Estadísticas */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                                <p className="text-sm text-green-600 dark:text-green-400">Exitosos</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                    {results.success}
                                </p>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                                <p className="text-sm text-red-600 dark:text-red-400">Fallidos</p>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                    {results.failed}
                                </p>
                            </div>
                        </div>

                        {/* Errores */}
                        {results.errors.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                                            Errores encontrados:
                                        </p>
                                        <div className="space-y-1 max-h-40 overflow-y-auto">
                                            {results.errors.map((error, i) => (
                                                <p key={i} className="text-xs text-red-700 dark:text-red-300 font-mono">
                                                    {error}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button onClick={onClose}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // Formulario de importación
    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Importación Masiva de Secretos</DialogTitle>
                    <DialogDescription>
                        Importa múltiples secretos desde un archivo .env o pegando el texto
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    {/* Proyecto */}
                    <div className="space-y-2">
                        <Label htmlFor="project">Proyecto (opcional)</Label>
                        <Select
                            value={projectId || "none"}
                            onValueChange={(value) => setProjectId(value === "none" ? "" : value)}
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
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Todos los secretos se asignarán a este proyecto
                        </p>
                    </div>

                    {/* Cargar archivo */}
                    <div className="space-y-2">
                        <Label htmlFor="file">Cargar archivo .env</Label>
                        <div className="flex items-center gap-2">
                            <input
                                id="file"
                                type="file"
                                accept=".env,.txt"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("file")?.click()}
                                className="w-full"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Seleccionar archivo .env
                            </Button>
                        </div>
                    </div>

                    {/* Textarea */}
                    <div className="space-y-2">
                        <Label htmlFor="envText">O pega el contenido aquí</Label>
                        <Textarea
                            id="envText"
                            placeholder={`DATABASE_URL=postgresql://user:pass@localhost/db
API_KEY=sk-1234567890
SECRET_TOKEN=abc123xyz
# Los comentarios se ignoran
ANOTHER_SECRET=valor-secreto`}
                            value={envText}
                            onChange={(e) => setEnvText(e.target.value)}
                            rows={10}
                            className="font-mono text-sm resize-none overflow-y-auto whitespace-pre-wrap break-words"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Formato: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">KEY=value</code> (una por línea)
                        </p>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="flex gap-2">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <div className="text-xs text-blue-800 dark:text-blue-200">
                                <p className="font-medium mb-1">Formato soportado:</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                    <li>Nombres en MAYÚSCULAS (A-Z, 0-9, _)</li>
                                    <li>Formato: KEY=value</li>
                                    <li>Comillas opcionales: KEY=&quot;value&quot; o KEY=&apos;value&apos;</li>
                                    <li>Comentarios con # se ignoran</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleImport} disabled={loading || !envText.trim()}>
                        {loading ? "Importando..." : "Importar Secretos"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
