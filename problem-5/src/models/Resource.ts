/**
 * Resource Model
 * Defines the structure of a resource entity
 */

export interface Resource {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateResourceDto {
    name: string;
    description?: string;
}

export interface UpdateResourceDto {
    name?: string;
    description?: string;
}

export interface ResourceFilters {
    limit?: number;
    offset?: number;
    search?: string;
}

