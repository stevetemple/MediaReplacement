import { UmbTreeServerDataSourceBase, type UmbTreeAncestorsOfRequestArgs } from '@umbraco-cms/backoffice/tree';
import { MediaFolderTreeService } from './media-folder-tree-service';
import {type MediaTreeItemResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import { UMB_MEDIA_ENTITY_TYPE, UMB_MEDIA_ROOT_ENTITY_TYPE, type UmbMediaTreeChildrenOfRequestArgs, type UmbMediaTreeItemModel, type UmbMediaTreeRootItemsRequestArgs } from '@umbraco-cms/backoffice/media';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

export class MediaFolderTreeDataSource extends UmbTreeServerDataSourceBase<
	MediaTreeItemResponseModel,
	UmbMediaTreeItemModel,
	UmbMediaTreeRootItemsRequestArgs,
	UmbMediaTreeChildrenOfRequestArgs
> {

    constructor(host: UmbControllerHost) {
    	super(host, {
	    	getRootItems,
		    getChildrenOf,
		    getAncestorsOf,
		    mapper,
	    });
    }
}

const getRootItems = (args: UmbMediaTreeRootItemsRequestArgs) =>
	// eslint-disable-next-line local-rules/no-direct-api-import
	MediaFolderTreeService.getTreeMediaRoot({ query: { dataTypeId: args.dataType?.unique, skip: args.skip, take: args.take } });

const getChildrenOf = (args: UmbMediaTreeChildrenOfRequestArgs) => {
    if (args.parent.unique === null) {
	    return getRootItems(args);
    } else {
	    // eslint-disable-next-line local-rules/no-direct-api-import
	    return MediaFolderTreeService.getTreeMediaChildren({
		    query: { parentId: args.parent.unique, dataTypeId: args.dataType?.unique, skip: args.skip, take: args.take },
	    });
    }
}   

const getAncestorsOf = (args: UmbTreeAncestorsOfRequestArgs) =>
	// eslint-disable-next-line local-rules/no-direct-api-import
	MediaFolderTreeService.getTreeMediaAncestors({
		query: { descendantId: args.treeItem.unique },
	});

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
