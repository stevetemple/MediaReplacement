import { MY_MEDIA_ROOT_ENTITY_TYPE } from './entity.js';
import { MyMediaTreeServerDataSource } from './my-media-tree.server.data-source.js';
import type {
	MyMediaTreeChildrenOfRequestArgs,
	MyMediaTreeItemModel,
	MyMediaTreeRootItemsRequestArgs,
	MyMediaTreeRootModel,
} from './types';
import { MY_MEDIA_TREE_STORE_CONTEXT } from './my-media-tree.store.context-token.js';
import { UmbTreeRepositoryBase } from '@umbraco-cms/backoffice/tree';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbApi } from '@umbraco-cms/backoffice/extension-api';

export class MyMediaTreeRepository
	extends UmbTreeRepositoryBase<
        MyMediaTreeItemModel,
        MyMediaTreeRootModel,
		MyMediaTreeRootItemsRequestArgs,
		MyMediaTreeChildrenOfRequestArgs
	>
	implements UmbApi
{
	constructor(host: UmbControllerHost) {
		super(host, MyMediaTreeServerDataSource, MY_MEDIA_TREE_STORE_CONTEXT);
	}

	async requestTreeRoot() {
		const { data: treeRootData } = await this._treeSource.getRootItems({ skip: 0, take: 1 });
		const hasChildren = treeRootData ? treeRootData.total > 0 : false;

		const data: MyMediaTreeRootModel = {
			unique: null,
			entityType: MY_MEDIA_ROOT_ENTITY_TYPE,
			name: '#treeHeaders_media',
			hasChildren,
			isFolder: true,
		};

		return { data };
	}

	
}

export default MyMediaTreeRepository;