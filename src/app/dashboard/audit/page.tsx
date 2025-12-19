"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/Store";
import { getAuditLogs } from "@/app/lib/api";
import type { AuditLog } from "@/types/vault";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, FileText, Eye, Pencil, Trash2, Plus } from "lucide-react";

export default function AuditPage() {
    const { url } = useAuthStore();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState<string>("all");

    useEffect(() => {
        const loadLogs = async () => {
            try {
                setLoading(true);
                const data = await getAuditLogs(url, { limit: 100 });
                setLogs(data);
            } catch (error) {
                console.error("Error cargando logs:", error);
            } finally {
                setLoading(false);
            }
        };
        
        loadLogs();
    }, [url]);

    // Filtrar logs
    const filteredLogs = logs.filter((log) => {
        const matchesSearch =
            log.secret_key?.toLowerCase().includes(search.toLowerCase()) ||
            log.user_email?.toLowerCase().includes(search.toLowerCase());
        const matchesAction =
            actionFilter === "all" || log.action === actionFilter;
        return matchesSearch && matchesAction;
    });

    const getActionIcon = (action: string) => {
        switch (action) {
            case "read":
                return <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
            case "create":
                return <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />;
            case "update":
                return <Pencil className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
            case "delete":
                return <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />;
            default:
                return <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
        }
    };

    const getActionLabel = (action: string) => {
        const labels: Record<string, string> = {
            read: "Lectura",
            create: "Creación",
            update: "Actualización",
            delete: "Eliminación",
        };
        return labels[action] || action;
    };

    const getActionColor = (action: string) => {
        const colors: Record<string, string> = {
            read: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
            create: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
            update: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
            delete: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        };
        return colors[action] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    };

    return (
        <div className="space-y-6 mt-16">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Auditoría
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Registro de accesos y modificaciones a los secretos
                </p>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por secreto o usuario..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filtrar por acción" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las acciones</SelectItem>
                        <SelectItem value="read">Lectura</SelectItem>
                        <SelectItem value="create">Creación</SelectItem>
                        <SelectItem value="update">Actualización</SelectItem>
                        <SelectItem value="delete">Eliminación</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Lecturas</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {logs.filter((l) => l.action === "read").length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Creaciones</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {logs.filter((l) => l.action === "create").length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                            <Pencil className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Actualizaciones</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {logs.filter((l) => l.action === "update").length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Eliminaciones</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {logs.filter((l) => l.action === "delete").length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
                </div>
            ) : filteredLogs.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        {search || actionFilter !== "all"
                            ? "No se encontraron logs"
                            : "No hay logs de auditoría"}
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Acción</TableHead>
                                <TableHead>Secreto</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead>IP</TableHead>
                                <TableHead>Fecha y Hora</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getActionIcon(log.action)}
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                                                {getActionLabel(log.action)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium font-mono text-sm">
                                        {log.secret_key || "-"}
                                    </TableCell>
                                    <TableCell className="text-gray-600 dark:text-gray-400">
                                        {log.user_email || "-"}
                                    </TableCell>
                                    <TableCell className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                                        {log.ip_address || "-"}
                                    </TableCell>
                                    <TableCell className="text-gray-500 dark:text-gray-400">
                                        {new Date(log.timestamp).toLocaleString("es-MX", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    ℹ️ <strong>Información:</strong> Los logs de auditoría se generan automáticamente cada vez que se accede, crea, modifica o elimina un secreto. Se muestran los últimos 100 registros.
                </p>
            </div>
        </div>
    );
}
