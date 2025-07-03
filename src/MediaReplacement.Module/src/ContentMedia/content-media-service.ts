import { type Options as ClientOptions, type TDataShape, type Client } from '@hey-api/client-fetch';
import { type GetUmbracoManagementApiV1DocumentByIdMediaResponses, type GetUmbracoManagementApiV1DocumentByIdMediaErrors, type GetUmbracoManagementApiV1DocumentByIdMediaData } from './types';
import { umbHttpClient } from '@umbraco-cms/backoffice/http-client';
import type { MediaTreeItemResponseModel } from '@umbraco-cms/backoffice/external/backend-api';


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

export class ContentMediaService {
    public static getUmbracoManagementApiV1DocumentByIdMedia = <ThrowOnError extends boolean = false>(options: Options<GetUmbracoManagementApiV1DocumentByIdMediaData, ThrowOnError>) => {
        return umbHttpClient.get<Array<MediaTreeItemResponseModel>, GetUmbracoManagementApiV1DocumentByIdMediaErrors, ThrowOnError>({
            security: [
                {
                    scheme: 'bearer',
                    type: 'http'
                }
            ],
            url: '/umbraco/management/api/v1/document/{id}/media',
            ...options
        });
    };
}
