import { redirect } from "next/navigation";
import type {
    Secret,
    SecretDetail,
    SecretCreate,
    SecretUpdate,
    GetSecretsParams,
    Project,
    ProjectCreate,
    ProjectUpdate,
    APIKey,
    APIKeyCreate,
    APIKeyCreateResponse,
    AuditLog,
    GetAuditLogsParams,
} from "@/types/vault";

// ============= AUTH (Existente) =============

export const fetchUser = async (url: string) => {
    const res = await fetch(`${url}/auth/me`, { credentials: 'include' });
    if (!res.ok) redirect("/auth/login");;
    return res.json();
};


export const login = async (email: string, password: string, url: string) => {
    const res = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Credenciales incorrectas');
    return res;
};

export const logout = async (url: string) => {
    const res = await fetch(`${url}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Error al cerrar sesión');
    return res;
};

export async function register(username: string, email: string, password: string, url: string) {
    try {
        const res = await fetch(`${url}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        return res.json();
    } catch (error) {
        console.error("Error en el registro:", error);
        return false;
    }
}

export async function forgot_password(url: string, email: string) {
    const res = await fetch(`${url}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error('Error al enviar el correo');
    return res;
}

export async function reset_password(url: string, new_password: string, token: string) {
    const res = await fetch(`${url}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password }),
    });

    if (!res.ok) throw new Error('Error al resetear la contraseña');
    return res;
}

// ============= SECRETS =============

export async function getSecrets(
    url: string,
    params?: GetSecretsParams
): Promise<Secret[]> {
    const queryParams = new URLSearchParams();
    if (params?.project_id) queryParams.append("project_id", params.project_id.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const res = await fetch(
        `${url}/admin/secrets?${queryParams.toString()}`,
        { credentials: "include" }
    );

    if (!res.ok) throw new Error("Error al obtener secretos");
    return res.json();
}

export async function getSecret(url: string, id: number): Promise<SecretDetail> {
    const res = await fetch(`${url}/admin/secrets/${id}`, {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Error al obtener secreto");
    return res.json();
}

export async function createSecret(
    url: string,
    data: SecretCreate
): Promise<Secret> {
    const res = await fetch(`${url}/admin/secrets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error al crear secreto");
    }
    return res.json();
}

export async function updateSecret(
    url: string,
    id: number,
    data: SecretUpdate
): Promise<Secret> {
    const res = await fetch(`${url}/admin/secrets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al actualizar secreto");
    return res.json();
}

export async function deleteSecret(url: string, id: number): Promise<void> {
    const res = await fetch(`${url}/admin/secrets/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) throw new Error("Error al eliminar secreto");
}

// ============= PROJECTS =============

export async function getProjects(url: string): Promise<Project[]> {
    const res = await fetch(`${url}/admin/projects`, {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Error al obtener proyectos");
    return res.json();
}

export async function getProject(url: string, id: number): Promise<Project> {
    const res = await fetch(`${url}/admin/projects/${id}`, {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Error al obtener proyecto");
    return res.json();
}

export async function createProject(
    url: string,
    data: ProjectCreate
): Promise<Project> {
    const res = await fetch(`${url}/admin/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error al crear proyecto");
    }
    return res.json();
}

export async function updateProject(
    url: string,
    id: number,
    data: ProjectUpdate
): Promise<Project> {
    const res = await fetch(`${url}/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al actualizar proyecto");
    return res.json();
}

export async function deleteProject(url: string, id: number): Promise<void> {
    const res = await fetch(`${url}/admin/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) throw new Error("Error al eliminar proyecto");
}

// ============= API KEYS =============

export async function getAPIKeys(url: string): Promise<APIKey[]> {
    const res = await fetch(`${url}/admin/api-keys`, {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Error al obtener API keys");
    return res.json();
}

export async function createAPIKey(
    url: string,
    data: APIKeyCreate
): Promise<APIKeyCreateResponse> {
    const res = await fetch(`${url}/admin/api-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error al crear API key");
    }
    return res.json();
}

export async function deactivateAPIKey(
    url: string,
    id: number
): Promise<APIKey> {
    const res = await fetch(`${url}/admin/api-keys/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) throw new Error("Error al desactivar API key");
    return res.json();
}

// ============= AUDIT LOGS =============

export async function getAuditLogs(
    url: string,
    params?: GetAuditLogsParams
): Promise<AuditLog[]> {
    const queryParams = new URLSearchParams();
    if (params?.secret_id) queryParams.append("secret_id", params.secret_id.toString());
    if (params?.action) queryParams.append("action", params.action);
    if (params?.skip) queryParams.append("skip", params.skip.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const res = await fetch(
        `${url}/admin/audit-logs?${queryParams.toString()}`,
        { credentials: "include" }
    );

    if (!res.ok) throw new Error("Error al obtener logs de auditoría");
    return res.json();
}
