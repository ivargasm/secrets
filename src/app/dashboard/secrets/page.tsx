"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/Store";
import { getSecrets, getProjects, deleteSecret } from "@/app/lib/api";
import type { Secret, Project } from "@/types/vault";
import { Button } from "@/components/ui/button";
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
import { Plus, Eye, Pencil, Trash2, Search, Key, Upload } from "lucide-react";
import { SecretForm } from "@/app/components/SecretForm";
import { SecretViewModal } from "@/app/components/SecretViewModal";
import { BulkImportModal } from "@/app/components/BulkImportModal";

export default function SecretsPage() {
  const { url } = useAuthStore();
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>("all");

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingSecret, setEditingSecret] = useState<Secret | null>(null);
  const [viewingSecretId, setViewingSecretId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [secretsData, projectsData] = await Promise.all([
          getSecrets(url),
          getProjects(url),
        ]);
        setSecrets(secretsData);
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
      const [secretsData, projectsData] = await Promise.all([
        getSecrets(url),
        getProjects(url),
      ]);
      setSecrets(secretsData);
      setProjects(projectsData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este secreto?")) return;

    try {
      await deleteSecret(url, id);
      await loadData();
    } catch (error) {
      console.error("Error eliminando secreto:", error);
      alert("Error al eliminar el secreto");
    }
  };

  const handleEdit = (secret: Secret) => {
    setEditingSecret(secret);
    setShowForm(true);
  };

  const handleView = (id: number) => {
    setViewingSecretId(id);
    setShowViewModal(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSecret(null);
    loadData();
  };

  const handleViewClose = () => {
    setShowViewModal(false);
    setViewingSecretId(null);
  };

  // Filtrar secretos
  const filteredSecrets = secrets.filter((secret) => {
    const matchesSearch = secret.key
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesProject =
      projectFilter === "all" ||
      (projectFilter === "none" && !secret.project_id) ||
      secret.project_id?.toString() === projectFilter;
    return matchesSearch && matchesProject;
  });

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
            Secretos
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Gestiona tus secretos cifrados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBulkImport(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Secreto
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por proyecto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los proyectos</SelectItem>
            <SelectItem value="none">Sin proyecto</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
        </div>
      ) : filteredSecrets.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {search || projectFilter !== "all"
              ? "No se encontraron secretos"
              : "No hay secretos. Crea tu primer secreto."}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSecrets.map((secret) => (
                <TableRow key={secret.id}>
                  <TableCell className="font-medium">{secret.key}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {getProjectName(secret.project_id)}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">
                    {secret.description || "-"}
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">
                    {new Date(secret.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(secret.id)}
                        title="Ver secreto"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(secret)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(secret.id)}
                        title="Eliminar"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <SecretForm
          mode={editingSecret ? "edit" : "create"}
          secret={editingSecret || undefined}
          projects={projects}
          onClose={handleFormClose}
        />
      )}

      {showViewModal && viewingSecretId && (
        <SecretViewModal secretId={viewingSecretId} onClose={handleViewClose} />
      )}

      {showBulkImport && (
        <BulkImportModal
          projects={projects}
          onClose={() => {
            setShowBulkImport(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
