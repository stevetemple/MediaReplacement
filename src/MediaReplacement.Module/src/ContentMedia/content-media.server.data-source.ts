
import { ContentMediaService } from './content-media-service';
import { type GetMediaForContentRequestArgs } from './types';
import {type MediaTreeItemResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import { UMB_MEDIA_ENTITY_TYPE, UMB_MEDIA_ROOT_ENTITY_TYPE, type UmbMediaTreeItemModel } from '@umbraco-cms/backoffice/media';

export interface ContentMediaSource {

    getMediaForContent(args: GetMediaForContentRequestArgs) : Promise<any>;
}

export class ContentMediaDataSource implements ContentMediaSource {

    async getMediaForContent(args: GetMediaForContentRequestArgs) : Promise<any> {
        var media = await ContentMediaService.getUmbracoManagementApiV1DocumentByIdMedia(
            {
                path : {
                    id : args.id.unique                
                }    
            }
        );

        if (media.data) {
			const items = media.data.map((item: MediaTreeItemResponseModel) => mapper(item));
			return items;
		}
        return media;
    }
}

const mapper = (item: MediaTreeItemResponseModel): UmbMediaTreeItemModel => {
    return {
        unique: item.id,
        parent: {
            unique: item.parent ? item.parent.id : null,
            entityType: item.parent ? UMB_MEDIA_ENTITY_TYPE : UMB_MEDIA_ROOT_ENTITY_TYPE,
        },
        entityType: UMB_MEDIA_ENTITY_TYPE,
        hasChildren: item.hasChildren,
        noAccess: item.noAccess,
        isTrashed: item.isTrashed,
        isFolder: false,
        mediaType: {
            unique: item.mediaType.id,
            icon: item.mediaType.icon,
            collection: item.mediaType.collection ? { unique: item.mediaType.collection.id } : null,
        },
        name: item.variants[0]?.name, // TODO: this is not correct. We need to get it from the variants. This is a temp solution.
        variants: item.variants.map((variant) => {
            return {
                name: variant.name,
                culture: variant.culture || null,
            };
        }),
        createDate: item.createDate,
    }
};
