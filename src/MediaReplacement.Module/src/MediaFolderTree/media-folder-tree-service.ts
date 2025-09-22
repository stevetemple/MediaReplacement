import { type Options as ClientOptions, type TDataShape, type Client } from '@hey-api/client-fetch';
import { umbHttpClient } from '@umbraco-cms/backoffice/http-client';
import type { GetTreeMediaAncestorsData, GetTreeMediaAncestorsErrors, GetTreeMediaAncestorsResponses, GetTreeMediaChildrenData, GetTreeMediaChildrenErrors, GetTreeMediaChildrenResponses, GetTreeMediaRootData, GetTreeMediaRootErrors, GetTreeMediaRootResponses } from '@umbraco-cms/backoffice/external/backend-api';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};

export class MediaFolderTreeService {
     public static getTreeMediaRoot<ThrowOnError extends boolean = true>(options?: Options<GetTreeMediaRootData, ThrowOnError>) {
     return umbHttpClient.get<GetTreeMediaRootResponses, GetTreeMediaRootErrors, ThrowOnError>({
         security: [
             {
                 scheme: 'bearer',
                 type: 'http'
             }
         ],
         url: '/umbraco/management/api/v1/tree/media/root/folders',
         ...options
         });
    }

    public static getTreeMediaAncestors<ThrowOnError extends boolean = true>(options?: Options<GetTreeMediaAncestorsData, ThrowOnError>) {
    return umbHttpClient.get<GetTreeMediaAncestorsResponses, GetTreeMediaAncestorsErrors, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/umbraco/management/api/v1/tree/media/ancestors',
        ...options
        });
    }

    public static getTreeMediaChildren<ThrowOnError extends boolean = true>(options?: Options<GetTreeMediaChildrenData, ThrowOnError>) {
    return umbHttpClient.get<GetTreeMediaChildrenResponses, GetTreeMediaChildrenErrors, ThrowOnError>({
        security: [
            {
                scheme: 'bearer',
                type: 'http'
            }
        ],
        url: '/umbraco/management/api/v1/tree/media/folders',
        ...options
        });
    }
}
