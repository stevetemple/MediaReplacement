import { MY_MEDIA_ENTITY_TYPE, MY_MEDIA_ROOT_ENTITY_TYPE } from './entity.js';
import type {
	MyMediaTreeChildrenOfRequestArgs,
	MyMediaTreeItemModel,
	MyMediaTreeRootItemsRequestArgs,
} from './types.js';
import type { UmbTreeAncestorsOfRequestArgs } from '@umbraco-cms/backoffice/tree';
import { UmbTreeServerDataSourceBase } from '@umbraco-cms/backoffice/tree';
import { MediaService, type MediaTreeItemResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

/**
 * A data source for the Media tree that fetches data from the server
 * @class UmbMediaTreeServerDataSource
 * @augments {UmbTreeServerDataSourceBase}
 */
export class MyMediaTreeServerDataSource extends UmbTreeServerDataSourceBase<
	MediaTreeItemResponseModel,
	MyMediaTreeItemModel,
	MyMediaTreeRootItemsRequestArgs,
	MyMediaTreeChildrenOfRequestArgs
> {
	/**
	 * Creates an instance of UmbMediaTreeServerDataSource.
	 * @param {UmbControllerHost} host - The controller host for this controller to be appended to
	 * @memberof MyMediaTreeServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		super(host, {
			getRootItems,
			getChildrenOf,
			getAncestorsOf,
			mapper,
		});
	}
}

const getRootItems = (args: MyMediaTreeRootItemsRequestArgs) =>
	// eslint-disable-next-line local-rules/no-direct-api-import
	MediaService.getTreeMediaRoot({ query: { dataTypeId: args.dataType?.unique, skip: args.skip, take: args.take } });

const getChildrenOf = async (args: MyMediaTreeChildrenOfRequestArgs) => {
    if (args.parent.unique === null) {
		return getRootItems(args);
	} else {
		// eslint-disable-next-line local-rules/no-direct-api-import
		return MediaService.getTreeMediaChildren(
		{
			query: { parentId: args.parent.unique, dataTypeId: args.dataType?.unique, skip: args.skip, take: args.take }
		});
	}
};

const getAncestorsOf = (args: UmbTreeAncestorsOfRequestArgs) =>
	// eslint-disable-next-line local-rules/no-direct-api-import
	MediaService.getTreeMediaAncestors({
		query: { descendantId: args.treeItem.unique },
	});

const mapper = (item: MediaTreeItemResponseModel): MyMediaTreeItemModel => {
	return {
		unique: item.id,
		parent: {
			unique: item.parent ? item.parent.id : null,
			entityType: item.parent ? MY_MEDIA_ENTITY_TYPE : MY_MEDIA_ROOT_ENTITY_TYPE,
		},
		entityType: MY_MEDIA_ENTITY_TYPE,
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
	};
};