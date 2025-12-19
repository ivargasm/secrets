/**
 * TypeScript types for Secret Manager
 */

export interface Secret {
    id: number;
    key: string;
    description?: string;
    project_id?: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    version: number;
}

export interface SecretDetail extends Secret {
    value: string; // Solo disponible en GET individual
}

export interface SecretCreate {
    key: string;
    value: string;
    description?: string;
    project_id?: number;
}

export interface SecretUpdate {
    value?: string;
    description?: string;
    project_id?: number;
}

export interface Project {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface ProjectCreate {
    name: string;
    description?: string;
}

export interface ProjectUpdate {
    name?: string;
    description?: string;
}

export interface APIKey {
    id: number;
    name: string;
    project_id?: number;
    created_by: number;
    last_used?: string;
    created_at: string;
    is_active: boolean;
}

export interface APIKeyCreate {
    name: string;
    project_id?: number;
}

export interface APIKeyCreateResponse extends APIKey {
    api_key: string; // Solo al crear (una vez)
}

export interface AuditLog {
    id: number;
    secret_id?: number;
    secret_key?: string;
    action: 'read' | 'create' | 'update' | 'delete';
    user_id?: number;
    user_email?: string;
    api_key_id?: number;
    ip_address?: string;
    timestamp: string;
    details?: Record<string, unknown>;
}

export interface GetSecretsParams {
    project_id?: number;
    search?: string;
    skip?: number;
    limit?: number;
}

export interface GetAuditLogsParams {
    secret_id?: number;
    action?: string;
    skip?: number;
    limit?: number;
}
