import { type MediaTreeItemResponseModel } from '@umbraco-cms/backoffice/external/backend-api';

export interface GetMediaForContentRequestArgs {
    id: {
        unique: string;
    };
}

export type GetUmbracoManagementApiV1DocumentByIdMediaData = {
    body?: never;
    path: {
        id: string;
    };
    query?: never;
    url: '/umbraco/management/api/v1/document/{id}/media';
};

export type GetUmbracoManagementApiV1DocumentByIdMediaErrors = {
    /**
     * The resource is protected and requires an authentication token
     */
    401: unknown;
    /**
     * The authenticated user does not have access to this resource
     */
    403: unknown;
};

export type GetUmbracoManagementApiV1DocumentByIdMediaResponses = {
    /**
     * OK
     */
    200: Array<MediaTreeItemResponseModel>;
};

