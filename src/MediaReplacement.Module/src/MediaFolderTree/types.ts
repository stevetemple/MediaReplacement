import { type MediaTreeItemResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import type { Identifier } from 'typescript';

export interface GetMediaForContentRequestArgs {
    id: {
        unique: string;
    };
}

export type MediaFoldersRootData = {
    body?: never;
    path: {
        skip: number;
        take: number;
    };
    query?: never;
    url: '/umbraco/management/api/v1/document/{id}/media/root/folders';
};

export type MediaFoldersChildrenData = {
    body?: never;
    path: {
        parentId: Identifier;
        skip: number;
        take: number;
    };
    query?: never;
    url: '/umbraco/management/api/v1/document/{id}/media/folders';
};

export type GetUmbracoManagementApiV1DocumentByIdMediaFoldersErrors = {
    /**
     * The resource is protected and requires an authentication token
     */
    401: unknown;
    /**
     * The authenticated user does not have access to this resource
     */
    403: unknown;
};

export type GetUmbracoManagementApiV1DocumentByIdMediaFoldersResponses = {
    /**
     * OK
     */
    200: Array<MediaTreeItemResponseModel>;
};

